import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'users.json')
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

interface User {
  id: string
  email: string
  password: string
  name: string
  category: string
  validated: boolean
  createdAt: number
  scores: {
    category: string
    score: number
    date: number
  }[]
}

async function isAdmin(userId: string): Promise<boolean> {
  if (ADMIN_EMAILS.length === 0) {
    // If no admin emails configured, allow first validated user to be admin
    return false
  }
  
  const users = await loadUsers()
  const user = users.find(u => u.id === userId)
  return user ? ADMIN_EMAILS.includes(user.email) : false
}

async function loadUsers(): Promise<User[]> {
  try {
    if (!existsSync(USERS_FILE)) {
      return []
    }
    const data = await readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveUsers(users: User[]) {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminUserId = request.cookies.get('userId')?.value
    
    if (!adminUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const adminCheck = await isAdmin(adminUserId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const users = await loadUsers()
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate user
    users[userIndex].validated = true
    await saveUsers(users)

    // Send validation email
    try {
      const baseUrl = process.env.SERVER_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'account_validation',
          userName: users[userIndex].name,
          userEmail: users[userIndex].email
        })
      })
    } catch (error) {
      console.error('Failed to send validation email:', error)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'User validated successfully',
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        validated: true
      }
    })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate user' },
      { status: 500 }
    )
  }
}

// GET endpoint to list pending validations
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminUserId = request.cookies.get('userId')?.value
    
    if (!adminUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const adminCheck = await isAdmin(adminUserId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }

    const users = await loadUsers()
    const pendingUsers = users
      .filter(u => !u.validated)
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        category: u.category,
        createdAt: u.createdAt
      }))

    return NextResponse.json({ pendingUsers })
  } catch (error) {
    console.error('Error fetching pending users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending users' },
      { status: 500 }
    )
  }
}
