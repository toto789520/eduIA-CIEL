'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  category: string
  totalScore: number
  lastActivity: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const categories = [
    'Tous',
    'Réseaux',
    'Cybersécurité',
    'Programmation',
    'Systèmes Linux',
    'Électronique',
    'Autre'
  ]

  useEffect(() => {
    loadLeaderboard()
  }, [selectedCategory])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const url = selectedCategory && selectedCategory !== 'Tous'
        ? `/api/leaderboard?category=${encodeURIComponent(selectedCategory)}`
        : '/api/leaderboard'
      
      const response = await axios.get(url)
      setLeaderboard(response.data.leaderboard)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="w-6 text-center font-bold text-gray-600">{rank}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Classement
          </h1>
          <p className="text-gray-600">
            Comparez vos performances avec les autres étudiants
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Tous' ? '' : cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  (cat === 'Tous' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Chargement du classement...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Aucun classement disponible pour cette catégorie
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rang
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Score Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1
                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        rank <= 3 ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {entry.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {entry.category}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {entry.totalScore} pts
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Comment améliorer votre classement?
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Complétez les évaluations pour gagner des points</li>
            <li>• Participez régulièrement pour maintenir votre position</li>
            <li>• Explorez différentes catégories pour diversifier vos compétences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
