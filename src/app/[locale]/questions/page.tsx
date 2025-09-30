'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSession, signIn } from 'next-auth/react'
import { SendOutlined, RobotOutlined, UserOutlined, LoadingOutlined, LockOutlined } from '@ant-design/icons'
import { getStepPythonApiInstance } from '@/lib/apiGenerate'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function QuestionsPage() {
  const { data: session, status } = useSession()
  const t = useTranslations('Questions')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLogin = () => {
    signIn('keycloak', undefined, { prompt: 'login' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await getStepPythonApiInstance(session?.accessToken).chatAiChatPost(userMessage.content, "0");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data || t('noReplyError'),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling AI:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('generalError'),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <RobotOutlined className="text-xl text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingOutlined className="text-2xl text-gray-400" />
        </div>
      </div>
    )
  }

  // Show login required message if not authenticated
  if (!session) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <RobotOutlined className="text-xl text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <LockOutlined className="text-6xl text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('loginRequired')}</h2>
            <p className="text-gray-600 mb-6">{t('loginDescription')}</p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              {t('loginButton')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main chat interface for authenticated users
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <RobotOutlined className="text-xl text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <RobotOutlined className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('welcomeTitle')}</h3>
              <p className="text-gray-500">{t('welcomeDescription')}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      message.role === 'user' ? 'ml-3' : 'mr-3'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <UserOutlined className="text-sm" />
                      ) : (
                        <RobotOutlined className="text-sm" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <RobotOutlined className="text-sm" />
                  </div>
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <LoadingOutlined className="animate-spin" />
                    <span className="text-sm">{t('thinking')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('inputPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ 
                  minHeight: '48px',
                  maxHeight: '120px',
                  overflowY: input.split('\n').length > 3 ? 'scroll' : 'hidden'
                }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <LoadingOutlined className="text-lg" />
              ) : (
                <SendOutlined className="text-lg" />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('sendHint')}
          </p>
        </div>
      </div>
    </div>
  )
} 