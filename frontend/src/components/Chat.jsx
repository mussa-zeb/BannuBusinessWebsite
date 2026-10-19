import { useEffect, useRef, useState } from "react";

/* ---------- Settings ---------- */
const CHAT_ENDPOINT = "/api/chat";
const BOT_NAME = "Bazaar Assistant";
const WELCOME =
  "Assalam o Alaikum! Main aapki shopping mein madad kar sakta hoon: products, order, delivery ya return ke baare mein poochein.";
const SUGGESTIONS = [
  "Order kaise karun?",
  "Delivery kitne din mein hoti hai?",
  "Return policy kya hai?",
  "Main seller kaise ban sakta hoon?",
];
const toApiRole = (role) => (role === "assistant" ? "assistant" : "user");

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ---------- Icons ---------- */
const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);
const ICON = {
  chat: "M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.6A8 8 0 1 1 21 12Z",
  close: "M6 6l12 12M18 6 6 18",
  send: "M5 12h14M13 6l6 6-6 6",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
};

/* ---------- Pieces ---------- */
function Avatar() {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-xs font-bold text-white">
      B
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-4 py-3">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 motion-reduce:animate-none"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function Message({ m }) {
  const mine = m.role === "user";
  return (
    <div className={`flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
      {!mine && <Avatar />}
      <div
        className={`flex max-w-[80%] flex-col ${
          mine ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`whitespace-pre-wrap break-words px-4 py-2.5 text-sm leading-relaxed ${
            mine
              ? "rounded-2xl rounded-br-md bg-black text-white"
              : "rounded-2xl rounded-bl-md border border-neutral-200 bg-white text-neutral-900"
          }`}
        >
          {m.content}
        </div>
        <span className="mt-1 px-1 text-[11px] text-neutral-400">
          {m.time}
        </span>
      </div>
    </div>
  );
}

/* ---------- Main widget ---------- */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content: WELCOME,
      time: timeNow(),
      welcome: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const messageIdRef = useRef(0);

  function createMessageId() {
    messageIdRef.current += 1;
    return messageIdRef.current;
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function ask(history) {
    setLoading(true);
    setFailed(false);
    setErrorMsg("");
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.welcome)
            .map((m) => ({ role: toApiRole(m.role), content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || data.error || `Chat service error (${res.status})`
        );
      }

      const replyText = data.reply || data.message;
      if (!replyText) throw new Error("AI ne khali jawab diya.");

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content: replyText,
          time: timeNow(),
        },
      ]);
    } catch (err) {
      setFailed(true);
      setErrorMsg(err.message || "Jawab nahi aa saka.");
    } finally {
      setLoading(false);
    }
  }

  function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [
      ...messages,
      { id: createMessageId(), role: "user", content, time: timeNow() },
    ];
    setMessages(next);
    setInput("");
    ask(next);
  }

  function clearChat() {
    setMessages([
      {
        id: createMessageId(),
        role: "assistant",
        content: WELCOME,
        time: timeNow(),
        welcome: true,
      },
    ]);
    setFailed(false);
    setErrorMsg("");
  }

  const onlyWelcome = messages.length === 1;

  return (
    <>
      <section
        role="dialog"
        aria-label={BOT_NAME}
        aria-hidden={!open}
        className={`fixed z-50 flex flex-col overflow-hidden border-neutral-200 bg-neutral-50 shadow-2xl transition duration-200 motion-reduce:transition-none
          inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[380px] sm:rounded-2xl sm:border
          ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
      >
        <header className="flex items-center gap-3 bg-black px-4 py-3 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-extrabold text-black">
            B
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold leading-tight">{BOT_NAME}</h2>
            <p className="flex items-center gap-1.5 text-xs text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Online
            </p>
          </div>
          <button
            onClick={clearChat}
            aria-label="Chat saaf karein"
            className="rounded-md p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            <Icon d={ICON.trash} />
          </button>
          <button
            onClick={() => setOpen(false)}
            aria-label="Chat band karein"
            className="rounded-md p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white sm:hidden"
          >
            <Icon d={ICON.close} />
          </button>
        </header>

        <div
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
          aria-live="polite"
        >
          {messages.map((m) => (
            <Message key={m.id} m={m} />
          ))}

          {onlyWelcome && (
            <div className="flex flex-wrap gap-2 pl-10">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-black hover:bg-black hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && <Typing />}

          {failed && (
            <div className="mx-auto max-w-[90%] rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
              <p className="font-semibold">Jawab nahi aa saka.</p>
              <p className="mt-1 text-xs">{errorMsg}</p>
              <button
                onClick={() => ask(messages)}
                className="mt-2 w-full rounded-lg bg-black py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Dobara koshish karein
              </button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-neutral-200 bg-white p-3"
        >
          <div className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Apna sawal likhein…"
              aria-label="Message"
              className="max-h-28 flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Message bhejein"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              <Icon d={ICON.send} />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            AI ghalti kar sakta hai. Zaroori maloomat dobara check karein.
          </p>
        </form>
      </section>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Chat band karein" : "Chat kholein"}
        aria-expanded={open}
        className={`fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-black text-white shadow-xl transition hover:scale-105 hover:bg-neutral-800 motion-reduce:transition-none ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        <Icon d={open ? ICON.close : ICON.chat} className="h-6 w-6" />
      </button>
    </>
  );
}