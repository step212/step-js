'use client'

import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { getStepGoApiInstance } from "@/lib/apiGenerate"

function NewTargetContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string

  const [parentId, setParentId] = useState<number>(0)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'default', // default type
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get parentId and returnUrl from URL parameters
    const parentIdFromUrl = searchParams.get('parentId')
    const returnUrlFromParams = searchParams.get('returnUrl')
    
    setParentId(parentIdFromUrl ? parseInt(parentIdFromUrl) : 0)
    setReturnUrl(returnUrlFromParams)
  }, [searchParams])

  if (!session) {
    return <div>{t('Please login')}</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceCreateTarget({
        ...formData,
        parentId: parentId.toString(),
      })

      if (response.status === 200) {
        const result = response.data
        // If returnUrl is provided, use it; otherwise navigate to the new target's page
        if (returnUrl) {
          router.push(returnUrl)
        } else {
          router.push(`/${locale}/accumulate/target/${result.id}`)
        }
      } else {
        console.error('Failed to create target')
      }
    } catch (error) {
      console.error('Error creating target:', error)
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
        <h1 className="text-2xl font-bold mb-6">{t('Create New Target')}</h1>
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
              {isSubmitting ? t('creating_state') : t('Create')}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function NewTarget() {
  const t = useTranslations()
  return (
    <Suspense fallback={<div>{t('loading_state')}</div>}>
      <NewTargetContent />
    </Suspense>
  )
} 