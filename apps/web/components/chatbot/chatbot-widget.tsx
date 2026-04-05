"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { products } from "@deer-drone/data";
import type { ChatMessage, ChatResponse, Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Сайн байна уу. Хэрэглээ, төсөв, эсвэл тодорхой загвараа хэлбэл би санал болгоё.",
    createdAt: new Date().toISOString(),
  },
];

function buildLocalReply(input: string): ChatResponse {
  const normalized = input.toLowerCase();
  let matches: Product[] = [];
  let reply =
    "Танд яг ямар зориулалт хэрэгтэй байгааг хэлбэл би илүү оновчтой санал болгоно. Жишээ нь зураглал, уул уурхай, контент зураг авалт гэх мэт.";

  if (normalized.includes("thermal") || normalized.includes("дулаан")) {
    matches = products.filter((product) => product.tags.includes("thermal"));
    reply = "Дулаан мэдрэгч хэрэгтэй бол энэ загвар хамгийн ойр таарч байна.";
  } else if (
    normalized.includes("зураг") ||
    normalized.includes("зураглал") ||
    normalized.includes("mapping")
  ) {
    matches = products.filter((product) => product.tags.includes("mapping") || product.tags.includes("inspection"));
    reply = "Зураглал болон inspection ажилд RTK эсвэл industrial ангилал илүү тохиромжтой.";
  } else if (normalized.includes("үнэ") || normalized.includes("price")) {
    matches = products.filter((product) =>
      normalized.split(" ").some((chunk) => chunk.length > 3 && product.name.toLowerCase().includes(chunk)),
    );
    reply = matches.length
      ? "Олдсон загваруудын үнийг доор харууллаа."
      : "Ямар загварын үнэ сонирхож байгаагаа нэртэй нь бичээрэй.";
  } else if (normalized.includes("лизинг")) {
    matches = products.filter((product) => product.isLeasable).slice(0, 2);
    reply = "Лизинг боломжтой загваруудаас эхлээд эдгээрийг үзээрэй.";
  } else if (normalized.includes("анхан")) {
    matches = products.filter((product) => product.slug === "dji-mini-4-pro");
    reply = "Анхан шатанд хөнгөн, удирдахад амар загвар тохиромжтой.";
  }

  return {
    sessionId: "local-session",
    reply,
    cards: matches.slice(0, 2).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      heroNote: product.heroNote,
    })),
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
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);

    startTransition(async () => {
      const endpoint = process.env.NEXT_PUBLIC_CHATBOT_URL ?? "http://localhost:8787/chat";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "widget-session",
            message: input,
            sourcePage: window.location.pathname,
          }),
        });

        if (!response.ok) {
          throw new Error("service unavailable");
        }

        const payload = (await response.json()) as ChatResponse;

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: payload.reply,
            cards: payload.cards,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch {
        const fallback = buildLocalReply(input);

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: fallback.reply,
            cards: fallback.cards,
            createdAt: new Date().toISOString(),
          },
        ]);
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
                className={message.role === "user" ? "chat-bubble chat-bubble-user" : "chat-bubble chat-bubble-assistant"}
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
              <button className="dd-button" disabled={isPending} onClick={() => void handleSend()} type="button">
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
