'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, Button, Form, Input, Select, InputNumber, Upload, message, Space } from 'antd'
import { ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { getStepGoApiInstance } from '@/lib/apiGenerate'
import { StepV1Target } from '@/lib/step-go-generate/api'

const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

interface CreateAwardForm {
  description: string
  targetType: string
  scope: string
  dimension: string
  threshold: number
  settedFiles?: UploadFile[]
}

export default function CreateAwardPage() {
  const t = useTranslations('FeedbackPage')
  const tCommon = useTranslations('')
  const tPortrait = useTranslations('PortraitPage')
  const { data: session } = useSession()
  const router = useRouter()
  const [form] = Form.useForm()
  
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [targetType, setTargetType] = useState<string>('')
  const [scope, setScope] = useState<string>('')
  const [topTargets, setTopTargets] = useState<StepV1Target[]>([])
  const [loadingTargets, setLoadingTargets] = useState(false)

  // Portrait scope to metrics mapping
  const portraitMetrics = {
    basic: ['bravery', 'decisiveness', 'patience', 'perseverance'],
    self_discipline: ['checkin_frequency', 'consistency', 'adjustment_ability'],
    target_and_execution: ['goal_achievement', 'goal_clarity', 'goal_reasonableness'],
    learning_and_growth: ['basic_solid', 'challenge_attitude', 'innovative_method', 'reflection_and_improvement', 'skill_improvement']
  }

  // Target steprate metrics
  const targetMetrics = [
    'target_clarity', 'target_achievement', 'target_reasonableness',
    'difficulty', 'innovation', 'basic_reliability',
    'skill_improvement', 'reflection_improvement', 'weighted_value'
  ]

  // Fetch top targets when targetType is 'target'
  const fetchTopTargets = async () => {
    if (!session?.accessToken) return
    
    setLoadingTargets(true)
    try {
      const api = getStepGoApiInstance(session.accessToken)
      const response = await api.stepServiceGetTargets("0")
      const targets = response.data.targets || []
      // Filter for top-level targets only (targets without parent or with empty parent)
      const topLevelTargets = targets.filter(target => !target.targetParent || target.targetParent === "0")
      setTopTargets(topLevelTargets)
    } catch (error) {
      console.error('Failed to fetch targets:', error)
      message.error(t('fetchTargetsFailed'))
    } finally {
      setLoadingTargets(false)
    }
  }

  useEffect(() => {
    if (targetType === 'target') {
      fetchTopTargets()
    }
  }, [targetType, session?.accessToken])

  // Handle target type change
  const handleTargetTypeChange = (value: string) => {
    setTargetType(value)
    setScope('')
    form.setFieldsValue({ scope: undefined, dimension: undefined })
  }

  // Handle scope change
  const handleScopeChange = (value: string) => {
    setScope(value)
    form.setFieldsValue({ dimension: undefined })
  }

  // Handle back to list
  const handleBack = () => {
    router.push('/feedback/award')
  }

  // Handle form submission
  const handleSubmit = async (values: CreateAwardForm) => {
    if (!session?.accessToken) return
    
    setLoading(true)
    try {
      // Prepare form data
      const formData = new FormData()
      
      // Add files
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj)
        }
      })
      
      // Add form fields
      formData.append('description', values.description)
      formData.append('targetType', values.targetType)
      formData.append('scope', values.scope)
      formData.append('dimension', values.dimension)
      formData.append('threshold', values.threshold.toString())

      // Call API
      const response = await fetch('/api/step-go?action=feedback_createAward', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create award')
      }

      const result = await response.json()
      console.log('Award created successfully:', result)
      
      message.success(t('awardCreatedSuccess'))
      router.push('/feedback/award')
    } catch (error) {
      console.error('Failed to create award:', error)
      message.error(error instanceof Error ? error.message : t('createAwardFailed'))
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList: fileList,
    beforeUpload: (file) => {
      // Check file size (10MB limit)
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error(t('fileSizeError'))
        return false
      }
      return false // Prevent auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList)
    },
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid))
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">{t('pages.create')}</h1>
        </div>


        {/* Create Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label={tCommon('Description')}
            name="description"
            rules={[
              { required: true, message: t('pleaseEnterDescription') },
              /* { min: 10, message: t('descriptionMinLength') } */
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t('enterDescription')}
              showCount
            />
          </Form.Item>

          {/* Target Type Selection */}
          <Form.Item
            label={t('targetType')}
            name="targetType"
            rules={[{ required: true, message: t('pleaseSelectTargetType') }]}
          >
            <Select 
              placeholder={t('selectTargetType')}
              onChange={handleTargetTypeChange}
            >
              <Option value="portrait">{t('targetTypePortrait')}</Option>
              <Option value="target">{t('targetTypeTarget')}</Option>
            </Select>
          </Form.Item>

          {/* Scope Selection */}
          <Form.Item
            label={t('scope')}
            name="scope"
            rules={[{ required: true, message: t('pleaseSelectScope') }]}
            style={{ display: targetType ? 'block' : 'none' }}
          >
            {targetType === 'portrait' ? (
              <Select 
                placeholder={t('selectScope')}
                onChange={handleScopeChange}
              >
                <Option value="basic">{tPortrait('dimension.basic')}</Option>
                <Option value="self_discipline">{tPortrait('dimension.self_discipline')}</Option>
                <Option value="target_and_execution">{tPortrait('dimension.target_and_execution')}</Option>
                <Option value="learning_and_growth">{tPortrait('dimension.learning_and_growth')}</Option>
              </Select>
            ) : targetType === 'target' ? (
              <Select 
                placeholder={t('selectTopTarget')}
                onChange={handleScopeChange}
                loading={loadingTargets}
              >
                {topTargets.map(target => (
                  <Option key={target.id} value={target.id}>
                    {target.title}
                  </Option>
                ))}
              </Select>
            ) : null}
          </Form.Item>

          {/* Dimension/Metric Selection */}
          <Form.Item
            label={t('dimension')}
            name="dimension"
            rules={[{ required: true, message: t('pleaseSelectDimension') }]}
            style={{ display: scope ? 'block' : 'none' }}
          >
            <Select placeholder={t('selectMetric')}>
              {targetType === 'portrait' && scope && portraitMetrics[scope as keyof typeof portraitMetrics] ? (
                portraitMetrics[scope as keyof typeof portraitMetrics].map(metric => (
                  <Option key={metric} value={metric}>
                    {tPortrait(`metrics.${metric}`) || tCommon(metric.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' '))}
                  </Option>
                ))
              ) : targetType === 'target' ? (
                targetMetrics.map(metric => (
                  <Option key={metric} value={metric}>
                    {tCommon(metric.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' '))}
                  </Option>
                ))
              ) : null}
            </Select>
          </Form.Item>

          {/* Threshold */}
          <Form.Item
            label={t('threshold')}
            name="threshold"
            rules={[
              { required: true, message: t('pleaseEnterThreshold') },
              { type: 'number', min: 1, message: t('thresholdMinValue') }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t('enterThresholdValue')}
              min={1}
              max={1000}
            />
          </Form.Item>

          {/* File Upload */}
          <Form.Item
            label={t('settedFiles')}
            help={t('maxFileSize')}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t('selectFiles')}</p>
              <p className="ant-upload-hint">
                {t('uploadHint')} {t('maxFileSize')}
              </p>
            </Dragger>
          </Form.Item>

          {/* Form Actions */}
          <Form.Item className="mb-0">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                {tCommon('Create')}
              </Button>
              <Button
                size="large"
                onClick={handleBack}
              >
                {tCommon('Cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
