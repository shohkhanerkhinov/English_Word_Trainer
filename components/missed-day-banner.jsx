"use client"

import { AlertCircle, X } from "lucide-react"
import { useState } from "react"

export default function MissedDayBanner({ missedDays, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || missedDays === 0) {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-amber-900 dark:text-amber-100">
          You missed {missedDays} day{missedDays > 1 ? "s" : ""}!
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
          Don't break your learning streak! Complete today's 10 words to get back on track.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
