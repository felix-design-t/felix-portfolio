/**
 * Local answers for Fexi.
 *
 * These replies keep starters and supported topics useful when Gemini is
 * unavailable. Biography summaries share the server's source of truth.
 */
import { fexiProfile } from "@/content/fexi-profile";

export type ReplyPiece =
  | { kind: "text"; value: string }
  | { kind: "link"; href: string; label: string };

export type FexiChipId = "background" | "time-off" | "problem-solving";

export type FexiChip = {
  id: FexiChipId;
  label: string;
  pieces: ReplyPiece[];
};

/** Sentence, then the page path as a link, then a period. */
function pageReply(sentence: string, href: string): ReplyPiece[] {
  return [
    { kind: "text", value: `${sentence} The page is ` },
    { kind: "link", href, label: href },
    { kind: "text", value: "." },
  ];
}

export const fexiChips: readonly FexiChip[] = [
  {
    id: "background",
    label: "What’s Felix’s background?",
    pieces: [{ kind: "text", value: fexiProfile.background }],
  },
  {
    id: "time-off",
    label: "What's Time-Off Copilot?",
    pieces: pageReply(fexiProfile.timeOff, "/work/time-off-copilot"),
  },
  {
    id: "problem-solving",
    label: "How does Felix solve complex problems?",
    pieces: pageReply(fexiProfile.problemSolving, "/work/expense-management"),
  },
];

/** Preserve project answers independently of the three visible starters. */
const studyReplies = [
  {
    id: "time-off",
    label: "What is Time-Off Copilot?",
    pieces: pageReply(
      fexiProfile.timeOff,
      "/work/time-off-copilot",
    ),
  },
  {
    id: "expense",
    label: "How did expense approvals change?",
    pieces: pageReply(
      fexiProfile.expense,
      "/work/expense-management",
    ),
  },
  {
    id: "walk",
    label: "What is Walk Explore?",
    pieces: pageReply(
      "Walk Explore is part of the Google Maps case study.",
      "/work/google-maps",
    ),
  },
  {
    id: "event",
    label: "What is Event Planning?",
    pieces: pageReply(
      "At DIEMlife, Felix helped organizations plan events and track engagement.",
      "/work/event-planning",
    ),
  },
];

const fallbackPieces: ReplyPiece[] = [
  {
    kind: "text",
    value:
      "I can help with Felix's background, AI workflow, design process, collaboration, and portfolio projects. Try one of the suggested questions, or explore the case studies. Time-Off Copilot is at ",
  },
  {
    kind: "link",
    href: "/work/time-off-copilot",
    label: "/work/time-off-copilot",
  },
  { kind: "text", value: ". Expense Management is at " },
  {
    kind: "link",
    href: "/work/expense-management",
    label: "/work/expense-management",
  },
  { kind: "text", value: ". Walk Explore is in the Google Maps study at " },
  { kind: "link", href: "/work/google-maps", label: "/work/google-maps" },
  { kind: "text", value: ". Event Planning is at " },
  { kind: "link", href: "/work/event-planning", label: "/work/event-planning" },
  { kind: "text", value: "." },
];

/** Lowercase, and treat punctuation as a space, so “Time-Off” matches “time off”. */
function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesStudy(id: string, normalized: string) {
  if (id === "time-off") {
    return normalized.includes("time off") || normalized.includes("copilot");
  }
  if (id === "expense") {
    return normalized.includes("expense") || normalized.includes("approval");
  }
  if (id === "event") {
    return normalized.includes("event") || normalized.includes("diemlife");
  }
  return (
    normalized.includes("walk explore") || normalized.includes("google maps")
  );
}

const pagePaths = [
  "/work/time-off-copilot",
  "/work/expense-management",
  "/work/event-planning",
  "/work/google-maps",
] as const;

/** Turn a written page path into a link, and leave the other words as text. */
export function piecesFromReply(reply: string): ReplyPiece[] {
  const pattern = new RegExp(`(${pagePaths.join("|")})`, "g");
  const pieces: ReplyPiece[] = [];
  let cursor = 0;
  for (const match of reply.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      pieces.push({ kind: "text", value: reply.slice(cursor, index) });
    }
    pieces.push({ kind: "link", href: match[1], label: match[1] });
    cursor = index + match[1].length;
  }
  if (cursor < reply.length) {
    pieces.push({ kind: "text", value: reply.slice(cursor) });
  }
  return pieces.length > 0 ? pieces : [{ kind: "text", value: reply }];
}

/**
 * Ask the server. Gemini runs there. Any failure, including a missing
 * key, returns the local pieces the caller already prepared.
 */
export async function replyFromServer(
  question: string,
  fallback: ReplyPiece[],
): Promise<ReplyPiece[]> {
  try {
    const response = await fetch("/api/fexi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) return fallback;
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "reply" in data &&
      typeof (data as { reply: unknown }).reply === "string"
    ) {
      const reply = (data as { reply: string }).reply.trim();
      if (reply) return piecesFromReply(reply);
    }
  } catch {
    return fallback;
  }
  return fallback;
}

/**
 * Resolve exact starters, project names, and biographical topics locally.
 * Unknown questions get an honest menu rather than an invented answer.
 */
export function replyForText(question: string): ReplyPiece[] {
  const normalized = normalize(question);
  const exact = [...fexiChips, ...studyReplies].find(
    (chip) => normalize(chip.label) === normalized,
  );
  if (exact) return exact.pieces;

  const matched = studyReplies.filter((study) => matchesStudy(study.id, normalized));
  if (matched.length === 1) return matched[0].pieces;
  if (matched.length > 1) return fallbackPieces;

  if (/\b(leave|left|leaving|career|opportunit\w*|looking for|next role)\b/.test(normalized)) {
    return [{ kind: "text", value: fexiProfile.career }];
  }
  if (/\b(collaborat\w*|stakeholder\w*|conflict|engineering team|engineers|constraint\w*)\b/.test(normalized)) {
    return [{ kind: "text", value: fexiProfile.collaboration }];
  }
  if (/\b(ai|claude|cursor|tools|prototyp\w*)\b/.test(normalized)) {
    return [{ kind: "text", value: fexiProfile.aiWorkflow }];
  }
  if (/\b(process|approach|solv\w*|complex\w*|design thinking)\b/.test(normalized)) {
    return fexiChips[2].pieces;
  }
  if (/\b(background|experience|about|who|engineering|architecture|manufacturing|paycom)\b/.test(normalized)) {
    return fexiChips[0].pieces;
  }
  return fallbackPieces;
}
