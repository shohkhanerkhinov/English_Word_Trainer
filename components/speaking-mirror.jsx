"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const PRACTICE_PHRASES = [
  { id: 1, text: "How are you?", difficulty: "easy" },
  { id: 2, text: "Good morning, everyone!", difficulty: "easy" },
  { id: 3, text: "Thank you very much.", difficulty: "easy" },
  { id: 4, text: "I am learning English.", difficulty: "easy" },
  { id: 5, text: "What is your name?", difficulty: "easy" },
  { id: 6, text: "The weather is beautiful today.", difficulty: "medium" },
  { id: 7, text: "I would like to improve my pronunciation.", difficulty: "medium" },
  { id: 8, text: "Education is the key to success.", difficulty: "medium" },
  { id: 9, text: "Technology has changed our lives significantly.", difficulty: "medium" },
  { id: 10, text: "Communication skills are essential in the modern world.", difficulty: "hard" },
  { id: 11, text: "The implementation of sustainable development requires collaboration.", difficulty: "hard" },
  { id: 12, text: "Unprecedented challenges demand innovative solutions.", difficulty: "hard" },
]

export default function SpeakingMirror() {
  const [isListening, setIsListening] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(PRACTICE_PHRASES[0])
  const [transcript, setTranscript] = useState("")
  const [result, setResult] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [browserSupported, setBrowserSupported] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event) => {
          const spokenText = event.results[0][0].transcript
          setTranscript(spokenText)
          checkPronunciation(spokenText)
        }

        recognitionInstance.onerror = (event) => {
          console.log("[v0] Speech recognition error:", event.error)
          setIsListening(false)
          if (event.error === "no-speech") {
            setResult({ success: false, message: "No speech detected. Please try again." })
          }
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } else {
        setBrowserSupported(false)
      }
    }

    const saved = localStorage.getItem("speakingStats")
    if (saved) {
      const stats = JSON.parse(saved)
      setAttempts(stats.attempts || 0)
      setSuccessCount(stats.success || 0)
    }
  }, [])

  const checkPronunciation = (spokenText) => {
    const normalized = spokenText.toLowerCase().trim()
    const target = currentPhrase.text.toLowerCase().trim()

    const similarity = calculateSimilarity(normalized, target)

    const newAttempts = attempts + 1
    let newSuccess = successCount

    if (similarity > 0.8) {
      setResult({ success: true, message: "Excellent pronunciation!", similarity })
      newSuccess = successCount + 1
    } else if (similarity > 0.6) {
      setResult({ success: true, message: "Good job! Keep practicing.", similarity })
      newSuccess = successCount + 1
    } else {
      setResult({ success: false, message: "Try again. Listen carefully and repeat.", similarity })
    }

    setAttempts(newAttempts)
    setSuccessCount(newSuccess)
    localStorage.setItem("speakingStats", JSON.stringify({ attempts: newAttempts, success: newSuccess }))
  }

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.split(" ")
    const words2 = str2.split(" ")
    let matches = 0

    words1.forEach((word) => {
      if (words2.includes(word)) {
        matches++
      }
    })

    return matches / Math.max(words1.length, words2.length)
  }

  const startListening = () => {
    if (recognition) {
      setTranscript("")
      setResult(null)
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const speakPhrase = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase.text)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const nextPhrase = () => {
    const currentIndex = PRACTICE_PHRASES.findIndex((p) => p.id === currentPhrase.id)
    const nextIndex = (currentIndex + 1) % PRACTICE_PHRASES.length
    setCurrentPhrase(PRACTICE_PHRASES[nextIndex])
    setTranscript("")
    setResult(null)
  }

  const selectPhrase = (phrase) => {
    setCurrentPhrase(phrase)
    setTranscript("")
    setResult(null)
  }

  if (!browserSupported) {
    return (
      <Card className="p-6 sm:p-8 md:p-12 text-center max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-balance">Browser Not Supported</h2>
        <p className="text-sm sm:text-base text-muted-foreground text-balance">
          Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.
        </p>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">Speaking Mirror</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Practice your pronunciation with AI feedback</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
          <Badge variant="outline" className="text-xs">
            Attempts: {attempts}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Success: {successCount}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Accuracy: {attempts > 0 ? Math.round((successCount / attempts) * 100) : 0}%
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <Badge className="mb-3 sm:mb-4 text-xs">{currentPhrase.difficulty}</Badge>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 text-balance px-2">
                {currentPhrase.text}
              </h3>
              <Button onClick={speakPhrase} variant="outline" className="gap-2 bg-transparent text-sm">
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${isListening ? "bg-destructive hover:bg-destructive/90" : ""}`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 sm:w-12 sm:h-12" />
                ) : (
                  <Mic className="w-8 h-8 sm:w-12 sm:h-12" />
                )}
              </Button>

              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                {isListening ? "Listening... Speak now!" : "Click to start speaking"}
              </p>

              {transcript && (
                <div className="w-full p-3 sm:p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">You said:</p>
                  <p className="text-base sm:text-lg text-secondary-foreground break-words">{transcript}</p>
                </div>
              )}

              {result && (
                <div
                  className={`w-full p-4 sm:p-6 rounded-lg border ${result.success ? "bg-primary/10 border-primary" : "bg-destructive/10 border-destructive"}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    {result.success ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive flex-shrink-0" />
                    )}
                    <p className="text-base sm:text-lg font-semibold break-words">{result.message}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Accuracy: {Math.round(result.similarity * 100)}%
                  </p>
                </div>
              )}

              <Button onClick={nextPhrase} variant="outline" className="w-full bg-transparent text-sm sm:text-base">
                Next Phrase
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:block">
          <Card className="p-3 sm:p-4">
            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Practice Phrases</h4>
            <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
              {PRACTICE_PHRASES.map((phrase) => (
                <button
                  key={phrase.id}
                  onClick={() => selectPhrase(phrase)}
                  className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-colors ${
                    phrase.id === currentPhrase.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-secondary border-border"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium break-words">{phrase.text}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {phrase.difficulty}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
