/**
 * Local answers for Fexi.
 *
 * These are the replies used when Gemini is unavailable.
 * A question either names one case study, or it lists the three pages
 * a visitor can open. No counts, rates, or results are added here.
 */

export type ReplyPiece =
  | { kind: "text"; value: string }
  | { kind: "link"; href: string; label: string };

export type FexiChipId = "time-off" | "expense" | "walk";

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
    id: "time-off",
    label: "What is Time-Off Copilot?",
    pieces: pageReply(
      "Time-Off Copilot is a case study on this site.",
      "/work/time-off-copilot",
    ),
  },
  {
    id: "expense",
    label: "How did expense approvals change?",
    pieces: pageReply(
      "Expense Management is the case study on expense approvals.",
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
];

const fallbackPieces: ReplyPiece[] = [
  {
    kind: "text",
    value:
      "I can point to the case studies on this site. Time-Off Copilot is at ",
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
  { kind: "text", value: "." },
];

/** Lowercase, and treat punctuation as a space, so “Time-Off” matches “time off”. */
function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesStudy(id: FexiChipId, normalized: string) {
  if (id === "time-off") {
    return normalized.includes("time off") || normalized.includes("copilot");
  }
  if (id === "expense") {
    return normalized.includes("expense") || normalized.includes("approval");
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
 * A typed question uses the same reply as a chip when it clearly names
 * one study. Two studies in one question, or none, get the list of pages.
 */
export function replyForText(question: string): ReplyPiece[] {
  const normalized = normalize(question);
  const exact = fexiChips.find((chip) => normalize(chip.label) === normalized);
  if (exact) return exact.pieces;

  const matched = fexiChips.filter((chip) => matchesStudy(chip.id, normalized));
  if (matched.length === 1) return matched[0].pieces;
  return fallbackPieces;
}
