'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { FileText, Plus, Lock, Globe, Trash2, MessageSquare, Send } from 'lucide-react'

interface Doc {
  id: string
  title: string
  content: string
  category: string
  isPublic: boolean
  userId?: string
  createdAt: number
  updatedAt: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')
  const [showChatSidebar, setShowChatSidebar] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const categories = [
    'Réseaux',
    'Cybersécurité',
    'Programmation',
    'Systèmes Linux',
    'Électronique',
    'Général'
  ]

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Général',
    isPublic: true
  })

  useEffect(() => {
    loadDocs()
  }, [filter])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const loadDocs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/docs?filter=${filter}`)
      setDocs(response.data.docs)
    } catch (error) {
      console.error('Error loading docs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/docs', formData)
      setDocs([...docs, response.data.doc])
      setShowCreateModal(false)
      setFormData({ title: '', content: '', category: 'Général', isPublic: true })
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Supprimer ce document?')) return

    try {
      await axios.delete(`/api/docs?id=${id}`)
      setDocs(docs.filter(d => d.id !== id))
      if (selectedDoc?.id === id) setSelectedDoc(null)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression')
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedDoc) return

    const userMessage: ChatMessage = { role: 'user', content: chatInput }
    setChatMessages([...chatMessages, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        message: chatInput,
        context: `Document: ${selectedDoc.title}\n\n${selectedDoc.content}`
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Erreur lors de la communication avec l\'IA.' }
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className={`flex-1 p-8 ${showChatSidebar ? 'mr-96' : ''} transition-all`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Documentation</h1>
              <p className="text-gray-600">Documents publics et privés</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau Document</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                filter === 'public' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Public</span>
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                filter === 'private' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Privé</span>
            </button>
          </div>

          {/* Document Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : docs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucun document disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedDoc?.id === doc.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                  onClick={() => {
                    setSelectedDoc(doc)
                    setChatMessages([])
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {doc.isPublic ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-orange-600" />
                      )}
                      <span className="text-xs text-gray-500">{doc.category}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDoc(doc.id)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{doc.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Document Detail View */}
          {selectedDoc && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h2>
                  <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      {selectedDoc.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span>{selectedDoc.isPublic ? 'Public' : 'Privé'}</span>
                    </span>
                    <span>•</span>
                    <span>{selectedDoc.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatSidebar(!showChatSidebar)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{showChatSidebar ? 'Masquer Chat' : 'Afficher Chat'}</span>
                </button>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{selectedDoc.content}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChatSidebar && selectedDoc && (
        <div className="fixed right-0 top-0 w-96 h-screen bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chat IA sur ce document</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-8">
                Posez des questions sur ce document...
              </p>
            )}
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">L'IA réfléchit...</p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Posez une question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouveau Document</h2>
            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.isPublic}
                      onChange={() => setFormData({ ...formData, isPublic: true })}
                      className="mr-2"
                    />
                    <Globe className="w-4 h-4 mr-1" />
                    Public (classe)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.isPublic}
                      onChange={() => setFormData({ ...formData, isPublic: false })}
                      className="mr-2"
                    />
                    <Lock className="w-4 h-4 mr-1" />
                    Privé
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  required
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
