/**
 * Utility functions for Cloudflare R2 CDN
 */

const CLOUDFLARE_R2_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL || ''

/**
 * Converts a local project path to Cloudflare R2 URL
 * @param localPath - Local path like "/projects/hardstyle/images/pic_1.webp"
 * @returns Full Cloudflare R2 URL
 */
export function getCloudflareUrl(localPath: string): string {
  // Remove leading "/projects/" if present and construct R2 URL
  const cleanPath = localPath.replace(/^\/projects\//, '')
  return `${CLOUDFLARE_R2_URL}/${cleanPath}`
}

/**
 * Checks if a path is a video file
 */
export function isVideoFile(src: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.webm', '.ogv'] as const
  return videoExtensions.some((ext) => src.toLowerCase().endsWith(ext))
}

/**
 * Gets the appropriate Cloudflare URL for project thumbnails and resources
 */
export function getProjectResourceUrl(project: any, resourceType: 'image' | 'video' = 'image'): string {
  if (resourceType === 'image') {
    return getCloudflareUrl(project.image)
  }
  return getCloudflareUrl(project.image)
}
