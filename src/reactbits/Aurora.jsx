export default function Aurora({
  amplitude = 1,
  blend = 0.5,
  colorStops = ['#5227ff', '#7cff67', '#5227ff'],
  speed = 0.5,
  animated = true,
}) {
  const [start = '#5227ff', middle = '#7cff67', end = '#5227ff'] = colorStops;
  const duration = Math.max(14, 31 - speed * 18);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        '--aurora-stop-a': start,
        '--aurora-stop-b': middle,
        '--aurora-stop-c': end,
        '--aurora-opacity': Math.min(1, 0.5 + blend * 0.45),
        '--aurora-blur-primary': `${18 + amplitude * 10}px`,
        '--aurora-blur-secondary': `${28 + amplitude * 12}px`,
        '--aurora-duration': `${duration}s`,
        '--aurora-duration-haze': `${duration * 1.9}s`,
        '--aurora-duration-secondary': `${duration * 1.35}s`,
        '--aurora-duration-ribbons': `${duration * 1.7}s`,
      }}
    >
      <span className={`absolute -inset-1/4 rounded-[45%] bg-[radial-gradient(ellipse_at_50%_50%,var(--aurora-stop-b)_0%,transparent_62%)] opacity-[var(--aurora-opacity)] blur-[var(--aurora-blur-secondary)] ${animated ? 'aurora-drift-haze' : ''}`} />
      <span className={`absolute -inset-1/4 rounded-[45%] bg-[linear-gradient(115deg,transparent_16%,var(--aurora-stop-a)_38%,transparent_58%),linear-gradient(72deg,transparent_24%,var(--aurora-stop-c)_52%,transparent_74%)] opacity-[var(--aurora-opacity)] blur-[var(--aurora-blur-primary)] mix-blend-screen ${animated ? 'aurora-drift' : ''}`} />
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_20%,rgb(4_8_18_/_0.35)_78%)]" />
      <span className={`absolute inset-x-0 top-1/3 h-1/3 -skew-y-6 bg-[linear-gradient(110deg,transparent_20%,var(--aurora-stop-b)_45%,transparent_70%)] opacity-20 blur-3xl ${animated ? 'aurora-drift-ribbon' : ''}`} />
    </div>
  );
}
