"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/projects"

type SortBy = "name" | "date"
type ActiveSection = "exhibitions" | "designs" | "styling" | "overview"

export interface SidebarProps {
  projects: Project[]
  hoveredProject: Project | null
  setHoveredProject: (project: Project) => void
  sortBy: SortBy
  setSortBy: (sort: SortBy) => void
  currentPage?: "exhibitions" | "designs" | "styling"
  onCollapseChange?: (collapsed: boolean) => void
}

export default function Sidebar({
  projects,
  hoveredProject,
  setHoveredProject,
  sortBy,
  setSortBy,
  currentPage = "exhibitions",
  onCollapseChange,
}: SidebarProps) {

  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>(currentPage)

  const handleToggle = () => {
    const newOpen = !isSidebarOpen
    setIsSidebarOpen(newOpen)
    onCollapseChange?.(!newOpen)
  }

  const handleProjectClick = (projectSlug: string) => {
    // Always navigate to /projects/{slug} for consistent routing
    router.push(`/projects/${projectSlug}`)
  }

  const handleSectionClick = (section: ActiveSection) => {
    setActiveSection(section)
    if (section === "overview") {
      router.push("/overview")
    } else {
      router.push(`/${section}`)
    }
  }

  return (
    <div
      className={`fixed left-0 top-[80px] h-[calc(100vh-80px)] bg-white overflow-hidden flex flex-col transition-all duration-300 z-40 ${
        isSidebarOpen ? "w-[25%]" : "w-[60px]"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleToggle}
          className="text-black"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>
      </div>

      {isSidebarOpen && (
        <div className="flex-1 overflow-hidden px-10">
          {/* Top Navigation Labels */}
          <nav className="mb-3">
            <div className="space-y-2">
              <button
                onClick={() => handleSectionClick("exhibitions")}
                className={`block text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
                  activeSection === "exhibitions" 
                    ? "font-semibold text-black" 
                    : "font-normal text-black hover:font-semibold"
                }`}
              >
                1711 Exhibitions
              </button>
              <button
                onClick={() => handleSectionClick("designs")}
                className={`block text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
                  activeSection === "designs" 
                    ? "font-semibold text-black" 
                    : "font-normal text-black hover:font-semibold"
                }`}
              >
                1711 Designs
              </button>
              <button
                onClick={() => handleSectionClick("styling")}
                className={`block text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
                  activeSection === "styling" 
                    ? "font-semibold text-black" 
                    : "font-normal text-black hover:font-semibold"
                }`}
              >
                1711 Styling
              </button>
              <button
                onClick={() => handleSectionClick("overview")}
                className={`block text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
                  activeSection === "overview" 
                    ? "font-semibold text-black" 
                    : "font-normal text-black hover:font-semibold"
                }`}
              >
                Overview
              </button>
            </div>
          </nav>

          {/* Current Project Details */}
          {hoveredProject && (
            <div className="mb-5 pb-3">
              <h3 className="text-[10px] tracking-[0.05em] uppercase font-semibold text-black leading-tight">
                {hoveredProject.title}
              </h3>
              <h3 className="text-[10px] tracking-[0.05em] uppercase font-semibold text-black leading-tight">
                {hoveredProject.date}
              </h3>
            </div>
          )}

          {/* Sort Controls */}
          <div className="mb-6 grid grid-cols-2 text-[10px] tracking-[0.14em] uppercase">
            <button
              onClick={() => setSortBy("name")}
              className={`text-left transition-colors ${
                sortBy === "name"
                  ? "font-semibold text-black"
                  : "font-normal text-black hover:font-semibold"
              }`}
            >
              SORT BY NAME
            </button>

            <button
              onClick={() => setSortBy("date")}
              className={`text-right transition-colors ${
                sortBy === "date"
                  ? "font-semibold text-black"
                  : "font-normal text-black hover:font-semibold"
              }`}
            >
              SORT BY DATE
            </button>
          </div>

          {/* Project List */}
          <div className="space-y-1">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="flex justify-between items-start cursor-pointer group"
                onMouseEnter={() => setHoveredProject(project)}
                onClick={() => handleProjectClick(project.slug)}
              >
                <h4
                  className={`text-[10px] tracking-[0.06em] uppercase leading-tight transition-all flex-1 pr-4
                    ${
                      hoveredProject?.slug === project.slug
                        ? "font-semibold text-black"
                        : "font-normal text-black group-hover:font-semibold"
                    }`}
                >
                  {project.overview}
                </h4>

                <span
                  className={`text-[10px] tracking-[0.08em] uppercase transition-all text-right flex-shrink-0
                    ${
                      hoveredProject?.slug === project.slug
                        ? "font-semibold text-black"
                        : "font-normal text-black group-hover:font-semibold"
                    }`}
                >
                  {project.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}