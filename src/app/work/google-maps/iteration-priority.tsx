import "./ideation-filter.css";
import "./iteration-priority.css";

/**
 * Where Walk Explore sits, depending on the city.
 *
 * Both lines are caption size. The pictures are the two screens.
 */
const scenes = [
  {
    src: "/work/google-maps/iteration-1.1.png",
    alt: "Walk Explore as the first chip when someone arrives in a new city",
    place: "User arrives new city",
    note: "Walk explore pops up",
  },
  {
    src: "/work/google-maps/iteration-1.2.png",
    alt: "Walk Explore set further along the chip row in the user's own city",
    place: "User's own city",
    note: "Walk explore will be placed in a low priority",
  },
];

export function IterationPriority() {
  return (
    <div className="iteration-priority">
      {scenes.map((scene) => (
        <figure key={scene.src}>
          <p>{scene.place}</p>
          <img
            src={scene.src}
            alt={scene.alt}
            width={366}
            height={494}
            draggable={false}
          />
          <figcaption>{scene.note}</figcaption>
        </figure>
      ))}
    </div>
  );
}
