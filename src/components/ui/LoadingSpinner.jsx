export default function LoadingSpinner({ size = 24, label = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#333" strokeWidth="2"/>
        <path d="M22 12a10 10 0 0 0-10-10" stroke="#20F3C7" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {label && <span className="text-xs text-gray-500">{label}</span>}
    </div>
  )
}
