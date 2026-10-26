interface PigeonLetter { name: string; email: string; message: string; fallbackToken: string }

export async function deliverPigeonEmail(letter: PigeonLetter, request: typeof fetch = fetch) {
  let response: Response;
  try {
    response = await request('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        service_id: 'service_1pmq0ww', template_id: 'template_974d8ci', user_id: 'yh5YjFrvOYntRlo2T',
        template_params: {
          name: letter.name, email: letter.email || 'vophuonganh054@gmail.com', message: letter.message,
          title: 'Thư bồ câu từ MY WORLD', time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
      }),
    });
  } catch {
    throw new Error('Thư đã lưu trên web. Chưa nhận được xác nhận gửi email; vui lòng kiểm tra Gmail trước khi gửi lại để tránh trùng thư.');
  }
  if (response.ok) return { provider: 'emailjs' };
  if (response.status < 400 || response.status >= 500) {
    throw new Error('Thư đã lưu. Dịch vụ email chưa xác nhận kết quả; vui lòng kiểm tra hộp thư trước khi gửi lại.');
  }
  // Only an explicit rejection may use the second provider. Never resend on a timeout.
  const backup = await request('/api/contact/pigeon-fallback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: letter.fallbackToken }),
  });
  const result = await backup.json();
  if (!backup.ok || result.success !== true) throw new Error(result.error || 'Thư đã lưu nhưng chưa chuyển được email.');
  return { provider: 'formsubmit' };
}
