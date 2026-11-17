import "./context-thought.css";

/**
 * The traveler is thinking.
 *
 * The picture is only her. The cloud sits above her head, and two
 * small circles lead the eye down to her, the way a thought bubble
 * does in a comic. The words are the question she is turning over.
 */
export function ContextThought() {
  return (
    <div className="context-thought">
      <p className="context-thought-bubble">
        How can I exploit free time outside my travel plans when exploring a
        new city?
      </p>
      <img
        src="/work/google-maps/context.png"
        alt="A traveler thinking, chin on her hand"
        width={330}
        height={330}
        draggable={false}
      />
    </div>
  );
}
