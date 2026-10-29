// Check animado: primero el círculo, luego el palomazo. Lo uso en los "guardado con éxito".
export function AnimatedCheck({ className = "h-10 w-10 text-emerald-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={className} fill="none" aria-hidden="true">
      <circle className="animated-check-circle" cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2.5" />
      <path
        className="animated-check-mark"
        d="M14 27l7.5 7.5L38 17"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
