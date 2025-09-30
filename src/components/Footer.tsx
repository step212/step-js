'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string

  const t = useTranslations('Layout')

  const navItems = [
    { name: t('Portrait'), path: `/${locale}/portrait` },
    { name: t('Questions'), path: `/${locale}/questions` },
    { name: t('Accumulate'), path: `/${locale}/accumulate` },
    { name: t('Feedback'), path: `/${locale}/feedback` },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === item.path ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </footer>
  )
} 