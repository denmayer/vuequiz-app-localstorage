export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  image?: string
  type?: 'multiple-choice' | 'true-false'
}

export interface QuizData {
  id: string
  name: string
  description: string
  questions: Question[]
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  date: string
  score: number
  totalQuestions: number
  percentage: number
}