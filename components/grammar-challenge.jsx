"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trophy, Star } from "lucide-react"

const GRAMMAR_QUESTIONS = {
  beginner: [
    {
      id: 1,
      question: "She ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correct: "goes",
      explanation: "Use 'goes' with third person singular (he/she/it) in present simple.",
    },
    {
      id: 2,
      question: "I ___ a student.",
      options: ["am", "is", "are", "be"],
      correct: "am",
      explanation: "Use 'am' with 'I' in present tense.",
    },
    {
      id: 3,
      question: "They ___ playing football now.",
      options: ["is", "am", "are", "be"],
      correct: "are",
      explanation: "Use 'are' with 'they' in present continuous.",
    },
    {
      id: 4,
      question: "He ___ his homework yesterday.",
      options: ["do", "does", "did", "doing"],
      correct: "did",
      explanation: "Use 'did' for past simple tense.",
    },
    {
      id: 5,
      question: "We ___ English every Monday.",
      options: ["study", "studies", "studying", "studied"],
      correct: "study",
      explanation: "Use base form with 'we' in present simple.",
    },
  ],
  intermediate: [
    {
      id: 6,
      question: "If I ___ rich, I would travel the world.",
      options: ["am", "was", "were", "be"],
      correct: "were",
      explanation: "Use 'were' in second conditional for all subjects.",
    },
    {
      id: 7,
      question: "She has ___ finished her work.",
      options: ["yet", "already", "still", "just"],
      correct: "already",
      explanation: "'Already' is used in affirmative sentences with present perfect.",
    },
    {
      id: 8,
      question: "The book ___ by millions of people.",
      options: ["read", "reads", "was read", "is reading"],
      correct: "was read",
      explanation: "Use passive voice (was + past participle) for completed actions.",
    },
    {
      id: 9,
      question: "I wish I ___ speak Chinese fluently.",
      options: ["can", "could", "will", "would"],
      correct: "could",
      explanation: "Use 'could' after 'wish' to express unreal present situations.",
    },
    {
      id: 10,
      question: "By next year, I ___ here for five years.",
      options: ["work", "worked", "will work", "will have worked"],
      correct: "will have worked",
      explanation: "Use future perfect for actions completed before a future time.",
    },
  ],
  advanced: [
    {
      id: 11,
      question: "Had I known about the meeting, I ___ attended.",
      options: ["would", "would have", "will", "will have"],
      correct: "would have",
      explanation: "Use 'would have' in third conditional with inverted structure.",
    },
    {
      id: 12,
      question: "The proposal ___ by the committee next week.",
      options: ["will review", "will be reviewed", "reviews", "is reviewing"],
      correct: "will be reviewed",
      explanation: "Use future passive voice for actions to be done in the future.",
    },
    {
      id: 13,
      question: "Scarcely ___ the door when the phone rang.",
      options: ["I opened", "had I opened", "I had opened", "did I open"],
      correct: "had I opened",
      explanation: "After 'scarcely', use inverted word order with past perfect.",
    },
    {
      id: 14,
      question: "The research ___ for three years before results emerged.",
      options: ["conducted", "was conducting", "had been conducted", "has conducted"],
      correct: "had been conducted",
      explanation: "Use past perfect passive for actions completed before another past action.",
    },
    {
      id: 15,
      question: "Not only ___ the exam, but he also got the highest score.",
      options: ["he passed", "did he pass", "he did pass", "passed he"],
      correct: "did he pass",
      explanation: "After 'not only', use inverted word order with auxiliary verb.",
    },
  ],
}

export default function GrammarChallenge() {
  const [level, setLevel] = useState("beginner")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const questions = GRAMMAR_QUESTIONS[level]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  useEffect(() => {
    const saved = localStorage.getItem("grammarScore")
    if (saved) {
      setTotalScore(Number.parseInt(saved))
    }
  }, [])

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === questions[currentQuestion].correct) {
      const newScore = score + 10
      setScore(newScore)
      const newTotal = totalScore + 10
      setTotalScore(newTotal)
      localStorage.setItem("grammarScore", newTotal.toString())
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 500)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowExplanation(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const changeLevel = (newLevel) => {
    setLevel(newLevel)
    resetQuiz()
  }

  if (currentQuestion >= questions.length) {
    return (
      <Card className="p-6 sm:p-8 md:p-12 text-center max-w-2xl mx-auto">
        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">Level Complete!</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-2">
          Your score: {score} / {questions.length * 10}
        </p>
        <p className="text-base sm:text-lg text-muted-foreground mb-6">Total points earned: {totalScore}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button onClick={resetQuiz} size="lg" className="w-full sm:w-auto">
            Try Again
          </Button>
          {level === "beginner" && (
            <Button
              onClick={() => changeLevel("intermediate")}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Next Level: Intermediate
            </Button>
          )}
          {level === "intermediate" && (
            <Button onClick={() => changeLevel("advanced")} size="lg" variant="outline" className="w-full sm:w-auto">
              Next Level: Advanced
            </Button>
          )}
        </div>
      </Card>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-balance">Grammar Challenge</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={level === "beginner" ? "default" : "outline"}
                onClick={() => changeLevel("beginner")}
                className="cursor-pointer text-xs"
              >
                Beginner
              </Badge>
              <Badge
                variant={level === "intermediate" ? "default" : "outline"}
                onClick={() => changeLevel("intermediate")}
                className="cursor-pointer text-xs"
              >
                Intermediate
              </Badge>
              <Badge
                variant={level === "advanced" ? "default" : "outline"}
                onClick={() => changeLevel("advanced")}
                className="cursor-pointer text-xs"
              >
                Advanced
              </Badge>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-primary" />
              {score} points
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total: {totalScore}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} / {questions.length}
        </p>
      </div>

      <Card className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-foreground leading-relaxed text-balance">{currentQ.question}</p>
        </div>

        <div className="grid gap-2 sm:gap-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={
                showResult
                  ? option === currentQ.correct
                    ? "default"
                    : option === selectedAnswer
                      ? "destructive"
                      : "outline"
                  : "outline"
              }
              size="lg"
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className="justify-between text-sm sm:text-base md:text-lg h-auto py-3 sm:py-4"
            >
              <span className="break-words text-left">{option}</span>
              {showResult && option === currentQ.correct && (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              {showResult && option === selectedAnswer && option !== currentQ.correct && (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-secondary rounded-lg border border-border">
            <p className="text-xs sm:text-sm font-semibold text-secondary-foreground mb-1">Explanation:</p>
            <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {showResult && (
          <div className="mt-4 sm:mt-6">
            <Button onClick={nextQuestion} size="lg" className="w-full">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
