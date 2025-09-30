'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, Button, Pagination, Tag, Modal, message, Select, Space } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { getFeedbackApiInstance } from '@/lib/apiGenerate'
import { StepV1FeedbackAward } from '@/lib/step-go-generate/api'

const { Option } = Select

export default function AwardPage() {
  const t = useTranslations('FeedbackPage')
  const tCommon = useTranslations('')
  const { data: session } = useSession()
  const router = useRouter()
  
  const [awards, setAwards] = useState<StepV1FeedbackAward[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedAward, setSelectedAward] = useState<StepV1FeedbackAward | null>(null)

  // Load awards data
  const loadAwards = async () => {
    if (!session?.accessToken) return
    
    setLoading(true)
    try {
      const api = getFeedbackApiInstance(session.accessToken)
      const response = await api.feedbackServiceGetFeedbackAwards(
        currentPage,
        pageSize,
        statusFilter || undefined
      )
      setAwards(response.data.awards || [])
      setTotal(parseInt(response.data.total || '0'))
    } catch (error) {
      console.error('Failed to load awards:', error)
      message.error('Failed to load awards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAwards()
  }, [currentPage, pageSize, statusFilter, session?.accessToken])

  // Handle delete award
  const handleDelete = async () => {
    if (!selectedAward?.id || !session?.accessToken) return
    
    try {
      const api = getFeedbackApiInstance(session.accessToken)
      await api.feedbackServiceDeleteFeedbackAward(selectedAward.id)
      message.success(t('deleteSuccess'))
      setDeleteModalVisible(false)
      setSelectedAward(null)
      loadAwards()
    } catch (error) {
      console.error('Failed to delete award:', error)
      message.error(tCommon('Delete failed'))
    }
  }

  // Handle back to feedback home
  const handleBack = () => {
    router.push('/feedback')
  }

  // Handle view details
  const handleViewDetails = (award: StepV1FeedbackAward) => {
    if (award.id) {
      router.push(`/feedback/award/${award.id}`)
    }
  }

  // Handle create award
  const handleCreateAward = () => {
    router.push('/feedback/award/create')
  }


  // Render status tag
  const renderStatusTag = (status: string | undefined) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'setted': { color: 'blue', text: t('filters.setted') },
      'achieved': { color: 'orange', text: t('filters.achieved') },
      'realized': { color: 'green', text: t('filters.realized') }
    }
    
    const statusInfo = statusMap[status || ''] || { color: 'default', text: status || '' }
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  }

  // Render award card (mobile-friendly)
  const renderAwardCard = (award: StepV1FeedbackAward) => {
    const getStatusStyle = (status: string | undefined) => {
      switch (status) {
        case 'setted':
          return 'border-blue-200 bg-blue-50'
        case 'achieved':
          return 'border-orange-200 bg-orange-50 shadow-lg ring-2 ring-orange-200'
        case 'realized':
          return 'border-gray-200 bg-gray-50 opacity-60'
        default:
          return 'border-gray-200 bg-white'
      }
    }

    const getContentStyle = (status: string | undefined) => {
      switch (status) {
        case 'achieved':
          return 'text-orange-900'
        case 'realized':
          return 'text-gray-500'
        default:
          return 'text-gray-900'
      }
    }

    return (
      <Card
        key={award.id}
        className={`mb-4 ${getStatusStyle(award.status)}`}
        hoverable={award.status !== 'realized'}
        bodyStyle={{ padding: '16px' }}
      >
        <div className={getContentStyle(award.status)}>
          {/* Header with status and actions */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              {renderStatusTag(award.status)}
            </div>
            <div className="flex space-x-1">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(award)}
                title={tCommon('View Details')}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedAward(award)
                  setDeleteModalVisible(true)
                }}
                title={tCommon('Delete')}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">{tCommon('Description')}</p>
            <p className="text-sm line-clamp-2">{award.description || '-'}</p>
          </div>

          {/* Time information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="font-medium">{t('settedAt')}: </span>
              <span>{formatDate(award.settedAt) || '-'}</span>
            </div>
            <div>
              <span className="font-medium">{t('achievedAt')}: </span>
              <span>{formatDate(award.achievedAt) || '-'}</span>
            </div>
            <div>
              <span className="font-medium">{t('realizedAt')}: </span>
              <span>{formatDate(award.realizedAt) || '-'}</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Format date helper
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    try {
      // Handle unix timestamp (seconds) - convert to milliseconds
      const timestamp = parseInt(dateString)
      if (!isNaN(timestamp)) {
        // If timestamp is in seconds (< year 3000), convert to milliseconds
        const date = timestamp < 4000000000 ? new Date(timestamp * 1000) : new Date(timestamp)
        return date.toLocaleDateString()
      }
      // Fallback to direct date parsing
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              {tCommon('Back')}
            </Button>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateAward}
          >
            {t('createAward')}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <Space>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="">{t('filters.all')}</Option>
              <Option value="setted">{t('filters.setted')}</Option>
              <Option value="achieved">{t('filters.achieved')}</Option>
              <Option value="realized">{t('filters.realized')}</Option>
            </Select>
          </Space>
        </div>

        {/* Awards List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">{tCommon('loading_state')}</p>
            </div>
          </div>
        ) : awards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t('noAwards')}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {awards.map(award => renderAwardCard(award))}
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              onChange={(page, size) => {
                setCurrentPage(page)
                setPageSize(size)
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={tCommon('Confirm Delete')}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false)
          setSelectedAward(null)
        }}
        okText={tCommon('Delete')}
        cancelText={tCommon('Cancel')}
        okType="danger"
      >
        <p>{t('deleteConfirm')}</p>
        {selectedAward && (
          <p className="text-gray-600">
            {selectedAward.description}
          </p>
        )}
      </Modal>
    </div>
  )
}
