"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Step = 0 | 1 | 2

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>(0)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const enterFirst = setTimeout(() => {
      setStep(0)
    }, 300)

    const exitFirst = setTimeout(() => {
      setStep(1)
    }, 1100)

    const enterSecond = setTimeout(() => {
      setStep(2)
    }, 1600)

    const fadeOut = setTimeout(() => {
      setHide(true)
    }, 3000)

    const finish = setTimeout(() => {
      onFinish()
    }, 3600)

    return () => {
      clearTimeout(enterFirst)
      clearTimeout(exitFirst)
      clearTimeout(enterSecond)
      clearTimeout(fadeOut)
      clearTimeout(finish)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center
      transition-opacity duration-900 ease-in-out
      ${hide ? "opacity-0" : "opacity-100"}`}
    >
      {/* IMAGE 1 */}
      <div
        className={`absolute transition-all duration-900 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            step === 0
              ? "opacity-100 translate-y-0"
              : step === 1
              ? "opacity-0 -translate-x-32"
              : "opacity-0"
          }`}
      >
        <Image
          src="/logo-f1.jpeg"
          alt="Intro Logo"
          width={320}
          height={320}
          priority
        />
      </div>

      {/* IMAGE 2 */}
      <div
        className={`absolute transition-all duration-900 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            step === 2
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-32"
          }`}
      >
        <Image
          src="/logo-f2.jpeg"
          alt="Final Logo"
          width={450}
          height={450}
          priority
        />
      </div>
    </div>
  )
}
