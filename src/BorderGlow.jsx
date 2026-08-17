import { useCallback, useEffect, useRef } from 'react';

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function colorFromGlowValue(glowColor) {
  const [hue = '185', saturation = '90', lightness = '78'] = String(glowColor).match(/[\d.]+/g) ?? [];
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '185 90 78',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const updateGlow = useCallback((event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;

    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const x = clamp(pointerRef.current.x - rect.left, 0, width);
      const y = clamp(pointerRef.current.y - rect.top, 0, height);
      const closestEdge = Math.min(x, y, width - x, height - y);
      const edgeRange = Math.max(24, edgeSensitivity * 2);
      const proximity = 1 - clamp(closestEdge / edgeRange, 0, 1);
      const angle = Math.atan2(y - height / 2, x - width / 2) * (180 / Math.PI);

      card.style.setProperty('--glow-x', `${(x / width) * 100}%`);
      card.style.setProperty('--glow-y', `${(y / height) * 100}%`);
      card.style.setProperty('--glow-angle', `${angle + 90}deg`);
      card.style.setProperty('--glow-strength', `${0.24 + proximity * 0.76}`);
    });
  }, [edgeSensitivity]);

  const resetGlow = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    cardRef.current?.style.setProperty('--glow-strength', '0.24');
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const fallbackColor = colorFromGlowValue(glowColor);
  const [first = fallbackColor, second = fallbackColor, third = fallbackColor] = colors;
  const spread = clamp(coneSpread, 12, 120);
  const radius = Math.max(glowRadius, 16);
  const strength = clamp(glowIntensity, 0, 1.5);
  const panelOpacity = clamp(fillOpacity, 0, 1);
  const borderGradient = `conic-gradient(from calc(var(--glow-angle) - ${spread / 2}deg) at var(--glow-x) var(--glow-y), ${first} 0deg, ${second} ${spread * 0.42}deg, ${third} ${spread}deg, transparent ${spread * 1.8}deg, transparent 360deg)`;

  return (
    <div
      ref={cardRef}
      className={`relative isolate rounded-[var(--border-radius)] p-px ${className}`}
      onPointerEnter={updateGlow}
      onPointerLeave={resetGlow}
      onPointerMove={updateGlow}
      style={{
        '--border-radius': `${borderRadius}px`,
        '--glow-angle': '110deg',
        '--glow-strength': 0.24,
        '--glow-x': '50%',
        '--glow-y': '50%',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-[var(--border-radius)] blur-2xl transition-opacity duration-300 motion-reduce:transition-none"
        style={{
          inset: `-${radius}px`,
          opacity: `calc(var(--glow-strength) * ${0.34 * strength})`,
          background: `radial-gradient(circle at var(--glow-x) var(--glow-y), ${second}, transparent 54%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[var(--border-radius)] transition-opacity duration-200 motion-reduce:transition-none"
        style={{
          opacity: `calc(var(--glow-strength) * ${strength})`,
          background: borderGradient,
        }}
      />
      {animated && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px z-0 rounded-[calc(var(--border-radius)-1px)] opacity-40 mix-blend-screen motion-reduce:hidden"
          style={{
            background: `linear-gradient(112deg, transparent 36%, ${first} 46%, ${second} 50%, ${third} 54%, transparent 64%)`,
            backgroundSize: '220% 100%',
            animation: 'border-glow-sweep 6s linear infinite',
          }}
        />
      )}
      <div className="relative z-10 h-full min-h-0 overflow-hidden rounded-[calc(var(--border-radius)-1px)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundColor, opacity: panelOpacity }} />
        <div className="relative z-10 h-full min-h-0">{children}</div>
      </div>
    </div>
  );
};

export default BorderGlow;
