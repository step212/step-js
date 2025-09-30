'use client'

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { StepV1Target } from "@/lib/step-go-generate"
import { useTranslations } from 'next-intl'
import { useParams } from "next/navigation"
import { getStepGoApiInstance } from "@/lib/apiGenerate"

export default function Accumulate() {
  const params = useParams()
  const locale = params.locale as string

  const { data: session } = useSession()
  const [targets, setTargets] = useState<StepV1Target[]>([])
  const t = useTranslations()

  const fetchTargets = useCallback(async () => {
    try {
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceGetTargets("0")
      const data = response.data
      if (data.targets) {
        setTargets(data.targets)
      }
    } catch (error) {
      console.error('Error fetching targets:', error)
    }
  }, [session?.accessToken])

  const completeTarget = async (targetId: string) => {
    try {
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceDoneTarget(targetId, {id: targetId})
      const data = response.data
      if (data) {
        await fetchTargets()
      } else {
        console.error('Failed to complete target:', data)
      }
    } catch (error) {
      console.error('Error completing target:', error)
    }
  }

  useEffect(() => {
    if (session) {
      fetchTargets()
    }
  }, [session, fetchTargets])

  if (!session) {
    return <div>{t('Please login')}</div>
  }

  return (
    <main className="p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('Targets')}</h1>
          <Link
            href={`/${locale}/accumulate/new-target?returnUrl=${encodeURIComponent(`/${locale}/accumulate`)}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('Add Target')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Title')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Description')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Type')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Status')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Created At')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Started At')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Challenge At')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Completed At')}</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {targets.map((target) => (
                <tr 
                  key={target.id} 
                  className={`hover:bg-gray-50 ${
                    target.status === 'done' 
                      ? 'bg-gray-100 text-gray-500 opacity-70' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{target.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.createdAt ? new Date(Number(target.createdAt) * 1000).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.startAt ? new Date(Number(target.startAt) * 1000).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.challengeAt ? new Date(Number(target.challengeAt) * 1000).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.doneAt ? new Date(Number(target.doneAt) * 1000).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <Link
                        href={`/${locale}/accumulate/target/${target.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {t('View Details')}
                      </Link>
                      <Link
                        href={`/${locale}/accumulate/target/${target.id}/edit`}
                        className="text-green-500 hover:text-green-700"
                      >
                        {t('Edit')}
                      </Link>
                      {target.status !== 'done' && (
                        <button
                          onClick={() => target.id && completeTarget(target.id.toString())}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          {t('Complete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
} 