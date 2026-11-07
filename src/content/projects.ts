import fs from "node:fs";
import path from "node:path";

/**
 * Reads every project file once, when the app starts.
 *
 * Each MDX file is like a component instance with a property panel.
 * The panel (the block between --- lines) holds the title, outcome,
 * and whether the project is Selected. The canvas underneath is still
 * empty, so Phase 1 does not render a case-study body.
 *
 * The read is synchronous and happens at module scope on purpose.
 * These files do not change per visitor, so Next can bake them into
 * the static page instead of fetching them on every request.
 */

export type ProjectStatus = "shipped" | "in-progress";

export type Project = {
  slug: string;
  title: string;
  year: number | null;
  outcome: string;
  /** Short phrase after the slash in a Selected Work caption. */
  meta: string | null;
  selected: boolean;
  status: ProjectStatus;
  media: string | null;
};

/**
 * Home grid order. File names on disk are alphabetical, which is not
 * the order a hiring manager should scan. Selected work is locked as
 * these four; anything else falls through to the archive.
 */
const selectedSlugsInOrder = [
  "time-off-copilot",
  "expense-management",
  "employee-engagement",
  "city-on-your-foot",
];

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export function getSelectedProjects(): Project[] {
  return loadProjects().filter((project) => project.selected);
}

export function getAllProjects(): Project[] {
  return loadProjects();
}

function loadProjects(): Project[] {
  return sortProjects(readProjectFiles(projectsDirectory));
}

function readProjectFiles(directory: string): Project[] {
  const fileNames = fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".mdx"));

  return fileNames.map((fileName) => {
    const source = fs.readFileSync(path.join(directory, fileName), "utf8");
    return parseProjectFile(source, fileName);
  });
}

function parseProjectFile(source: string, fileName: string): Project {
  const fields = parseFrontmatter(source, fileName);
  const status = fields.status;

  if (status !== "shipped" && status !== "in-progress") {
    throw new Error(`Unknown status "${status}" in ${fileName}.`);
  }

  const year = parseYear(fields.year, fileName);

  return {
    slug: requireField(fields, "slug", fileName),
    title: requireField(fields, "title", fileName),
    year,
    outcome: requireField(fields, "outcome", fileName),
    meta: fields.meta ? fields.meta : null,
    selected: fields.selected === "true",
    status,
    media: fields.media === "null" || fields.media === "" ? null : fields.media,
  };
}

/**
 * Frontmatter is the small YAML-like header at the top of an MDX file.
 * We only need those key/value lines, so a full markdown parser can wait
 * until case-study pages actually have body copy.
 */
function parseFrontmatter(
  source: string,
  fileName: string,
): Record<string, string> {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${fileName}.`);
  }

  const fields: Record<string, string> = {};

  for (const line of match[1].split("\n")) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const separatorIndex = trimmedLine.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();
    fields[key] = value;
  }

  return fields;
}

function requireField(
  fields: Record<string, string>,
  key: string,
  fileName: string,
): string {
  const value = fields[key];
  if (!value) {
    throw new Error(`Missing "${key}" in ${fileName}.`);
  }
  return value;
}

function parseYear(value: string | undefined, fileName: string): number | null {
  if (!value || value === "null") return null;

  const year = Number(value);
  if (!Number.isInteger(year)) {
    throw new Error(`Year "${value}" in ${fileName} is not a whole number.`);
  }
  return year;
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((first, second) => {
    const firstRank = rankProject(first.slug);
    const secondRank = rankProject(second.slug);

    if (firstRank !== secondRank) return firstRank - secondRank;
    return first.title.localeCompare(second.title);
  });
}

function rankProject(slug: string): number {
  const selectedIndex = selectedSlugsInOrder.indexOf(slug);
  // Archive items sort after every selected project, then by title.
  return selectedIndex === -1 ? selectedSlugsInOrder.length : selectedIndex;
}
