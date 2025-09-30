'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { message, Typography, Button, Space, InputNumber, Input } from 'antd'
import { StepV1Step, StepV1GetNoauthStepReply, StepV1SetCommentForStepRequest, StepV1DecryptRequest } from '@/lib/step-go-generate'
import { MediaCardGrid } from '@/components/MediaCardGrid'
import { useTranslations } from 'next-intl'
import { getStepGoNoauthApiInstance } from '@/lib/apiGenerate'
import { Ratings } from '@/lib/comment'

const { Title } = Typography

export default function ShareStep() {
  const params = useParams()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [step, setStep] = useState<StepV1Step | null>(null)
  const [childSteps, setChildSteps] = useState<StepV1Step[]>([])
  const [loading, setLoading] = useState(true)
  const [targetTitle, setTargetTitle] = useState('')
  const [targetDescription, setTargetDescription] = useState('')
  const [shareTargets, setShareTargets] = useState<{ parent: boolean; teacher: boolean; friend: boolean }>({
    parent: false,
    teacher: false,
    friend: false
  })

  const [commentType, setCommentType] = useState<'parent' | 'teacher' | 'friend' | null>(null)
  const [ratings, setRatings] = useState<Ratings>({
    version: 'v1.0',
    target: {
      target_clarity: null,
      target_achievement: null,
      target_reasonableness: null,
    },
    quality: {
      difficulty: null,
      innovation: null,
      basic_reliability: null,
      skill_improvement: null,
      reflection_improvement: null,
    },
    weighted_value: null,
    comment: null
  })
  const shareTo = searchParams.get('shareTo')
  const stepGoNoauthApiInstance = getStepGoNoauthApiInstance()

  useEffect(() => {
    const decryptShareTo = async () => {
      if (!shareTo) return
      try {
        const body: StepV1DecryptRequest = {
          id: params.stepId as string,
          data: shareTo
        }
        const response = await stepGoNoauthApiInstance.stepNoauthServiceDecrypt(params.stepId as string, body)
        if (response.status !== 200) throw new Error('Failed to decrypt shareTo')
        const { data } = response.data
        if (data) {
          setShareTargets({
            parent: data.includes('parent'),
            teacher: data.includes('teacher'),
            friend: data.includes('friend')
          })
        }
      } catch (err) {
        console.error('Failed to decrypt shareTo:', err)
        message.error('Invalid share link')
      }
    }

    decryptShareTo()
  }, [shareTo, params.stepId, stepGoNoauthApiInstance])

  useEffect(() => {
    const fetchStep = async () => {
      if (!shareTo) return
      try {
        const response = await stepGoNoauthApiInstance.stepNoauthServiceGetNoauthStep(params.stepId as string, shareTo)
        if (response.status !== 200) throw new Error('Failed to fetch step')
        const data: StepV1GetNoauthStepReply = response.data
        setStep(data.step || null)
        setTargetTitle(data.targetTitle || '')
        setTargetDescription(data.targetDescription || '')
        if (data.children) {
          setChildSteps(data.children)
        }
      } catch (err) {
        message.error('Failed to load data: ' + err)
      } finally {
        setLoading(false)
      }
    }

    fetchStep()
  }, [params.stepId, shareTo, stepGoNoauthApiInstance])

  const handleCommentSubmit = async () => {
    if (!step || !commentType) return

    const target_keys = [
      'target_clarity',
      'target_achievement',
      'target_reasonableness',
    ] as const
    const quality_keys = [
      'difficulty',
      'innovation',
      'basic_reliability',
      'skill_improvement',
      'reflection_improvement'
    ] as const
    const target_vals = target_keys.map(k => ratings.target[k as keyof typeof ratings.target]) as (number | null)[]
    const quality_vals = quality_keys.map(k => ratings.quality[k as keyof typeof ratings.quality]) as (number | null)[]
    const numericValues = target_vals.concat(quality_vals)
    const isComplete = numericValues.every(v => typeof v === 'number' && v >= 0 && v <= 10)
    if (!isComplete) {
      message.error(t('Please complete all ratings'))
      return
    }

    const weightedValue = Number(((numericValues as number[]).reduce((sum, v) => sum + v, 0) / numericValues.length).toFixed(2))

    try {
      const request: StepV1SetCommentForStepRequest = {
        id: step.id,
        type: commentType,
        comment: JSON.stringify({
          data: {
            target: {
              target_clarity: ratings.target.target_clarity,
              target_achievement: ratings.target.target_achievement,
              target_reasonableness: ratings.target.target_reasonableness
            },
            quality: {
              difficulty: ratings.quality.difficulty,
              innovation: ratings.quality.innovation,
              basic_reliability: ratings.quality.basic_reliability,
              skill_improvement: ratings.quality.skill_improvement,
              reflection_improvement: ratings.quality.reflection_improvement
            },
            weighted_value: weightedValue,
            comment: ratings.comment
          },
          version: 'v1.0'
        })
      }

      const response = await stepGoNoauthApiInstance.stepNoauthServiceSetCommentForStep(step.id as string, request)
      if (response.status !== 200) throw new Error('Failed to submit comment')

      message.success(t('Comment submitted successfully'))
      setRatings({
        version: 'v1.0',
        target: {
          target_clarity: null,
          target_achievement: null,
          target_reasonableness: null,
        },
        quality: {
          difficulty: null,
          innovation: null,
          basic_reliability: null,
          skill_improvement: null,
          reflection_improvement: null,
        },
        weighted_value: null,
        comment: null
      })
      setCommentType(null)

      // Refresh step data to show new comment
      const updatedResponse = await stepGoNoauthApiInstance.stepNoauthServiceGetNoauthStep(params.stepId as string, shareTo as string)
      if (updatedResponse.status !== 200) throw new Error('Failed to refresh step data')
      const data: StepV1GetNoauthStepReply = updatedResponse.data
      setStep(data.step || null)
    } catch (err) {
      message.error('Failed to submit comment: ' + err)
    }
  }

  const canComment = (type: 'parent' | 'teacher' | 'friend'): boolean => {
    if (!step || !shareTargets[type]) return false
    
    /* // Safely parse the creation date
    let createdAt: Date | null = null
    try {
      const timestamp = step.createdAt || ''
      if (timestamp) {
        const timestampNum = Number(timestamp)
        const timestampMs = String(timestampNum).length === 10 ? timestampNum * 1000 : timestampNum
        createdAt = new Date(timestampMs)
        // Check if the date is valid
        if (isNaN(createdAt.getTime())) {
          createdAt = null
        }
      }
    } catch (e) {
      console.error('Failed to parse creation date:', e)
      createdAt = null
    }

    // If we couldn't get a valid creation date, don't allow commenting
    if (!createdAt) return false

    const now = new Date()
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff > 24) return false */

    // Check if comment is empty
    const commentField = `${type}Comment` as keyof StepV1Step
    const comment = step[commentField]
    return !comment || comment === ''
  }

  // For non-dir steps, we'll use a dummy onDelete and onShowDetail since they're not needed
  const dummyHandler = async () => Promise.resolve()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!step) {
    return <div>Step not found</div>
  }

  // Prepare steps array based on whether it's a dir or not
  const stepsToDisplay = step.type === 'dir' ? childSteps : [step]

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{targetTitle}</Title>
      {targetDescription && <Title level={4}>{targetDescription}</Title>}
      <Title level={3}>{step.title || step.objectName}</Title>

      <MediaCardGrid
        steps={stepsToDisplay}
        isShared={true}
        onDelete={dummyHandler}
      />

      {/* Comment section */}
      <div style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {canComment('parent') && (
            <Button 
              type={commentType === 'parent' ? 'primary' : 'default'}
              onClick={() => setCommentType(commentType === 'parent' ? null : 'parent')}
            >
              {t('Add Parent Comment')}
            </Button>
          )}
          {canComment('teacher') && (
            <Button 
              type={commentType === 'teacher' ? 'primary' : 'default'}
              onClick={() => setCommentType(commentType === 'teacher' ? null : 'teacher')}
            >
              {t('Add Teacher Comment')}
            </Button>
          )}
          {canComment('friend') && (
            <Button 
              type={commentType === 'friend' ? 'primary' : 'default'}
              onClick={() => setCommentType(commentType === 'friend' ? null : 'friend')}
            >
              {t('Add Friend Comment')}
            </Button>
          )}
          
          {commentType && (
            <>
              <Title level={4}>{t('Ratings')}</Title>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>{t('Target')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  {t('Target Clarity')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.target.target_clarity as number | null} onChange={(v) => setRatings(prev => ({ ...prev, target: { ...prev.target, target_clarity: v as number | null } }))} />
                </label>
                <label>
                  {t('Target Achievement')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.target.target_achievement as number | null} onChange={(v) => setRatings(prev => ({ ...prev, target: { ...prev.target, target_achievement: v as number | null } }))} />
                </label>
                <label>
                  {t('Target Reasonableness')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.target.target_reasonableness as number | null} onChange={(v) => setRatings(prev => ({ ...prev, target: { ...prev.target, target_reasonableness: v as number | null } }))} />
                </label>
              </div>
              <div style={{ marginTop: 12, marginBottom: 8, fontWeight: 600 }}>{t('Quality')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  {t('Difficulty')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.quality.difficulty as number | null} onChange={(v) => setRatings(prev => ({ ...prev, quality: { ...prev.quality, difficulty: v as number | null } }))} />
                </label>
                <label>
                  {t('Innovation')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.quality.innovation as number | null} onChange={(v) => setRatings(prev => ({ ...prev, quality: { ...prev.quality, innovation: v as number | null } }))} />
                </label>
                <label>
                  {t('Basic Reliability')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.quality.basic_reliability as number | null} onChange={(v) => setRatings(prev => ({ ...prev, quality: { ...prev.quality, basic_reliability: v as number | null } }))} />
                </label>
                <label>
                  {t('Skill Improvement')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.quality.skill_improvement as number | null} onChange={(v) => setRatings(prev => ({ ...prev, quality: { ...prev.quality, skill_improvement: v as number | null } }))} />
                </label>
                <label>
                  {t('Reflection Improvement')}
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} value={ratings.quality.reflection_improvement as number | null} onChange={(v) => setRatings(prev => ({ ...prev, quality: { ...prev.quality, reflection_improvement: v as number | null } }))} />
                </label>
              </div>
              <label>
                {t('Comment')}
                <Input.TextArea rows={4} style={{ width: '100%' }} value={ratings.comment ?? ''} onChange={(e) => setRatings(prev => ({ ...prev, comment: e.target.value }))} />
              </label>
              <div>
                {t('Weighted Value')}: {(() => {
                  const target_keys = [
                    'target_clarity',
                    'target_achievement',
                    'target_reasonableness',
                  ] as const
                  const quality_keys = [
                    'difficulty',
                    'innovation',
                    'basic_reliability',
                    'skill_improvement',
                    'reflection_improvement'
                  ] as const
                  const target_vals = target_keys.map(k => ratings.target[k as keyof typeof ratings.target]) as (number | null)[]
                  const quality_vals = quality_keys.map(k => ratings.quality[k as keyof typeof ratings.quality]) as (number | null)[]
                  const nums = target_vals.concat(quality_vals)
                  const complete = nums.every(v => typeof v === 'number')
                  if (!complete) return '-'
                  return Number((nums.reduce((s, v) => s + v, 0) / nums.length).toFixed(2))
                })()}
              </div>
              <Button type="primary" onClick={handleCommentSubmit}>
                {t('Submit Comment')}
              </Button>
            </>
          )}
        </Space>
      </div>
    </div>
  )
}