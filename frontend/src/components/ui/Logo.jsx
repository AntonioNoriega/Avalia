export default function Logo ({ size = 28, withText = true, light = false }) {
  const stroke = light ? '#FFFFFF' : '#1E4D8C'
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
        <path d="M16 84 L48 14" stroke={stroke} strokeWidth="11" strokeLinecap="round"/>
        <path d="M48 14 L80 84" stroke={stroke} strokeWidth="11" strokeLinecap="round"/>
        <path d="M28 52 L48 40 L68 52" stroke="#2E9E6B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="40" y="56" width="16" height="16" rx="2" fill="#F2A93B"/>
      </svg>
      {withText && <span className={`font-display text-xl font-semibold ${light ? 'text-white' : 'text-ink'}`}>avalia</span>}
    </span>
  )
}
