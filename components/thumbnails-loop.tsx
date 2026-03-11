"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function ThumbnailsLoop() {
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)

  // fetch images once
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/loop/meta.json")
        const data: string[] = await res.json()
        setImages(data)
      } catch (e) {
        console.error("Failed loading images", e)
      }
    }
    fetchImages()
  }, [])

  // loop through images
  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 200) // 200ms per user request
    return () => clearInterval(interval)
  }, [images])

  if (images.length === 0) return null

  const current = images[index]
  return (
    <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[220px] h-[220px] md:w-[260px] md:h-[260px] overflow-hidden rounded-md shadow-lg">
      <Image
        src={`/loop/${current}`}
        alt={current}
        fill
        className="object-cover"
        sizes="220px"
        priority
      />
    </div>
  )
}
