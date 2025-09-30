'use client'

import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, Button } from 'antd'
import { TrophyOutlined, StarOutlined } from '@ant-design/icons'

export default function FeedbackPage() {
  const t = useTranslations('FeedbackPage')
  const tCommon = useTranslations('')
  const { data: session } = useSession()
  const router = useRouter()

  // Navigate to modules
  const handleNavigateToAward = () => {
    router.push('/feedback/award')
  }

  const handleNavigateToShow = () => {
    router.push('/feedback/show')
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('modules.title')}</h1>
          <p className="text-gray-600">{t('modules.subtitle')}</p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Award Module */}
          <Card
            hoverable
            className="text-center border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
            bodyStyle={{ padding: '32px' }}
            onClick={handleNavigateToAward}
          >
            <div className="mb-4">
              <TrophyOutlined className="text-6xl text-blue-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('modules.award.title')}</h2>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {t('modules.award.description')}
              </p>
            </div>
            <Button 
              type="primary" 
              size="large"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                handleNavigateToAward()
              }}
            >
              {t('modules.award.button')}
            </Button>
          </Card>

          {/* Show Module */}
          <Card
            hoverable
            className="text-center border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
            bodyStyle={{ padding: '32px' }}
            onClick={handleNavigateToShow}
          >
            <div className="mb-4">
              <StarOutlined className="text-6xl text-purple-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('modules.show.title')}</h2>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {t('modules.show.description')}
              </p>
            </div>
            <Button 
              size="large"
              className="w-full"
              disabled
              onClick={(e) => {
                e.stopPropagation()
                handleNavigateToShow()
              }}
            >
              {t('modules.show.button')}
            </Button>
          </Card>
        </div>

        {/* Quick Stats or Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('modules.footer')}
          </p>
        </div>
      </div>
    </div>
  )
}