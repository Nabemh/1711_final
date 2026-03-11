import fs from "fs"
import path from "path"
import { getCloudflareUrl } from "./cloudflare"

export type LayoutTemplate = 1 | 2 | 3 | 4 | 5

export interface Resource {
  type: "image" | "video"
  src: string
  template: LayoutTemplate
  alt?: string
}

export interface Project {
  title: string
  overview: string
  description: string
  tags: string[]
  image: string
  slug: string
  video?: boolean
  resources?: Resource[]
  backgroundColor?: string
  section: "exhibitions" | "designs" | "styling"
  date?: string
}

const projectsDir = path.join(process.cwd(), "public/projects")

/**
 * Normalizes section values to standard format
 */
function normalizeSection(section: string | undefined): "exhibitions" | "designs" | "styling" {
  if (!section) return "exhibitions"
  
  const normalized = section.toLowerCase().trim()
  
  // Handle common variations
  if (normalized === "design" || normalized === "designs") return "designs"
  if (normalized === "styling" || normalized === "styled" || normalized === "style") return "styling"
  if (normalized === "exhibition" || normalized === "exhibitions") return "exhibitions"
  
  // Default to exhibitions for unknown values
  return "exhibitions"
}

/**
 * Generates a URL-friendly slug from a project folder name
 */
function generateSlug(folderName: string): string {
  return folderName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Finds the first image file in a project folder
 */
function findFirstImage(folderPath: string): string | null {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
  
  // Check for thumb files first
  for (const ext of imageExtensions) {
    const thumbPath = path.join(folderPath, `thumb${ext}`)
    if (fs.existsSync(thumbPath)) {
      return `thumb${ext}`
    }
  }

  // Check thumbs subdirectory
  const thumbsDir = path.join(folderPath, "thumbs")
  if (fs.existsSync(thumbsDir)) {
    const files = fs.readdirSync(thumbsDir)
    for (const file of files) {
      if (imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))) {
        return `thumbs/${file}`
      }
    }
  }

  // Check images subdirectory
  const imagesDir = path.join(folderPath, "images")
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir)
    for (const file of files) {
      if (imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))) {
        return `images/${file}`
      }
    }
  }

  // Check root directory
  const files = fs.readdirSync(folderPath)
  for (const file of files) {
    if (imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))) {
      return file
    }
  }

  return null
}

/**
 * Loads all projects from the filesystem
 */
export async function loadProjects(): Promise<Project[]> {
  try {
    const folders = fs.readdirSync(projectsDir)
    const projects: Project[] = []

    for (const folder of folders) {
      const folderPath = path.join(projectsDir, folder)
      const stat = fs.statSync(folderPath)

      if (!stat.isDirectory()) continue

      const metaPath = path.join(folderPath, "meta.json")

      if (!fs.existsSync(metaPath)) continue

      try {
        const metaContent = fs.readFileSync(metaPath, "utf-8")
        const meta = JSON.parse(metaContent)

        const slug = generateSlug(folder)
        
        // Use image from meta.json, or find first image in folder
        let image = meta.image
        if (!image) {
          const foundImage = findFirstImage(folderPath)
          image = foundImage ? `/projects/${slug}/${foundImage}` : `/projects/${slug}/thumb.webp`
        }

        projects.push({
          title: meta.title || folder,
          overview: meta.overview || meta.title || folder,
          description: meta.description || "",
          tags: meta.tags || [],
          image: getCloudflareUrl(meta.image || image),
          slug,
          video: meta.video || false,
          resources: (meta.resources || []).map((resource: any) => ({
            ...resource,
            src: getCloudflareUrl(resource.src)
          })),
          backgroundColor: meta.backgroundColor || "#ffffff",
          section: normalizeSection(meta.section),
          date: meta.date || "July 2023", // Default date, can be updated in meta.json
        })
      } catch (error) {
        console.error(`Error loading meta.json from ${folder}:`, error)
      }
    }

    return projects.sort((a, b) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}

/**
 * Loads a single project by slug
 */
export async function loadProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await loadProjects()
  return projects.find((p) => p.slug === slug) || null
}

/**
 * Gets all available project slugs (for static generation)
 */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await loadProjects()
  return projects.map((p) => p.slug)
}

/**
 * Gets all projects in a specific section
 */
export async function getProjectsBySection(section: "exhibitions" | "designs" | "styling"): Promise<Project[]> {
  const projects = await loadProjects()
  return projects.filter((p) => p.section === section)
}

/**
 * Gets slugs for projects in a specific section (for static generation)
 */
export async function getProjectSlugsBySection(section: "exhibitions" | "designs" | "styling"): Promise<string[]> {
  const projects = await getProjectsBySection(section)
  return projects.map((p) => p.slug)
}
