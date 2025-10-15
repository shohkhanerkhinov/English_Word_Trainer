"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Check, RotateCcw } from "lucide-react"

export default function WordCard({ word, onLearned, onReview, isLearned, needsReview }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.english)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 break-words">{word.english}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono break-all">{word.pronunciation}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={speakWord}
            className="hover:bg-primary/10 hover:text-primary flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          {isFlipped ? (
            <div className="py-3 sm:py-4 px-3 sm:px-4 bg-secondary rounded-lg border border-border">
              <p className="text-base sm:text-lg text-secondary-foreground break-words">
                <span className="text-muted-foreground">Uzbek:</span> {word.uzbek}
              </p>
            </div>
          ) : (
            <div className="py-3 sm:py-4 px-3 sm:px-4 bg-muted/30 rounded-lg border border-dashed border-border">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">Click to see translation</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
          <Button
            size="sm"
            variant={isLearned ? "default" : "outline"}
            onClick={() => onLearned(word.id)}
            className="flex-1 gap-2 text-xs sm:text-sm"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            {isLearned ? "Learned" : "Mark as Learned"}
          </Button>
          <Button
            size="sm"
            variant={needsReview ? "secondary" : "outline"}
            onClick={() => onReview(word.id)}
            className="flex-1 gap-2 text-xs sm:text-sm"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            {needsReview ? "In Review" : "Need Review"}
          </Button>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
    </Card>
  )
}
