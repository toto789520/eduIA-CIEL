import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const users = await loadUsers()
    const user = users.find(u => u.id === userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  
  response.cookies.delete('userId')
  
  return response
}
