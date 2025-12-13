'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, MessageSquare, BookOpen, Terminal, Trophy, User, LogOut, Book, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface UserInfo {
  id: string
  name: string
  email: string
  category: string
  validated: boolean
}

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const response = await axios.get('/api/auth/session')
      setUser(response.data.user)
    } catch (error) {
      // User not logged in
      setUser(null)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.delete('/api/auth/session')
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/docs', label: 'Documentation', icon: Book },
    { href: '/chat', label: 'Chat IA', icon: MessageSquare },
    { href: '/quiz', label: 'Quiz', icon: BookOpen },
    { href: '/evaluation', label: 'Évaluation', icon: Terminal },
    { href: '/leaderboard', label: 'Classement', icon: Trophy },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">eduIA-CIEL</h1>
        <p className="text-sm text-gray-400 mt-1">BTS CIEL Platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {user ? (
        <div className="p-4 border-t border-gray-800">
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="text-xs text-gray-500">{user.category}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/login"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <User className="w-4 h-4" />
            <span>Se connecter</span>
          </Link>
          <Link
            href="/register"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 mt-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            <span>S'inscrire</span>
          </Link>
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>Powered by Ollama</p>
          <p className="mt-1">© 2024 eduIA-CIEL</p>
        </div>
      </div>
    </aside>
  )
}
