// src/components/Chatbot/ChatbotPanel.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ChatbotPanel.css';

type Role = 'bot' | 'user';
type Msg = {
  id: string;
  role: Role;
  text: string;
  time: string;
};

const now = () =>
  new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

/** ===== Backend =====
 * Si prefieres .env, cambia a:
 * const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
 */
const API_BASE = 'http://localhost:8000';
const CHAT_ENDPOINT = '/api/chatbot/'; // tu ruta real

const ChatbotPanel: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: 'bot',
      text: '¡Hola! Soy tu asistente de Stark Advisor. ¿Qué deseas analizar hoy?',
      time: now(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const canSend = useMemo(() => draft.trim().length > 0 && !sending, [draft, sending]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;

    // 1) pinta el mensaje del usuario (MISMO DISEÑO)
    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setSending(true);

    try {
      // 2) POST { question } al backend
      const res = await fetch(`${API_BASE}${CHAT_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) {
        let detail = `Error ${res.status}`;
        try {
          const j = await res.json();
          detail = j?.message || detail;
        } catch { }
        throw new Error(detail);
      }

      // 3) respuesta { answer }
      const data: { answer?: string } = await res.json();
      const botText = data?.answer ?? 'No recibí "answer" desde el servidor.';

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: botText,
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      // Mensaje de error en burbuja del bot (Misma UI)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text:
            '⚠️ No pude conectar con el backend.' +
            (e?.message ? ` Detalle: ${e.message}` : ''),
          time: now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) void send();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'bot',
        text: '¡Listo! Comencemos de nuevo 😊',
        time: now(),
      },
    ]);
  };

  return (
    <section className="sa-chat">
      {/* Header con gradiente + botón limpiar */}
      <header className="sa-chat__header">
        <div className="sa-chat__title">
          <div className="sa-chat__logo">
            <span className="sa-logo-pulse" />
          </div>
          <div>
            <div className="sa-chat__name">Stark Advisor — Chat</div>
            <div className="sa-chat__time">
              {new Date().toLocaleDateString()}&nbsp;{now()}
            </div>
          </div>
        </div>

        <button className="sa-btn sa-btn--ghost" onClick={clearChat} disabled={sending}>
          Limpiar
        </button>
      </header>

      {/* Timeline (MISMAS BURBUJAS que tenías) */}
      <main ref={bodyRef} className="sa-chat__body" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`sa-row sa-row--${m.role}`}>
            {m.role === 'bot' && (
              <div className="sa-avatar" aria-hidden="true">
                <span className="sa-avatar__icon">📈</span>
              </div>
            )}

            <div
              className={`sa-bubble ${m.role === 'bot' ? 'sa-bubble--bot' : 'sa-bubble--user'}`}
              role="group"
              aria-label={m.role === 'bot' ? 'Asistente' : 'Tú'}
            >
              <div className="sa-bubble__text">{m.text}</div>
              <div className="sa-bubble__meta">
                {m.time} &nbsp; {m.role === 'bot' ? 'Asistente' : 'Tú'}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="sa-avatar sa-avatar--user" aria-hidden="true">
                <span className="sa-avatar__initials">Tú</span>
              </div>
            )}
          </div>
        ))}

        {/* 🔥 Indicador de escribiendo solo cuando está enviando */}
        {sending && (
          <div className="sa-row sa-row--bot">
            <div className="sa-avatar" aria-hidden="true">
              <span className="sa-avatar__icon">📈</span>
            </div>
            <div className="sa-bubble sa-bubble--bot">
              <div className="sa-typing">
                <span className="sa-dot"></span>
                <span className="sa-dot"></span>
                <span className="sa-dot"></span>
              </div>
            </div>
          </div>
        )}
      </main>


      {/* Input sticky */}
      <footer className="sa-chat__footer">
        <textarea
          className="sa-input"
          placeholder="Escribe tu mensaje… (Shift+Enter = nueva línea)"
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={sending}
        />
        <button className="sa-btn sa-btn--primary" onClick={send} disabled={!canSend}>
          {sending ? 'Enviando…' : 'Enviar'}
        </button>
      </footer>
    </section>
  );
};

export default ChatbotPanel;