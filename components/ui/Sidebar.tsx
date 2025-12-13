'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, MessageSquare, BookOpen, Terminal } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/chat', label: 'Chat IA', icon: MessageSquare },
    { href: '/quiz', label: 'Quiz', icon: BookOpen },
    { href: '/evaluation', label: 'Évaluation', icon: Terminal },
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

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>Powered by Ollama</p>
          <p className="mt-1">© 2024 eduIA-CIEL</p>
        </div>
      </div>
    </aside>
  )
}
