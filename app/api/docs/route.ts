import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const DOCS_FILE = path.join(process.cwd(), 'docs.json')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

interface Doc {
  id: string
  title: string
  content: string
  category: string
  isPublic: boolean // true = class-wide, false = user-private
  userId?: string // owner if private
  createdAt: number
  updatedAt: number
}

async function loadDocs(): Promise<Doc[]> {
  try {
    if (!existsSync(DOCS_FILE)) {
      return []
    }
    const data = await readFile(DOCS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveDocs(docs: Doc[]): Promise<void> {
  await writeFile(DOCS_FILE, JSON.stringify(docs, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'public', 'private', 'all'

    let docs = await loadDocs()

    // Filter based on access rights
    if (filter === 'public') {
      docs = docs.filter(d => d.isPublic)
    } else if (filter === 'private') {
      if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }
      docs = docs.filter(d => !d.isPublic && d.userId === userId)
    } else {
      // 'all' - show public + user's private docs
      if (userId) {
        docs = docs.filter(d => d.isPublic || d.userId === userId)
      } else {
        docs = docs.filter(d => d.isPublic)
      }
    }

    return NextResponse.json({ docs })
  } catch (error) {
    console.error('Error loading docs:', error)
    return NextResponse.json({ error: 'Failed to load docs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    const { title, content, category, isPublic } = await request.json()

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Authentication required for all document creation
    if (!userId) {
      return NextResponse.json(
        { error: 'Must be logged in to create documents' },
        { status: 401 }
      )
    }

    const docs = await loadDocs()

    const newDoc: Doc = {
      id: crypto.randomUUID(),
      title,
      content,
      category,
      isPublic: isPublic === true,
      userId: userId, // Always store creator
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    docs.push(newDoc)
    await saveDocs(docs)

    return NextResponse.json({ doc: newDoc })
  } catch (error) {
    console.error('Error creating doc:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    const { id, title, content, category } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!id || !title || !content || !category) {
      return NextResponse.json(
        { error: 'ID, title, content, and category are required' },
        { status: 400 }
      )
    }

    const docs = await loadDocs()
    const docIndex = docs.findIndex(d => d.id === id)

    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const doc = docs[docIndex]

    // Check permissions - must be owner
    if (doc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    docs[docIndex] = {
      ...doc,
      title,
      content,
      category,
      updatedAt: Date.now()
    }

    await saveDocs(docs)

    return NextResponse.json({ doc: docs[docIndex] })
  } catch (error) {
    console.error('Error updating doc:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const docs = await loadDocs()
    const docIndex = docs.findIndex(d => d.id === id)

    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const doc = docs[docIndex]

    // Check permissions - must be owner
    if (doc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    docs.splice(docIndex, 1)
    await saveDocs(docs)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting doc:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
