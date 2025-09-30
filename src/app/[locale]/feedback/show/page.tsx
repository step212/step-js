'use client'

import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from 'antd'
import { ArrowLeftOutlined, ToolOutlined } from '@ant-design/icons'

export default function ShowPage() {
  const t = useTranslations('FeedbackPage')
  const tCommon = useTranslations('')
  const { data: session } = useSession()
  const router = useRouter()

  // Handle back to feedback home
  const handleBack = () => {
    router.push('/feedback')
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-600">{tCommon('Please login')}</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            {tCommon('Back')}
          </Button>
          <h1 className="text-2xl font-bold">{t('modules.show.title')}</h1>
        </div>

        {/* Coming Soon Content */}
        <div className="text-center py-16">
          <ToolOutlined className="text-8xl text-purple-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('show.title')}</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {t('show.subtitle')}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">{t('show.features.title')}</h3>
            <ul className="text-left text-purple-700 space-y-2">
              <li>• {t('show.features.achievement_wall')}</li>
              <li>• {t('show.features.social_sharing')}</li>
              <li>• {t('show.features.personal_stats')}</li>
              <li>• {t('show.features.team_leaderboard')}</li>
              <li>• {t('show.features.badge_system')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
