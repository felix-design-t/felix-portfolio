import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects } from "@/content/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getAllProjects().find((item) => item.slug === slug);

  return {
    title: project?.title ?? "Work",
  };
}

/**
 * A placeholder for the case study. The cover on the home grid needs a
 * real destination; the page itself stays a title until the study is written.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getAllProjects().find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <article className="work-page">
      <header className="work-page-header">
        <h1>{project.title}</h1>
        {project.meta ? <p>{project.meta}</p> : null}
      </header>
    </article>
  );
}
