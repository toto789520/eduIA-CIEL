import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

const SESSIONS_FILE = path.join(process.cwd(), 'evaluation-sessions.json')

interface EvaluationSession {
  id: string
  userId: string
  exercises: Exercise[]
  currentExercise: number
  score: number
  completed: boolean
  timeLimit: number
  startTime: number
}

interface Exercise {
  id: string
  title: string
  description: string
  type: 'terminal' | 'code'
  task: string
  validation: string
  points: number
}

async function loadSessions(): Promise<EvaluationSession[]> {
  try {
    if (!existsSync(SESSIONS_FILE)) {
      return []
    }
    const data = await readFile(SESSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveSessions(sessions: EvaluationSession[]) {
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

const exercises: Exercise[] = [
  {
    id: 'linux-1',
    title: 'Commandes Linux de Base',
    description: 'Testez vos connaissances des commandes Linux essentielles.',
    type: 'terminal',
    task: 'Listez tous les fichiers (y compris les fichiers cachés) dans le répertoire courant avec les détails.',
    validation: 'ls -la',
    points: 10
  },
  {
    id: 'linux-2',
    title: 'Gestion des Fichiers',
    description: 'Créez et gérez des fichiers et répertoires.',
    type: 'terminal',
    task: 'Créez un répertoire nommé "projet" et naviguez dedans.',
    validation: 'mkdir projet && cd projet',
    points: 10
  },
  {
    id: 'linux-3',
    title: 'Permissions Linux',
    description: 'Gérez les permissions de fichiers.',
    type: 'terminal',
    task: 'Changez les permissions d\'un fichier pour qu\'il soit exécutable par tous.',
    validation: 'chmod +x',
    points: 15
  },
  {
    id: 'code-1',
    title: 'Script Bash Simple',
    description: 'Écrivez un script Bash basique.',
    type: 'code',
    task: 'Écrivez un script qui affiche "Hello BTS CIEL" et la date actuelle.\nUtilisez echo et date.',
    validation: 'echo.*date',
    points: 15
  },
  {
    id: 'code-2',
    title: 'Fonction Python',
    description: 'Créez une fonction Python simple.',
    type: 'code',
    task: 'Écrivez une fonction Python nommée "calculate_average" qui prend une liste de nombres et retourne leur moyenne.',
    validation: 'def calculate_average',
    points: 20
  }
]

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const sessionId = crypto.randomUUID()
    const serverStartTime = Date.now()
    
    const session: EvaluationSession = {
      id: sessionId,
      userId,
      exercises: exercises,
      currentExercise: 0,
      score: 0,
      completed: false,
      timeLimit: 1800, // 30 minutes in seconds
      startTime: serverStartTime
    }

    // Save session to server
    const sessions = await loadSessions()
    sessions.push(session)
    await saveSessions(sessions)

    return NextResponse.json({
      id: sessionId,
      exercises: exercises,
      currentExercise: 0,
      score: 0,
      completed: false,
      timeLimit: 1800,
      startTime: serverStartTime
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start evaluation' },
      { status: 500 }
    )
  }
}
