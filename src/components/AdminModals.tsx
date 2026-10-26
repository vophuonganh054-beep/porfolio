import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playRetroBeep } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';
import { getStoredAdminToken } from '../utils/portfolioApi';

export const AdminModals: React.FC = () => {
  const { language, isVi } = useLanguage();
  const t = TRANSLATIONS[language].admin;

  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    isPasswordModalOpen,
    closePasswordModal,
    changePassword,
    isMessagesModalOpen,
    closeMessagesModal,
  } = useAuth();

  // Login state
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Change password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Pigeon Messages state
  const [pigeonMessages, setPigeonMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (isMessagesModalOpen) {
      setIsLoadingMessages(true);
      const token = getStoredAdminToken();
      fetch('/api/contact/messages', {
        headers: token ? { 'x-admin-token': token } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.messages) {
            setPigeonMessages(data.messages);
          }
        })
        .catch((err) => console.error('Error fetching pigeon messages:', err))
        .finally(() => setIsLoadingMessages(false));
    }
  }, [isMessagesModalOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPass.trim()) return;

    setIsLoggingIn(true);
    setLoginError(null);
    const res = await login(loginPass.trim());
    setIsLoggingIn(false);

    if (res.success) {
      playRetroBeep('coin');
      setLoginPass('');
    } else {
      playRetroBeep('pop');
      setLoginError(res.error || t.wrongPass);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError(null);
    setChangeSuccess(null);

    if (newPass.length < 4) {
      setChangeError(t.minChars);
      playRetroBeep('pop');
      return;
    }

    if (newPass !== confirmNewPass) {
      setChangeError(t.mismatch);
      playRetroBeep('pop');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPass, newPass);
    setIsChangingPass(false);

    if (res.success) {
      playRetroBeep('coin');
      setChangeSuccess(t.successChange);
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setTimeout(() => {
        setChangeSuccess(null);
        closePasswordModal();
      }, 2500);
    } else {
      playRetroBeep('pop');
      setChangeError(res.error || t.cannotChange);
    }
  };

  return (
    <>
      {/* Admin Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLoginModal}
        >
          <div
            className="bg-[#1f1730] border-[4px] border-[#f6c833] pixel-box-sm p-6 w-full max-w-md shadow-[8px_8px_0px_#0a0514] font-['Space_Mono'] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#5a3696] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f6c833] text-xl">admin_panel_settings</span>
                <h3 className="text-base font-extrabold text-[#f6c833] font-['Space_Grotesk'] tracking-wider">
                  {t.loginTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLoginModal}
                className="text-[#eaddff] hover:text-[#ef4444] font-bold text-base px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Explanation */}
            <div className="text-xs text-[#eaddff]/90 space-y-2 mb-4 bg-[#120a21] border border-[#5a3696] p-3">
              <p className="flex items-center gap-1.5 text-[#45b7d1] font-bold">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span>{t.privacyTitle}</span>
              </p>
              <p>
                {t.privacyDesc}
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 bg-[#ef4444]/20 border-2 border-[#ef4444] text-[#ff8080] text-xs p-2.5 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#d1c5ad] uppercase mb-1">
                  {t.passLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder={t.passPlaceholder}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] text-sm text-[#f3eeff] px-3 py-2 pr-10 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#d1c5ad] hover:text-[#f6c833] text-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeLoginModal}
                  className="px-4 py-2 bg-[#2e263f] text-xs text-[#d1c5ad] border border-black cursor-pointer hover:bg-[#3d3254]"
                >
                  {t.closeBtn}
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="px-5 py-2 bg-[#f6c833] hover:bg-[#e0b020] text-xs text-[#120a21] font-bold border-2 border-black shadow-[3px_3px_0px_#0a0514] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">key</span>
                  <span>{isLoggingIn ? t.verifying : t.confirmBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Change Password Modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={closePasswordModal}
        >
          <div
            className="bg-[#1f1730] border-[4px] border-[#45b7d1] pixel-box-sm p-6 w-full max-w-md shadow-[8px_8px_0px_#0a0514] font-['Space_Mono'] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#5a3696] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45b7d1] text-xl">lock_reset</span>
                <h3 className="text-base font-extrabold text-[#45b7d1] font-['Space_Grotesk'] tracking-wider">
                  {t.changePassTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={closePasswordModal}
                className="text-[#eaddff] hover:text-[#ef4444] font-bold text-base px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {changeError && (
              <div className="mb-4 bg-[#ef4444]/20 border-2 border-[#ef4444] text-[#ff8080] text-xs p-2.5 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{changeError}</span>
              </div>
            )}

            {changeSuccess && (
              <div className="mb-4 bg-[#26c281]/20 border-2 border-[#26c281] text-[#26c281] text-xs p-2.5 flex items-center gap-2 font-bold animate-pulse">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{changeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#d1c5ad] uppercase mb-1">
                  {t.currentPassLabel}
                </label>
                <input
                  type="password"
                  placeholder={t.currentPassPlaceholder}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#45b7d1] text-xs text-[#f3eeff] px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#d1c5ad] uppercase mb-1">
                  {t.newPassLabel}
                </label>
                <input
                  type="password"
                  required
                  placeholder={t.newPassPlaceholder}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#45b7d1] text-xs text-[#f3eeff] px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#d1c5ad] uppercase mb-1">
                  {t.confirmNewPassLabel}
                </label>
                <input
                  type="password"
                  required
                  placeholder={t.confirmNewPassPlaceholder}
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  className="w-full bg-[#120a21] border-2 border-[#5a3696] focus:border-[#45b7d1] text-xs text-[#f3eeff] px-3 py-2 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 bg-[#2e263f] text-xs text-[#d1c5ad] border border-black cursor-pointer hover:bg-[#3d3254]"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2 bg-[#45b7d1] hover:bg-[#38a0b8] text-xs text-[#120a21] font-bold border-2 border-black shadow-[3px_3px_0px_#0a0514] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>{isChangingPass ? t.saving : t.updateBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pigeon Messages Inbox Modal */}
      {isMessagesModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={closeMessagesModal}
        >
          <div
            className="bg-[#1f1730] border-[4px] border-[#26c281] pixel-box-sm p-5 sm:p-6 w-full max-w-2xl shadow-[10px_10px_0px_#0a0514] font-['Space_Mono'] relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#5a3696] pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕊️</span>
                <div>
                  <h3 className="text-base font-extrabold text-[#26c281] font-['Space_Grotesk'] tracking-wider">
                    {isVi ? 'HỘP THƯ BỒ CÂU (PIGEON INBOX)' : 'PIGEON CARRIER INBOX'}
                  </h3>
                  <p className="text-[10px] text-[#a798c4]">
                    {isVi
                      ? 'Đồng bộ tự động tới hộp thư Gmail: vophuonganh054@gmail.com'
                      : 'Auto-synchronized to Gmail: vophuonganh054@gmail.com'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMessagesModal}
                className="text-[#eaddff] hover:text-[#ef4444] font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {isLoadingMessages ? (
                <div className="text-center py-10 text-[#f6c833] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  <span>{isVi ? 'Đang tải tin nhắn bồ câu...' : 'Loading messages...'}</span>
                </div>
              ) : pigeonMessages.length === 0 ? (
                <div className="text-center py-12 text-[#a798c4] bg-[#120a21] border border-[#5a3696] p-6 space-y-2">
                  <span className="text-3xl block">📭</span>
                  <p className="text-[#f6c833] font-bold">
                    {isVi ? 'Chưa có lời nhắn bồ câu nào!' : 'No messages yet!'}
                  </p>
                  <p className="text-[11px]">
                    {isVi
                      ? 'Khi khách gửi lời nhắn qua mục Bồ Câu Đưa Thư, thư sẽ vừa lưu tại đây vừa tự động gửi vào vophuonganh054@gmail.com.'
                      : 'When visitors send via the Carrier Pigeon form, messages will appear here and in vophuonganh054@gmail.com.'}
                  </p>
                </div>
              ) : (
                pigeonMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-[#120a21] border-2 border-[#5a3696] hover:border-[#26c281] p-3.5 pixel-box-sm transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#5a3696]/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f6c833]">{msg.senderName}</span>
                        {msg.senderEmail && msg.senderEmail !== 'guest@myworld.app' && (
                          <span className="text-[10px] text-[#45b7d1] bg-[#1f1730] px-2 py-0.5 border border-[#5a3696]">
                            {msg.senderEmail}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8b79a8]">
                        {new Date(msg.createdAt).toLocaleString(isVi ? 'vi-VN' : 'en-US')}
                      </span>
                    </div>

                    <p className="text-[#f3eeff] whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>

                    {msg.senderEmail && msg.senderEmail !== 'guest@myworld.app' && (
                      <div className="pt-1.5 flex justify-end">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.senderEmail)}&su=${encodeURIComponent(`[MY WORLD] Phản hồi lời nhắn bồ câu của ${msg.senderName}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#26c281] hover:bg-[#1fa86f] text-[#120a21] font-bold text-[10px] flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                        >
                          <span className="material-symbols-outlined text-xs">reply</span>
                          <span>{isVi ? 'Phản hồi qua Gmail' : 'Reply via Gmail'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#5a3696] flex items-center justify-between shrink-0">
              <span className="text-[10px] text-[#8b79a8]">
                {pigeonMessages.length} {isVi ? 'thư đã lưu' : 'messages stored'}
              </span>
              <button
                type="button"
                onClick={closeMessagesModal}
                className="px-4 py-1.5 bg-[#2e263f] hover:bg-[#3d3254] text-[#d1c5ad] text-xs font-bold border border-black cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
