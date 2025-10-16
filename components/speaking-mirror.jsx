"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const PRACTICE_PHRASES = [
  // Easy (1-35) - Basic greetings and simple sentences
  { id: 1, text: "How are you?", difficulty: "easy" },
  { id: 2, text: "Good morning, everyone!", difficulty: "easy" },
  { id: 3, text: "Thank you very much.", difficulty: "easy" },
  { id: 4, text: "I am learning English.", difficulty: "easy" },
  { id: 5, text: "What is your name?", difficulty: "easy" },
  { id: 6, text: "Nice to meet you.", difficulty: "easy" },
  { id: 7, text: "Have a great day!", difficulty: "easy" },
  { id: 8, text: "See you later.", difficulty: "easy" },
  { id: 9, text: "I am fine, thank you.", difficulty: "easy" },
  { id: 10, text: "Where are you from?", difficulty: "easy" },
  { id: 11, text: "I live in the city.", difficulty: "easy" },
  { id: 12, text: "This is my book.", difficulty: "easy" },
  { id: 13, text: "I like coffee.", difficulty: "easy" },
  { id: 14, text: "The sky is blue.", difficulty: "easy" },
  { id: 15, text: "I am a student.", difficulty: "easy" },
  { id: 16, text: "Can you help me?", difficulty: "easy" },
  { id: 17, text: "I need water.", difficulty: "easy" },
  { id: 18, text: "What time is it?", difficulty: "easy" },
  { id: 19, text: "I am hungry.", difficulty: "easy" },
  { id: 20, text: "The weather is nice.", difficulty: "easy" },
  { id: 21, text: "I love music.", difficulty: "easy" },
  { id: 22, text: "This is delicious.", difficulty: "easy" },
  { id: 23, text: "I am happy today.", difficulty: "easy" },
  { id: 24, text: "Please speak slowly.", difficulty: "easy" },
  { id: 25, text: "I understand now.", difficulty: "easy" },
  { id: 26, text: "Excuse me, please.", difficulty: "easy" },
  { id: 27, text: "You are welcome.", difficulty: "easy" },
  { id: 28, text: "I am sorry.", difficulty: "easy" },
  { id: 29, text: "That is correct.", difficulty: "easy" },
  { id: 30, text: "I agree with you.", difficulty: "easy" },
  { id: 31, text: "How much is this?", difficulty: "easy" },
  { id: 32, text: "I want to learn.", difficulty: "easy" },
  { id: 33, text: "This is important.", difficulty: "easy" },
  { id: 34, text: "I am ready now.", difficulty: "easy" },
  { id: 35, text: "Let us begin.", difficulty: "easy" },

  // Medium (36-70) - Everyday conversations and descriptions
  { id: 36, text: "The weather is beautiful today.", difficulty: "medium" },
  { id: 37, text: "I would like to improve my pronunciation.", difficulty: "medium" },
  { id: 38, text: "Education is the key to success.", difficulty: "medium" },
  { id: 39, text: "Technology has changed our lives significantly.", difficulty: "medium" },
  { id: 40, text: "I enjoy reading books in my free time.", difficulty: "medium" },
  { id: 41, text: "Could you please repeat that sentence?", difficulty: "medium" },
  { id: 42, text: "I am planning to visit the museum tomorrow.", difficulty: "medium" },
  { id: 43, text: "Learning a new language requires dedication and practice.", difficulty: "medium" },
  { id: 44, text: "The presentation was very informative and engaging.", difficulty: "medium" },
  { id: 45, text: "I believe teamwork is essential for achieving goals.", difficulty: "medium" },
  { id: 46, text: "The restaurant serves authentic international cuisine.", difficulty: "medium" },
  { id: 47, text: "I am interested in studying computer science.", difficulty: "medium" },
  { id: 48, text: "Regular exercise contributes to better health.", difficulty: "medium" },
  { id: 49, text: "The conference will take place next month.", difficulty: "medium" },
  { id: 50, text: "I appreciate your help with this project.", difficulty: "medium" },
  { id: 51, text: "The library has an extensive collection of books.", difficulty: "medium" },
  { id: 52, text: "I prefer working in a quiet environment.", difficulty: "medium" },
  { id: 53, text: "The movie was entertaining and thought-provoking.", difficulty: "medium" },
  { id: 54, text: "I am looking forward to the upcoming vacation.", difficulty: "medium" },
  { id: 55, text: "The professor explained the concept very clearly.", difficulty: "medium" },
  { id: 56, text: "I need to submit the assignment by Friday.", difficulty: "medium" },
  { id: 57, text: "The city offers many cultural and recreational activities.", difficulty: "medium" },
  { id: 58, text: "I am trying to develop better time management skills.", difficulty: "medium" },
  { id: 59, text: "The workshop provided valuable insights and techniques.", difficulty: "medium" },
  { id: 60, text: "I enjoy exploring different cuisines and cultures.", difficulty: "medium" },
  { id: 61, text: "The company is committed to environmental sustainability.", difficulty: "medium" },
  { id: 62, text: "I find mathematics both challenging and rewarding.", difficulty: "medium" },
  { id: 63, text: "The exhibition showcases contemporary art from various artists.", difficulty: "medium" },
  { id: 64, text: "I am working on improving my communication skills.", difficulty: "medium" },
  { id: 65, text: "The seminar addressed important issues in modern society.", difficulty: "medium" },
  { id: 66, text: "I believe continuous learning is crucial for personal growth.", difficulty: "medium" },
  { id: 67, text: "The hotel provides excellent service and comfortable accommodations.", difficulty: "medium" },
  { id: 68, text: "I am passionate about protecting the environment.", difficulty: "medium" },
  { id: 69, text: "The research findings have significant implications for the field.", difficulty: "medium" },
  { id: 70, text: "I value honesty and integrity in all relationships.", difficulty: "medium" },

  // Hard (71-100) - Academic and professional language
  { id: 71, text: "Communication skills are essential in the modern world.", difficulty: "hard" },
  { id: 72, text: "The implementation of sustainable development requires collaboration.", difficulty: "hard" },
  { id: 73, text: "Unprecedented challenges demand innovative solutions.", difficulty: "hard" },
  { id: 74, text: "The interdisciplinary approach facilitates comprehensive understanding.", difficulty: "hard" },
  { id: 75, text: "Globalization has profoundly influenced economic and cultural dynamics.", difficulty: "hard" },
  { id: 76, text: "The methodology employed in this study ensures reliable results.", difficulty: "hard" },
  { id: 77, text: "Critical thinking skills are fundamental to academic excellence.", difficulty: "hard" },
  { id: 78, text: "The paradigm shift necessitates reevaluation of traditional assumptions.", difficulty: "hard" },
  { id: 79, text: "Technological advancement has revolutionized information accessibility.", difficulty: "hard" },
  { id: 80, text: "The correlation between variables demonstrates statistical significance.", difficulty: "hard" },
  { id: 81, text: "Ethical considerations are paramount in scientific research.", difficulty: "hard" },
  { id: 82, text: "The comprehensive analysis reveals multifaceted implications.", difficulty: "hard" },
  { id: 83, text: "Socioeconomic factors significantly influence educational outcomes.", difficulty: "hard" },
  { id: 84, text: "The theoretical framework provides a foundation for empirical investigation.", difficulty: "hard" },
  {
    id: 85,
    text: "Interdependence among nations characterizes contemporary international relations.",
    difficulty: "hard",
  },
  { id: 86, text: "The synthesis of diverse perspectives enriches intellectual discourse.", difficulty: "hard" },
  { id: 87, text: "Quantitative and qualitative methodologies complement each other effectively.", difficulty: "hard" },
  { id: 88, text: "The phenomenon exhibits remarkable complexity and variability.", difficulty: "hard" },
  { id: 89, text: "Sustainable practices are imperative for environmental preservation.", difficulty: "hard" },
  { id: 90, text: "The hypothesis was substantiated through rigorous experimentation.", difficulty: "hard" },
  { id: 91, text: "Cultural diversity enhances creativity and innovation in organizations.", difficulty: "hard" },
  {
    id: 92,
    text: "The implications of artificial intelligence extend beyond technological domains.",
    difficulty: "hard",
  },
  { id: 93, text: "Collaborative efforts are indispensable for addressing global challenges.", difficulty: "hard" },
  { id: 94, text: "The epistemological foundations of knowledge warrant careful examination.", difficulty: "hard" },
  { id: 95, text: "Demographic transitions have profound societal and economic consequences.", difficulty: "hard" },
  { id: 96, text: "The integration of technology in education transforms pedagogical approaches.", difficulty: "hard" },
  {
    id: 97,
    text: "Philosophical inquiry illuminates fundamental questions about human existence.",
    difficulty: "hard",
  },
  { id: 98, text: "The multidimensional nature of poverty requires comprehensive interventions.", difficulty: "hard" },
  { id: 99, text: "Neuroplasticity demonstrates the brain's remarkable capacity for adaptation.", difficulty: "hard" },
  {
    id: 100,
    text: "The convergence of disciplines fosters groundbreaking discoveries and innovations.",
    difficulty: "hard",
  },
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
      try {
        recognition.stop()
      } catch (e) {
        // Ignore if not running
      }
      setTimeout(() => {
        try {
          recognition.start()
        } catch (e) {
          console.log("[v0] Recognition start error:", e)
          setIsListening(false)
        }
      }, 100)
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
    if (isListening) {
      stopListening()
    }
  }

  const selectPhrase = (phrase) => {
    setCurrentPhrase(phrase)
    setTranscript("")
    setResult(null)
    if (isListening) {
      stopListening()
    }
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

              <div className="w-full space-y-2">
                <Button onClick={nextPhrase} className="w-full text-sm sm:text-base">
                  Next Phrase →
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Practice this phrase multiple times, then click "Next Phrase" to continue
                </p>
              </div>
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
