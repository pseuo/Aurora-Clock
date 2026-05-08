export function Toast({ message }) {
  return (
    <div className={`toast-region ${message ? 'is-visible' : ''}`} aria-live="polite" aria-atomic="true">
      {message && <div className="toast-card">{message}</div>}
    </div>
  );
}
