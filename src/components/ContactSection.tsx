import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { spawnPixelBurst } from '../utils/fx';
import { playRetroBeep } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';
interface ContactSectionProps {
  onOpenModal?: (e?: React.MouseEvent) => void;
}
export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenModal
}) => {
  const {
    language,
    isVi
  } = useLanguage();
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: senderName.trim() || (isVi ? 'Khách ghé thăm MY WORLD' : 'MY WORLD Guest'),
          email: senderEmail.trim(),
          message: senderMessage.trim(),
          website
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || (isVi ? 'Chưa gửi được thư. Vui lòng thử lại.' : 'Could not send your message. Please try again.'));
      }
      // FormSubmit's AJAX endpoint receives the website origin from the browser.
      // Archive once on our server, then send exactly one email.
      const delivery = await fetch('https://formsubmit.co/ajax/vophuonganh054@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          name: senderName.trim() || 'MY WORLD Guest',
          ...(senderEmail.trim() ? {
            email: senderEmail.trim(),
            _replyto: senderEmail.trim()
          } : {}),
          message: senderMessage.trim(),
          _subject: '[MY WORLD] Thư bồ câu từ ' + (senderName.trim() || 'Khách ghé thăm'),
          _template: 'table',
          _captcha: 'false'
        })
      });
      const receipt = await delivery.json();
      if (!delivery.ok || !(receipt.success === true || receipt.success === 'true')) {
        throw new Error(/activat/i.test(String(receipt.message || '')) ? 'Chủ website cần bấm Activate Form trong email FormSubmit.' : isVi ? 'Thư đã lưu nhưng chưa chuyển được tới Gmail. Vui lòng thử lại sau.' : 'Your message was saved, but email delivery failed. Please try again.');
      }
      setSentSuccess(true);
      playRetroBeep('coin');
      spawnPixelBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
      setSenderName('');
      setSenderEmail('');
      setSenderMessage('');
      setTimeout(() => setSentSuccess(false), 12000);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : isVi ? 'Chưa gửi được thư. Vui lòng thử lại.' : 'Could not send your message.');
    } finally {
      setIsSending(false);
    }
  };
  const handleLinkClick = (e: React.MouseEvent) => {
    spawnPixelBurst(e.clientX, e.clientY, 10);
    playRetroBeep('coin');
  };
  return <section className="bg-[#1f1730]/95 border-[4px] border-[#5a3696] p-4 sm:p-6 md:p-8 pixel-box relative overflow-hidden backdrop-blur-md">
      {/* Decorative Arcade Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b-[3px] border-dashed border-[#5a3696] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#120a21] border-2 border-[#26c281] px-3 py-1 font-['Space_Mono'] text-xs font-bold text-[#26c281] shadow-[2px_2px_0px_#0a0514] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#26c281] animate-ping" />
            <span>{pixelText(isVi ? 'TRẠM LIÊN LẠC • ONLINE' : 'COMMUNICATION STATION • ONLINE')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f6c833] font-['Space_Grotesk'] tracking-wider uppercase arcade-title-shadow">
            {pixelText(isVi ? 'KẾT NỐI VỚI PHƯƠNG ANH' : 'CONNECT WITH PHUONG ANH')}
          </h2>
          <p className="text-xs sm:text-sm font-['Space_Mono'] text-[#f3eeff] mt-1">
            {pixelText(isVi ? 'Rất vui được trao đổi về học tập, thiết kế web, giao lưu sáng tạo hoặc đơn giản là chào nhau một câu!' : 'Happy to connect for learning, web design exchange, creative collaboration, or just saying hi!')}
          </p>
        </div>

        {pixelText(onOpenModal && <button type="button" onClick={onOpenModal} className="self-start sm:self-center px-4 py-2 bg-[#2e263f] hover:bg-[#3d3254] text-[#f6c833] border-2 border-[#f6c833] font-['Space_Mono'] text-xs font-bold pixel-btn-action flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0a0514]">
            <PixelIcon className="text-sm">open_in_new</PixelIcon>
            <span>{pixelText(isVi ? 'MỞ POPUP NHANH' : 'QUICK POPUP')}</span>
          </button>)}
      </div>

      {/* Main Grid: Social Channels & Carrier Pigeon Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Social Cards with Official Brand Logos */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-['Space_Mono'] text-xs font-extrabold uppercase text-[#45b7d1] tracking-wider flex items-center gap-2">
            <PixelIcon className="text-sm">hub</PixelIcon>
            <span>{pixelText(isVi ? 'KÊNH LIÊN LẠC TRỰC TIẾP' : 'DIRECT CHANNELS')}</span>
          </h3>

          <div className="space-y-3">
            {pixelText(SOCIAL_LINKS.map(link => {
            const btnLabel = isVi ? link.btnText : link.type === 'telegram' ? t.chatNow : t.visit;
            return <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="group bg-[#231b34] hover:bg-[#2d2244] border-[3px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-btn-action flex items-center justify-between transition-all duration-150 block text-decoration-none shadow-[3px_3px_0px_#0a0514]">
                  <div className="flex items-center gap-3.5">
                    {/* Official Brand Logo Icon */}
                    {pixelText(link.type === 'instagram' && <div className="w-11 h-11 rounded-none bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="instagram" className="w-6 h-6 text-white" />
                      </div>)}
                    {pixelText(link.type === 'facebook' && <div className="w-11 h-11 rounded-none bg-[#1877f2] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="facebook" className="w-6 h-6 text-white" />
                      </div>)}
                    {pixelText(link.type === 'telegram' && <div className="w-11 h-11 rounded-none bg-[#229ed9] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="telegram" className="w-6 h-6 text-white" />
                      </div>)}

                    <div>
                      <div className="font-['Space_Grotesk'] font-bold text-sm text-[#f6c833] group-hover:text-white transition-colors">
                        {pixelText(link.name)}
                      </div>
                      <div className="font-['Space_Mono'] text-xs text-[#d1c5ad]">
                        {pixelText(link.handle)}
                      </div>
                      <div className="font-['Space_Mono'] text-[10px] text-[#45b7d1]">
                        {pixelText(link.subtitle)}
                      </div>
                    </div>
                  </div>

                  <span className={`font-['Space_Mono'] text-xs font-extrabold px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#0a0514] uppercase tracking-wider text-white ${link.btnBg} group-hover:scale-105 transition-all inline-flex items-center gap-1 shrink-0`}>
                    <span>{pixelText(btnLabel)}</span>
                    <PixelIcon className="text-[14px]">north_east</PixelIcon>
                  </span>
                </a>;
          }))}
          </div>

          {/* Quick Notice Card */}
          <div className="bg-[#120a21] border-2 border-[#5a3696] p-4 pixel-box-sm text-xs font-['Space_Mono'] space-y-2 text-[#d1c5ad]">
            <div className="text-[#f6c833] font-bold flex items-center gap-1.5">
              <PixelIcon className="text-sm">schedule</PixelIcon>
              <span>{pixelText(isVi ? 'KHUNG GIỜ HOẠT ĐỘNG' : 'ACTIVE HOURS')}</span>
            </div>
            <div>08:30 - 23:00 (GMT+7 • TP. Hồ Chí Minh)</div>
            <div className="text-[11px] text-[#45b7d1] pt-1 border-t border-[#5a3696]/50">{pixelText("📧 Gmail chính: ")}<a href="mailto:vophuonganh054@gmail.com" className="underline hover:text-[#f6c833] text-[#f6c833] font-bold">vophuonganh054@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Right Column: Retro Carrier Pigeon Message Dispatch to Gmail */}
        <div className="lg:col-span-7 bg-[#231b34] border-[3px] border-[#5a3696] p-4 sm:p-6 pixel-box flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dashed border-[#5a3696]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{pixelText("🕊️")}</span>
                <span className="font-['Space_Mono'] text-xs font-extrabold uppercase text-[#f6c833] tracking-wider">
                  {pixelText(isVi ? 'BỒ CÂU ĐƯA THƯ (CARRIER PIGEON)' : 'CARRIER PIGEON DISPATCH')}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#120a21] text-[#26c281] border border-[#26c281] px-2 py-0.5">
                GMAIL
              </span>
            </div>

            {/* Direct Gmail Badge */}
            <div className="flex flex-wrap items-center gap-2 bg-[#120a21] border border-[#26c281] px-3 py-1.5 text-xs font-['Space_Mono'] text-[#26c281] mb-4">
              <span>{pixelText("🕊️")}</span>
              <span>{pixelText(isVi ? 'Tự động gửi đến Gmail:' : 'Auto-delivers to Gmail:')}</span>
              <span className="text-[#f6c833] font-bold underline">vophuonganh054@gmail.com</span>
            </div>

            <p className="text-xs font-['Space_Mono'] text-[#f3eeff] mb-4">
              {pixelText(isVi ? 'Gửi lời nhắn hoặc câu hỏi cho Phương Anh, thư bồ câu sẽ tự động chuyển thẳng vào hộp thư Gmail của cô ấy:' : 'Send a message or greeting to Phuong Anh, the pigeon will automatically deliver it straight to her Gmail inbox:')}
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3.5">
              <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
              {pixelText(sendError && <div role="alert" className="border-2 border-red-400 bg-[#120a21] p-3 text-xs text-red-300">{pixelText(sendError)}</div>)}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                    {pixelText(isVi ? 'TÊN / BIỆT DANH CỦA BẠN:' : 'YOUR NAME / HANDLE:')}
                  </label>
                  <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder={isVi ? 'Ví dụ: Bạn Lữ Hành, Alex...' : 'e.g. Fellow Adventurer, Alex...'} className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none px-3 py-2 text-xs font-['Space_Mono'] text-[#f6c833] placeholder-[#7d6b9d]" />
                </div>

                <div>
                  <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                    {pixelText(isVi ? 'EMAIL ĐỂ PHẢN HỒI (TÙY CHỌN):' : 'EMAIL FOR REPLY (OPTIONAL):')}
                  </label>
                  <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="email-cua-ban@gmail.com" className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none px-3 py-2 text-xs font-['Space_Mono'] text-[#f6c833] placeholder-[#7d6b9d]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['Space_Mono'] font-bold text-[#d1c5ad] mb-1">
                  {pixelText(isVi ? 'NỘI DUNG LỜI NHẮN *:' : 'MESSAGE CONTENT *:')}
                </label>
                <textarea required rows={4} maxLength={5000} value={senderMessage} onChange={e => setSenderMessage(e.target.value)} placeholder={isVi ? 'Nhập lời nhắn gửi đến Phương Anh...' : 'Type your message to Phuong Anh...'} className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] outline-none p-3 text-xs font-['Space_Mono'] text-[#f3eeff] placeholder-[#7d6b9d] resize-none" />
              </div>

              {pixelText(sentSuccess && <div className="bg-[#120a21] border-2 border-[#26c281] p-3.5 pixel-box-sm space-y-2 text-xs font-['Space_Mono'] animate-fadeIn">
                  <div className="text-[#26c281] font-bold flex items-center gap-2">
                    <span className="text-base animate-bounce">{pixelText("🕊️")}</span>
                    <span>
                      {pixelText(isVi ? 'Thư bồ câu đã gửi thành công tới hộp thư Gmail: vophuonganh054@gmail.com!' : 'Pigeon has delivered your message directly to vophuonganh054@gmail.com!')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a798c4]">
                    {pixelText(isVi ? 'Bạn có thể kiểm tra lại email phản hồi trước lần gửi tiếp theo. Cảm ơn bạn đã ghé thăm MY WORLD!' : 'Thank you for visiting MY WORLD!')}
                  </p>
                </div>)}

              <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                <span className="text-[10px] font-['Space_Mono'] text-[#8b79a8]">
                  {pixelText(isVi ? '🛡️ Phi thương mại • Bảo mật thông tin' : '🛡️ Non-commercial • Respect privacy')}
                </span>

                <button type="submit" disabled={isSending || !senderMessage.trim()} className="px-6 py-2.5 bg-[#26c281] hover:bg-[#1fa86f] disabled:opacity-50 text-[#120a21] font-['Space_Mono'] font-bold text-xs uppercase pixel-btn-action flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0a0514] transition-all">
                  <PixelIcon className="text-sm">
                    {pixelText(isSending ? 'hourglass_top' : 'send')}
                  </PixelIcon>
                  <span>
                    {pixelText(isSending ? isVi ? '🕊️ Bồ câu đang bay...' : '🕊️ Pigeon flying...' : isVi ? 'GỬI BỒ CÂU TỚI GMAIL' : 'SEND PIGEON TO GMAIL')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>;
};
