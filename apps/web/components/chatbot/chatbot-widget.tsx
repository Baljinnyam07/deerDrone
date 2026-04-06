"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ChatMessage, ChatResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Сайн байна уу. Хэрэглээ, төсөв, эсвэл тодорхой загвараа хэлбэл би санал болгоё.",
    createdAt: new Date().toISOString(),
  },
];

function buildErrorMessage(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "AI зөвлөх түр ажиллагаагүй байна. Хэсэг хугацааны дараа дахин оролдох эсвэл support багтай холбогдоно уу.",
    createdAt: new Date().toISOString(),
  };
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSend() {
    const input = draft.trim();

    if (!input) {
      return;
    }

    setDraft("");

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
        createdAt: new Date().toISOString(),
      },
    ]);

    startTransition(async () => {
      try {
        const response = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "widget-session",
            message: input,
            sourcePage: window.location.pathname,
          }),
        });

        const payload = (await response.json()) as Partial<ChatResponse> & {
          error?: string;
        };

        if (!response.ok || !payload.reply || !payload.sessionId) {
          throw new Error(payload.error || "service unavailable");
        }

        const reply = payload.reply;

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply,
            cards: payload.cards,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages((current) => [...current, buildErrorMessage()]);
      }
    });
  }

  return (
    <div className="floating-chat">
      {isOpen ? (
        <section className="chatbot-shell">
          <div className="chatbot-head stack-row">
            <div>
              <strong>AI зөвлөх</strong>
              <p className="muted">Бараа, үнэ, лизинг, хүргэлтийн асуулт</p>
            </div>
            <button className="dd-button dd-button-secondary" onClick={() => setIsOpen(false)} type="button">
              Хаах
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((message) => (
              <div
                className={
                  message.role === "user"
                    ? "chat-bubble chat-bubble-user"
                    : "chat-bubble chat-bubble-assistant"
                }
                key={message.id}
              >
                <div>{message.content}</div>

                {message.cards?.map((card) => (
                  <div className="chat-inline-card" key={card.id}>
                    <strong>{card.name}</strong>
                    <p className="muted">{card.heroNote}</p>
                    <div className="stack-row">
                      <span>{formatMoney(card.price)}</span>
                      <Link href={`/products/${card.slug}`}>Дэлгэрэнгүй</Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="chatbot-footer">
            <div className="chat-input-row">
              <input
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Жишээ: лизингтэй мэргэжлийн дрон"
                value={draft}
              />
              <button
                className="dd-button"
                disabled={isPending}
                onClick={() => void handleSend()}
                type="button"
              >
                {isPending ? "..." : "Илгээх"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <button className="dd-button" onClick={() => setIsOpen((current) => !current)} type="button">
        {isOpen ? "Чат нээлттэй" : "AI зөвлөхтэй ярилцах"}
      </button>
    </div>
  );
}
