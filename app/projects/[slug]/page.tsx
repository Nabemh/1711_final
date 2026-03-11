import Link from "next/link"
import { loadProjectBySlug, getProjectSlugs } from "@/lib/projects"
import { notFound } from "next/navigation"
import ProjectDetailClient from "./project-detail-client"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await loadProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
