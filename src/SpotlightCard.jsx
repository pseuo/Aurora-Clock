import { useEffect, useRef } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const handleMouseMove = (event) => {
    const card = divRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    pointRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const current = divRef.current;
      if (!current) return;

      current.style.setProperty('--mouse-x', `${pointRef.current.x}px`);
      current.style.setProperty('--mouse-y', `${pointRef.current.y}px`);
      current.style.setProperty('--spotlight-color', spotlightColor);
    });
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
