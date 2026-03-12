import { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';

const CONSENT_KEY = 'cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: 'accepted' }));
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: 'declined' }));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-[#008060] rounded-full flex items-center justify-center">
            <Cookie className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-0.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#25D366]" /> We value your privacy
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            We use cookies to improve your experience, analyze site traffic, and personalise content.
            By clicking &quot;Accept&quot; you consent to our use of cookies.{' '}
            <a href="/cookie-policy" className="text-[#25D366] hover:underline">Cookie Policy</a>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 self-end sm:self-auto">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-bold bg-[#008060] hover:bg-[#006e52] text-white rounded-lg transition-colors shadow"
          >
            Accept All
          </button>
        </div>
        <button
          onClick={decline}
          className="absolute top-3 right-3 sm:hidden text-gray-500 hover:text-gray-300"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
