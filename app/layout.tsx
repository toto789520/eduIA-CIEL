import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/ui/Sidebar'

export const metadata: Metadata = {
  title: 'eduIA-CIEL - Plateforme Éducative IA',
  description: 'Plateforme éducative avec IA pour BTS CIEL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
