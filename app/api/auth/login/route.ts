import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

const USERS_FILE = path.join(process.cwd(), 'users.json')

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

function hashPassword(password: string): string {
  // Use SHA-256 with a salt derived from the email
  // Note: For production, use bcrypt or similar
  const salt = process.env.PASSWORD_SALT || 'eduIA-CIEL-default-salt-2024'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const users = await loadUsers()
    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.password !== hashPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.validated) {
      return NextResponse.json(
        { error: 'Account pending validation. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    // Create session token
    const sessionToken = crypto.randomUUID()

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })

    // Set session cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
