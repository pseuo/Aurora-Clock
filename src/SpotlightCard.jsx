import { useCallback, useEffect, useRef } from 'react';

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  style,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  ...props
}) => {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const updateSpotlight = useCallback((event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;

    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = clamp(pointerRef.current.x - rect.left, 0, Math.max(rect.width, 1));
      const y = clamp(pointerRef.current.y - rect.top, 0, Math.max(rect.height, 1));

      card.style.setProperty('--spotlight-x', `${(x / Math.max(rect.width, 1)) * 100}%`);
      card.style.setProperty('--spotlight-y', `${(y / Math.max(rect.height, 1)) * 100}%`);
      card.style.setProperty('--spotlight-opacity', '1');
    });
  }, []);

  const resetSpotlight = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    cardRef.current?.style.setProperty('--spotlight-opacity', '0');
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const handlePointerEnter = useCallback((event) => {
    onPointerEnter?.(event);
    updateSpotlight(event);
  }, [onPointerEnter, updateSpotlight]);

  const handlePointerLeave = useCallback((event) => {
    onPointerLeave?.(event);
    resetSpotlight();
  }, [onPointerLeave, resetSpotlight]);

  const handlePointerMove = useCallback((event) => {
    onPointerMove?.(event);
    updateSpotlight(event);
  }, [onPointerMove, updateSpotlight]);

  return (
    <div
      {...props}
      ref={cardRef}
      className={`relative isolate overflow-hidden ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%',
        '--spotlight-opacity': 0,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--spotlight-opacity)] transition-opacity duration-300 motion-reduce:transition-none"
        style={{
          background: `radial-gradient(34rem circle at var(--spotlight-x) var(--spotlight-y), ${spotlightColor} 0%, transparent 58%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[calc(var(--spotlight-opacity)*0.7)] mix-blend-screen"
        style={{
          background: `radial-gradient(12rem circle at var(--spotlight-x) var(--spotlight-y), ${spotlightColor} 0%, transparent 72%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
