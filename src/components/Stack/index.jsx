import { useState, useRef, useEffect } from 'react';
import './Stack.css';

// Box dimensions (px)
const W = 150; // width
const H = 44;  // height (front face)
const D = 150; // depth (equal to width for box-like shape)

function hexToRgba(hex, alpha) {
  let full = hex.replace('#', '');
  if (full.length === 3) full = full.split('').map(c => c + c).join('');
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function IsoBox({ label, color, index, visible }) {
  const fill     = hexToRgba(color, 0.62);
  const topFill  = hexToRgba(color, 0.78);
  const sideFill = hexToRgba(color, 0.46);
  const leftFill = hexToRgba(color, 0.52);
  const bd       = `2px solid ${color}`;
  const face     = { position: 'absolute', boxSizing: 'border-box', border: bd };

  return (
    <div className="iso-box-slot" style={{ '--idx': index }}>
      {/* Separate drop-animation wrapper so the animation does not flatten 3D children */}
      <div
        className={`iso-box-drop${visible ? ' iso-drop-animate' : ''}`}
        style={{ '--idx': index }}
      >
        <div className="iso-box">
          {/* Front face — shows label */}
          <div
            className="iso-face iso-front"
            style={{
              ...face,
              background: fill,
              width: W,
              height: H,
              left: -W / 2,
              top: -H / 2,
              '--box-color': color,
            }}
          >
            <span className="iso-label">{label}</span>
          </div>

          {/* Top face */}
          <div
            className="iso-face iso-top"
            style={{ ...face, background: topFill, width: W, height: D, left: -W / 2, top: -D / 2 }}
          />

          {/* Right face */}
          <div
            className="iso-face iso-right"
            style={{ ...face, background: sideFill, width: D, height: H, left: -D / 2, top: -H / 2 }}
          />

          {/* Left face (back-left in isometric view) */}
          <div
            className="iso-face iso-left"
            style={{ ...face, background: leftFill, width: D, height: H, left: -D / 2, top: -H / 2 }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Stack — renders a pile of 3D isometric boxes.
 *
 * @param {{
 *   items?: Array<{ label: string, color: string, reason?: string }>,
 *   scenarios?: Array<{
 *     label: string,
 *     summary?: string,
 *     items: Array<{ label: string, color: string, reason?: string }>
 *   }>
 * }} props
 *
 * Example:
 *   <Stack items={[
 *     { label: 'React',      color: '#61DAFB' },
 *     { label: 'TypeScript', color: '#3178C6' },
 *     { label: 'Astro',      color: '#FF5D01' },
 *   ]} />
 *
 * items[0] is the bottom of the stack, the last item is the top.
 */
export default function Stack({ items = [], scenarios = [] }) {
  const [visible, setVisible] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [dropCycle, setDropCycle] = useState(0);
  const sceneRef = useRef(null);

  const scenarioList = scenarios.length > 0
    ? scenarios
    : [{ label: 'Stack', items }];
  const current = scenarioList[activeScenario] ?? scenarioList[0];
  const currentItems = current?.items ?? [];
  const reasonParagraphs = currentItems
    .filter((item) => typeof item.reason === 'string' && item.reason.trim().length > 0)
    .map((item) => ({
      label: item.label,
      reason: item.reason.trim(),
    }));
  const currentSummary = current?.summary
    ?? `Great fit for fast delivery with ${currentItems.map((item) => item.label).join(', ')}.`;

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function onScenarioClick(index) {
    setActiveScenario(index);
    if (visible) setDropCycle((v) => v + 1);
  }

  return (
    <div className="iso-wrap">
      {scenarioList.length > 1 && (
        <div className="iso-scenarios" role="tablist" aria-label="Tech stack scenarios">
          {scenarioList.map((scenario, index) => (
            <button
              key={scenario.label}
              type="button"
              role="tab"
              aria-selected={activeScenario === index}
              className={`iso-scenario-btn${activeScenario === index ? ' is-active' : ''}`}
              onClick={() => onScenarioClick(index)}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      )}

      <div className="iso-scene" ref={sceneRef} style={{ height: currentItems.length * H + 140 }}>
        <div className="iso-stack">
          {[...currentItems].reverse().map((item, i) => (
            <IsoBox
              key={`${dropCycle}-${current.label}-${item.label}-${i}`}
              {...item}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      <aside className="iso-summary" aria-live="polite">
        <p className="iso-summary-kicker">Why this stack works</p>

        {reasonParagraphs.length > 0 && (
          <div className="iso-summary-reasons">
            {reasonParagraphs.map((entry) => (
              <p key={`${current.label}-${entry.label}`} className="iso-summary-copy">
                <span className="iso-summary-tech">{entry.label}:</span> {entry.reason}
              </p>
            ))}
          </div>
        )}

        <p className="iso-summary-end">{currentSummary}</p>
      </aside>
    </div>
  );
}
