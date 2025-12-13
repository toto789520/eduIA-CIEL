'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, XCircle, BookOpen } from 'lucide-react'
import axios from 'axios'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  questions: Question[]
  title: string
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const generateQuiz = async () => {
    setLoading(true)
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    
    try {
      const response = await axios.post('/api/quiz')
      setQuiz(response.data)
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert('Erreur lors de la génération du quiz. Assurez-vous d\'avoir téléchargé des documents.')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (answerIndex: number) => {
    if (showResults) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = () => {
    if (!quiz) return
    
    let correctCount = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })
    
    setScore(correctCount)
    setShowResults(true)
  }

  const currentQ = quiz?.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Interactif</h1>
          <p className="text-gray-600">
            Générez des quiz à partir de vos documents de cours
          </p>
        </div>

        {!quiz ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Prêt à tester vos connaissances?
            </h2>
            <p className="text-gray-600 mb-8">
              Cliquez sur le bouton ci-dessous pour générer un quiz basé sur vos documents
            </p>
            <button
              onClick={generateQuiz}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center space-x-3 mx-auto text-lg font-medium"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-6 h-6" />
                  <span>Générer un Quiz</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} sur {quiz.questions.length}</span>
                {showResults && (
                  <span className="font-semibold">
                    Score: {score}/{quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {currentQ && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentQ.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index
                    const isCorrect = index === currentQ.correctAnswer
                    const showCorrectAnswer = showResults && isCorrect
                    const showIncorrectAnswer = showResults && isSelected && !isCorrect

                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={showResults}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showCorrectAnswer
                            ? 'border-green-500 bg-green-50'
                            : showIncorrectAnswer
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{option}</span>
                          {showResults && isCorrect && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                          {showResults && isSelected && !isCorrect && (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResults && currentQ.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Explication:</h3>
                    <p className="text-blue-800">{currentQ.explanation}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>

                  <div className="flex space-x-4">
                    {!showResults ? (
                      <>
                        {currentQuestion < quiz.questions.length - 1 ? (
                          <button
                            onClick={nextQuestion}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Suivant
                          </button>
                        ) : (
                          <button
                            onClick={submitQuiz}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Soumettre
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {currentQuestion < quiz.questions.length - 1 && (
                          <button
                            onClick={nextQuestion}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Suivant
                          </button>
                        )}
                        {currentQuestion === quiz.questions.length - 1 && (
                          <button
                            onClick={() => {
                              setQuiz(null)
                              setShowResults(false)
                              setCurrentQuestion(0)
                              setSelectedAnswers([])
                            }}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            Nouveau Quiz
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
