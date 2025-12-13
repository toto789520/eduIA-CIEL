'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, FileText, Download } from 'lucide-react'
import axios from 'axios'

interface Document {
  id: string
  name: string
  size: number
  uploadDate: string
  content?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await axios.get('/api/documents')
      setDocuments(response.data)
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      await axios.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Documents téléchargés avec succès!')
      loadDocuments()
    } catch (error) {
      setMessage('Erreur lors du téléchargement')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await axios.delete(`/api/documents?id=${id}`)
      loadDocuments()
      setMessage('Document supprimé')
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Documents
          </h1>
          <p className="text-gray-600">
            Téléchargez vos documents de cours pour les utiliser avec l'IA
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Cliquez pour télécharger
              </span>
              <span className="text-gray-600"> ou glissez-déposez</span>
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Formats supportés: PDF, TXT, DOC, DOCX
            </p>
          </div>
          {uploading && (
            <div className="mt-4 text-center text-blue-600">
              Téléchargement en cours...
            </div>
          )}
          {message && (
            <div className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Documents Téléchargés ({documents.length})
          </h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucun document téléchargé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
