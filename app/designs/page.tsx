"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { isVideoFile } from "@/lib/cloudflare"
import Sidebar from "@/components/Sidebar"

type SortBy = "name" | "date"

export default function DesignsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()

        // FILTER ONLY DESIGNS
        const designs = data.filter(
          (p: Project) => p.section === "designs"
        )

        setProjects(designs)

        if (designs.length > 0) {
          setHoveredProject(designs[0])
          setCurrentProject(designs[0])
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
  const displayProject = hoveredProject || currentProject || sortedProjects[0]

  return (
    <main className="bg-white text-black">

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex md:h-screen md:overflow-hidden">
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
          currentPage="designs"
          onCollapseChange={(collapsed) => setIsSidebarOpen(!collapsed)}
        />

        {/* RIGHT VIEWER */}
        <div className={`transition-all duration-300 h-[calc(100vh-80px)] relative mt-[80px] ${
          isSidebarOpen ? "ml-[25%] w-[75%]" : "ml-[60px] w-[calc(100%-60px)]"
        }`}>

          {/* Project Title and Date - Top Right */}
          {displayProject && (
            <div className="absolute top-0 right-0 z-10 p-6 text-right">
              <h2 className="text-sm font-semibold mb-1">
                {displayProject.title}
              </h2>
              <p className="text-xs text-gray-600">
                {displayProject.date}
              </p>
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center">

            {displayProject && (isVideoFile(displayProject.image) || displayProject.video) ? (
              <video
                src={displayProject.image}
                className="max-w-[85%] max-h-[85%] object-contain"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : displayProject ? (
              <Image
                src={displayProject.image}
                alt={displayProject.title}
                width={1600}
                height={1000}
                className="w-full h-full object-contain"
                priority
                unoptimized={true}
              />
            ) : null}

          </div>

        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden min-h-screen">

        {/* HEADER */}
        <header className="flex items-center py-6 px-6">
          <Image
            src="/logo-f2-copy.jpeg"
            alt="Logo"
            width={110}
            height={40}
            priority
          />
        </header>

        {/* SECTION NAVIGATION */}
        <nav className="px-6 mb-1 pb-6">
          <div className="space-y-2">
            <button
              onClick={() => router.push("/exhibitions")}
              className="block text-[10px] tracking-[0.14em] uppercase font-medium text-black hover:font-semibold transition-colors"
            >
              1711 Exhibitions
            </button>
            <button
              onClick={() => router.push("/designs")}
              className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-black"
            >
              1711 Designs
            </button>
            <button
              onClick={() => router.push("/styling")}
              className="block text-[10px] tracking-[0.14em] uppercase font-medium text-black hover:font-semibold transition-colors"
            >
              1711 Styling
            </button>
            <button
              onClick={() => router.push("/overview")}
              className="block text-[10px] tracking-[0.14em] uppercase font-medium text-black hover:font-semibold transition-colors"
            >
              Overview
            </button>
          </div>
        </nav>

        {/* FEATURED PROJECT */}
        {currentProject && (
          <section className="px-6 pt-3">

            <div className="w-full aspect-[3/2] relative">

              {isVideoFile(currentProject.image) || currentProject.video ? (

                <video
                  src={currentProject.image}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />

              ) : (

                <Image
                  src={currentProject.image}
                  alt={currentProject.title}
                  fill
                  className="object-cover"
                  unoptimized
                />

              )}

            </div>

            <div className="text-center mt-4">

              <h2 className="text-sm font-semibold uppercase">
                {currentProject.title}
              </h2>

              <p className="text-xs text-gray-600 uppercase">
                {currentProject.date}
              </p>

            </div>

          </section>
        )}

        {/* SORT CONTROLS */}
        <div className="px-6 mt-10 grid grid-cols-2 text-[11px] tracking-[0.14em] uppercase">

          <button
            onClick={() => setSortBy("name")}
            className={sortBy === "name" ? "font-bold text-left" : "text-left"}
          >
            SORT BY NAME
          </button>

          <button
            onClick={() => setSortBy("date")}
            className={sortBy === "date" ? "font-bold text-right" : "text-right"}
          >
            SORT BY DATE
          </button>

        </div>

        {/* PROJECT LIST */}
        <div className="px-6 mt-6 pb-20 space-y-2">

          {sortedProjects.map((project) => (

            <div
              key={project.slug}
              className="flex justify-between items-start cursor-pointer"
              onClick={() => {
                setCurrentProject(project)
                router.push(`/projects/${project.slug}`)
              }}
            >

              <span className="text-[11px] uppercase tracking-[0.06em] font-medium">
                {project.overview}
              </span>

              <span className="text-[11px] uppercase tracking-[0.08em] font-medium">
                {project.date}
              </span>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}