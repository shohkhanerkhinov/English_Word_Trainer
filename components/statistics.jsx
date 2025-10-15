"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle2, RotateCcw, Target } from "lucide-react"

export default function Statistics({ totalWords, learnedWords, reviewWords, dailyWords }) {
  const learningProgress = (learnedWords / totalWords) * 100

  const stats = [
    {
      icon: BookOpen,
      label: "Total Words",
      value: totalWords,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle2,
      label: "Words Learned",
      value: learnedWords,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: RotateCcw,
      label: "Need Review",
      value: reviewWords,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      icon: Target,
      label: "Today's Words",
      value: dailyWords,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Progress</h2>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Overall Learning Progress</h3>
          <span className="text-2xl font-bold text-primary">{Math.round(learningProgress)}%</span>
        </div>
        <Progress value={learningProgress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {learnedWords} out of {totalWords} words learned
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:border-primary/50 transition-all">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Achievements */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${learnedWords >= 5 ? "bg-primary" : "bg-muted"} flex items-center justify-center`}
            >
              <CheckCircle2
                className={`w-6 h-6 ${learnedWords >= 5 ? "text-primary-foreground" : "text-muted-foreground"}`}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">First Steps</p>
              <p className="text-sm text-muted-foreground">Learn 5 words</p>
            </div>
            {learnedWords >= 5 && <span className="text-sm font-semibold text-primary">Unlocked!</span>}
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${learnedWords >= 10 ? "bg-primary" : "bg-muted"} flex items-center justify-center`}
            >
              <CheckCircle2
                className={`w-6 h-6 ${learnedWords >= 10 ? "text-primary-foreground" : "text-muted-foreground"}`}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Word Master</p>
              <p className="text-sm text-muted-foreground">Learn 10 words</p>
            </div>
            {learnedWords >= 10 && <span className="text-sm font-semibold text-primary">Unlocked!</span>}
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${learnedWords >= 20 ? "bg-primary" : "bg-muted"} flex items-center justify-center`}
            >
              <CheckCircle2
                className={`w-6 h-6 ${learnedWords >= 20 ? "text-primary-foreground" : "text-muted-foreground"}`}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Vocabulary Expert</p>
              <p className="text-sm text-muted-foreground">Learn all 20 words</p>
            </div>
            {learnedWords >= 20 && <span className="text-sm font-semibold text-primary">Unlocked!</span>}
          </div>
        </div>
      </Card>
    </div>
  )
}
