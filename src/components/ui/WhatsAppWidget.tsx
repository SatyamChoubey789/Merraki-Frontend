"use client";

import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "919034009530";
const PRIMARY_COLOR = "#253957";

// Below this viewport width, the chat window goes full-screen
const MOBILE_BREAKPOINT = 640;

type Message = {
  from: "bot" | "user";
  text: string;
};

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    reason: "",
  });

  const chatRef = useRef<HTMLDivElement>(null);

  // Track viewport size so we can switch layouts
  useEffect(() => {
    const checkSize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Lock body scroll on mobile while the full-screen chat is open
  useEffect(() => {
    if (isMobile && open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, open]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    if (open && messages.length === 0) {
      bot("Hi 👋 Welcome to Merraki Solutions");
      setTimeout(() => {
        bot("May I know your name?");
        setStep(1);
      }, 600);
    }
  }, [open]);

  const bot = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((p) => [...p, { from: "bot", text }]);
    }, 600);
  };

  const user = (text: string) => {
    setMessages((p) => [...p, { from: "user", text }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    user(input);

    if (step === 1) {
      setForm((p) => ({ ...p, name: input }));
      setInput("");
      bot("Your phone number?");
      setStep(2);
      return;
    }

    if (step === 2) {
      setForm((p) => ({ ...p, phone: input }));
      setInput("");
      bot("Tell us your requirement.");
      setStep(3);
      return;
    }

    if (step === 3) {
      const final = { ...form, reason: input };

      setForm(final);
      setInput("");

      bot("Redirecting to WhatsApp...");

      setTimeout(() => {
        const message = `
*New Merraki Enquiry*

Name: ${final.name}
Phone: ${final.phone}

Requirement:
${final.reason}

Page:
${window.location.href}
`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message,
        )}`;

        window.open(url, "_blank");

        setOpen(false);
        setMessages([]);
        setStep(0);
      }, 900);
    }
  };

  return (
    <>
      {/* keyframes for the typing-indicator dots */}
      <style jsx global>{`
        @keyframes wa-widget-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>

      {/* FLOATING BUTTON — hidden on mobile while the full-screen chat is open */}
      {!(isMobile && open) && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Chat"
          style={{
            position: "fixed",
            bottom: isMobile
              ? "max(16px, env(safe-area-inset-bottom))"
              : 22,
            right: isMobile ? 16 : 22,
            width: isMobile ? 56 : 62,
            height: isMobile ? 56 : 62,
            borderRadius: "50%",
            background: PRIMARY_COLOR,
            border: "2px solid #ffffff",
            cursor: "pointer",
            zIndex: 999999,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M4 4h16v11a3 3 0 0 1-3 3H8l-4 4V4z" />
          </svg>
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          style={
            isMobile
              ? {
                  position: "fixed",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  background: "#f4f6f9",
                  zIndex: 999999,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }
              : {
                  position: "fixed",
                  bottom: 100,
                  right: 22,
                  width: 380,
                  maxWidth: "calc(100vw - 32px)",
                  height: 520,
                  maxHeight: "calc(100vh - 140px)",
                  background: "#f4f6f9",
                  zIndex: 999999,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                }
          }
        >
          {/* HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg, #253957, #1f2d44)",
              color: "#fff",
              padding: isMobile
                ? "max(14px, env(safe-area-inset-top)) 16px 14px"
                : "14px 16px",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div>
              Merraki Support
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                Typically replies in a few minutes
              </div>
            </div>

            {/* CLOSE BUTTON — 32px tap target for mobile usability */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
                lineHeight: 1,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={chatRef}
            style={{
              flex: 1,
              padding: 14,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              background: "radial-gradient(circle at top, #f8fafc, #eef2f7)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 12px",
                    borderRadius: 0,

                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg, #253957, #1f2d44)"
                        : "#ffffff",

                    color: m.from === "user" ? "#fff" : "#111",

                    border: m.from === "user" ? "none" : "1px solid #e5e7eb",

                    boxShadow:
                      m.from === "user"
                        ? "0 8px 18px rgba(37,57,87,0.25)"
                        : "0 2px 10px rgba(0,0,0,0.04)",

                    fontSize: isMobile ? 14 : 13,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", gap: 5, padding: 6 }}>
                <Dot />
                <Dot delay="0.2s" />
                <Dot delay="0.4s" />
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              padding: isMobile
                ? "10px 10px max(10px, env(safe-area-inset-bottom))"
                : 10,
              borderTop: "1px solid #e5e7eb",
              background: "#ffffff",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: 11,
                border: "1px solid #e5e7eb",
                outline: "none",
                borderRadius: 0,
                // 16px on mobile stops iOS Safari from auto-zooming on focus
                fontSize: isMobile ? 16 : 13,
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              style={{
                background: "linear-gradient(135deg, #253957, #1f2d44)",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: 14,
                boxShadow: "0 6px 14px rgba(37,57,87,0.25)",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* typing dots */
function Dot({ delay = "0s" }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#94a3b8",
        display: "inline-block",
        animation: "wa-widget-bounce 1.2s infinite",
        animationDelay: delay,
      }}
    />
  );
}