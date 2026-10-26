import { get, head, put, del, BlobPreconditionFailedError } from '@vercel/blob';
import { createHmac, timingSafeEqual, pbkdf2Sync, randomBytes } from 'node:crypto';
import { Readable } from 'node:stream';

const STATE = 'portfolio/state.json';
const AUTH = 'portfolio/auth.json';
const attempts = new Map<string, { count: number; until: number }>();

async function readJson(path: string, fallback: any) {
  const blob = await get(path, { access: 'private', useCache: false });
  if (!blob || blob.statusCode !== 200 || !blob.stream) return { data: fallback, etag: undefined };
  return { data: JSON.parse(await new Response(blob.stream).text()), etag: blob.blob.etag };
}

async function mutate(path: string, fallback: any, change: (state: any) => any) {
  for (let retry = 0; retry < 3; retry++) {
    // The metadata API supplies the storage ETag used by conditional writes.
    // A download response can carry a delivery-layer ETag instead.
    const metadata = await head(path).catch(error => {
      if ((error as Error).name === 'BlobNotFoundError') return null;
      throw error;
    });
    const { data } = await readJson(path, fallback);
    const etag = metadata?.etag;
    const next = change(data);
    try {
      await put(path, JSON.stringify(next), {
        access: 'private', contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: Boolean(etag),
        ...(etag ? { ifMatch: etag } : {}),
      });
      return next;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError) && (error as Error).name !== 'BlobAlreadyExistsError') throw error;
      if (retry === 2) throw error;
    }
  }
}

async function readAuth() {
  let initial: any = null;
  if (process.env.PORTFOLIO_ADMIN_AUTH) initial = JSON.parse(process.env.PORTFOLIO_ADMIN_AUTH);
  const { data } = await readJson(AUTH, initial);
  if (!data?.hash || !data?.salt) throw new Error('Admin login has not been configured');
  return data;
}

function matches(password: unknown, auth: any) {
  if (typeof password !== 'string' || password.length > 256) return false;
  const hash = pbkdf2Sync(password.trim(), auth.salt, auth.iterations || 1000, 64, 'sha512');
  const expected = Buffer.from(auth.hash, 'hex');
  return hash.length === expected.length && timingSafeEqual(hash, expected);
}
function sign(value: string) {
  const secret = process.env.BLOB_READ_WRITE_TOKEN;
  if (!secret) throw new Error('Shared storage is not configured');
  return createHmac('sha256', secret).update(value).digest('base64url');
}
function issue(auth: any) {
  const data = Buffer.from(JSON.stringify({
    exp: Date.now() + 24 * 60 * 60 * 1000,
    version: auth.version || 0, key: sign(auth.hash),
  })).toString('base64url');
  return data + '.' + sign(data);
}
function authorized(req: any, auth: any) {
  try {
    const token = String(req.headers['x-admin-token'] || '').split('.');
    if (token.length !== 2) return false;
    const actual = Buffer.from(token[1]);
    const expected = Buffer.from(sign(token[0]));
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const data = JSON.parse(Buffer.from(token[0], 'base64url').toString());
    return data.exp > Date.now() && data.version === (auth.version || 0) && data.key === sign(auth.hash);
  } catch { return false; }
}
function validImageUrl(value: unknown) {
  return typeof value === 'string' && (
    /^https?:\/\//i.test(value) ||
    (value.startsWith('/') && !value.startsWith('//')) ||
    /^data:image\/(jpeg|png|webp|gif);base64,/i.test(value)
  );
}
async function saveImage(value: string) {
  if (!validImageUrl(value)) throw new Error('Invalid image URL');
  if (!value.startsWith('data:')) return value;
  const match = value.match(/^data:image\/(jpeg|png|webp|gif);base64,([a-zA-Z0-9+/=\s]+)$/);
  if (!match) throw new Error('Unsupported image type');
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length > 2 * 1024 * 1024) throw new Error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 2 MB.');
  const pathname = 'media/' + randomBytes(18).toString('hex') + '.' + (match[1] === 'jpeg' ? 'jpg' : match[1]);
  await put(pathname, bytes, { access: 'private', contentType: 'image/' + match[1], addRandomSuffix: false });
  return '/api/media/' + pathname.slice('media/'.length);
}

