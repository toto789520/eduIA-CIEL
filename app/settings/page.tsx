'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Settings as SettingsIcon, Bell, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface UpdateInfo {
  currentVersion: string
  updateAvailable: boolean
  latestVersion: string | null
  releaseNotes: string | null
  releaseUrl: string | null
  lastCommit: {
    sha: string
    message: string
    author: string
    date: string
    url: string
  } | null
}

export default function SettingsPage() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [emailPreferences, setEmailPreferences] = useState({
    accountValidation: true,
    rankingChanges: true
  })

  useEffect(() => {
    checkForUpdates()
  }, [])

  const checkForUpdates = async () => {
    setCheckingUpdate(true)
    try {
      const response = await axios.get('/api/update')
      setUpdateInfo(response.data)
    } catch (error) {
      console.error('Error checking updates:', error)
    } finally {
      setCheckingUpdate(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <SettingsIcon className="w-10 h-10 mr-3" />
            Paramètres
          </h1>
          <p className="text-gray-600">
            Gérez vos préférences et les mises à jour du système
          </p>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-6 h-6 mr-2" />
            Notifications Email
          </h2>
          <p className="text-gray-600 mb-6">
            Configurez les emails que vous souhaitez recevoir
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Validation de compte</h3>
                <p className="text-sm text-gray-600">
                  Recevoir un email lorsque votre compte est validé
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.accountValidation}
                  onChange={(e) => setEmailPreferences({
                    ...emailPreferences,
                    accountValidation: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Changements de classement</h3>
                <p className="text-sm text-gray-600">
                  Recevoir un email lorsque votre position change dans le classement
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.rankingChanges}
                  onChange={(e) => setEmailPreferences({
                    ...emailPreferences,
                    rankingChanges: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Les emails sont envoyés à l'adresse associée à votre compte.
              Pour configurer le serveur SMTP, définissez les variables d'environnement:
              SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, SERVER_DOMAIN
            </p>
          </div>
        </div>

        {/* System Updates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-6 h-6 mr-2" />
            Mises à Jour Système
          </h2>
          <p className="text-gray-600 mb-6">
            Vérifiez les mises à jour disponibles depuis GitHub
          </p>

          {updateInfo ? (
            <div className="space-y-4">
              {/* Current Version */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Version actuelle</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      v{updateInfo.currentVersion}
                    </p>
                  </div>
                  <button
                    onClick={checkForUpdates}
                    disabled={checkingUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center space-x-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${checkingUpdate ? 'animate-spin' : ''}`} />
                    <span>Vérifier</span>
                  </button>
                </div>
              </div>

              {/* Update Status */}
              {updateInfo.updateAvailable ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">
                        Mise à jour disponible!
                      </h3>
                      <p className="text-green-800 mb-3">
                        Version <strong>v{updateInfo.latestVersion}</strong> est disponible
                      </p>
                      {updateInfo.releaseNotes && (
                        <div className="mb-3">
                          <h4 className="font-medium text-green-900 mb-1">Notes de version:</h4>
                          <div className="text-sm text-green-800 bg-white p-3 rounded border border-green-200 whitespace-pre-wrap">
                            {updateInfo.releaseNotes}
                          </div>
                        </div>
                      )}
                      {updateInfo.releaseUrl && (
                        <a
                          href={updateInfo.releaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Voir sur GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Vous êtes à jour!
                      </h3>
                      <p className="text-blue-800">
                        La version actuelle est la dernière version disponible
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Commit */}
              {updateInfo.lastCommit && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Dernier commit</h3>
                  <div className="text-sm text-gray-700">
                    <p className="mb-1">
                      <strong>SHA:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{updateInfo.lastCommit.sha}</code>
                    </p>
                    <p className="mb-1">
                      <strong>Message:</strong> {updateInfo.lastCommit.message}
                    </p>
                    <p className="mb-1">
                      <strong>Auteur:</strong> {updateInfo.lastCommit.author}
                    </p>
                    <p className="mb-2">
                      <strong>Date:</strong> {new Date(updateInfo.lastCommit.date).toLocaleString('fr-FR')}
                    </p>
                    <a
                      href={updateInfo.lastCommit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir sur GitHub →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {checkingUpdate ? 'Vérification des mises à jour...' : 'Cliquez pour vérifier les mises à jour'}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Les mises à jour doivent être appliquées manuellement par un administrateur.
              Le système vérifie automatiquement les nouvelles versions depuis le dépôt GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
