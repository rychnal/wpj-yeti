import type { Metadata } from 'next'
import './globals.css'
import Navbar from './ui/navbar'

export const metadata: Metadata = {
  title: 'Yetinder',
  description: 'Databáze Yetů z našich hor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="h-full">
      <body className="min-h-full flex flex-col bg-zinc-900 text-white">
        <Navbar />
        <main className="flex-1 py-8 px-4 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  )
}
