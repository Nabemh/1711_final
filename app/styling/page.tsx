"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { isVideoFile } from "@/lib/cloudflare"
import Sidebar from "@/components/Sidebar"

type SortBy = "name" | "date"

export default function StylingPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()

        // FILTER ONLY STYLING
        const styling = data.filter(
          (p: Project) => p.section === "styling"
        )

        setProjects(styling)

        if (styling.length > 0) {
          setHoveredProject(styling[0])
        }
      } catch (err) {
        console.error("Failed to load projects:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const getSortedProjects = () => {
    const sorted = [...projects]

    if (sortBy === "name") {
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    }

    return sorted.sort((a, b) =>
      (b.date || "").localeCompare(a.date || "")
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
    )
  }

  const sortedProjects = getSortedProjects()
  const currentProject = hoveredProject || sortedProjects[0]

  return (
    <main className="h-screen bg-white text-black overflow-hidden">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-[80px] flex items-center px-10 bg-white z-50">
        <Image
          src="/logo-f2-copy.jpeg"
          alt="Logo"
          width={120}
          height={40}
          priority
        />
      </header>

      {/* SIDEBAR */}
      <Sidebar
        projects={sortedProjects}
        hoveredProject={hoveredProject}
        setHoveredProject={setHoveredProject}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currentPage="styling"
        onCollapseChange={(collapsed) => setIsSidebarOpen(!collapsed)}
      />

      {/* RIGHT VIEWER */}
      <div className={`transition-all duration-300 h-[calc(100vh-80px)] relative mt-[80px] ${
        isSidebarOpen ? "ml-[25%] w-[75%]" : "ml-[60px] w-[calc(100%-60px)]"
      }`}>

        {/* Project Title and Date - Top Right */}
        {currentProject && (
          <div className="absolute top-0 right-0 z-10 p-6 text-right">
            <h2 className="text-sm font-semibold mb-1">
              {currentProject.title}
            </h2>
            <p className="text-xs text-gray-600">
              {currentProject.date}
            </p>
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center">

          {isVideoFile(currentProject.image) || currentProject.video ? (
            <video
              src={currentProject.image}
              className="max-w-[85%] max-h-[85%] object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              width={1600}
              height={1000}
              className="w-full h-full object-contain"
              priority
              unoptimized={true}
            />
          )}

        </div>
      </div>
    </main>
  )
}
