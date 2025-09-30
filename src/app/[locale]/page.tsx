'use client'

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Graph } from '@antv/g6';
import type { IElementEvent } from '@antv/g6';
import type { ElementDatum } from '@antv/g6';
import { useCallback } from 'react';
import { Modal } from 'antd';

export default function Home() {
  const t = useTranslations('HomePage');
  const [edgeModalVisible, setEdgeModalVisible] = useState(false);
  const [edgeModalContent, setEdgeModalContent] = useState('');
  const [nodeModalVisible, setNodeModalVisible] = useState(false);
  const [nodeModalContent, setNodeModalContent] = useState('');

  // 文本截断函数 - 使用useCallback避免重复创建
  const truncateText = useCallback((text: string, maxLength: number = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }, []);

  useEffect(() => {
    // 定义节点和边的数据 - 从左向右，依次向上排列
    const data = {
      nodes: [
        { id: 'brave', style: { x: 0, y: 280 }, data: { label: t('nodes.brave') } },
        { id: 'decisive', style: { x: 100, y: 230 }, data: { label: t('nodes.decisive') } },
        { id: 'patience', style: { x: 200, y: 180 }, data: { label: t('nodes.patience') } },
        { id: 'perseverance', style: { x: 300, y: 100 }, data: { label: t('nodes.perseverance') } },
      ],
      edges: [
        { id: 'edge1', source: 'brave', target: 'decisive', data: { label: t('edges.braveToDecisive') } },
        { id: 'edge2', source: 'decisive', target: 'patience', data: { label: t('edges.decisiveToPatience') } },
        { id: 'edge3', source: 'patience', target: 'perseverance', data: { label: t('edges.patienceToPermerseverance') } },
      ],
    };

    // 创建G6图实例 - 在初始化时传入数据
    const graph = new Graph({
      container: 'mountNode', // 容器ID
      width: document.documentElement.clientWidth, // 宽度
      height: document.documentElement.clientHeight *0.5, // 高度
      data: data, // G6 5.x 在初始化时传入数据
      autoResize: true,
      autoFit: 'view',
      padding: 10,
      node: {
        style: {
          fill: '#9EC9FF',
          stroke: '#5B8FF9',
          lineWidth: 2,
          labelText: (d: { data?: { label?: string }; label?: string }) => d.data?.label || d.label || '',
        },
      },
      edge: {
        type: 'quadratic',
        style: {
          stroke: '#F6BD16',
          strokeWidth: 1.5,
          endArrow: true,
          labelText: (d: { data?: { label?: string }; label?: string }) => truncateText(d.data?.label || d.label || ''),
          curveOffset: -20,
          labelFontSize: 8,
          labelPosition: 'middle',
          labelTextAlign: 'center',
          labelOffsetX: 0,
          labelOffsetY: 0,
          labelTextBaseline: 'middle',
        }
      },
      //behaviors: ['drag-canvas'],
    });

     // 处理边点击的通用函数
     const handleEdgeClick = (e: IElementEvent) => {
       // 阻止事件冒泡，防止modal立即关闭  
       e.preventDefault?.();
       e.stopPropagation?.();
       
       if (e.target?.id) {
         const edgeItem: ElementDatum = graph.getElementData(e.target.id);
         const fullLabel = (edgeItem as { data?: { label?: string } })?.data?.label || '';
         
         if (fullLabel) {
           // 延迟一点显示modal，确保touch事件完全结束
           setTimeout(() => {
             setEdgeModalContent(fullLabel);
             setEdgeModalVisible(true);
           }, 100);
         }
       }
     };

     // 处理节点点击的通用函数
     const handleNodeClick = (e: IElementEvent) => {
       // 阻止事件冒泡，防止modal立即关闭  
       e.preventDefault?.();
       e.stopPropagation?.();
       
       if (e.target?.id) {
         const nodeId = e.target.id;
         // 根据节点ID获取对应的modal文本
         const modalText = t(`modal.${nodeId}`);

         if (modalText) {
           // 延迟一点显示modal，确保touch事件完全结束
           setTimeout(() => {
             setNodeModalContent(modalText);
             setNodeModalVisible(true);
           }, 100);
         }
       }
     };

     // 添加边点击事件（PC端）
     graph.on('edge:click', handleEdgeClick);
     
     // 添加边触摸事件（移动端）
     graph.on('edge:touchend', handleEdgeClick);

     // 添加节点点击事件（PC端）
     graph.on('node:click', handleNodeClick);
     
     // 添加节点触摸事件（移动端）
     graph.on('node:touchend', handleNodeClick);

     // 渲染图
     graph.render();

     // 处理组件卸载
     return () => {
       graph.destroy();
     };
   }, [t, truncateText]);

  return (
    <div>
      {/* 应用愿景文字 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '20px',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.3,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: '700',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px',
            lineHeight: '1.2'
          }}>
            {t('vision.title')}
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            fontWeight: '400',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto',
            opacity: '0.95'
          }}>
            {t('vision.subtitle')}
          </p>
        </div>
      </div>

      <div id="mountNode"></div>

      {/* 应用介绍 */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* 主标题 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '30px',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '700',
            margin: '0',
            color: '#8B4513',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {t('introduction.title')}
          </h2>
        </div>

        {/* 步骤列表 */}
        <div style={{
          display: 'grid',
          gap: '30px'
        }}>
          {t.raw('introduction.steps').map((step: { title: string; content: string }, index: number) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
            }}>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                fontWeight: '600',
                margin: '0 0 15px 0',
                color: '#2c3e50',
                lineHeight: '1.3'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: '1.8',
                color: '#34495e',
                margin: '0',
                textAlign: 'justify'
              }}>
                {step.content}
              </p>
            </div>
          ))}
        </div>

        {/* 结论部分 */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          color: 'white'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            fontWeight: '600',
            margin: '0 0 20px 0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {t('introduction.conclusion.title')}
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            {t('introduction.conclusion.content')}
          </p>
        </div>
      </div>

      {/* 边标签详情Modal */}
      <Modal
        open={edgeModalVisible}
        onCancel={(e) => {
          e.stopPropagation();
          setEdgeModalVisible(false);
        }}
        footer={null}
        centered
        maskClosable={true}
        destroyOnClose={true}
        getContainer={() => document.body}
      >
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          {edgeModalContent}
        </p>
      </Modal>

      {/* 节点详情Modal */}
      <Modal
        title={nodeModalContent}
        open={nodeModalVisible}
        onCancel={(e) => {
          e.stopPropagation();
          setNodeModalVisible(false);
        }}
        footer={[
          <button 
            key="back" 
            onClick={(e) => {
              e.stopPropagation();
              setNodeModalVisible(false);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t('modal.backButton')}
          </button>,
        ]}
        centered
        maskClosable={true}
        destroyOnClose={true}
        getContainer={() => document.body}
      >
      </Modal>
    </div>
  );
};
