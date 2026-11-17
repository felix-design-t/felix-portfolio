import "./research-pains.css";

/**
 * Three pains from the interviews.
 *
 * Each picture sits above its line. The line is the site's caption
 * size, in the sans face, at the regular weight. That is smaller
 * and thinner than the bold labels in the source board.
 */
const pains = [
  {
    src: "/work/google-maps/research-1.png",
    alt: "A compass",
    label: "Clutter Information in Navigation Apps",
  },
  {
    src: "/work/google-maps/research-2.png",
    alt: "A city skyline",
    label: "Hard to find reachable spots within limited time",
  },
  {
    src: "/work/google-maps/research-3.png",
    alt: "A person walking",
    label: "Hard to find unique and live attraction spots",
  },
];

export function ResearchPains() {
  return (
    <ul className="research-pains">
      {pains.map((pain) => (
        <li key={pain.src}>
          <img src={pain.src} alt={pain.alt} width={99} height={99} draggable={false} />
          <p>{pain.label}</p>
        </li>
      ))}
    </ul>
  );
}
