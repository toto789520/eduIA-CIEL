import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
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

async function saveUsers(users: User[]) {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const users = await loadUsers()
    const validatedUsers = users.filter(u => u.validated)

    // Calculate total scores per category for each user
    const leaderboard = validatedUsers.map(user => {
      const categoryScores = user.scores
        .filter(s => !category || s.category === category)
        .reduce((sum, s) => sum + s.score, 0)

      return {
        id: user.id,
        name: user.name,
        category: user.category,
        totalScore: categoryScores,
        lastActivity: user.scores.length > 0 
          ? Math.max(...user.scores.map(s => s.date))
          : user.createdAt
      }
    })

    // Sort by total score descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore)

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value
    const { category, score } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!category || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Category and score are required' },
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

    // Get previous rank
    const previousRank = users
      .filter(u => u.validated)
      .map(u => ({
        id: u.id,
        totalScore: u.scores.filter(s => s.category === category).reduce((sum, s) => sum + s.score, 0)
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .findIndex(u => u.id === userId) + 1

    // Add score
    users[userIndex].scores.push({
      category,
      score,
      date: Date.now()
    })

    await saveUsers(users)

    // Calculate new rank
    const newRank = users
      .filter(u => u.validated)
      .map(u => ({
        id: u.id,
        totalScore: u.scores.filter(s => s.category === category).reduce((sum, s) => sum + s.score, 0)
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .findIndex(u => u.id === userId) + 1

    const totalScore = users[userIndex].scores
      .filter(s => s.category === category)
      .reduce((sum, s) => sum + s.score, 0)

    // Send email notification if rank changed
    if (previousRank !== newRank && previousRank > 0) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ranking_change',
            userName: users[userIndex].name,
            userEmail: users[userIndex].email,
            category,
            oldRank: previousRank,
            newRank,
            totalScore
          })
        })
      } catch (error) {
        console.error('Failed to send email notification:', error)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: 'Score added successfully',
      previousRank,
      newRank,
      rankChanged: previousRank !== newRank
    })
  } catch (error) {
    console.error('Score submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    )
  }
}
