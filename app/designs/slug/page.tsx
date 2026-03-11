import { loadProjectBySlug } from "@/lib/projects"
import { notFound } from "next/navigation"
import ProjectDetail from "@/components/ProjectDetail"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: PageProps) {

  const project = await loadProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}