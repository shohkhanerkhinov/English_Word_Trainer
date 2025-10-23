"use client"

import { useState, useEffect } from "react"
import WordCard from "@/components/word-card"
import TestMode from "@/components/test-mode"
import Statistics from "@/components/statistics"
import GrammarChallenge from "@/components/grammar-challenge"
import SpeakingMirror from "@/components/speaking-mirror"
import AuthForm from "@/components/auth-form"
import MissedDayBanner from "@/components/missed-day-banner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, BarChart3, BookText, Mic, Menu, LogOut } from "lucide-react"
import { WORD_DATABASE } from "@/lib/word-database"
import { requestNotificationPermission, checkMissedDays, sendMissedDayNotification } from "@/lib/notification-service"

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [mode, setMode] = useState("learn")
  const [dailyWords, setDailyWords] = useState([])
  const [learnedWords, setLearnedWords] = useState([])
  const [reviewWords, setReviewWords] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [missedDays, setMissedDays] = useState(0)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("englishTrainerCurrentUser")
      if (userData) {
        const user = JSON.parse(userData)
        console.log("[v0] Loaded user session:", user.email)
        setCurrentUser(user)
      } else {
        console.log("[v0] No saved user session found")
      }
    } catch (e) {
      console.log("[v0] Error loading user session:", e)
      localStorage.removeItem("englishTrainerCurrentUser")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!currentUser) return

    // Request notification permission
    requestNotificationPermission()

    // Check for missed days
    const { missedDays: missed } = checkMissedDays(currentUser.id)
    setMissedDays(missed)

    // Send notification if days were missed
    if (missed > 0) {
      sendMissedDayNotification(missed)
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return

    // Load user-specific data from localStorage
    const userDataKey = `wordTrainerData_${currentUser.id}`
    const saved = localStorage.getItem(userDataKey)
    if (saved) {
      const data = JSON.parse(saved)
      setLearnedWords(data.learned || [])
      setReviewWords(data.review || [])
    }

    // Get today's words
    const today = new Date().toDateString()
    const userDateKey = `wordTrainerDate_${currentUser.id}`
    const userDailyKey = `wordTrainerDaily_${currentUser.id}`
    const savedDate = localStorage.getItem(userDateKey)

    if (savedDate !== today) {
      // New day, generate new words
      const shuffled = [...WORD_DATABASE].sort(() => Math.random() - 0.5)
      const todayWords = shuffled.slice(0, 10)
      setDailyWords(todayWords)
      localStorage.setItem(userDateKey, today)
      localStorage.setItem(userDailyKey, JSON.stringify(todayWords))
    } else {
      // Load today's words
      const saved = localStorage.getItem(userDailyKey)
      if (saved) {
        setDailyWords(JSON.parse(saved))
      }
    }
  }, [currentUser])

  const saveData = (learned, review) => {
    if (!currentUser) return
    const userDataKey = `wordTrainerData_${currentUser.id}`
    localStorage.setItem(
      userDataKey,
      JSON.stringify({
        learned,
        review,
      }),
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("englishTrainerCurrentUser")
    setCurrentUser(null)
    setMode("learn")
    setDailyWords([])
    setLearnedWords([])
    setReviewWords([])
    setMissedDays(0)
  }

  const handleLogin = (user) => {
    console.log("[v0] handleLogin called with user:", user.email)
    setCurrentUser(user)
  }

  const markAsLearned = (wordId) => {
    if (!learnedWords.includes(wordId)) {
      const updated = [...learnedWords, wordId]
      setLearnedWords(updated)
      saveData(updated, reviewWords)
    }
  }

  const markForReview = (wordId) => {
    if (!reviewWords.includes(wordId)) {
      const updated = [...reviewWords, wordId]
      setReviewWords(updated)
      saveData(learnedWords, updated)
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground truncate">English Word Trainer</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome, {currentUser.name}!</p>
              </div>
            </div>

            <div className="hidden md:flex gap-2">
              <Button
                variant={mode === "learn" ? "default" : "ghost"}
                onClick={() => setMode("learn")}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Learn
              </Button>
              <Button variant={mode === "test" ? "default" : "ghost"} onClick={() => setMode("test")} className="gap-2">
                <Trophy className="w-4 h-4" />
                Test
              </Button>
              <Button
                variant={mode === "grammar" ? "default" : "ghost"}
                onClick={() => setMode("grammar")}
                className="gap-2"
              >
                <BookText className="w-4 h-4" />
                Grammar
              </Button>
              <Button
                variant={mode === "speaking" ? "default" : "ghost"}
                onClick={() => setMode("speaking")}
                className="gap-2"
              >
                <Mic className="w-4 h-4" />
                Speaking
              </Button>
              <Button
                variant={mode === "stats" ? "default" : "ghost"}
                onClick={() => setMode("stats")}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "learn" ? "default" : "outline"}
                  onClick={() => handleModeChange("learn")}
                  className="gap-2 justify-start"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Learn
                </Button>
                <Button
                  variant={mode === "test" ? "default" : "outline"}
                  onClick={() => handleModeChange("test")}
                  className="gap-2 justify-start"
                  size="sm"
                >
                  <Trophy className="w-4 h-4" />
                  Test
                </Button>
                <Button
                  variant={mode === "grammar" ? "default" : "outline"}
                  onClick={() => handleModeChange("grammar")}
                  className="gap-2 justify-start"
                  size="sm"
                >
                  <BookText className="w-4 h-4" />
                  Grammar
                </Button>
                <Button
                  variant={mode === "speaking" ? "default" : "outline"}
                  onClick={() => handleModeChange("speaking")}
                  className="gap-2 justify-start"
                  size="sm"
                >
                  <Mic className="w-4 h-4" />
                  Speaking
                </Button>
                <Button
                  variant={mode === "stats" ? "default" : "outline"}
                  onClick={() => handleModeChange("stats")}
                  className="gap-2 justify-start"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  Statistics
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2 justify-start col-span-2 bg-transparent"
                  size="sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {missedDays > 0 && <MissedDayBanner missedDays={missedDays} onDismiss={() => setMissedDays(0)} />}

        {mode === "learn" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">Today's Words</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Learn 10 new words every day</p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {dailyWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  onLearned={markAsLearned}
                  onReview={markForReview}
                  isLearned={learnedWords.includes(word.id)}
                  needsReview={reviewWords.includes(word.id)}
                />
              ))}
            </div>

            {dailyWords.length === 0 && (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-muted-foreground">Loading today's words...</p>
              </Card>
            )}
          </div>
        )}

        {mode === "test" && (
          <TestMode
            words={dailyWords}
            onComplete={(score) => {
              console.log("[v0] Test completed with score:", score)
            }}
          />
        )}

        {mode === "stats" && (
          <Statistics
            totalWords={WORD_DATABASE.length}
            learnedWords={learnedWords.length}
            reviewWords={reviewWords.length}
            dailyWords={dailyWords.length}
          />
        )}

        {mode === "grammar" && <GrammarChallenge />}

        {mode === "speaking" && <SpeakingMirror />}
      </main>
    </div>
  )
}
