'use client'

import { useSession } from "next-auth/react"
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useMemo, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { Column, Line } from '@ant-design/plots'
import type { PlotEvent } from '@ant-design/plots'
import { Modal, Select, Spin } from 'antd'
import { getPortraitApiInstance, getStepGoApiInstance } from '@/lib/apiGenerate'

type BasicDimension = 'basic' | 'self_discipline' | 'target_and_execution' | 'learning_and_growth'
type StatUnit = 'day' | 'week' | 'month'

type BasicValue = Record<string, number>
type BasicValueResponse = Record<BasicDimension, BasicValue>

type StepRateSeriesPoint = Record<string, number>
type StepRateResponse = Record<string, StepRateSeriesPoint[]>

// 将 abbrEn 移到组件外部，避免每次渲染都重新创建
const abbrEn: Record<string, string> = {
  bravery: 'Bravery',
  decisiveness: 'Decisive',
  patience: 'Patience',
  perseverance: 'Persever.',
  basic_solid: 'Found.',
  challenge_attitude: 'Chall. Att.',
  innovative_method: 'Innov. Method',
  reflection_and_improvement: 'Reflect.',
  skill_improvement: 'Skill Up',
  checkin_frequency: 'Check-in',
  consistency: 'Consist.',
  adjustment_ability: 'Adjust.',
  goal_achievement: 'Goal Ach.',
  goal_clarity: 'Goal Clar.',
  goal_reasonableness: 'Goal Reason.'
}

