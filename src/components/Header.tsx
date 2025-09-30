'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const t = useTranslations('Layout')

  // 获取当前语言
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    return segments[1] || 'en'; // 默认为英文
  };

  const goToHome = () => {
    const currentLocale = getCurrentLocale();
    router.push(`/${currentLocale}`);
  };

  return (
    <header className="flex items-center p-4 bg-gray-100">
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button
          onClick={goToHome}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
          title={t('Home')}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t('Home')}
        </button>
      </div>
      <div className="flex-grow min-w-8"></div>
      <div className="flex items-center justify-end min-w-0">
        {session ? (
          <>
            <div className="mr-4 cursor-pointer hover:text-blue-500 flex items-center group min-w-0">
              <span 
                className="break-words text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]"
                onClick={() => setIsModalOpen(true)}
                title={`${t('Welcome')}, ${session.user?.name}`}
              >
                {t('Welcome')}, {session.user?.name}
              </span>
              <svg 
                className="w-4 h-4 ml-1 text-gray-500 group-hover:text-blue-500 transition-transform group-hover:translate-x-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                onClick={() => setIsModalOpen(true)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              {t('Logout')}
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn(
              "keycloak",
              undefined,
              { prompt: 'login' }
            )}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t('Login')}
          </button>
        )}
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={() => setIsModalOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full bg-white shadow-xl w-96 overflow-y-auto z-[10000]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Profile</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('Name')}</label>
                  <p className="mt-1 text-gray-900">{session?.user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('Email')}</label>
                  <p className="mt-1 text-gray-900">{session?.user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('Access Token')}</label>
                  <p className="mt-1 text-gray-900 break-all font-mono text-sm bg-gray-50 p-2 rounded">
                    {session?.accessToken}
                  </p>
                </div>
                {session?.user?.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Profile Image')}</label>
                    <Image 
                      src={session.user.image} 
                      alt="Profile" 
                      width={80}
                      height={80}
                      className="mt-1 w-20 h-20 rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 