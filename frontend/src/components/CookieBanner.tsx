type CookieBannerProps = {
  onAccept: () => void;
  onDecline?: () => void;
};

export default function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(95vw,900px)] -translate-x-1/2 rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 text-left">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-base font-semibold">We use cookies to improve your experience.</p>
          <p className="text-sm text-gray-600">
            By continuing to browse this site, you accept our use of cookies for analytics and functionality.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="mt-2 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 md:mt-0"
        >
          Accept cookies
        </button>

        <button 
          onClick={onDecline}
          className="mt-2 inline-flex rounded-full bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-400 md:mt-0"
        >
          Decline cookies
        </button>
      </div>
    </div>
  );
}
