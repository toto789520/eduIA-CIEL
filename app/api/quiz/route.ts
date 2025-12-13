import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'documents.json')

async function loadDocuments() {
  try {
    if (!existsSync(DB_FILE)) {
      return []
    }
    const data = await readFile(DB_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function generateQuizWithOllama(context: string) {
  try {
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434'
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama2'

    const prompt = `À partir du contenu suivant, génère un quiz de 5 questions à choix multiples pour tester les connaissances. Format JSON exact:

{
  "title": "Quiz sur [sujet]",
  "questions": [
    {
      "question": "Question claire et précise?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication de la réponse correcte"
    }
  ]
}

Contenu:
${context}

Génère UNIQUEMENT le JSON, sans texte avant ou après.`

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    })

    if (!response.ok) {
      throw new Error('Ollama not responding')
    }

    const data = await response.json()
    let quizData = data.response

    // Try to parse the JSON response
    try {
      return JSON.parse(quizData)
    } catch (e) {
      // If parsing fails, return a fallback quiz
      throw new Error('Failed to parse quiz data')
    }
  } catch (error) {
    console.error('Ollama quiz generation error:', error)
    // Return a fallback quiz if Ollama fails
    return generateFallbackQuiz()
  }
}

function generateFallbackQuiz() {
  return {
    title: "Quiz BTS CIEL - Général",
    questions: [
      {
        question: "Qu'est-ce que le BTS CIEL?",
        options: [
          "Cybersécurité, Informatique et réseaux, Électronique",
          "Commerce International et Économie Locale",
          "Construction Infrastructure et Équipement Lourd",
          "Cuisine Internationale et Événementiel"
        ],
        correctAnswer: 0,
        explanation: "BTS CIEL signifie Cybersécurité, Informatique et réseaux, Électronique."
      },
      {
        question: "Quel protocole est utilisé pour l'accès sécurisé à distance sur Linux?",
        options: [
          "FTP",
          "SSH",
          "HTTP",
          "SMTP"
        ],
        correctAnswer: 1,
        explanation: "SSH (Secure Shell) est le protocole standard pour l'accès sécurisé à distance."
      },
      {
        question: "Quelle commande Linux permet de lister les fichiers?",
        options: [
          "dir",
          "list",
          "ls",
          "show"
        ],
        correctAnswer: 2,
        explanation: "La commande 'ls' (list) est utilisée pour lister les fichiers et répertoires."
      },
      {
        question: "Quel est le port par défaut du protocole HTTP?",
        options: [
          "21",
          "22",
          "80",
          "443"
        ],
        correctAnswer: 2,
        explanation: "Le port 80 est le port par défaut pour le protocole HTTP."
      },
      {
        question: "Que signifie l'acronyme RAM?",
        options: [
          "Read Access Memory",
          "Random Access Memory",
          "Rapid Action Module",
          "Remote Access Method"
        ],
        correctAnswer: 1,
        explanation: "RAM signifie Random Access Memory (Mémoire à Accès Aléatoire)."
      }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const documents = await loadDocuments()
    
    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents available. Please upload documents first.' },
        { status: 400 }
      )
    }

    // Prepare context from documents
    let context = documents
      .filter((doc: any) => doc.content)
      .map((doc: any) => doc.content)
      .join('\n\n')
      .substring(0, 4000) // Limit context size

    // If no text content, use fallback
    if (!context.trim()) {
      context = "BTS CIEL: Cybersécurité, Informatique et réseaux, Électronique. Formation technique en systèmes informatiques, réseaux, et électronique."
    }

    const quiz = await generateQuizWithOllama(context)

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Quiz generation error:', error)
    // Return fallback quiz on error
    return NextResponse.json(generateFallbackQuiz())
  }
}
