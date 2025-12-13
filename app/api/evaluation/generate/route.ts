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

async function generateEvaluationWithOllama(codeContent: string) {
  try {
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434'
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama2'

    // Validate Ollama URL to prevent SSRF
    try {
      const url = new URL(ollamaUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch (error) {
      console.error('Invalid OLLAMA_API_URL:', ollamaUrl)
      throw new Error('Invalid Ollama API URL configuration')
    }

    const prompt = `Analyse ce code et génère 3-5 exercices d'évaluation pratiques basés sur ce code. Format JSON exact:

{
  "exercises": [
    {
      "id": "auto-1",
      "title": "Titre de l'exercice",
      "description": "Description courte",
      "type": "terminal" ou "code",
      "task": "Tâche détaillée à accomplir",
      "validation": "critère de validation ou pattern regex",
      "points": 10-20
    }
  ],
  "timeLimit": 1800
}

Code à analyser:
${codeContent}

Génère UNIQUEMENT le JSON, sans texte avant ou après. Les exercices doivent tester la compréhension du code, la capacité à le modifier, à déboguer, ou à écrire du code similaire.`

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
    let evaluationData = data.response

    try {
      return JSON.parse(evaluationData)
    } catch (e) {
      throw new Error('Failed to parse evaluation data')
    }
  } catch (error) {
    console.error('Ollama evaluation generation error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { documentIds } = await request.json()

    if (!documentIds || documentIds.length === 0) {
      return NextResponse.json(
        { error: 'No documents specified' },
        { status: 400 }
      )
    }

    const documents = await loadDocuments()
    
    // Filter documents that contain code
    const codeDocuments = documents.filter((doc: any) => 
      documentIds.includes(doc.id) && 
      doc.content &&
      (doc.name.endsWith('.py') || 
       doc.name.endsWith('.js') || 
       doc.name.endsWith('.java') ||
       doc.name.endsWith('.c') ||
       doc.name.endsWith('.cpp') ||
       doc.name.endsWith('.sh') ||
       doc.content.includes('function') ||
       doc.content.includes('def ') ||
       doc.content.includes('class '))
    )

    if (codeDocuments.length === 0) {
      return NextResponse.json(
        { error: 'No code documents found. Please select files containing code.' },
        { status: 400 }
      )
    }

    // Prepare code context
    const codeContent = codeDocuments
      .map((doc: any) => `// File: ${doc.name}\n${doc.content}`)
      .join('\n\n')
      .substring(0, 6000) // Limit context size

    const evaluation = await generateEvaluationWithOllama(codeContent)

    return NextResponse.json({
      exercises: evaluation.exercises || [],
      currentExercise: 0,
      score: 0,
      completed: false,
      timeLimit: evaluation.timeLimit || 1800,
      startTime: Date.now()
    })
  } catch (error) {
    console.error('Evaluation generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI evaluation. Please try again or use standard evaluation.' },
      { status: 500 }
    )
  }
}
