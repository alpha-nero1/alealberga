import { useState } from 'react';
import AleBot from './AleBot.jsx';

export default function AleBotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="alebot-widget">
      {open && (
        <div className="alebot-panel" role="dialog" aria-label="Chat with AleBot">
          <div className="alebot-panel-header">
            <span className="alebot-panel-title">Ask AleBot</span>
            <button
              className="alebot-panel-close"
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <AleBot />
        </div>
      )}

      <button
        className={`alebot-fab ${open ? 'alebot-fab--open' : 'alebot-fab--cta'}`}
        type="button"
        title="Have a specific question? Ask AleBot"
        aria-label={open ? 'Close AleBot chat' : 'Have a specific question? Ask AleBot'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="alebot-fab-icon">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        {!open && <span className="alebot-fab-label">Have a specific question? Ask AleBot</span>}
        {!open && <span className="alebot-fab-sheen" aria-hidden="true" />}
      </button>
    </div>
  );
}
