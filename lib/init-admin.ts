import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import crypto from 'crypto'

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

function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT || 'eduIA-CIEL-default-salt-2024'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
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
          return
        }
      } catch {
        // File exists but is invalid JSON, will be overwritten
        users = []
      }
    }

    // Create default admin account
    const defaultAdmin: User = {
      id: crypto.randomUUID(),
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
    console.log('   Password: admin123')
    console.log('   ⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Failed to initialize default admin:', error)
  }
}
