export function HeroVisual() {
  return (
    <div
      className="animate-fade-up delay-4 relative mx-auto w-full max-w-md lg:max-w-none"
      aria-hidden="true"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-steel shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.04),transparent_40%)]" />
        <div className="absolute inset-6 rounded-[1.4rem] border border-white/10" />

        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <g className="origin-center animate-orbit" style={{ transformOrigin: "200px 200px" }}>
            <circle
              cx="200"
              cy="200"
              r="118"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="1.25"
              strokeDasharray="18 10"
            />
            <circle cx="200" cy="82" r="4" fill="#ffffff" />
          </g>
          <circle
            cx="200"
            cy="200"
            r="78"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="42"
            fill="rgba(255,255,255,0.06)"
            stroke="#ffffff"
            strokeWidth="1.25"
          />
          <rect x="188" y="188" width="24" height="24" rx="5" fill="#ffffff" />
          <path
            d="M70 70h36M70 70v36M330 70h-36M330 70v36M70 330h36M70 330v-36M330 330h-36M330 330v-36"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/10 bg-obsidian/80 p-4 backdrop-blur-md">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
            Product frame
          </p>
          <p className="mt-1 text-sm text-paper">Idea in. App out. Keep shaping.</p>
        </div>
      </div>
    </div>
  );
}
