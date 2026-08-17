export function Toast({ message }) {
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition duration-300 ${message ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`} aria-live="polite" aria-atomic="true">
      {message && <div className="rounded-full border border-white/15 bg-panel/90 px-4 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">{message}</div>}
    </div>
  );
}
