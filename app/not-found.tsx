import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block text-sm font-light tracking-[0.3em] uppercase hover:opacity-70 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
