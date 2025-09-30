'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Upload, message, Typography, Modal, Form, Input, Switch, Button, Pagination } from 'antd'
import { UploadOutlined, PlusOutlined, FolderAddOutlined } from '@ant-design/icons'
import { StepV1GetTargetReply, StepV1Step, StepV1Target } from '@/lib/step-go-generate'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { MediaCardGrid } from '@/components/MediaCardGrid'
import { getStepGoApiInstance } from '@/lib/apiGenerate'
import { useSession } from 'next-auth/react'

const { Title, Paragraph } = Typography

export default function TargetDetails() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [target, setTarget] = useState<StepV1GetTargetReply | null>(null)
  const [targetTree, setTargetTree] = useState<StepV1Target | null>(null)
  const [loading, setLoading] = useState(true)
  const [stepV1Step, setStepV1Step] = useState<StepV1Step[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [form] = Form.useForm()
  const [isDirModalVisible, setIsDirModalVisible] = useState(false)
  const [dirForm] = Form.useForm()
  const t = useTranslations()
  const [isUploading, setIsUploading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [targetResponse, treeResponse] = await Promise.all([
          getStepGoApiInstance(session?.accessToken).stepServiceGetTarget(
            params.targetId as string,
            true,
            pagination.current,
            pagination.pageSize
          ),
          getStepGoApiInstance(session?.accessToken).stepServiceGetTargetTree(params.targetId as string)
        ])

        if (targetResponse.status !== 200) throw new Error('Failed to fetch target details')
        if (treeResponse.status !== 200) throw new Error('Failed to fetch target tree')

        const targetData = targetResponse.data
        const treeData = treeResponse.data
        console.log("wxp treeData", treeData)

        setTarget(targetData)
        setTargetTree(treeData.rootTarget || null)
        setStepV1Step(targetData.steps || [])
        setPagination(prev => ({
          ...prev,
          total: parseInt(targetData.total || '0')
        }))
      } catch (err) {
        message.error('Failed to load data: ' + err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.accessToken, params.targetId, pagination.current, pagination.pageSize])

  const handleTargetClick = (nodeId: string) => {
    const locale = params.locale
    if (nodeId !== params.targetId && typeof locale === 'string') {
      const newPath = `/${locale}/accumulate/target/${nodeId}`
      router.push(newPath)
    } else {
      console.error("Invalid navigation: missing locale or same target")
    }
  }

  const handleAddChildTarget = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent node click
    const locale = params.locale
    if (typeof locale === 'string') {
      const currentPath = `/${locale}/accumulate/target/${params.targetId}`
      const encodedReturnUrl = encodeURIComponent(currentPath)
      const newPath = `/${locale}/accumulate/new-target?parentId=${parentId}&returnUrl=${encodedReturnUrl}`
      router.push(newPath)
    } else {
      console.error("Invalid navigation: missing locale")
    }
  }

  const handleUpload = async (values: { title: string; description: string; isChallenge: boolean }) => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('targetID', params.targetId as string)
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
      setStepV1Step(prev => [newStep, ...prev])
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

  const handleAddDir = async (values: { dirName: string }) => {
    try {
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceAddTargetDirStep(params.targetId as string, {
        title: values.dirName,
      })
      if (response.status !== 200) throw new Error('Failed to add directory')
      
      const data = response.data
      const newStep = {
        id: data.id,
        type: 'dir',
        title: values.dirName,
      }
      setStepV1Step(prev => [newStep, ...prev])
      message.success('Directory added successfully')
      setIsDirModalVisible(false)
      dirForm.resetFields()
    } catch (err) {
      message.error('Failed to add directory: ' + err)
    }
  }

  const handleDelete = async (step: StepV1Step) => {
    try {
      const response = await getStepGoApiInstance(session?.accessToken).stepServiceDeleteTargetStep(step.id as string)
      if (response.status !== 200) throw new Error('Failed to delete step')

      // Refresh the steps list
      const updatedSteps = stepV1Step.filter(s => s.id !== step.id)
      setStepV1Step(updatedSteps)
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

  const renderTreeNode = (node: StepV1Target) => {
    const statusColors = {
      init: '#999',
      step: '#1890ff',
      step_hard: '#ff4d4f',
      done: '#52c41a'
    }

    const isCurrentTarget = node.id === params.targetId

    return (
      <div
        key={node.id}
        style={{
          padding: '12px',
          marginBottom: '12px',
          border: `1px solid ${isCurrentTarget ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: '6px',
          backgroundColor: isCurrentTarget ? '#e6f7ff' : '#fff',
          boxShadow: isCurrentTarget ? '0 2px 8px rgba(24,144,255,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={(e) => {
          e.stopPropagation() // 防止事件冒泡
          handleTargetClick(String(node.id))
        }}
        onMouseEnter={(e) => {
          if (!isCurrentTarget) {
            e.currentTarget.style.borderColor = '#40a9ff'
            e.currentTarget.style.backgroundColor = '#f0f5ff'
          }
        }}
        onMouseLeave={(e) => {
          if (!isCurrentTarget) {
            e.currentTarget.style.borderColor = '#d9d9d9'
            e.currentTarget.style.backgroundColor = '#fff'
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: statusColors[node.status as keyof typeof statusColors] || '#999',
                marginRight: '12px'
              }}
            />
            <strong style={{ 
              fontSize: '16px',
              color: isCurrentTarget ? '#1890ff' : 'inherit'
            }}>{node.title}</strong>
            {isCurrentTarget && (
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '12px', 
                color: '#1890ff',
                backgroundColor: '#e6f7ff',
                padding: '2px 8px',
                borderRadius: '10px',
                border: '1px solid #91d5ff'
              }}>
                Current
              </span>
            )}
          </div>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={(e) => handleAddChildTarget(String(node.id), e)}
            style={{ marginLeft: '8px' }}
          >
            {t('Add Child Target')}
          </Button>
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginLeft: '22px' }}>
          <div>{node.description}</div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#888' }}>
            Status: {node.status} | Layer: {node.layer}
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div style={{ marginLeft: '22px', marginTop: '12px', borderLeft: '1px solid #e8e8e8', paddingLeft: '12px' }}>
            {node.children.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    )
  }

  if (status === 'loading') {
    return <div>{t('loading_state')}</div>
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in</div>
  }

  if (loading) {
    return <div>{t('loading_state')}</div>
  }

  if (!target) {
    return <div>Target not found</div>
  }

  return (
    <div className="p-4">
      <Title level={2}>{t('Title')}: {target.target?.title}</Title>
      <Paragraph>{t('Description')}: {target.target?.description}</Paragraph>

      {targetTree && (
        <div className="mb-8">
          <Title level={3}>{t('Target Tree')}</Title>
          <div style={{ 
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {renderTreeNode(targetTree)}
          </div>
        </div>
      )}

      <div className="mb-4 flex space-x-4">
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
              transition: 'border-color 0.3s, background 0.3s',
              flex: 1
            }}
          >
            <p style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
              <UploadOutlined />
            </p>
            <p style={{ fontSize: '16px', color: '#666' }}>{t('Add Accumulate')}</p>
            <p style={{ fontSize: '14px', color: '#999' }}>{t('Click or drag file to this area to upload')}</p>
          </div>
        </Upload>

        <Button
          type="primary"
          icon={<FolderAddOutlined />}
          onClick={() => setIsDirModalVisible(true)}
          style={{
            height: 'auto',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '16px' }}>{t('Add Directory')}</span>
        </Button>
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

      <Modal
        title={t('Add Directory')}
        open={isDirModalVisible}
        onOk={() => dirForm.submit()}
        onCancel={() => {
          setIsDirModalVisible(false)
          dirForm.resetFields()
        }}
      >
        <Form
          form={dirForm}
          layout="vertical"
          onFinish={handleAddDir}
        >
          <Form.Item
            name="dirName"
            label={t('Directory Name')}
            rules={[{ required: true, message: 'Please input the directory name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <MediaCardGrid steps={stepV1Step} onDelete={handleDelete} />
      
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