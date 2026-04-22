'use client'

import { useActionState, useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CLIENT_API } from '../lib/api'

export default function AddPage() {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [error, formAction, isPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      const body = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        height_cm: Number(formData.get('height_cm')),
        weight_kg: Number(formData.get('weight_kg')),
        location: formData.get('location'),
        description: formData.get('description') || null,
      }

      try {
        const res = await fetch(`${CLIENT_API}/yeti`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const err = await res.json()
          return err.error ?? 'Chyba při ukládání.'
        }
        const yeti = await res.json()

        const photoFile = formData.get('photo') as File | null
        if (photoFile && photoFile.size > 0) {
          const photoFd = new FormData()
          photoFd.append('photo', photoFile)
          await fetch(`${CLIENT_API}/yeti/${yeti.id}/photo`, {
            method: 'POST',
            body: photoFd,
          })
        }

        router.push('/')
        return null
      } catch (e) {
        return (e as Error).message
      }
    },
    null,
  )

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Zaregistrovat nového Yetiho</h1>

      <form action={formAction} className="bg-zinc-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Jméno *</label>
            <input name="name" required className="input" placeholder="Bohumil Sněžný" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Pohlaví *</label>
            <select name="gender" required className="input">
              <option value="">Vyberte pohlaví ▾</option>
              <option value="male">Muž</option>
              <option value="female">Žena</option>
              <option value="unknown">Neznámé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Výška (cm) *</label>
            <input
              name="height_cm"
              type="number"
              required
              min="50"
              max="500"
              className="input"
              placeholder="243"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Váha (kg) *</label>
            <input
              name="weight_kg"
              type="number"
              required
              min="10"
              max="1000"
              className="input"
              placeholder="180"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Bydliště / lokalita *</label>
          <input name="location" required className="input" placeholder="Krkonoše, Sněžka" />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Popis (nepovinné)</label>
          <textarea
            name="description"
            rows={3}
            className="input resize-none"
            placeholder="Přátelský jedinec, poprvé spatřen..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Fotografie (nepovinné)</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Náhled"
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-600 shrink-0"
              />
            )}
            <label className="flex-1 cursor-pointer">
              <div className="input flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                <span>📷</span>
                <span className="truncate text-sm">
                  {fileRef.current?.files?.[0]?.name ?? 'Vybrat soubor...'}
                </span>
              </div>
              <input
                ref={fileRef}
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isPending ? 'Ukládám...' : 'Přidat Yetiho'}
        </button>
      </form>
    </div>
  )
}
