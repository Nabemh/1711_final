"use client"

import Image from "next/image"
import type { Project } from "@/lib/projects"

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {

  return (
    <main
      className="min-h-screen flex"
      style={{ backgroundColor: project.backgroundColor || "#ffffff" }}
    >
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 fixed left-0 top-0 h-screen bg-white flex flex-col">

        <div className="px-10 py-12">

          <h1 className="text-[10px] uppercase font-semibold">
            {project.title}
          </h1>

          <h2 className="text-[10px] uppercase font-semibold mb-6">
            {project.date}
          </h2>

          {project.description && (
            <p className="text-[11px] leading-relaxed uppercase">
              {project.description}
            </p>
          )}

        </div>

      </div>


      {/* RIGHT CONTENT */}
      <div className="w-3/4 ml-[25%] pt-24 pb-24">

        <div className="space-y-24">

          {project.resources?.map((res, index) => (

            <div key={index} className="w-full h-[140vh] relative flex items-center justify-center">

              {res.type === "video" ? (
                <video
                  src={res.src}
                  className="max-w-[80%] max-h-[80%] object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={res.src}
                  alt={`${project.title} ${index + 1}`}
                  width={1600}
                  height={1000}
                  className="max-w-[80%] max-h-[80%] object-contain"
                  priority={index === 0}
                  unoptimized={true}
                />
              )}

            </div>

          )) || (
            <div className="w-full h-[60vh] flex items-center justify-center">
              <p className="text-gray-500">No resources available for this project</p>
            </div>
          )}

        </div>

      </div>
    </main>
  )
}