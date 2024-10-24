import quizData from '../data/quizzes.json'
import type { QuizData, Question, QuizAttempt } from '../types/quiz'

const STORAGE_KEY = 'quiz_attempts'
const QUIZZES_KEY = 'quiz_data'

// Initialize quizzes in localStorage if not present
if (!localStorage.getItem(QUIZZES_KEY)) {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizData))
}

export const quizService = {
  getAllQuizzes(): QuizData[] {
    const stored = localStorage.getItem(QUIZZES_KEY)
    return stored ? JSON.parse(stored).quizzes : []
  },

  getQuizById(id: string): QuizData | undefined {
    return this.getAllQuizzes().find(quiz => quiz.id === id)
  },

  saveQuizzes(quizzes: QuizData[]): void {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify({ quizzes }))
  },

  addQuiz(quiz: QuizData): void {
    const quizzes = this.getAllQuizzes()
    quizzes.push(quiz)
    this.saveQuizzes(quizzes)
  },

  addQuestion(quizId: string, question: Question): void {
    const quizzes = this.getAllQuizzes()
    const quiz = quizzes.find(q => q.id === quizId)
    if (!quiz) return

    // Generate new ID
    const maxId = Math.max(...quiz.questions.map(q => q.id), 0)
    question.id = maxId + 1

    quiz.questions.push(question)
    this.saveQuizzes(quizzes)
  },

  updateQuestion(quizId: string, question: Question): void {
    const quizzes = this.getAllQuizzes()
    const quiz = quizzes.find(q => q.id === quizId)
    if (!quiz) return

    const index = quiz.questions.findIndex(q => q.id === question.id)
    if (index === -1) return

    quiz.questions[index] = question
    this.saveQuizzes(quizzes)
  },

  deleteQuestion(quizId: string, questionId: number): void {
    const quizzes = this.getAllQuizzes()
    const quiz = quizzes.find(q => q.id === quizId)
    if (!quiz) return

    quiz.questions = quiz.questions.filter(q => q.id !== questionId)
    this.saveQuizzes(quizzes)
  },

  saveAttempt(quizId: string, score: number, totalQuestions: number): QuizAttempt {
    const attempts = this.getAttempts()
    const newAttempt: QuizAttempt = {
      id: crypto.randomUUID(),
      quizId,
      date: new Date().toISOString(),
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100)
    }
    
    attempts.push(newAttempt)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
    return newAttempt
  },

  getAttempts(quizId?: string): QuizAttempt[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    const attempts = stored ? JSON.parse(stored) : []
    return quizId ? attempts.filter((a: QuizAttempt) => a.quizId === quizId) : attempts
  },

  clearAttempts(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}