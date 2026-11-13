/**
 * A shared sign-in sheet for people currently on the site.
 *
 * Each browser checks in with the same id. The sheet forgets anyone
 * who has not checked in lately, the way a lobby drops a name when
 * the person leaves.
 *
 * The number on the page is not the raw headcount. It starts at 1,
 * then adds 2 for every person here. Three people read as 7 (1+3+3).
 */

const presentForMs = 45_000;
const maxPeople = 500;

type PresenceBook = {
  lastSeenAt: Map<string, number>;
};

const globalStore = globalThis as typeof globalThis & {
  presenceBook?: PresenceBook;
};

function getBook(): PresenceBook {
  if (!globalStore.presenceBook) {
    globalStore.presenceBook = { lastSeenAt: new Map() };
  }
  return globalStore.presenceBook;
}

function dropStaleNames(now: number) {
  const book = getBook();
  for (const [viewerId, seenAt] of book.lastSeenAt) {
    if (now - seenAt > presentForMs) book.lastSeenAt.delete(viewerId);
  }
}

export function noteViewer(viewerId: string, now = Date.now()): number {
  const book = getBook();
  dropStaleNames(now);

  if (!book.lastSeenAt.has(viewerId) && book.lastSeenAt.size >= maxPeople) {
    const oldestId = book.lastSeenAt.keys().next().value;
    if (oldestId) book.lastSeenAt.delete(oldestId);
  }

  book.lastSeenAt.set(viewerId, now);
  return book.lastSeenAt.size;
}

export function forgetViewer(viewerId: string, now = Date.now()): number {
  const book = getBook();
  book.lastSeenAt.delete(viewerId);
  dropStaleNames(now);
  return book.lastSeenAt.size;
}

/** 1, plus 2 for every person currently here. */
export function onlineCountFor(peopleHere: number): number {
  return 1 + peopleHere * 2;
}
