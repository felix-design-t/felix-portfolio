import { AnnotatedImage, type AnnotatedNote } from "./annotated-image";
import "./image-pair.css";

type ImagePairItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  notes?: AnnotatedNote[];
  /** Bullet list in the hover card. A sentence when this is false. */
  asList?: boolean;
};

/**
 * Two pictures in one row, inside the section's single frame.
 *
 * A picture can carry numbered pins. On a phone the pictures stack.
 */
export function ImagePair({ images }: { images: ImagePairItem[] }) {
  return (
    <div className="image-pair">
      {images.map((image) =>
        image.notes ? (
          <AnnotatedImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            notes={image.notes}
            asList={image.asList}
          />
        ) : (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            draggable={false}
          />
        ),
      )}
    </div>
  );
}
