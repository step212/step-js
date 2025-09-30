'use client'

import { App as AntdApp } from 'antd'
import { ReactNode } from 'react'

export default function AntdProvider({
  children
}: {
  children: ReactNode
}) {
  return <AntdApp>{children}</AntdApp>
} 