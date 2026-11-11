import "./same-sheet-again.css";

/**
 * One row on a setup sheet.
 * `marked` draws the 1px accent under a label that is still empty.
 */
type SheetRow = {
  label: string;
  value: string;
  marked?: boolean;
};

/** Front sheet. Department is filled. Limit and Exceptions are still empty. */
const ptoRows: SheetRow[] = [
  { label: "Department", value: "Product" },
  { label: "Type", value: "Paid Time-Off" },
  { label: "Total", value: "10 days" },
  { label: "Limit", value: "", marked: true },
  { label: "Accrual", value: "2 days / month" },
  { label: "Exceptions", value: "", marked: true },
];

/** Same department as PTO. The title is what makes it a duplicate. */
const sickRows: SheetRow[] = ptoRows;

/** First line is a different total. The rest of the sheet still follows. */
const juryRows: SheetRow[] = [
  { label: "Total", value: "1 day" },
  ...ptoRows.slice(1),
];

type SheetLayer = {
  /** Which card. CSS uses this to offset the pile. */
  id: "pto" | "sick" | "jury";
  /** Name in the band the card in front does not cover. */
  typeName: string;
  /** Note outside the card. Same rose on every sheet. */
  note: string;
  rows: SheetRow[];
};

/**
 * PTO is first in the reading order. z-index puts it in front.
 * Paid Time-Off and Jury Duty sit behind it, each shifted up and to the right.
 */
const layers: SheetLayer[] = [
  { id: "pto", typeName: "PTO", note: "Missing Fields", rows: ptoRows },
  {
    id: "sick",
    typeName: "Paid Time-Off",
    note: "Duplicate",
    rows: sickRows,
  },
  {
    id: "jury",
    typeName: "Jury Duty",
    note: "Compliance Error",
    rows: juryRows,
  },
];

/**
 * The same sheet, again.
 *
 * Like a short stack of the same component, nudged up and to the right.
 * Each copy is a filled card. The front one is readable. The others
 * only leave their type name showing.
 */
export function SameSheetAgain() {
  return (
    <div className="same-sheet">
      <p className="same-sheet-note">
        Three copies of the same setup sheet. PTO is in front, Department
        is Product, marked Missing Fields. Behind it, a card titled Paid
        Time-Off also has Department Product, marked Duplicate. Jury Duty
        starts with Total 1 day, marked Compliance Error. Total on the
        front card is 10 days. Accrual is 2 days per month, and the two
        do not match. Limit and Exceptions are marked.
      </p>
      <div className="same-sheet-stage">
        {layers.map((layer) => (
          <Sheet key={layer.id} layer={layer} />
        ))}
      </div>
    </div>
  );
}

function Sheet({ layer }: { layer: SheetLayer }) {
  const isFront = layer.id === "pto";

  return (
    <article
      className="same-sheet-card"
      data-sheet={layer.id}
      aria-hidden={isFront ? undefined : true}
    >
      <p className="same-sheet-type">{layer.typeName}</p>
      <p className="same-sheet-callout" data-callout={layer.id}>
        <span className="same-sheet-callout-stem" aria-hidden="true" />
        {layer.note}
      </p>
      <ul className="same-sheet-rows">
        {layer.rows.map((row, index) => (
          <li className="same-sheet-row" key={`${row.label}-${index}`}>
            <span
              className={
                row.marked
                  ? "same-sheet-label same-sheet-mark"
                  : "same-sheet-label"
              }
            >
              {row.label}
            </span>
            <span className="same-sheet-value">{row.value}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
