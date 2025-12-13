import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const DB_FILE = path.join(process.cwd(), 'documents.json')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

interface Document {
  id: string
  name: string
  size: number
  uploadDate: string
  filename: string
  content?: string
}

async function loadDocuments(): Promise<Document[]> {
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

async function saveDocuments(documents: Document[]): Promise<void> {
  await writeFile(DB_FILE, JSON.stringify(documents, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const documents = await loadDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 })
  }
}

const ALLOWED_MIME_TYPES = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const documents = await loadDocuments()
    const newDocuments: Document[] = []

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File size exceeds limit' }, { status: 400 })
      }

      // Validate file extension
      const fileExt = path.extname(file.name).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Validate file content by checking magic numbers
      if (fileExt === '.pdf' && !buffer.slice(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46]))) {
        return NextResponse.json({ error: 'Invalid file content' }, { status: 400 })
      }
      
      const filename = crypto.randomUUID() + fileExt
      const filepath = path.join(UPLOAD_DIR, filename)
      
      await writeFile(filepath, buffer)

      // Extract text content for simple files
      let content = ''
      if (file.name.endsWith('.txt')) {
        content = buffer.toString('utf-8')
      }

      const doc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        filename: filename,
        content: content
      }

      newDocuments.push(doc)
    }

    documents.push(...newDocuments)
    await saveDocuments(documents)

    return NextResponse.json({ success: true, documents: newDocuments })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    const documents = await loadDocuments()
    const docIndex = documents.findIndex(d => d.id === id)

    if (docIndex === -1) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 404 })
    }

    const doc = documents[docIndex]
    
    // Validate filename to prevent path traversal
    if (
      typeof doc.filename !== 'string' ||
      doc.filename !== path.basename(doc.filename) ||
      doc.filename.includes('/') ||
      doc.filename.includes('\\')
    ) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    const filepath = path.join(UPLOAD_DIR, doc.filename)

    try {
      if (existsSync(filepath)) {
        await unlink(filepath)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    documents.splice(docIndex, 1)
    await saveDocuments(documents)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
