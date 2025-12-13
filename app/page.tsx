import { FileText, MessageSquare, BookOpen, Terminal } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            eduIA-CIEL
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plateforme éducative intelligente pour BTS CIEL
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Téléchargez vos documents, discutez avec l'IA, créez des quiz et passez des évaluations interactives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Link href="/documents" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <FileText className="w-16 h-16 text-blue-600 group-hover:text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Documents
              </h2>
              <p className="text-gray-600 text-center">
                Téléchargez et gérez vos documents de cours
              </p>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <MessageSquare className="w-16 h-16 text-green-600 group-hover:text-green-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Chat IA
              </h2>
              <p className="text-gray-600 text-center">
                Discutez avec l'IA sur vos documents
              </p>
            </div>
          </Link>

          <Link href="/quiz" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-16 h-16 text-purple-600 group-hover:text-purple-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Quiz
              </h2>
              <p className="text-gray-600 text-center">
                Générez des quiz à partir de vos documents
              </p>
            </div>
          </Link>

          <Link href="/evaluation" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Terminal className="w-16 h-16 text-orange-600 group-hover:text-orange-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Évaluation
              </h2>
              <p className="text-gray-600 text-center">
                Passez des évaluations interactives notées
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fonctionnalités</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Téléchargement et stockage sécurisé de documents (PDF, TXT, DOCX)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Chat intelligent avec IA (Ollama) basé sur vos documents</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Génération automatique de quiz à partir du contenu des cours</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Évaluations interactives avec terminal Linux et VSCode simulés</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Système de notation automatique pour les évaluations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
