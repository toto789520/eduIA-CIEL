import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { hashPassword } from './password'

const USERS_FILE = join(process.cwd(), 'users.json')

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

export function initializeDefaultAdmin(): void {
  try {
    // Check if users.json exists and has content
    let users: User[] = []
    
    if (existsSync(USERS_FILE)) {
      const data = readFileSync(USERS_FILE, 'utf-8')
      try {
        users = JSON.parse(data)
        if (users.length > 0) {
          // Users already exist, no need to initialize
          // Note: This only runs on first startup when no users exist
          return
        }
      } catch {
        // File exists but is invalid JSON, will be overwritten
        users = []
      }
    }

    // Create default admin account
    // Note: Using a simple default password for easy initial setup
    // Admin must change this password after first login
    const defaultAdmin: User = {
      id: randomUUID(),
      email: 'admin@eduia-ciel.local',
      password: hashPassword('admin123'),
      name: 'Administrateur',
      category: 'Administration',
      validated: true,
      createdAt: Date.now(),
      scores: []
    }

    users.push(defaultAdmin)
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    
    console.log('✅ Default admin account created')
    console.log('   Email: admin@eduia-ciel.local')
    if (process.env.NODE_ENV !== 'production') {
      console.log('   Password: admin123')
    }
    console.log('   ⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Failed to initialize default admin:', error)
  }
}
