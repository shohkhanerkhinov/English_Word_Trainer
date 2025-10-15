"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Trophy } from "lucide-react"

export default function TestMode({ words, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [testWords, setTestWords] = useState([])

  useEffect(() => {
    // Prepare test questions
    if (words.length > 0) {
      const shuffled = [...words].sort(() => Math.random() - 0.5)
      setTestWords(shuffled.slice(0, 5))
    }
  }, [words])

  const generateOptions = (correctWord) => {
    const allWords = [...words]
    const options = [correctWord.uzbek]

    while (options.length < 4) {
      const random = allWords[Math.floor(Math.random() * allWords.length)]
      if (!options.includes(random.uzbek)) {
        options.push(random.uzbek)
      }
    }

    return options.sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === testWords[currentQuestion].uzbek) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < testWords.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      onComplete(score)
    }
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setTestWords(shuffled.slice(0, 5))
  }

  if (testWords.length === 0) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <p className="text-muted-foreground">No words available for testing. Learn some words first!</p>
      </Card>
    )
  }

  if (currentQuestion >= testWords.length) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-2">Test Complete!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Your score: {score} / {testWords.length}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={resetTest} size="lg">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  const currentWord = testWords[currentQuestion]
  const options = generateOptions(currentWord)
  const progress = ((currentQuestion + 1) / testWords.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Question {currentQuestion + 1} / {testWords.length}
          </h2>
          <div className="text-lg font-semibold text-primary">Score: {score}</div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Translate this word:</p>
          <h3 className="text-4xl font-bold text-foreground">{currentWord.english}</h3>
          <p className="text-muted-foreground mt-2 font-mono">{currentWord.pronunciation}</p>
        </div>

        <div className="grid gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={
                showResult
                  ? option === currentWord.uzbek
                    ? "default"
                    : option === selectedAnswer
                      ? "destructive"
                      : "outline"
                  : "outline"
              }
              size="lg"
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className="justify-between text-lg h-auto py-4"
            >
              <span>{option}</span>
              {showResult && option === currentWord.uzbek && <CheckCircle2 className="w-5 h-5" />}
              {showResult && option === selectedAnswer && option !== currentWord.uzbek && (
                <XCircle className="w-5 h-5" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 text-center">
            <Button onClick={nextQuestion} size="lg" className="w-full">
              {currentQuestion < testWords.length - 1 ? "Next Question" : "Finish Test"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
