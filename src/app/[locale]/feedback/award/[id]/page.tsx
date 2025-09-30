'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Card, Button, Descriptions, Tag, Modal, message, Image, Spin, Alert, Upload } from 'antd'
import { DeleteOutlined, ArrowLeftOutlined, FileImageOutlined, PlayCircleOutlined, SoundOutlined, FileOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { getFeedbackApiInstance } from '@/lib/apiGenerate'
import { StepV1FeedbackAward } from '@/lib/step-go-generate/api'

export default function AwardDetailPage() {
  const t = useTranslations('FeedbackPage')
  const tCommon = useTranslations('')
  const tPortrait = useTranslations('PortraitPage')
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  
  const [award, setAward] = useState<StepV1FeedbackAward | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [realizeModalVisible, setRealizeModalVisible] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [realizing, setRealizing] = useState(false)

  // Load award details
  const loadAward = async () => {
    if (!session?.accessToken || !params.id) return
    
    setLoading(true)
    try {
      const api = getFeedbackApiInstance(session.accessToken)
      const response = await api.feedbackServiceGetFeedbackAward(params.id as string)
      setAward(response.data.award || null)
    } catch (error) {
      console.error('Failed to load award:', error)
      message.error('Failed to load award details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAward()
  }, [params.id, session?.accessToken])

  // Handle delete award
  const handleDelete = async () => {
    if (!award?.id || !session?.accessToken) return
    
    try {
      const api = getFeedbackApiInstance(session.accessToken)
      await api.feedbackServiceDeleteFeedbackAward(award.id)
      message.success(t('deleteSuccess'))
      router.push('/feedback/award')
    } catch (error) {
      console.error('Failed to delete award:', error)
      message.error(tCommon('Delete failed'))
    }
  }

  // Handle back to list
  const handleBack = () => {
    router.push('/feedback/award')
  }

  // Handle realize award
  const handleRealizeAward = () => {
    if (award?.status === 'achieved') {
      setRealizeModalVisible(true)
    } else {
      message.warning(t('awardNotAchieved'))
    }
  }

  // Handle realize submit
  const handleRealizeSubmit = async () => {
    if (!award?.id || !session?.accessToken) return
    if (uploadedFiles.length === 0) {
      message.error(t('pleaseSelectFiles'))
      return
    }

    setRealizing(true)
    try {
      const formData = new FormData()
      formData.append('id', award.id)
      
      uploadedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/step-go?action=feedback_realizeAward', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to realize award')
      }

      message.success(t('realizeSuccess'))
      setRealizeModalVisible(false)
      setUploadedFiles([])
      loadAward() // Reload award details
    } catch (error) {
      console.error('Failed to realize award:', error)
      message.error(t('realizeFailed'))
    } finally {
      setRealizing(false)
    }
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

  // Helper function to determine file type from URL
  const getFileType = (url: string): 'image' | 'video' | 'audio' | 'document' => {
    // Remove query parameters first, then extract extension
    const urlWithoutParams = url.split('?')[0]
    const extension = urlWithoutParams.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
      return 'image'
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      return 'video'
    } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension || '')) {
      return 'audio'
    } else {
      return 'document'
    }
  }

  // Render file icon
  const renderFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <FileImageOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
      case 'video':
        return <PlayCircleOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
      case 'audio':
        return <SoundOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
      default:
        return <FileOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
    }
  }

  // Render file preview
  const renderFilePreview = (url: string, index: number) => {
    const fileType = getFileType(url)
    
    // Extract filename from URL, handle query parameters and decode Chinese characters
    const urlParts = url.split('?')[0].split('/')
    const rawFileName = urlParts[urlParts.length - 1] || `file-${index + 1}`
    
    // Decode URL-encoded filename (handles Chinese characters)
    let fileName = rawFileName
    try {
      fileName = decodeURIComponent(rawFileName)
    } catch {
      console.warn('Failed to decode filename:', rawFileName)
      fileName = rawFileName
    }

    return (
      <div key={`${url}-${index}`} className="border rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          {renderFileIcon(fileType)}
          <div className="flex-1 min-w-0">
            <span 
              className="text-sm font-medium block truncate" 
              title={fileName}
              style={{ maxWidth: '100%' }}
            >
              {fileName}
            </span>
          </div>
        </div>
        
        {fileType === 'image' && (
          <div className="mt-3">
            <Image
              src={url}
              alt={fileName}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                borderRadius: '4px'
              }}
              preview={{
                mask: <div className="flex items-center justify-center">{tCommon('Preview')}</div>,
              }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FuSZ4QFVdkSPJFaHNIsqEXUFqPD3i1XqvIVd39es8sQ=="
            />
          </div>
        )}
        
        {fileType === 'video' && (
          <div className="mt-3">
            <video
              src={url}
              controls
              style={{ width: '100%', maxHeight: '200px' }}
              preload="metadata"
            />
          </div>
        )}
        
        {fileType === 'audio' && (
          <div className="mt-3">
            <audio 
              src={url}
              controls 
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    )
  }

  // Format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    try {
      // Handle unix timestamp (seconds) - convert to milliseconds
      const timestamp = parseInt(dateString)
      if (!isNaN(timestamp)) {
        // If timestamp is in seconds (< year 3000), convert to milliseconds
        const date = timestamp < 4000000000 ? new Date(timestamp * 1000) : new Date(timestamp)
        return date.toLocaleString()
      }
      // Fallback to direct date parsing
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  // Translate target type
  const translateTargetType = (targetType: string | undefined): string => {
    if (!targetType) return '-'
    switch (targetType) {
      case 'portrait':
        return t('targetTypePortrait')
      case 'target':
        return t('targetTypeTarget')
      default:
        return targetType
    }
  }

  // Translate scope
  const translateScope = (scope: string | undefined, targetType: string | undefined): string => {
    if (!scope) return '-'
    
    if (targetType === 'portrait') {
      switch (scope) {
        case 'basic':
          return tPortrait('dimension.basic')
        case 'self_discipline':
          return tPortrait('dimension.self_discipline')
        case 'target_and_execution':
          return tPortrait('dimension.target_and_execution')
        case 'learning_and_growth':
          return tPortrait('dimension.learning_and_growth')
        default:
          return scope
      }
    }
    return scope
  }

  // Translate dimension
  const translateDimension = (dimension: string | undefined): string => {
    if (!dimension) return '-'
    
    // Try portrait metrics first
    const portraitKey = `metrics.${dimension}`
    const portraitTranslation = tPortrait(portraitKey)
    if (portraitTranslation && portraitTranslation !== portraitKey) {
      return portraitTranslation
    }
    
    // Fallback to common translation
    return tCommon(dimension.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '))
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-600">{tCommon('Please login')}</h1>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (!award) {
    return (
      <div className="container mx-auto p-6">
        <Alert
          message="Award Not Found"
          description="The requested award could not be found."
          type="error"
          showIcon
          action={
            <Button onClick={handleBack}>
              {t('backToList')}
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="mr-2"
            >
              {tCommon('Back')}
            </Button>
            <h1 className="text-2xl font-bold">{t('awardDetails')}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleRealizeAward}
              disabled={award.status !== 'achieved'}
            >
              {t('realizeAward')}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteModalVisible(true)}
            >
              {tCommon('Delete')}
            </Button>
          </div>
        </div>

        {/* Award Details */}
        <Descriptions
          title={t('basicInformation')}
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          size="middle"
          labelStyle={{ fontWeight: 'bold', width: '160px' }}
        >
          <Descriptions.Item label={tCommon('Status')} span={2}>
            {renderStatusTag(award.status)}
          </Descriptions.Item>
          
          <Descriptions.Item label={tCommon('Description')} span={2}>
            {award.description || '-'}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('targetType')}>
            {translateTargetType(award.targetType)}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('scope')}>
            {translateScope(award.scope, award.targetType)}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('dimension')}>
            {translateDimension(award.dimension)}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('threshold')}>
            {award.threshold || '-'}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('settedAt')}>
            {formatDate(award.settedAt)}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('achievedAt')}>
            {formatDate(award.achievedAt)}
          </Descriptions.Item>
          
          <Descriptions.Item label={t('realizedAt')} span={2}>
            {formatDate(award.realizedAt)}
          </Descriptions.Item>
        </Descriptions>

        {/* Setted Files */}
        {award.settedFiles && award.settedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">{t('settedFiles')}</h3>
            <div className="grid gap-4">
              {award.settedFiles.map((url, index) => renderFilePreview(url, index))}
            </div>
          </div>
        )}

        {/* Realized Files */}
        {award.realizedFiles && award.realizedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">{t('realizedFiles')}</h3>
            <div className="grid gap-4">
              {award.realizedFiles.map((url, index) => renderFilePreview(url, index))}
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title={tCommon('Confirm Delete')}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText={tCommon('Delete')}
        cancelText={tCommon('Cancel')}
        okType="danger"
        centered
        width="90%"
        style={{ maxWidth: '400px', top: 20 }}
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <div className="space-y-3">
          <p>{t('deleteConfirm')}</p>
          <div className="p-3 bg-gray-50 rounded border">
            <p className="text-sm text-gray-600 break-words">
              {award.description}
            </p>
          </div>
        </div>
      </Modal>

      {/* Realize Award Modal */}
      <Modal
        title={t('realizeAward')}
        open={realizeModalVisible}
        onOk={handleRealizeSubmit}
        onCancel={() => {
          setRealizeModalVisible(false)
          setUploadedFiles([])
        }}
        okText={t('realizeAward')}
        cancelText={tCommon('Cancel')}
        confirmLoading={realizing}
        width="90%"
        style={{ maxWidth: '500px', top: 20 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        centered
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">
              {t('uploadRealizedFiles')}
            </p>
            <div className="text-xs text-gray-500 mb-3">
              {award.description && (
                <div className="p-2 bg-gray-50 rounded text-sm">
                  <strong>{tCommon('Description')}:</strong> {award.description}
                </div>
              )}
            </div>
          </div>
          
          <Upload.Dragger
            multiple
            beforeUpload={(file) => {
              // Check file size (10MB limit)
              const isLt10M = file.size / 1024 / 1024 < 10
              if (!isLt10M) {
                message.error(t('fileSizeError'))
                return false
              }
              
              setUploadedFiles(prev => [...prev, file])
              return false // Prevent auto upload
            }}
            onRemove={(file) => {
              setUploadedFiles(prev => prev.filter(f => f.name + f.size !== file.uid))
            }}
            fileList={uploadedFiles.map(file => ({
              uid: file.name + file.size,
              name: file.name,
              status: 'done' as const,
              size: file.size,
              type: file.type
            }))}
            className="mobile-upload-dragger"
            style={{ minHeight: '120px' }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-sm">{t('selectFiles')}</p>
            <p className="ant-upload-hint text-xs">
              {t('uploadHint')} {t('maxFileSize')}
            </p>
          </Upload.Dragger>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-700 font-medium mb-2">
                {t('selectedFiles')}: {uploadedFiles.length}
              </p>
              <div className="space-y-1">
                {uploadedFiles.slice(0, 3).map((file, idx) => (
                  <div key={idx} className="text-xs text-blue-600 truncate">
                    📎 {file.name}
                  </div>
                ))}
                {uploadedFiles.length > 3 && (
                  <div className="text-xs text-blue-500">
                    ... {tCommon('And')} {uploadedFiles.length - 3} {tCommon('more files')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
