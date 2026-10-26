import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { spawnPixelBurst } from '../utils/fx';
import { playRetroBeep } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';

interface ContactSectionProps {
  onOpenModal?: (e?: React.MouseEvent) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenModal }) => {
  const { language, isVi } = useLanguage();
  const t = TRANSLATIONS[language].social;

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [website, setWebsite] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || !senderMessage.trim()) return;
    setIsSending(true);
    setSentSuccess(false);
    setSendError('');
    playRetroBeep('select');
    try {
      const response = await fetch('/api/contact/pigeon', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: senderName.trim() || (isVi ? 'Khách ghé thăm MY WORLD' : 'MY WORLD Guest'),
          email: senderEmail.trim(), message: senderMessage.trim(), website,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || (isVi ? 'Chưa gửi được thư. Vui lòng thử lại.' : 'Could not send your message. Please try again.'));
      }
      // FormSubmit's AJAX endpoint receives the website origin from the browser.
      // Archive once on our server, then send exactly one email.
      const delivery = await fetch('https://formsubmit.co/ajax/vophuonganh054@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          name: senderName.trim() || 'MY WORLD Guest',
          ...(senderEmail.trim() ? { email: senderEmail.trim(), _replyto: senderEmail.trim() } : {}),
          message: senderMessage.trim(),
          _subject: '[MY WORLD] Thư bồ câu từ ' + (senderName.trim() || 'Khách ghé thăm'),
          _template: 'table', _captcha: 'false',
        }),
      });
      const receipt = await delivery.json();
      if (!delivery.ok || !(receipt.success === true || receipt.success === 'true')) {
        throw new Error(/activat/i.test(String(receipt.message || ''))
          ? 'Chủ website cần bấm Activate Form trong email FormSubmit.'
          : (isVi ? 'Thư đã lưu nhưng chưa chuyển được tới Gmail. Vui lòng thử lại sau.' : 'Your message was saved, but email delivery failed. Please try again.'));
      }
      setSentSuccess(true);
      playRetroBeep('coin');
      spawnPixelBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
      setSenderName(''); setSenderEmail(''); setSenderMessage('');
      setTimeout(() => setSentSuccess(false), 12000);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : (isVi ? 'Chưa gửi được thư. Vui lòng thử lại.' : 'Could not send your message.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    spawnPixelBurst(e.clientX, e.clientY, 10);
    playRetroBeep('coin');
  };

  return (
    <section className="bg-[#1f1730]/95 border-[4px] border-[#5a3696] p-4 sm:p-6 md:p-8 pixel-box relative overflow-hidden backdrop-blur-md">
      {/* Decorative Arcade Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b-[3px] border-dashed border-[#5a3696] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#120a21] border-2 border-[#26c281] px-3 py-1 font-['Space_Mono'] text-xs font-bold text-[#26c281] shadow-[2px_2px_0px_#0a0514] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#26c281] animate-ping" />
            <span>{isVi ? 'TRẠM LIÊN LẠC • ONLINE' : 'COMMUNICATION STATION • ONLINE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f6c833] font-['Space_Grotesk'] tracking-wider uppercase arcade-title-shadow">
            {isVi ? 'KẾT NỐI VỚI PHƯƠNG ANH' : 'CONNECT WITH PHUONG ANH'}
          </h2>
          <p className="text-xs sm:text-sm font-['Space_Mono'] text-[#f3eeff] mt-1">
            {isVi
              ? 'Rất vui được trao đổi về học tập, thiết kế web, giao lưu sáng tạo hoặc đơn giản là chào nhau một câu!'
              : 'Happy to connect for learning, web design exchange, creative collaboration, or just saying hi!'}
          </p>
        </div>

        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="self-start sm:self-center px-4 py-2 bg-[#2e263f] hover:bg-[#3d3254] text-[#f6c833] border-2 border-[#f6c833] font-['Space_Mono'] text-xs font-bold pixel-btn-action flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0a0514]"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>{isVi ? 'MỞ POPUP NHANH' : 'QUICK POPUP'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Social Channels & Carrier Pigeon Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Social Cards with Official Brand Logos */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-['Space_Mono'] text-xs font-extrabold uppercase text-[#45b7d1] tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>{isVi ? 'KÊNH LIÊN LẠC TRỰC TIẾP' : 'DIRECT CHANNELS'}</span>
          </h3>

          <div className="space-y-3">
            {SOCIAL_LINKS.map((link) => {
              const btnLabel = isVi ? link.btnText : (link.type === 'telegram' ? t.chatNow : t.visit);
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="group bg-[#231b34] hover:bg-[#2d2244] border-[3px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-btn-action flex items-center justify-between transition-all duration-150 block text-decoration-none shadow-[3px_3px_0px_#0a0514]"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Official Brand Logo Icon */}
                    {link.type === 'instagram' && (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.44-1.44z" />
                        </svg>
                      </div>
                    )}
                    {link.type === 'facebook' && (
                      <div className="w-11 h-11 rounded-xl bg-[#1877f2] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                    )}
                    {link.type === 'telegram' && (
                      <div className="w-11 h-11 rounded-xl bg-[#229ed9] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.34-.694.34l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.851.866z" />
                        </svg>
                      </div>
                    )}

                    <div>
                      <div className="font-['Space_Grotesk'] font-bold text-sm text-[#f6c833] group-hover:text-white transition-colors">
                        {link.name}
                      </div>
                      <div className="font-['Space_Mono'] text-xs text-[#d1c5ad]">
                        {link.handle}
                      </div>
                      <div className="font-['Space_Mono'] text-[10px] text-[#45b7d1]">
                        {link.subtitle}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-['Space_Mono'] text-xs font-extrabold px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#0a0514] uppercase tracking-wider text-white ${link.btnBg} group-hover:scale-105 transition-all inline-flex items-center gap-1 shrink-0`}
                  >
                    <span>{btnLabel}</span>
                    <span className="material-symbols-outlined text-[14px]">north_east</span>
                  </span>
                </a>
              );
            })}
          </div>

          {/* Quick Notice Card */}
          <div className="bg-[#120a21] border-2 border-[#5a3696] p-4 pixel-box-sm text-xs font-['Space_Mono'] space-y-2 text-[#d1c5ad]">
            <div className="text-[#f6c833] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{isVi ? 'KHUNG GIỜ HOẠT ĐỘNG' : 'ACTIVE HOURS'}</span>
            </div>
            <div>08:30 - 23:00 (GMT+7 • TP. Hồ Chí Minh)</div>
            <div className="text-[11px] text-[#45b7d1] pt-1 border-t border-[#5a3696]/50">
              📧 Gmail chính: <a href="mailto:vophuonganh054@gmail.com" className="underline hover:text-[#f6c833] text-[#f6c833] font-bold">vophuonganh054@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Right Column: Retro Carrier Pigeon Message Dispatch to Gmail */}
        <div className="lg:col-span-7 bg-[#231b34] border-[3px] border-[#5a3696] p-4 sm:p-6 pixel-box flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dashed border-[#5a3696]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕊️</span>
                <span className="font-['Space_Mono'] text-xs font-extrabold uppercase text-[#f6c833] tracking-wider">
                  {isVi ? 'BỒ CÂU ĐƯA THƯ (CARRIER PIGEON)' : 'CARRIER PIGEON DISPATCH'}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#120a21] text-[#26c281] border border-[#26c281] px-2 py-0.5">
                GMAIL
              </span>
            </div>

            {/* Direct Gmail Badge */}
            <div className="flex flex-wrap items-center gap-2 bg-[#120a21] border border-[#26c281] px-3 py-1.5 text-xs font-['Space_Mono'] text-[#26c281] mb-4">
              <span>🕊️</span>
              <span>{isVi ? 'Tự động gửi đến Gmail:' : 'Auto-delivers to Gmail:'}</span>
              <span className="text-[#f6c833] font-bold underline">vophuonganh054@gmail.com</span>
            </div>

            <p className="text-xs font-['Space_Mono'] text-[#f3eeff] mb-4">
              {isVi
                ? 'Gửi lời nhắn hoặc câu hỏi cho Phương Anh, thư bồ câu sẽ tự động chuyển thẳng vào hộp thư Gmail của cô ấy:'
                : 'Send a message or greeting to Phuong Anh, the pigeon will automatically deliver it straight to her Gmail inbox:'}
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3.5">
              <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
              {sendError && <div role="alert" className="border-2 border-red-400 bg-[#120a21] p-3 text-xs text-red-300">{sendError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                    {isVi ? 'TÊN / BIỆT DANH CỦA BẠN:' : 'YOUR NAME / HANDLE:'}
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={isVi ? 'Ví dụ: Bạn Lữ Hành, Alex...' : 'e.g. Fellow Adventurer, Alex...'}
                    className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none px-3 py-2 text-xs font-['Space_Mono'] text-[#f6c833] placeholder-[#7d6b9d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                    {isVi ? 'EMAIL ĐỂ PHẢN HỒI (TÙY CHỌN):' : 'EMAIL FOR REPLY (OPTIONAL):'}
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="email-cua-ban@gmail.com"
                    className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none px-3 py-2 text-xs font-['Space_Mono'] text-[#f6c833] placeholder-[#7d6b9d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                  {isVi ? 'NỘI DUNG LỜI NHẮN *:' : 'MESSAGE CONTENT *:'}
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  placeholder={isVi ? 'Nhập lời nhắn gửi đến Phương Anh...' : 'Type your message to Phuong Anh...'}
                  className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none p-3 text-xs font-['Space_Mono'] text-[#f3eeff] placeholder-[#7d6b9d] resize-none"
                />
              </div>

              {sentSuccess && (
                <div className="bg-[#120a21] border-2 border-[#26c281] p-3.5 pixel-box-sm space-y-2 text-xs font-['Space_Mono'] animate-fadeIn">
                  <div className="text-[#26c281] font-bold flex items-center gap-2">
                    <span className="text-base animate-bounce">🕊️</span>
                    <span>
                      {isVi
                        ? 'Thư bồ câu đã gửi thành công tới hộp thư Gmail: vophuonganh054@gmail.com!'
                        : 'Pigeon has delivered your message directly to vophuonganh054@gmail.com!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a798c4]">
                    {isVi
                      ? 'Bạn có thể kiểm tra lại email phản hồi trước lần gửi tiếp theo. Cảm ơn bạn đã ghé thăm MY WORLD!'
                      : 'Thank you for visiting MY WORLD!'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                <span className="text-[10px] font-['Space_Mono'] text-[#8b79a8]">
                  {isVi ? '🛡️ Phi thương mại • Bảo mật thông tin' : '🛡️ Non-commercial • Respect privacy'}
                </span>

                <button
                  type="submit"
                  disabled={isSending || !senderMessage.trim()}
                  className="px-6 py-2.5 bg-[#26c281] hover:bg-[#1fa86f] disabled:opacity-50 text-[#120a21] font-['Space_Mono'] font-bold text-xs uppercase pixel-btn-action flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0a0514] transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isSending ? 'hourglass_top' : 'send'}
                  </span>
                  <span>
                    {isSending
                      ? (isVi ? '🕊️ Bồ câu đang bay...' : '🕊️ Pigeon flying...')
                      : (isVi ? 'GỬI BỒ CÂU TỚI GMAIL' : 'SEND PIGEON TO GMAIL')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
