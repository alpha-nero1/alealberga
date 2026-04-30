import { useMemo, useState } from 'react';

const MESSAGES = [
  'Shipping ideas quickly',
  'Polishing interactions',
  'Designing for momentum',
  'Building with Astro + React',
];

export default function ReactMotionCard() {
  const [messageIndex, setMessageIndex] = useState(0);

  const message = useMemo(() => MESSAGES[messageIndex], [messageIndex]);

  function cycleMessage() {
    setMessageIndex((current) => (current + 1) % MESSAGES.length);
  }

  return (
    <section className="react-motion-card" aria-live="polite">
      <p className="react-motion-card__eyebrow">React island active</p>
      <h3 className="react-motion-card__title">{message}</h3>
      <button type="button" className="react-motion-card__button" onClick={cycleMessage}>
        Animate next idea
      </button>
    </section>
  );
}