export default function Portrait() {
  const { data: session } = useSession()
  const t = useTranslations()
  const [dimension, setDimension] = useState<BasicDimension>('basic')
  const [statUnit, setStatUnit] = useState<StatUnit>('day')
  const locale = useLocale()

  const [basicData, setBasicData] = useState<Array<{ metric: string, metricLabel: string, metricShortLabel: string, score: number }>>([])
  const [stepData, setStepData] = useState<Array<{ date: string, value: number }>>([])
  const [loadingBasic, setLoadingBasic] = useState(false)
  const [loadingStep, setLoadingStep] = useState(false)
  const [loadingTargets, setLoadingTargets] = useState(false)
  const [topTargets, setTopTargets] = useState<Array<{ id: string, title: string }>>([])
  const [selectedTopTargetId, setSelectedTopTargetId] = useState<string | undefined>(undefined)
  const [stepSeriesMap, setStepSeriesMap] = useState<Record<string, StepRateSeriesPoint[]>>({})
  const [selectedSeries, setSelectedSeries] = useState<string>('weighted_value')
  const [modalInfo, setModalInfo] = useState<{ visible: boolean, title: string, content: string }>({ visible: false, title: '', content: '' })

  const { startDate, endDate } = useMemo(() => {
    const end = dayjs()
    let start: dayjs.Dayjs
    if (statUnit === 'day') {
      start = end.subtract(1, 'month')
    } else if (statUnit === 'week') {
      start = end.subtract(3, 'months')
    } else {
      start = end.subtract(1, 'year')
    }
    return { startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') }
  }, [statUnit])

  const fetchTopTargets = useCallback(async () => {
    if (!session?.accessToken) return
    setLoadingTargets(true)
    try {
      const api = getStepGoApiInstance(session.accessToken)
      const res = await api.stepServiceGetTargets('0')
      const list = res.data?.targets || []
      const mapped = list.map((t: { id?: string | number; title?: string }) => ({ id: String(t.id), title: String(t.title || t.id) }))
      setTopTargets(mapped)
      if (!selectedTopTargetId && mapped.length > 0) {
        setSelectedTopTargetId(mapped[0].id)
      }
    } catch (e) {
      console.error('fetchTopTargets error', e)
      setTopTargets([])
    } finally {
      setLoadingTargets(false)
    }
  }, [session?.accessToken, selectedTopTargetId])


  const shortenLabelZh = useCallback((label: string) => {
    const maxLen = 6
    return label.length > maxLen ? label.slice(0, maxLen) + '…' : label
  }, [])

  const shortenLabelEn = useCallback((metric: string, label: string) => {
    return abbrEn[metric] || (label.length > 12 ? label.slice(0, 12) + '…' : label)
  }, [])

  const fetchBasic = useCallback(async () => {
    if (!session?.accessToken) return
    setLoadingBasic(true)
    try {
      const api = getPortraitApiInstance(session.accessToken)
      const res = await api.portraitServiceGetPortraitBasic(dimension)
      const raw = res.data?.value
      if (raw) {
        const obj = JSON.parse(raw) as BasicValueResponse
        const values = obj[dimension] || {}
        const transformed = Object.entries(values).map(([metric, score]) => {
          const label = t(`PortraitPage.metrics.${metric}`)
          const metricShortLabel = locale === 'zh' ? shortenLabelZh(label) : shortenLabelEn(metric, label)
          return { metric, metricLabel: label, metricShortLabel, score: Number(score) }
        })
        setBasicData(transformed)
      } else {
        setBasicData([])
      }
    } catch (e) {
      console.error('fetchBasic error', e)
      setBasicData([])
    } finally {
      setLoadingBasic(false)
    }
  }, [session?.accessToken, dimension, t, locale])

  const fetchStepRate = useCallback(async () => {
    if (!session?.accessToken) return
    setLoadingStep(true)
    try {
      const api = getPortraitApiInstance(session.accessToken)
      const res = await api.portraitServiceGetPortraitStepRate(selectedTopTargetId, statUnit, startDate, endDate)
      const raw = res.data?.value
      if (raw) {
        const obj = JSON.parse(raw) as StepRateResponse
        setStepSeriesMap(obj)
        const candidate = selectedSeries && obj[selectedSeries] ? selectedSeries : (obj['weighted_value'] ? 'weighted_value' : Object.keys(obj)[0])
        if (candidate) {
          if (!obj[selectedSeries]) setSelectedSeries(candidate)
          const transformed: Array<{ date: string, value: number }> = (obj[candidate] || []).map((point) => {
            const [dateKey, value] = Object.entries(point)[0] || ['-', 0]
            return { date: dateKey, value: Number(value) }
          })
          setStepData(transformed)
        } else {
          setStepData([])
        }
      } else {
        setStepData([])
      }
    } catch (e) {
      console.error('fetchStepRate error', e)
      setStepData([])
    } finally {
      setLoadingStep(false)
    }
  }, [session?.accessToken, selectedTopTargetId, statUnit, startDate, endDate, selectedSeries])

  useEffect(() => {
    if (session) {
      fetchTopTargets()
      fetchBasic()
    }
  }, [session, dimension, fetchTopTargets, fetchBasic])

  useEffect(() => {
    if (session && selectedTopTargetId) {
      fetchStepRate()
    }
  }, [session, selectedTopTargetId, statUnit, startDate, endDate, fetchStepRate])

  useEffect(() => {
    const series = stepSeriesMap[selectedSeries]
    if (series) {
      const transformed: Array<{ date: string, value: number }> = series.map((point) => {
        const [dateKey, value] = Object.entries(point)[0] || ['-', 0]
        return { date: dateKey, value: Number(value) }
      })
      setStepData(transformed)
    }
  }, [selectedSeries, stepSeriesMap])

  if (!session) {
    return <div>{t('Please login')}</div>
  }

  return (
    <main className="p-4">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">{t('Portrait')}</h1>
        </div>

        <section className="bg-white p-4 rounded border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-medium">{t('PortraitPage.basicSectionTitle')}</span>
            <Select
              size="middle"
              value={dimension}
              onChange={(v) => setDimension(v as BasicDimension)}
              options={[
                { label: t('PortraitPage.dimension.basic'), value: 'basic' },
                { label: t('PortraitPage.dimension.self_discipline'), value: 'self_discipline' },
                { label: t('PortraitPage.dimension.target_and_execution'), value: 'target_and_execution' },
                { label: t('PortraitPage.dimension.learning_and_growth'), value: 'learning_and_growth' },
              ]}
              style={{ width: 260 }}
            />
          </div>
          <div className="w-full min-h-[280px] relative">
            <Column
              key={`basic-${dimension}`}
              data={basicData}
              xField="metricShortLabel"
              yField="score"
              label={{ position: 'top' }}
              columnWidthRatio={0.6}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
              meta={{ score: { alias: 'score' } }}
              tooltip={false}
              onReady={(chart) => {
                // 柱状图点击事件处理
                const handleClick = (ev: PlotEvent) => {
                  // 获取点击的数据
                  let datum = ev?.data?.data
                  if (Array.isArray(datum)) datum = datum[0]
                  
                  // 只处理有有效数据的事件，过滤掉FederatedPointerEvent
                  if (datum?.metricLabel && datum?.score !== undefined) {
                    setTimeout(() => {
                      setModalInfo({
                        visible: true,
                        title: datum.metricLabel || '',
                        content: `${datum.metricLabel || ''}: ${datum.score}`
                      })
                    }, 50)
                  }
                }
                
                // 只绑定有效的click事件
                chart.on('click', handleClick)
              }}
            />
            {loadingBasic && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Spin />
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded border">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-medium">{t('PortraitPage.accumulationSectionTitle')}</span>
            <Select
              size="middle"
              value={statUnit}
              onChange={(v) => setStatUnit(v as StatUnit)}
              options={[
                { label: t('PortraitPage.statUnit.day'), value: 'day' },
                { label: t('PortraitPage.statUnit.week'), value: 'week' },
                { label: t('PortraitPage.statUnit.month'), value: 'month' },
              ]}
              style={{ width: 200 }}
            />
            <span className="text-sm text-gray-500">{startDate} ~ {endDate}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-medium">{t('PortraitPage.targetSectionTitle')}</span>
            <Select
              size="middle"
              loading={loadingTargets}
              placeholder={t('Target')}
              value={selectedTopTargetId}
              onChange={(v) => setSelectedTopTargetId(v)}
              options={topTargets.map(tg => ({ label: tg.title, value: tg.id }))}
              style={{ width: 260 }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-medium">{t('PortraitPage.seriesSectionTitle')}</span>
            <Select
              size="middle"
              placeholder={t('Quality')}
              value={selectedSeries}
              onChange={(v) => setSelectedSeries(v)}
              options={Object.keys(stepSeriesMap).map((k) => ({
                label: (
                  k === 'weighted_value' ? t('Weighted Value') :
                  k === 'basic_reliability' ? t('Basic Reliability') :
                  k === 'difficulty' ? t('Difficulty') :
                  k === 'innovation' ? t('Innovation') :
                  k === 'reflection_improvement' ? t('Reflection Improvement') :
                  k === 'skill_improvement' ? t('Skill Improvement') :
                  k === 'target_achievement' ? t('Target Achievement') :
                  k === 'target_clarity' ? t('Target Clarity') :
                  k === 'target_reasonableness' ? t('Target Reasonableness') : k
                ),
                value: k
              }))}
              style={{ width: 260 }}
            />
          </div>
          <div className="w-full min-h-[280px] relative">
            <Line
              key={`rate-${statUnit}-${selectedSeries}-${selectedTopTargetId}`}
              data={stepData}
              xField="date"
              yField="value"
              smooth
              point={{ size: 3 }}
              meta={{ value: { alias: (
                selectedSeries === 'weighted_value' ? t('Weighted Value') :
                selectedSeries === 'basic_reliability' ? t('Basic Reliability') :
                selectedSeries === 'difficulty' ? t('Difficulty') :
                selectedSeries === 'innovation' ? t('Innovation') :
                selectedSeries === 'reflection_improvement' ? t('Reflection Improvement') :
                selectedSeries === 'skill_improvement' ? t('Skill Improvement') :
                selectedSeries === 'target_achievement' ? t('Target Achievement') :
                selectedSeries === 'target_clarity' ? t('Target Clarity') :
                selectedSeries === 'target_reasonableness' ? t('Target Reasonableness') : selectedSeries
              ) } }}
            />
            {loadingStep && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Spin />
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* 自定义Modal，避免antd兼容性问题 */}
      <Modal
        title={modalInfo.title}
        open={modalInfo.visible}
        onOk={() => setModalInfo({ visible: false, title: '', content: '' })}
        onCancel={() => setModalInfo({ visible: false, title: '', content: '' })}
        cancelButtonProps={{ style: { display: 'none' } }}
        mask={true}
        maskClosable={false}
        destroyOnClose={true}
        getContainer={false}
      >
        <p>{modalInfo.content}</p>
      </Modal>
    </main>
  )
} 