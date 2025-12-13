'use client'

import { useState, useEffect, useRef } from 'react'
import { Terminal, Play, RotateCcw, CheckCircle } from 'lucide-react'
import axios from 'axios'

interface Exercise {
  id: string
  title: string
  description: string
  type: 'terminal' | 'code'
  task: string
  validation: string
  points: number
}

interface EvaluationSession {
  exercises: Exercise[]
  currentExercise: number
  score: number
  completed: boolean
  timeLimit?: number // in seconds
  startTime?: number // timestamp
}

export default function EvaluationPage() {
  const [session, setSession] = useState<EvaluationSession | null>(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [codeInput, setCodeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  // Timer effect
  useEffect(() => {
    if (session && session.timeLimit && session.startTime && !session.completed) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - session.startTime!) / 1000)
        const remaining = session.timeLimit! - elapsed
        
        if (remaining <= 0) {
          setTimeRemaining(0)
          // Auto-complete evaluation when time runs out
          setSession({
            ...session,
            completed: true
          })
          clearInterval(interval)
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [session])

  const startEvaluation = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/evaluation/start')
      const sessionData = {
        ...response.data,
        startTime: Date.now()
      }
      setSession(sessionData)
      if (sessionData.timeLimit) {
        setTimeRemaining(sessionData.timeLimit)
      }
      setTerminalOutput(['Bienvenue dans l\'évaluation interactive BTS CIEL!', ''])
    } catch (error) {
      console.error('Error starting evaluation:', error)
      alert('Erreur lors du démarrage de l\'évaluation')
    } finally {
      setLoading(false)
    }
  }

  const executeCommand = async (command: string) => {
    if (!command.trim()) return

    setTerminalOutput(prev => [...prev, `$ ${command}`, ''])
    setTerminalInput('')

    try {
      const response = await axios.post('/api/evaluation/execute', {
        command,
        exerciseId: session?.exercises[session.currentExercise].id
      })

      setTerminalOutput(prev => [...prev, response.data.output, ''])

      if (response.data.correct) {
        setFeedback('✓ Correct! Passez à l\'exercice suivant.')
        setTimeout(() => nextExercise(), 2000)
      } else if (response.data.hint) {
        setFeedback(`Indice: ${response.data.hint}`)
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, 'Erreur lors de l\'exécution', ''])
    }
  }

  const submitCode = async () => {
    if (!codeInput.trim()) return

    setLoading(true)
    setFeedback('')

    try {
      const response = await axios.post('/api/evaluation/submit', {
        code: codeInput,
        exerciseId: session?.exercises[session.currentExercise].id
      })

      if (response.data.correct) {
        setFeedback('✓ Code correct! Passez à l\'exercice suivant.')
        setTimeout(() => nextExercise(), 2000)
      } else {
        setFeedback(`✗ ${response.data.message}`)
      }
    } catch (error) {
      setFeedback('Erreur lors de la soumission')
    } finally {
      setLoading(false)
    }
  }

  const nextExercise = () => {
    if (!session) return

    if (session.currentExercise < session.exercises.length - 1) {
      setSession({
        ...session,
        currentExercise: session.currentExercise + 1,
        score: session.score + session.exercises[session.currentExercise].points
      })
      setFeedback('')
      setCodeInput('')
      setTerminalOutput([])
    } else {
      setSession({
        ...session,
        completed: true,
        score: session.score + session.exercises[session.currentExercise].points
      })
    }
  }

  const currentExercise = session?.exercises[session.currentExercise]

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Évaluation Interactive
            </h1>
            <p className="text-gray-600">
              Passez des évaluations notées avec terminal Linux et code
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Terminal className="w-20 h-20 text-orange-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Prêt à commencer l'évaluation?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Cette évaluation contient plusieurs exercices pratiques incluant des commandes Linux,
              du code à compléter, et des configurations système. Vous serez noté automatiquement.
            </p>
            <button
              onClick={startEvaluation}
              disabled={loading}
              className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 transition-colors flex items-center space-x-3 mx-auto text-lg font-medium"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-6 h-6 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>Commencer l'Évaluation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (session.completed) {
    const totalPoints = session.exercises.reduce((sum, ex) => sum + ex.points, 0)
    const percentage = Math.round((session.score / totalPoints) * 100)

    // Submit score to leaderboard if user is logged in
    const submitScore = async () => {
      try {
        // Determine category based on exercise types
        const hasTerminal = session.exercises.some(ex => ex.type === 'terminal')
        const hasCode = session.exercises.some(ex => ex.type === 'code')
        const category = hasTerminal && hasCode ? 'Général' : hasTerminal ? 'Systèmes Linux' : 'Programmation'
        
        await axios.post('/api/leaderboard', {
          category,
          score: session.score
        })
      } catch (error) {
        console.error('Failed to submit score:', error)
      }
    }

    // Submit score once when evaluation completes
    if (session.score > 0) {
      submitScore()
    }

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Évaluation Terminée!
            </h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {percentage}%
            </div>
            <p className="text-xl text-gray-700 mb-8">
              Score: {session.score}/{totalPoints} points
            </p>
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setSession(null)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Nouvelle Évaluation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Exercice {session.currentExercise + 1}/{session.exercises.length}
            </h1>
            <p className="text-gray-600">
              Score: {session.score} points
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {timeRemaining !== null && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Temps restant</div>
                <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </div>
            )}
            <div className="text-right">
              <div className="text-sm text-gray-600">Points</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentExercise?.points}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((session.currentExercise + 1) / session.exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentExercise?.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {currentExercise?.description}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Tâche:</h3>
              <p className="text-blue-800 whitespace-pre-wrap">
                {currentExercise?.task}
              </p>
            </div>
            {feedback && (
              <div className={`mt-4 p-4 rounded-lg ${
                feedback.startsWith('✓') 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : feedback.startsWith('✗')
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              }`}>
                {feedback}
              </div>
            )}
          </div>

          {/* Interactive Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {currentExercise?.type === 'terminal' ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  Terminal Linux
                </h3>
                <div
                  ref={terminalRef}
                  className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto mb-4"
                >
                  {terminalOutput.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  <div className="flex items-center">
                    <span className="text-blue-400">user@ciel:~$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          executeCommand(terminalInput)
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none ml-2 text-green-400"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Éditeur de Code
                </h3>
                <textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Écrivez votre code ici..."
                />
                <button
                  onClick={submitCode}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Soumettre le Code</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
