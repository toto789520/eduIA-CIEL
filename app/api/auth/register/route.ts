import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { initializeDefaultAdmin } from '@/lib/init-admin'
import { hashPassword } from '@/lib/password'

const USERS_FILE = path.join(process.cwd(), 'users.json')

interface User {
  id: string
  email: string
  password: string // hashed
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
      // Initialize default admin on first run
      initializeDefaultAdmin()
      // Verify the file was created
      if (!existsSync(USERS_FILE)) {
        console.error('Failed to initialize users file')
        return []
      }
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
    const { email, password, name, category } = await request.json()

    if (!email || !password || !name || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const users = await loadUsers()

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password: hashPassword(password),
      name,
      category,
      validated: false, // Will be validated by admin
      createdAt: Date.now(),
      scores: []
    }

    users.push(newUser)
    await saveUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Registration successful. Your account is pending validation.'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
