import { loadProjects } from "@/lib/projects"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const projects = await loadProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error loading projects:", error)
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    )
  }
}
