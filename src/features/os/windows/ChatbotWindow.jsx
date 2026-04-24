import { useEffect, useRef, useState } from 'react';

import { playKeyboardSound } from '../../../lib/sound';
import WindowFrame from '../WindowFrame';

const CHATBOT_DAILY_LIMIT = 20;
const CHATBOT_COOLDOWN_MS = 3000;
const CHATBOT_MAX_PROMPT_LENGTH = 800;
const CHATBOT_SESSION_KEY = 'portfolio-chatbot-session';
const CHATBOT_ENDPOINT = '/.netlify/functions/chatbot';

const initialMessages = [
  {
    id: 'welcome',
    role: 'model',
    text: 'Hey, I am your desktop chatbot. I can answer questions, or help you explore this portfolio.',
  },
];

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
  };
}

function getSessionId() {
  if (typeof window === 'undefined') {
    return 'server-render';
  }

  try {
    const existing = window.localStorage.getItem(CHATBOT_SESSION_KEY);

    if (existing) {
      return existing;
    }

    const generated = window.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(CHATBOT_SESSION_KEY, generated);
    return generated;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

export default function ChatbotWindow({ windowState, controls }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const [remainingMessages, setRemainingMessages] = useState(null);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(getSessionId());
  const lastSentAtRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const syncUsage = async () => {
      try {
        const response = await fetch(CHATBOT_ENDPOINT, {
          method: 'GET',
          headers: {
            'X-Chat-Session': sessionIdRef.current,
          },
        });
        const data = await response.json().catch(() => ({}));

        if (isMounted && response.ok && typeof data.remaining === 'number') {
          setRemainingMessages(Math.max(0, data.remaining));
        }
      } catch (usageError) {
        console.error(usageError);
      }
    };

    syncUsage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  const sendMessage = async () => {
    const text = draft.trim();
    const now = Date.now();

    if (!text || isThinking) {
      return;
    }

    if (text.length > CHATBOT_MAX_PROMPT_LENGTH) {
      setError(`Please keep messages under ${CHATBOT_MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    if (remainingMessages !== null && remainingMessages <= 0) {
      setError('Daily chat limit reached. Please try again tomorrow.');
      return;
    }

    if (now - lastSentAtRef.current < CHATBOT_COOLDOWN_MS) {
      setError('Please wait a moment before sending another message.');
      return;
    }

    const userMessage = createMessage('user', text);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft('');
    setError('');
    setIsThinking(true);
    lastSentAtRef.current = now;

    try {
      const response = await fetch(CHATBOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Chat-Session': sessionIdRef.current,
        },
        body: JSON.stringify({
          prompt: text,
          messages: nextMessages.map((message) => ({
            role: message.role,
            text: message.text,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (typeof data.remaining === 'number') {
          setRemainingMessages(Math.max(0, data.remaining));
        }

        if (response.status === 404) {
          throw new Error('Chat endpoint not found. Restart the dev server so the local function route is registered.');
        }

        throw new Error(data.error || 'Assistant request failed.');
      }

      if (typeof data.remaining === 'number') {
        setRemainingMessages(Math.max(0, data.remaining));
      }

      const reply = data.reply?.trim() || 'I received that, but the assistant did not return any text.';
      setMessages((current) => [...current, createMessage('model', reply)]);
    } catch (requestError) {
      console.error(requestError);
      const message = requestError instanceof Error ? requestError.message : 'Assistant request failed. Please try again later.';
      setError(message);
      setMessages((current) => [
        ...current,
        createMessage('model', 'I could not reach the assistant from here. Please try again later.'),
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleDraftKeyDown = (event) => {
    if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Enter') {
      playKeyboardSound();
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
    setDraft('');
    setError('');
  };

  const messageCount = Math.max(1, messages.length);
  const remainingLabel = remainingMessages === null ? 'Checking' : `${remainingMessages} left today`;

  return (
    <WindowFrame
      windowId="chatbot"
      title="chatbot.ai"
      windowState={windowState}
      width="520px"
      height="560px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentClassName="chatbot-window-content"
      contentStyle={{ padding: 0, overflow: 'hidden' }}
    >
      <div className="chatbot-shell">
        <div className="chatbot-toolbar">
          <div className="chatbot-identity">
            <div className="chatbot-avatar">
              <img src="/images/assistant.png" alt="" />
            </div>
            <div>
              <div className="chatbot-title">Portfolio Assistant</div>
              <div className="chatbot-status">
                <span className="chatbot-dot online" />
                Online
              </div>
            </div>
          </div>
          <div className="chatbot-toolbar-actions">
            <button type="button" className="chatbot-clear-btn" onClick={clearChat}>
              Clear
            </button>
          </div>
        </div>

        <div className="chatbot-messages" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message-row ${message.role}`}>
              {message.role === 'model' && (
                <div className="chatbot-message-avatar">
                  <img src="/images/assistant.png" alt="" />
                </div>
              )}
              <div className="chatbot-message-bubble">
                {message.text}
              </div>
              {message.role === 'user' && <div className="chatbot-user-avatar">Y</div>}
            </div>
          ))}
          {isThinking && (
            <div className="chatbot-message-row model">
              <div className="chatbot-message-avatar">
                <img src="/images/assistant.png" alt="" />
              </div>
              <div className="chatbot-message-bubble chatbot-thinking">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="chatbot-error">{error}</div>}

        <form className="chatbot-composer" onSubmit={handleSubmit}>
          <div className="chatbot-composer-top">
            <span>{remainingLabel}</span>
            <span>{isThinking ? 'Thinking' : 'Ready'}</span>
          </div>
          <div className="chatbot-input-row">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleDraftKeyDown}
              placeholder="Ask anything..."
              rows={2}
              maxLength={CHATBOT_MAX_PROMPT_LENGTH}
              disabled={isThinking}
            />
            <button type="submit" disabled={!draft.trim() || isThinking || remainingMessages === 0}>
              Send
            </button>
          </div>
          <div className="chatbot-composer-bottom">
            <span>{draft.length}/{CHATBOT_MAX_PROMPT_LENGTH}</span>
            <span>{messageCount} message{messageCount === 1 ? "" : "s"}</span>
          </div>
        </form>
      </div>
    </WindowFrame>
  );
}
