"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { FexiMorph } from "@/components/fexi-morph";
import {
  fexiChips,
  replyForText,
  replyFromServer,
  type FexiChip,
  type ReplyPiece,
} from "@/components/fexi-chat/fexi-replies";
import "./fexi-chat.css";

/**
 * Open and close, shared by the nav and the name in the bio.
 * The thread itself lives next to this, so typing does not redraw the page.
 */
type FexiChatContextValue = {
  isOpen: boolean;
  toggleChat: () => void;
};

const FexiChatContext = createContext<FexiChatContextValue | null>(null);

function useFexiChat() {
  const value = useContext(FexiChatContext);
  if (!value) {
    throw new Error("Fexi chat controls must render inside FexiChatRoot.");
  }
  return value;
}

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  pieces: ReplyPiece[];
};

/**
 * The frame around every page.
 * Closing the panel hides it. The thread stays, until Refresh clears it.
 * The button that opened the panel gets focus back on close.
 */
export function FexiChatRoot({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const openerRef = useRef<HTMLElement | null>(null);
  const nextId = useRef(1);

  const toggleChat = useCallback(() => {
    setIsOpen((open) => {
      if (open) {
        const opener = openerRef.current;
        requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
        return false;
      }
      openerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      return true;
    });
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    const opener = openerRef.current;
    requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
  }, []);

  const value = useMemo(
    () => ({ isOpen, toggleChat }),
    [isOpen, toggleChat],
  );

  function ask(question: string, fallback: ReplyPiece[]) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const questionId = nextId.current++;
    const answerId = nextId.current++;
    setMessages((current) => [
      ...current,
      {
        id: questionId,
        role: "user",
        pieces: [{ kind: "text", value: trimmed }],
      },
    ]);
    // The page path stays a link when the model writes it as plain text.
    void replyFromServer(trimmed, fallback).then((pieces) => {
      setMessages((current) => [
        ...current,
        { id: answerId, role: "assistant", pieces },
      ]);
    });
  }

  function sendQuestion(question: string) {
    ask(question, replyForText(question));
  }

  function sendDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion(draft);
    setDraft("");
  }

  function sendChip(chip: FexiChip) {
    ask(chip.label, chip.pieces);
  }

  function refreshThread() {
    setMessages([]);
    setDraft("");
  }

  return (
    <FexiChatContext.Provider value={value}>
      {children}
      {isOpen ? (
        <FexiChatPanel
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={sendDraft}
          onChip={sendChip}
          onRefresh={refreshThread}
          onClose={closeChat}
        />
      ) : null}
    </FexiChatContext.Provider>
  );
}

/**
 * The name in the bio: the same mark and mono word as before.
 * The click opens the panel. A second click closes it.
 */
export function FexiNameButton() {
  const { isOpen, toggleChat } = useFexiChat();

  return (
    <button
      type="button"
      className="fexi-link"
      aria-expanded={isOpen}
      aria-controls="fexi-panel"
      onClick={toggleChat}
    >
      <FexiMorph speed="idle" />
      <span className="fexi-word">Fexi</span>
    </button>
  );
}

/** Ask Fexi in the nav uses the same open and close as the name in the bio. */
export function useAskFexi() {
  return useFexiChat();
}

type FexiChatPanelProps = {
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChip: (chip: FexiChip) => void;
  onRefresh: () => void;
  onClose: () => void;
};

function FexiChatPanel({
  messages,
  draft,
  onDraftChange,
  onSubmit,
  onChip,
  onRefresh,
  onClose,
}: FexiChatPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Opening chat on a phone should not immediately summon the keyboard.
    if (window.matchMedia("(min-width: 1280px) and (pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    } else {
      panelRef.current?.focus({ preventScroll: true });
    }
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const viewport = window.visualViewport;
    let frame = 0;

    // Safari resizes/pans the visual viewport, not the layout viewport,
    // when its keyboard opens. Update the panel without React rerenders.
    function updateViewport() {
      if (!panel) return;
      panel.style.setProperty("--fexi-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
      panel.style.setProperty("--fexi-viewport-top", `${viewport?.offsetTop ?? 0}px`);
      const thread = threadRef.current;
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateViewport);
    }

    updateViewport();
    viewport?.addEventListener("resize", scheduleUpdate);
    viewport?.addEventListener("scroll", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", scheduleUpdate);
      viewport?.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    const narrowScreen = window.matchMedia("(max-width: 1279px)");
    let unlock: (() => void) | undefined;
    function syncScrollLock() {
      if (!narrowScreen.matches) {
        unlock?.();
        unlock = undefined;
        return;
      }
      if (unlock) return;
      const body = document.body;
      const scrollY = window.scrollY;
      const previous = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
      };
      Object.assign(body.style, {
        position: "fixed",
        top: `-${scrollY}px`,
        width: "100%",
        overflow: "hidden",
      });
      unlock = () => {
        Object.assign(body.style, previous);
        window.scrollTo({ top: scrollY, behavior: "instant" });
      };
    }
    syncScrollLock();
    narrowScreen.addEventListener("change", syncScrollLock);
    return () => {
      narrowScreen.removeEventListener("change", syncScrollLock);
      unlock?.();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useLayoutEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  const canSend = draft.trim() !== "";

  return (
    <aside
      ref={panelRef}
      id="fexi-panel"
      className="fexi-panel"
      tabIndex={-1}
      data-has-messages={messages.length > 0}
      role="dialog"
      aria-modal="false"
      aria-labelledby="fexi-panel-title"
    >
      <div className="fexi-panel-bar">
        <h2 id="fexi-panel-title" className="fexi-panel-title">
          Fexi
          <span className="fexi-beta">Beta</span>
        </h2>
        <div className="fexi-panel-actions">
          <button
            type="button"
            className="fexi-icon-button"
            aria-label="Refresh conversation"
            onClick={() => {
              onRefresh();
              if (window.matchMedia("(pointer: fine)").matches) {
                inputRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            className="fexi-icon-button"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="fexi-thread" ref={threadRef} aria-live="polite">
        {messages.map((message) => (
          <p
            key={message.id}
            className={
              message.role === "user"
                ? "fexi-message fexi-message-user"
                : "fexi-message fexi-message-assistant"
            }
          >
            <span className="fexi-sr">
              {message.role === "user" ? "You" : "Fexi"}:{" "}
            </span>
            {message.pieces.map((piece, index) =>
              piece.kind === "link" ? (
                <Link
                  key={`${message.id}-${index}`}
                  href={piece.href}
                  className="text-link fexi-reply-link"
                >
                  {piece.label}
                </Link>
              ) : (
                <span key={`${message.id}-${index}`}>{piece.value}</span>
              ),
            )}
          </p>
        ))}
      </div>

      <div className="fexi-dock">
        <div className="fexi-chips" role="group" aria-label="Suggested questions">
          {fexiChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="fexi-chip"
              onClick={() => onChip(chip)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form className="fexi-composer" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="fexi-input"
            value={draft}
            placeholder="Ask anything"
            aria-label="Ask anything"
            autoComplete="off"
            enterKeyHint="send"
            onChange={(event) => onDraftChange(event.target.value)}
          />
          <button
            type="submit"
            className="fexi-send"
            aria-label="Send"
            disabled={!canSend}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </aside>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="fexi-svg">
      <path d="M13.1 8a5.1 5.1 0 1 1-1.4-3.5" />
      <path d="M13.2 2.7v3.1H10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="fexi-svg">
      <path d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="fexi-svg">
      <path d="M8 12.3V3.8" />
      <path d="M4.7 7.1 8 3.8l3.3 3.3" />
    </svg>
  );
}
