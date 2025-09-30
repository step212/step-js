'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Upload, message, Typography, Modal, Form, Input, Switch, Button, Pagination } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { StepV1Step } from '@/lib/step-go-generate'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { MediaCardGrid } from '@/components/MediaCardGrid'

const { Title } = Typography

export default function DirectoryDetails() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [steps, setSteps] = useState<StepV1Step[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [form] = Form.useForm()
  const [isUploading, setIsUploading] = useState(false)
  const t = useTranslations()
  const title = searchParams.get('title') || ''
  const targetId = params.targetId as string
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/step-go?action=step_getTargetDirStepChildren&id=${params.dirId}&page=${pagination.current}&pageSize=${pagination.pageSize}`)
        if (!response.ok) throw new Error('Failed to fetch directory contents')
        const data = await response.json()
        setSteps(data.steps || [])
        setPagination(prev => ({
          ...prev,
          total: parseInt(data.total) || 0
        }))
      } catch (err) {
        message.error('Failed to load data: ' + err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.dirId, pagination.current, pagination.pageSize])

  const handleUpload = async (values: { title: string; description: string; isChallenge: boolean }) => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('parentID', params.dirId as string)
      formData.append('isChallenge', values.isChallenge.toString())
      formData.append('title', values.title)
      formData.append('description', values.description)

      const response = await fetch('/api/step-go?action=step_uploadFile', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      const newStep = {
        id: data.id,
        objectName: data.objectName,
        presignedUrl: data.presignedUrl,
        type: data.type,
        title: data.title,
        description: data.description,
        isChallenge: data.isChallenge,
      }
      setSteps(prev => [newStep, ...prev])
      message.success('File uploaded successfully')
      setIsModalVisible(false)
      form.resetFields()
      setSelectedFile(null)
    } catch (err) {
      message.error('Failed to upload file: ' + err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (step: StepV1Step) => {
    try {
      const response = await fetch(`/api/step-go?action=step_deleteTargetStep&id=${step.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete step')
      // Refresh the steps list
      const updatedSteps = steps.filter(s => s.id !== step.id)
      setSteps(updatedSteps)
    } catch (err) {
      throw err
    }
  }

  const uploadProps = {
    beforeUpload: (file: File) => {
      setSelectedFile(file)
      setIsModalVisible(true)
      return false
    },
    showUploadList: false,
  }

  if (loading) {
    return <div>{t('loading_state')}</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push(`/${params.locale}/accumulate/target/${targetId}`)}
        >
          {t('Back to Target')}
        </Button>
      </div>

      <Title level={2}>{t('Directory')}: {title}</Title>

      <div className="mb-4">
        <Upload {...uploadProps}>
          <div 
            className="upload-zone"
            style={{
              border: '2px dashed #1890ff',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              background: '#fafafa',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background 0.3s'
            }}
          >
            <p style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
              <UploadOutlined />
            </p>
            <p style={{ fontSize: '16px', color: '#666' }}>{t('Add Accumulate')}</p>
            <p style={{ fontSize: '14px', color: '#999' }}>{t('Click or drag file to this area to upload')}</p>
          </div>
        </Upload>
        <style jsx>{`
          .upload-zone:hover {
            border-color: #40a9ff !important;
            background: #f0f5ff !important;
          }
        `}</style>
      </div>

      <Modal
        title={t('Add Details')}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false)
          setSelectedFile(null)
          form.resetFields()
        }}
        okButtonProps={{ disabled: isUploading }}
        confirmLoading={isUploading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          initialValues={{ isChallenge: false }}
        >
          <Form.Item
            name="title"
            label={t('Title')}
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input disabled={isUploading} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('Description')}
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea rows={4} disabled={isUploading} />
          </Form.Item>
          <Form.Item
            name="isChallenge"
            label={t('Is Challenge')}
            valuePropName="checked"
          >
            <Switch disabled={isUploading} />
          </Form.Item>
        </Form>
      </Modal>

      <MediaCardGrid steps={steps} onDelete={handleDelete} />
      
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            setPagination(prev => ({
              ...prev,
              current: page,
              pageSize: pageSize || prev.pageSize
            }))
          }}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  )
} 