/**
 * Time-Off Copilot motion, in milliseconds.
 *
 * These are the beats of section 02 ("Type what you have", in
 * type-what-you-have.tsx), which is the reference pacing for every
 * product visual. Think of them like spacing tokens, but for time:
 * pick a named beat instead of typing a new number.
 *
 * The matching CSS durations are the --toc-dur-* variables defined next
 * to the product tokens in type-what-you-have.css. Keep both in sync.
 */

/** Gap between one thing appearing and the next: thinking lines, chips, rows. */
export const TOC_STEP_MS = 720;
/** Typing speed, one letter. */
export const TOC_CHAR_MS = 48;
/** Quiet moment after the last event, before a button is pressed. */
export const TOC_BEAT_MS = 320;
/** How long a pressed button stays down before the story moves on. */
export const TOC_PRESS_HOLD_MS = 420;
/** A short rest after something settles, before the next phase arrives. */
export const TOC_REST_MS = 480;
/** How long a finished state is held before a loop starts over. */
export const TOC_HOLD_MS = 2000;
/** A card entering or travelling. Matches --toc-dur-move. */
export const TOC_MOVE_MS = 800;
/** A tint flash on a chip or line: it comes in and goes out over two fades. */
export const TOC_FLASH_MS = 1120;

/** Time to read a question or a change before the story answers: two steps. */
export const TOC_PAUSE_MS = TOC_STEP_MS * 2;
/** A step plus a rest. The usual gap before a new phase starts. */
export const TOC_PHASE_GAP_MS = TOC_STEP_MS + TOC_REST_MS;
