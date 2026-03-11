"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { isVideoFile } from "@/lib/cloudflare"

function isDarkBg(bgColor: string): boolean {
  const hex = bgColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

interface ProjectDetailClientProps {
  project: Project
  section?: "exhibitions" | "designs" | "styling"
}

export default function ProjectDetailClient({ project: initialProject, section }: ProjectDetailClientProps) {
  const [project] = useState(initialProject)
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function loadProjects() {
      try {
        let projectsData = await fetch("/api/projects").then(res => res.json())
        
        // Filter by section if provided
        if (section) {
          projectsData = projectsData.filter((p: Project) => p.section === section)
        }
        
        setAllProjects(projectsData)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [section])

  const handleScroll = (e: React.WheelEvent) => {
    if (!project?.resources || project.resources.length <= 1) return
    
    const direction = e.deltaY > 0 ? 1 : -1
    const newIndex = currentImageIndex + direction
    
    if (newIndex >= 0 && newIndex < project.resources.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  const navigateToProject = (direction: 'prev' | 'next') => {
    const currentIndex = allProjects.findIndex(p => p.slug === project?.slug)
    if (currentIndex === -1) return
    
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex >= 0 && targetIndex < allProjects.length) {
      const targetProject = allProjects[targetIndex]
      const basePath = section ? `/projects/${section}` : `/projects` 
      router.push(`${basePath}/${targetProject.slug}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
    )
  }

  if (project?.resources && project.resources.length > 0) {
  const bgColor = project.backgroundColor || "#ffffff"
  const isDark = isDarkBg(bgColor)

    return (
      <main className="min-h-screen flex" style={{ backgroundColor: bgColor }}>
        
        {/* LEFT — SIDEBAR (25% width) */}
        <div className="w-1/4 fixed left-0 top-0 h-screen bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto px-10 py-12 sidebar-type">

            {/* Close */}
            <nav className="mb-6">
              <button
                onClick={() => router.back()}
                className="block text-[10px] tracking-[0.14em] uppercase font-medium text-gray-500 hover:text-black transition-colors"
              >
                Close
              </button>
            </nav>

            {/* Project Title + Date (relationship typography) */}
            <div className="mb-6 group cursor-default">
              <h3 className="text-[10px] tracking-[0.05em] uppercase leading-tight text-black font-semibold">
                {project.title}
              </h3>
              <h3 className="text-[10px] tracking-[0.05em] uppercase leading-tight font-semibold text-black">
                {project.date || "July 2023"}
              </h3>
            </div>

            {/* Description */}
            {project.description && (
              <div className="text-[11px] leading-relaxed text-black space-y-3 uppercase">
                {project.description.split(". ").map((sentence, i) => (
                  <p key={i}>
                    {sentence}
                    {i < project.description.split(". ").length - 1 && "."}
                  </p>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT — 75% SCROLLING PROJECT IMAGES */}
        <div className="w-3/4 ml-[25%] pt-18 pb-22 overflow-y-auto">
          <div className="space-y-8">

            {project.resources?.map((res, index) => (
              <div
                key={index}
                className="w-full h-[140vh] relative flex items-center justify-center"
              >
                {res.type === "video" ? (
                  <video
                    src={res.src}
                    className="max-w-[85%] max-h-[85%] object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={res.src}
                    alt={`${project.title} ${index + 1}`}
                    priority={index === 0}
                    width={1600}
                    height={1000}
                    className="max-w-[85%] max-h-[95%] object-contain"
                    unoptimized={true}
                  />
                )}
              </div>
            ))}

          </div>
        </div>
      </main>
    )
  }

  // Fallback for projects without resources
  return (
    <main className="min-h-screen flex" style={{ backgroundColor: project.backgroundColor || "#ffffff" }}>
      <div className="w-1/4 fixed left-0 top-0 h-screen bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto px-10 py-12">
          <nav className="mb-6">
            <Link
              href="/projects"
              className="block text-[10px] tracking-[0.14em] uppercase font-medium text-gray-500 hover:text-black transition-colors"
            >
              Close
            </Link>
          </nav>
          <div className="mb-6">
            <h3 className="text-[10px] tracking-[0.05em] uppercase leading-tight text-black font-semibold">
              {project.title}
            </h3>
            <h3 className="text-[10px] tracking-[0.05em] uppercase leading-tight font-semibold text-black">
              {project.date || "July 2023"}
            </h3>
          </div>
        </div>
      </div>
      <div className="w-3/4 ml-[25%] pt-24 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No resources available for this project</p>
        </div>
      </div>
    </main>
  )
}
