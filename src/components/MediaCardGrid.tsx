import { Row, Modal, Card, Button, Space, Checkbox, Input, App } from 'antd'
import { PlayCircleOutlined, FolderAddOutlined, InfoCircleOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons'
import { StepV1Step } from '@/lib/step-go-generate'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Ratings } from '@/lib/comment'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getStepGoApiInstance } from '@/lib/apiGenerate'
import { useSession } from 'next-auth/react'

interface MediaCardGridProps {
  steps: StepV1Step[]
  onDelete?: (step: StepV1Step) => Promise<void>
  isShared?: boolean
}

const renderCardActions = (step: StepV1Step, showDetail: boolean, onDelete?: (step: StepV1Step) => void, onShowDetail?: (step: StepV1Step) => void, onShare?: (step: StepV1Step) => void, isShared?: boolean) => (
  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, gap: 4 }} className="card-action-group">
    {showDetail && (
      <Button
        key="detail"
        type="text"
        icon={<InfoCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
        onClick={() => onShowDetail?.(step)}
        style={{ padding: '4px 8px', height: 'auto', fontSize: '12px', background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      />
    )}
    {!isShared && onDelete && (
      <Button
        key="delete"
        type="text"
        danger
        icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
        onClick={() => onDelete(step)}
        style={{ padding: '4px 8px', height: 'auto', fontSize: '12px', background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      />
    )}
    {!isShared && onShare && (
      <Button
        key="share"
        type="text"
        icon={<ShareAltOutlined style={{ fontSize: '14px', color: '#1890ff' }} />}
        onClick={() => onShare(step)}
        style={{ padding: '4px 8px', height: 'auto', fontSize: '12px', background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      />
    )}
  </div>
)

const MediaCard = ({ step, onDelete, onShowDetail, onShare, isShared }: { step: StepV1Step, onDelete?: (step: StepV1Step) => void, onShowDetail?: (step: StepV1Step) => void, onShare?: (step: StepV1Step) => void, isShared?: boolean }) => {
  const router = useRouter()
  const params = useParams()
  const cardTitle = step.title || step.objectName

  const handleCardClick = () => {
    if (step.type === 'dir') {
      const locale = params.locale
      const targetId = params.targetId
      if (typeof locale === 'string' && typeof targetId === 'string') {
        router.push(`/${locale}/accumulate/target/${targetId}/dir/${step.id}?title=${encodeURIComponent(step.title || '')}`)
      }
    }
  }

  switch (step.type) {
    case 'image':
      return (
        <Card
          key={step.id}
          hoverable
          style={{ position: 'relative', width: '100%', border: '1px solid #f0f0f0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '200px', background: '#fff', transition: 'box-shadow 0.3s', padding: 0 }}
          className="media-card"
        >
          <div style={{ position: 'relative', width: '100%' }}>
            {step.presignedUrl && (
              <Image
                src={step.presignedUrl}
                alt={cardTitle || 'Image'}
                width={350}
                height={160}
                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
              />
            )}
            {renderCardActions(step, true, onDelete, onShowDetail, onShare, isShared)}
          </div>
          <div style={{ background: '#f5f5f5', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: '15px', lineHeight: 1.2, width: '100%' }}>{cardTitle}</div>
        </Card>
      )
    case 'video':
      return (
        <Card
          key={step.id}
          hoverable
          style={{ position: 'relative', width: '100%', border: '1px solid #f0f0f0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '200px', background: '#fff', transition: 'box-shadow 0.3s', padding: 0 }}
          className="media-card"
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <video
              src={step.presignedUrl}
              style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
              controls
            />
            {renderCardActions(step, true, onDelete, onShowDetail, onShare, isShared)}
          </div>
          <div style={{ background: '#f5f5f5', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: '15px', lineHeight: 1.2, width: '100%' }}>{cardTitle}</div>
        </Card>
      )
    case 'audio':
      return (
        <Card
          key={step.id}
          hoverable
          style={{ position: 'relative', width: '100%', border: '1px solid #f0f0f0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '200px', background: '#fff', transition: 'box-shadow 0.3s', padding: 0 }}
          className="media-card"
        >
          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
            <Space>
              <PlayCircleOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <audio src={step.presignedUrl} controls style={{ verticalAlign: 'middle' }} />
            </Space>
            {renderCardActions(step, true, onDelete, onShowDetail, onShare, isShared)}
          </div>
          <div style={{ background: '#f5f5f5', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: '15px', lineHeight: 1.2, width: '100%' }}>{cardTitle}</div>
        </Card>
      )
    case 'dir':
      return (
        <Card 
          key={step.id} 
          hoverable
          onClick={handleCardClick}
          style={{ position: 'relative', width: '100%', border: '1px solid #f0f0f0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '200px', background: '#fff', transition: 'box-shadow 0.3s', padding: 0 }}
          className="media-card"
        >
          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
            <FolderAddOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            {renderCardActions(step, false, onDelete, onShowDetail, onShare, isShared)}
          </div>
          <div style={{ background: '#f5f5f5', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: '15px', lineHeight: 1.2, width: '100%' }}>{step.title}</div>
        </Card>
      )
    default:
      return null
  }
}

export const MediaCardGrid = ({ steps, onDelete, isShared = false }: MediaCardGridProps) => {
  const { message } = App.useApp();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [stepToDelete, setStepToDelete] = useState<StepV1Step | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailStep, setDetailStep] = useState<StepV1Step | null>(null)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [stepToShare, setStepToShare] = useState<StepV1Step | null>(null)
  const [shareTargets, setShareTargets] = useState<{ parent: boolean; teacher: boolean; friend: boolean }>({
    parent: false,
    teacher: false,
    friend: false
  })
  const [shareLink, setShareLink] = useState('')
  const t = useTranslations()
  const params = useParams()
  const { data: session } = useSession()

  const showDeleteConfirm = (step: StepV1Step) => {
    setStepToDelete(step)
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (!stepToDelete || !onDelete) return
    try {
      await onDelete(stepToDelete)
      message.success(t('Delete successful'))
    } catch (err) {
      message.error(t('Delete failed') + ': ' + err)
    } finally {
      setDeleteModalVisible(false)
      setStepToDelete(null)
    }
  }

  const showDetailModal = (step: StepV1Step) => {
    setDetailStep(step)
    setDetailModalVisible(true)
  }

  const showShareModal = (step: StepV1Step) => {
    setStepToShare(step)
    setShareModalVisible(true)
    setShareTargets({ parent: false, teacher: false, friend: false })
    setShareLink('')
  }

  const generateShareLink = async () => {
    if (!stepToShare) return

    const selectedTargets = Object.entries(shareTargets)
      .filter(([, selected]) => selected)
      .map(([target]) => target)
      .join(',')

    if (selectedTargets.length === 0) {
      message.warning(t('Please select at least one share target'))
      return
    }

    try {
      const body = {
        id: stepToShare.id,
        data: selectedTargets
      }
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceEncrypt(stepToShare.id as string, body)
      if (response.status !== 200) {
        throw new Error('Encryption failed')
      }

      const { data } = response.data
      const locale = params.locale
      const shareUrl = `${window.location.origin}/${locale}/accumulate/share/${stepToShare.id}?shareTo=${encodeURIComponent(data || '')}`

      setShareLink(shareUrl)
    } catch (error) {
      console.error('Failed to generate share link:', error)
      message.error(t('Failed to generate share link'))
    }
  }

  const handleShareTargetChange = (target: 'parent' | 'teacher' | 'friend', checked: boolean) => {
    setShareTargets(prev => ({ ...prev, [target]: checked }))
    setShareLink('') // Reset share link when targets change
  }

  const renderParsedComment = (raw: string) => {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version === 'v1.0' && parsed.data) {
        const data = parsed.data as Ratings
        const target = data.target || {}
        const quality = data.quality || {}
        const weightedValue = data.weighted_value
        const text: string = data.comment || ''

        return (
          <div style={{ marginTop: 8 }}>
            <div>
              <b>{t('Weighted Value')}:</b> {typeof weightedValue === 'number' ? weightedValue : '-'}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{t('Target')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><b>{t('Target Clarity')}:</b> {target.target_clarity ?? '-'}</div>
              <div><b>{t('Target Achievement')}:</b> {target.target_achievement ?? '-'}</div>
              <div><b>{t('Target Reasonableness')}:</b> {target.target_reasonableness ?? '-'}</div>
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{t('Quality')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><b>{t('Difficulty')}:</b> {quality.difficulty ?? '-'}</div>
              <div><b>{t('Innovation')}:</b> {quality.innovation ?? '-'}</div>
              <div><b>{t('Basic Reliability')}:</b> {quality.basic_reliability ?? '-'}</div>
              <div><b>{t('Skill Improvement')}:</b> {quality.skill_improvement ?? '-'}</div>
              <div><b>{t('Reflection Improvement')}:</b> {quality.reflection_improvement ?? '-'}</div>
            </div>
            {text && (
              <div style={{ marginTop: 8 }}>
                <b>{t('Comment')}:</b> {text}
              </div>
            )}
          </div>
        )
      }

      if (parsed && parsed.version === undefined && typeof parsed.data === 'string') {
        return parsed.data
      }

      return raw
    } catch {
      return raw
    }
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {steps.map(step => (
          <MediaCard
            key={step.id}
            step={step}
            onDelete={showDeleteConfirm}
            onShowDetail={showDetailModal}
            onShare={showShareModal}
            isShared={isShared}
          />
        ))}
      </Row>

      <Modal
        title={t('Confirm Delete')}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false)
          setStepToDelete(null)
        }}
        okText={t('Delete')}
        cancelText={t('Cancel')}
        okButtonProps={{ danger: true }}
      >
        <p>{t('Are you sure you want to delete this item?')}</p>
      </Modal>

      <Modal
        title={t('Details')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {detailStep && (
          <div>
            <div style={{ marginBottom: 16, fontWeight: 500 }}>{detailStep.title || detailStep.objectName}</div>
            {detailStep.type === 'image' && detailStep.presignedUrl && (
              <Image 
                src={detailStep.presignedUrl} 
                alt={detailStep.title || 'Image'} 
                width={800}
                height={600}
                style={{ maxWidth: '100%' }} 
              />
            )}
            {detailStep.type === 'video' && (
              <video src={detailStep.presignedUrl} controls style={{ width: '100%' }} />
            )}
            {detailStep.type === 'audio' && (
              <audio src={detailStep.presignedUrl} controls style={{ width: '100%' }} />
            )}
            <div style={{ marginTop: 16 }}>
              <div><b>{t('Description')}:</b> {detailStep.description}</div>
              {detailStep.teacherComment && detailStep.teacherComment !== '' && detailStep.teacherComment !== null && (
                <div style={{ marginTop: 12 }}>
                  <b style={{ fontSize: '16px' }}>{t('Teacher Comment')}:</b>
                  {renderParsedComment(detailStep.teacherComment)}
                </div>
              )}
              {detailStep.parentComment && detailStep.parentComment !== '' && detailStep.parentComment !== null && (
                <div style={{ marginTop: 12 }}>
                  <b style={{ fontSize: '16px' }}>{t('Parent Comment')}:</b>
                  {renderParsedComment(detailStep.parentComment)}
                </div>
              )}
              {detailStep.friendComment && detailStep.friendComment !== '' && detailStep.friendComment !== null && (
                <div style={{ marginTop: 12 }}>
                  <b style={{ fontSize: '16px' }}>{t('Friend Comment')}:</b>
                  {renderParsedComment(detailStep.friendComment)}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={t('Share')}
        open={shareModalVisible}
        onCancel={() => {
          setShareModalVisible(false)
          setStepToShare(null)
          setShareTargets({ parent: false, teacher: false, friend: false })
          setShareLink('')
        }}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>{t('Share with:')}</div>
          <Space direction="vertical">
            <Checkbox
              checked={shareTargets.parent}
              onChange={(e) => handleShareTargetChange('parent', e.target.checked)}
            >
              {t('Parent')}
            </Checkbox>
            <Checkbox
              checked={shareTargets.teacher}
              onChange={(e) => handleShareTargetChange('teacher', e.target.checked)}
            >
              {t('Teacher')}
            </Checkbox>
            <Checkbox
              checked={shareTargets.friend}
              onChange={(e) => handleShareTargetChange('friend', e.target.checked)}
            >
              {t('Friend')}
            </Checkbox>
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={generateShareLink}>
            {t('Generate Share Link')}
          </Button>
        </div>

        {shareLink && (
          <div>
            <div style={{ marginBottom: 8 }}>{t('Share Link:')}</div>
            <Space.Compact style={{ width: '100%' }}>
              <CopyToClipboard 
                text={shareLink}
                onCopy={([, success]) => success ? message.success(t('Link copied to clipboard')) : message.error(t('Failed to copy link'))}
              >
                <Button type="primary" style={{ height: '96px' }}>
                  {t('Copy')}
                </Button>
              </CopyToClipboard>
              <Input.TextArea
                value={shareLink}
                readOnly
                autoSize={false}
                style={{ 
                  cursor: 'default',
                  height: '96px',
                  resize: 'none',
                  overflow: 'hidden',
                  lineHeight: '24px',
                }}
              />
            </Space.Compact>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .ant-card-body {
          padding: 0 !important;
        }
        .media-card .card-action-group {
          display: none;
        }
        .media-card:hover .card-action-group,
        .media-card:active .card-action-group {
          display: flex !important;
        }
      `}</style>
    </>
  )
} 