export default function ErrorBlock({ message, onRetry, label = 'data' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-red-900/40 bg-red-950/20">
      <div className="flex items-center gap-2 text-red-400">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-medium">Failed to load {label}</span>
      </div>
      {message && <p className="text-xs text-red-300/60 text-center">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 text-xs font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
