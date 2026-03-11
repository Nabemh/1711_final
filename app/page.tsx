"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import Link from "next/link"
import ThumbnailsLoop from "@/components/thumbnails-loop"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash again every X ms
    const LOOP_INTERVAL = 10000 // 10 secs

    const interval = setInterval(() => {
      setShowSplash(true)
    }, LOOP_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      <ThumbnailsLoop />

      <main className="min-h-screen bg-white text-black flex flex-col">
        {/* logo */}
        <div className="fixed top-2 left-8 z-[130] pointer-events-none">
          <Image
            src="/logo-f2-copy.jpeg"
            alt="1711 Delivered"
            width={160}
            height={140}
            priority
          />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-[100] flex justify-between items-center px-4 md:px-6 py-4 md:py-6 bg-white">
          <div />
          <nav className="flex gap-8 items-center">
            <Link href="/exhibitions" className="italic text-sm hover:opacity-60">
              Work
            </Link>
           {/*  <div className="w-1.5 h-1.5 bg-black rounded-full" />
            <Link href="/exhibitions" className="italic text-sm hover:opacity-60">
              Exhibitions
            </Link>
            <Link href="/designs" className="italic text-sm hover:opacity-60">
              Designs
            </Link>
            <Link href="/styling" className="italic text-sm hover:opacity-60">
              Styling
            </Link> */}
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </nav>
        </header>

        {/* Content placeholder */}
        <div className="flex-1" />

        {/* Footer */}
        <footer className="sticky bottom-0 z-[90] flex justify-between items-center px-4 md:px-8 py-4 md:py-8 text-sm bg-white">
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
      </main>
    </>
  )
}
