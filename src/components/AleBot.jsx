import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "What's Ale's main tech stack?",
  "What kind of teams does Ale work best in?",
  "What is Ale working on right now?",
];

function BotMessage({ content, streaming }) {
  return (
    <div className="alebot-msg alebot-msg--bot">
      <span className="alebot-avatar">A</span>
      <div className="alebot-bubble">
        {content}
        {streaming && <span className="alebot-cursor" />}
      </div>
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div className="alebot-msg alebot-msg--user">
      <div className="alebot-bubble">{content}</div>
    </div>
  );
}

export default function AleBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setInput('');
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setLoading(true);

    // Add a streaming placeholder for the bot reply.
    setMessages([...next, { role: 'assistant', content: '', streaming: true }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        throw new Error('API error');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...next, { role: 'assistant', content: reply, streaming: true }]);
      }

      setMessages([...next, { role: 'assistant', content: reply, streaming: false }]);
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: "Sorry, I couldn't connect right now. Try reaching Ale directly at ale.alberga1@gmail.com.",
          streaming: false,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showSuggestions = messages.length === 0;

  return (
    <div className="alebot">
      <div className="alebot-thread" ref={threadRef}>
        {showSuggestions && (
          <div className="alebot-welcome">
            <div className="alebot-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="alebot-suggestion" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'user'
            ? <UserMessage key={i} content={m.content} />
            : <BotMessage key={i} content={m.content} streaming={m.streaming} />
        )}

      </div>

      <form
        className="alebot-form"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <input
          ref={inputRef}
          className="alebot-input"
          type="text"
          placeholder="Ask me anything about Ale…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          autoComplete="off"
        />
        <button
          className="alebot-send"
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
