'use client'

import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { StepV1Target } from '@/lib/step-go-generate'

export default function EditTarget() {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const targetId = params.targetId as string

  const [formData, setFormData] = useState<Partial<StepV1Target>>({
    title: '',
    description: '',
    type: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const response = await fetch(`/api/step-go?action=step_getTarget&id=${targetId}`)
        const data = await response.json()
        if (data.target) {
          const { title, description, type } = data.target
          setFormData({ title, description, type })
        }
      } catch (error) {
        console.error('Error fetching target:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchTarget()
    }
  }, [session, targetId])

  if (!session) {
    return <div>{t('Please login')}</div>
  }

  if (isLoading) {
    return <div>{t('loading_state')}</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/step-go?action=step_updateTarget&id=${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: targetId,
          ...formData,
        }),
      })

      if (response.ok) {
        router.push(`/${locale}/accumulate`)
      } else {
        console.error('Failed to update target')
      }
    } catch (error) {
      console.error('Error updating target:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <main className="p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">{t('Edit Target')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Title')}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Description')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Type')}
            </label>
            <input
              type="text"
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? t('updating_state') : t('Update')}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 