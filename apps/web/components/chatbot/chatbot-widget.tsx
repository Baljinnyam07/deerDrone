"use client";

import Link from "next/link";
import { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, ChatResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

const SESSION_ID = `w-${Math.random().toString(36).slice(2, 9)}`;

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Сайн байна уу! Юу туслах вэ?",
  createdAt: new Date().toISOString(),
};

const QUICK = ["Бүтээгдэхүүн", "Үнэ мэдэх", "Зээл", "Хүргэлт"];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const [pending, startT] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 250); }, [open]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || pending) return;
    setDraft("");
    setMsgs(p => [...p, { id: crypto.randomUUID(), role: "user", content: msg, createdAt: new Date().toISOString() }]);
    startT(async () => {
      try {
        const r = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: SESSION_ID, message: msg, sourcePage: window.location.pathname }),
        });
        const d = await r.json() as Partial<ChatResponse> & { error?: string };
        if (!r.ok || !d.reply) throw new Error(d.error ?? "err");
        setMsgs(p => [...p, { id: crypto.randomUUID(), role: "assistant", content: d.reply!, cards: d.cards, createdAt: new Date().toISOString() }]);
      } catch {
        setMsgs(p => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Алдаа гарлаа. Дахин оролдоно уу.", createdAt: new Date().toISOString() }]);
      }
    });
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-panel"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="cb-header">
              <div className="cb-header-dot" />
              <span className="cb-header-title">DEER Drone</span>
              <button className="cb-close" onClick={() => setOpen(false)} type="button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="cb-body">
              {msgs.map(m => (
                <div key={m.id} className={m.role === "user" ? "cb-row cb-row-user" : "cb-row cb-row-bot"}>
                  <div className={m.role === "user" ? "cb-bubble cb-bubble-user" : "cb-bubble cb-bubble-bot"}>
                    {m.content}
                  </div>
                  {m.cards && m.cards.length > 0 && (
                    <div className="cb-cards">
                      {m.cards.map(c => (
                        <div className="cb-card" key={c.id}>
                          <div className="cb-card-img">
                            <img
                              src={c.image_url ?? "/assets/drone-product.png"}
                              alt={c.name}
                              onError={e => { e.currentTarget.src = "/assets/drone-product.png"; }}
                            />
                          </div>
                          <div className="cb-card-info">
                            <p className="cb-card-name">{c.name}</p>
                            <p className="cb-card-price">{c.price > 0 ? formatMoney(c.price) : "Үнэ тодрох"}</p>
                          </div>
                          <div className="cb-card-btns">
                            <Link href={`/products/${c.slug}`} className="cb-btn-ghost">Харах</Link>
                            <Link href={`/products/${c.slug}`} className="cb-btn-dark">Захиалах</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {pending && (
                <div className="cb-row cb-row-bot">
                  <div className="cb-bubble cb-bubble-bot cb-dots">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies — show only at start */}
            {msgs.length === 1 && (
              <div className="cb-quick">
                {QUICK.map(q => (
                  <button key={q} className="cb-quick-chip" onClick={() => send(q)} type="button">{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="cb-footer">
              <input
                ref={inputRef}
                className="cb-input"
                placeholder="Асуулт бичих..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(draft); } }}
                disabled={pending}
              />
              <button
                className="cb-send"
                onClick={() => void send(draft)}
                disabled={pending || !draft.trim()}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        className="cb-fab"
        onClick={() => setOpen(o => !o)}
        type="button"
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.12 }}>
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </motion.span>
            : <motion.span key="chat" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.12 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Зөвлөх</span>
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}
