"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/projects"

export default function OverviewPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Flowing horizontal layout - titles sit next to each other across the page
  const getProjectPosition = (index: number) => {
    // Define manual positions for each project to flow naturally horizontally
    const positions = [
    // Row 1
    { top: '13%', left: '5%' },
    { top: '13%', left: '37%' },
    { top: '15%', left: '61%' },

    // Row 2
    { top: '25%', left: '5%' },
    { top: '28%', left: '24%' },
    { top: '26%', left: '60%' },

    // Row 3
    { top: '37%', left: '5%' },
    { top: '38%', left: '50%' },

    // Row 4
    { top: '49%', left: '5%' },
    { top: '48%', left: '20%' },
    { top: '50%', left: '50%' },

    // Row 5
    { top: '61%', left: '5%' },
    { top: '61%', left: '29%' },

    // Row 6
    { top: '73%', left: '5%' },
    { top: '74%', left: '55%' },
    { top: '61%', left: '80%' },

    // Row 7
    { top: '72%', left: '39%' },
    { top: '50%', left: '66%' },
    ]

    
    return positions[index] || { top: '110%', left: '3%' }
  }

  const handleProjectClick = (slug: string) => {
    router.push(`/projects/${slug}`)
  }

  return (
    <div className="min-h-screen bg-[#e8e9ec] text-black overflow-hidden relative">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#e8e9ec] flex justify-between items-center px-8 py-6">
        <div className="text-sm"></div>
        <nav className="flex gap-8 items-center">
          <a href="/" className="italic text-sm hover:opacity-60">
            Home
          </a>
          <a href="/exhibitions" className="italic text-sm hover:opacity-60">
            Work
          </a>
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        </nav>
      </header>

      {/* Projects */}
      <main className="pt-48 pb-20 relative min-h-[100vh]">
        {projects.map((project, index) => {
          const position = getProjectPosition(index)
          const isHovered = hoveredProject?.slug === project.slug
          const isOtherHovered =
            hoveredProject && hoveredProject.slug !== project.slug

          return (
            <div
              key={project.slug}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => handleProjectClick(project.slug)}
              className="absolute cursor-pointer flex items-start gap-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                ...position,
                opacity: isOtherHovered ? 0.25 : 1,
              }}
            >
              {/* Title */}
              <h2
                className="text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.025em] whitespace-nowrap m-0"
                style={{ color: isHovered ? "#000" : "#222" }}
              >
                {project.overview}
              </h2>

              {/* Tags */}
              <div
                className="text-[0.8rem] italic leading-snug pt-0.5"
                style={{ color: isHovered ? "#444" : "#777" }}
              >
                {project.tags.map((tag, i) => (
                  <span key={i}>
                    {tag}
                    {i < project.tags.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </main>

      {/* Floating Image */}
      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-50 rounded-md transition-opacity duration-200"
          style={{
            width: "360px",
            height: "250px",
            backgroundImage: `url(${hoveredProject.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            left: mousePosition.x + 18,
            top: mousePosition.y - 18,
            boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
          }}
        />
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-[90] flex justify-between items-center px-8 py-8 text-sm">
        <div>© 2025</div>
        <div className="flex gap-8 items-center">
          <a href="#instagram" className="hover:opacity-60">
            Instagram
          </a>
          <a href="#linkedin" className="hover:opacity-60">
            LinkedIn
          </a>
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        </div>
      </footer>
    </div>
  )
}