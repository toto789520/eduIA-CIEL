import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'documents.json')

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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

async function chatWithOllama(messages: Message[], context: string) {
  try {
    // Prepare the system message with document context
    const systemMessage = context 
      ? `Tu es un assistant éducatif pour des étudiants en BTS CIEL (Cybersécurité, Informatique et réseaux, Électronique). Voici le contenu des documents disponibles:\n\n${context}\n\nRéponds de manière professionnelle et pédagogique aux questions en te basant sur ces documents.`
      : `Tu es un assistant éducatif pour des étudiants en BTS CIEL (Cybersécurité, Informatique et réseaux, Électronique). Réponds de manière professionnelle et pédagogique aux questions.`

    // Try to connect to Ollama
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // Default model, can be changed
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error('Ollama not responding')
    }

    const data = await response.json()
    return data.message.content
  } catch (error) {
    console.error('Ollama error:', error)
    // Fallback response if Ollama is not available
    return "Je suis désolé, mais je ne peux pas me connecter au service Ollama. Assurez-vous qu'Ollama est installé et en cours d'exécution avec la commande: 'ollama serve'. Vous pouvez installer Ollama depuis https://ollama.ai"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Load documents to provide context
    const documents = await loadDocuments()
    let context = ''
    
    if (documents.length > 0) {
      context = documents
        .filter((doc: any) => doc.content)
        .map((doc: any) => `Document: ${doc.name}\n${doc.content}`)
        .join('\n\n---\n\n')
    }

    // Prepare message history
    const messageHistory: Message[] = history || []
    messageHistory.push({ role: 'user', content: message })

    // Get response from Ollama
    const response = await chatWithOllama(messageHistory, context)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