function mediaPaths(state: any): Set<string> {
  const urls = [state?.avatarUrl, ...(Array.isArray(state?.photos) ? state.photos.map((photo: any) => photo?.image) : [])];
  return new Set(urls.flatMap(url => {
    if (typeof url !== 'string') return [];
    const match = url.match(/^\/api\/media\/([a-f0-9]{36}\.(?:jpg|png|webp|gif))$/);
    return match ? ['media/' + match[1]] : [];
  }));
}

async function removeReplacedImages(previous: any) {
  try {
    const latest = (await readJson(STATE, {})).data;
    const currentPaths = mediaPaths(latest);
    for (const pathname of mediaPaths(previous)) {
      if (!currentPaths.has(pathname)) await del(pathname);
    }
  } catch (error) {
    // The new state is already saved. A cleanup failure must not roll it back.
    console.warn('Could not remove an unused portfolio image');
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  const route = String(req.query?.route || new URL(req.url, 'https://portfolio.local').pathname.replace(/^\/api\/?/, ''));
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  try {
    if (req.method === 'GET' && route === 'health') return res.json({ status: 'ok', storage: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
    if (req.method === 'GET' && route.startsWith('media/')) {
      const name = route.slice(6);
      if (!/^[a-f0-9]{36}\.(jpg|png|webp|gif)$/.test(name)) return res.status(404).end();
      const image = await get('media/' + name, { access: 'private' });
      if (!image || image.statusCode !== 200 || !image.stream) return res.status(404).end();
      res.setHeader('Content-Type', image.blob.contentType || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return Readable.fromWeb(image.stream as any).pipe(res);
    }
    if (req.method === 'GET' && route === 'portfolio') {
      const { data } = await readJson(STATE, { avatarUrl: null, photos: [], updatedAt: null });
      return res.json({ success: true, avatarUrl: data.avatarUrl || null, photos: data.photos || [], updatedAt: data.updatedAt || null });
    }
    if (req.method === 'POST' && route === 'contact/pigeon') {
      if (body.website) return res.status(400).json({ success: false, error: 'Tin nhắn không hợp lệ.' });
      if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 5000) return res.status(400).json({ success: false, error: 'Tin nhắn cần có nội dung và không quá 5.000 ký tự.' });
      const email = String(body.email || '').trim();
      if (email && (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ success: false, error: 'Email phản hồi không hợp lệ.' });
      const visitor = sign(String(req.headers['x-forwarded-for'] || '').split(',')[0]);
      const ratePath = 'portfolio/rates/' + visitor + '.json';
      let limited = false;
      await mutate(ratePath, { count: 0, until: 0 }, state => {
        const rate = state.until > Date.now() ? state : { count: 0, until: Date.now() + 600000 };
        limited = rate.count >= 3;
        return limited ? rate : { ...rate, count: rate.count + 1 };
      });
      if (limited) return res.status(429).json({ success: false, error: 'Bạn đã gửi nhiều thư. Vui lòng chờ 10 phút rồi thử lại.' });
      const entry = {
        id: randomBytes(12).toString('hex'),
        senderName: String(body.name || 'Khách ghé thăm MY WORLD').trim().slice(0, 120),
        senderEmail: email,
        message: body.message.trim(), createdAt: Date.now(), delivery: 'stored',
      };
      await mutate('portfolio/messages.json', [], messages => [entry, ...messages].slice(0, 200));
      // EmailJS is primary; only an explicit rejection allows the backup.
      // A timeout is ambiguous and must not trigger a second email.
      try {
        const primary = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            service_id: 'service_1pmq0ww', template_id: 'template_974d8ci',
            user_id: 'yh5YjFrvOYntRlo2T',
            template_params: {
              name: entry.senderName, email: email || 'vophuonganh054@gmail.com',
              message: entry.message, title: 'Thư bồ câu từ MY WORLD',
              time: new Date(entry.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
            },
          }),
        });
        if (primary.ok) return res.json({ success: true, delivery: 'submitted', provider: 'emailjs', id: entry.id });
        const reason = (await primary.text()).slice(0, 240);
        // 5xx responses may have been processed: keep the archived letter instead.
        if (primary.status >= 500) return res.status(502).json({ success: false, saved: true,
          error: 'Thư đã lưu. Dịch vụ email chưa xác nhận kết quả; vui lòng kiểm tra hộp thư trước khi gửi lại.' });
        console.warn('Pigeon: EmailJS rejected request', primary.status, reason);
      } catch {
        return res.status(502).json({ success: false, saved: true,
          error: 'Thư đã lưu. Chưa nhận được xác nhận từ dịch vụ email; vui lòng kiểm tra hộp thư trước khi gửi lại để tránh trùng thư.' });
      }
      try {
        const delivery = await fetch('https://formsubmit.co/ajax/vophuonganh054@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: 'https://myworld-sunny.vercel.app/' },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            name: entry.senderName, message: entry.message,
            ...(email ? { email, _replyto: email } : {}),
            _subject: '[MY WORLD] Thư bồ câu từ ' + entry.senderName,
            _template: 'table', _captcha: 'false', _url: 'https://myworld-sunny.vercel.app/',
          }),
        });
        const receipt = await delivery.json();
        if (!delivery.ok || !(receipt.success === true || receipt.success === 'true')) {
          const activation = /activat|actived/i.test(String(receipt.message || ''));
          return res.status(502).json({ success: false, saved: true, id: entry.id,
            error: activation ? 'Thư đã lưu. Chủ web cần mở email FormSubmit và bấm Activate Form cho link myworld-sunny.vercel.app.'
              : 'Thư đã lưu trong hộp thư của web, nhưng dịch vụ chuyển tới Gmail chưa nhận thư. Bạn có thể dùng nút gửi bằng ứng dụng email bên dưới.' });
        }
        return res.json({ success: true, delivery: 'submitted', provider: 'formsubmit', id: entry.id });
      } catch {
        console.warn('Pigeon: message archived; email service unavailable');
        return res.status(502).json({ success: false, saved: true, id: entry.id,
          error: 'Thư đã lưu trong hộp thư của web. Dịch vụ gửi Gmail đang phản hồi chậm; bạn có thể gửi bằng ứng dụng email bên dưới.' });
      }
    }
    if (route === 'diary' && req.method === 'GET') {
      const { data } = await readJson('portfolio/diary.json', null);
      return res.json({ success: true, diary: data });
    }
    const auth = await readAuth();
    if (route === 'auth/login' && req.method === 'POST') {
      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0];
      const previous = attempts.get(ip);
      const record = previous && previous.until > Date.now() ? previous : { count: 0, until: Date.now() + 900000 };
      if (record.count >= 8) return res.status(429).json({ error: 'Bạn thử quá nhiều lần. Vui lòng chờ 15 phút.' });
      if (!matches(body.password, auth)) {
        record.count++; attempts.set(ip, record);
        return res.status(401).json({ success: false, error: 'Mật khẩu quản trị viên không chính xác.' });
      }
      attempts.delete(ip);
      return res.json({ success: true, token: issue(auth) });
    }
    const isAdmin = authorized(req, auth);
    if (route === 'auth/status' && req.method === 'GET') return res.json({ isAdmin, role: isAdmin ? 'admin' : 'viewer' });
    if (!isAdmin) return res.status(403).json({ success: false, isViewer: true, error: 'Vui lòng đăng nhập Admin để lưu thay đổi.' });
    if (route === 'auth/logout' && req.method === 'POST') {
      await mutate(AUTH, auth, current => ({ ...current, version: (current.version || 0) + 1 }));
      return res.json({ success: true });
    }
    if (route === 'auth/change-password' && req.method === 'POST') {
      if (!matches(body.currentPassword, auth)) return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng.' });
      if (typeof body.newPassword !== 'string' || body.newPassword.trim().length < 8 || body.newPassword.length > 256) return res.status(400).json({ error: 'Mật khẩu mới cần ít nhất 8 ký tự.' });
      const salt = randomBytes(24).toString('hex');
      const iterations = 210000;
      const hash = pbkdf2Sync(body.newPassword.trim(), salt, iterations, 64, 'sha512').toString('hex');
      await mutate(AUTH, auth, current => ({ hash, salt, iterations, version: (current.version || 0) + 1 }));
      return res.json({ success: true });
    }
    if (route === 'diary' && req.method === 'POST') {
      const moods = ['sparkles', 'coffee', 'computer', 'moon', 'heart', 'confetti'];
      if (!moods.includes(body.mood) || typeof body.note !== 'string' || body.note.length > 500 ||
          typeof body.learning !== 'string' || body.learning.length > 120 ||
          typeof body.song !== 'string' || body.song.length > 120) {
        return res.status(400).json({ success: false, error: 'Nội dung nhật ký không hợp lệ.' });
      }
      const diary = { mood: body.mood, note: body.note.trim(), learning: body.learning.trim(), song: body.song.trim(), updatedAt: Date.now() };
      await mutate('portfolio/diary.json', null, () => diary);
      return res.json({ success: true, diary });
    }
    if (route === 'contact/messages' && req.method === 'GET') {
      const { data } = await readJson('portfolio/messages.json', []);
      return res.json({ success: true, messages: data });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (route === 'portfolio/upload-photo') {
      if (typeof body.imageBase64 !== 'string' || !body.imageBase64.startsWith('data:image/')) return res.status(400).json({ error: 'Thiếu dữ liệu ảnh.' });
      return res.json({ success: true, url: await saveImage(body.imageBase64) });
    }
    if (route === 'portfolio/avatar') {
      const previous = (await readJson(STATE, {})).data;
      const avatarUrl = await saveImage(body.avatarUrl || body.imageBase64);
      await mutate(STATE, { photos: [] }, current => ({ ...current, avatarUrl, updatedAt: Date.now() }));
      await removeReplacedImages(previous);
      return res.json({ success: true, avatarUrl });
    }
    if (route === 'portfolio/reset-avatar') {
      const previous = (await readJson(STATE, {})).data;
      await mutate(STATE, { photos: [] }, current => ({ ...current, avatarUrl: null, updatedAt: Date.now() }));
      await removeReplacedImages(previous);
      return res.json({ success: true });
    }
    if (route === 'portfolio/photos') {
      if (!Array.isArray(body.photos) || body.photos.length > 200) return res.status(400).json({ error: 'Danh sách ảnh không hợp lệ.' });
      const previous = (await readJson(STATE, {})).data;
      const photos: any[] = [];
      for (const item of body.photos) {
        if (!item || typeof item.id !== 'string' || !validImageUrl(item.image)) return res.status(400).json({ error: 'Ảnh không hợp lệ.' });
        photos.push({ ...item, image: await saveImage(item.image) });
      }
      await mutate(STATE, { avatarUrl: null }, current => ({ ...current, photos, updatedAt: Date.now() }));
      await removeReplacedImages(previous);
      return res.json({ success: true, photos });
    }
    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Portfolio API:', error);
    return res.status(503).json({ success: false, error: 'Chưa lưu được lên máy chủ. Vui lòng thử lại sau.' });
  }
}
