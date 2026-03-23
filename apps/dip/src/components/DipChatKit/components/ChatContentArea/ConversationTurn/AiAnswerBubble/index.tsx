import { CopyOutlined, RedoOutlined } from '@ant-design/icons'
import { Bubble, CodeHighlighter, Mermaid } from '@ant-design/x'
import XMarkdown, { type ComponentProps as MarkdownComponentProps } from '@ant-design/x-markdown'
import '@ant-design/x-markdown/dist/x-markdown.css'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import type React from 'react'
import { useMemo } from 'react'
import MessageActions from '../MessageActions'
import styles from './index.module.less'
import type { AiAnswerBubbleProps } from './types'
import {
  buildCardPreviewPayload,
  buildCodePreviewPayload,
  getDomDataAttributes,
  isMermaidLanguage,
  normalizeLanguage,
  normalizeMarkdownText,
} from './utils'

const AiAnswerBubble: React.FC<AiAnswerBubbleProps> = ({ turn, onCopy, onRegenerate, onOpenPreview }) => {
  const markdownComponents = useMemo(() => {
    const CodeRenderer: React.FC<MarkdownComponentProps> = ({
      children,
      lang,
      block,
      className,
    }) => {
      const language = normalizeLanguage(lang)
      const codeText = normalizeMarkdownText(children)

      if (!block) {
        return <code className={clsx(styles.inlineCode, className)}>{codeText}</code>
      }

      if (isMermaidLanguage(language)) {
        return (
          <div
            className={styles.blockCodeWrap}
            onClick={() => {
              onOpenPreview(buildCodePreviewPayload(language, codeText))
            }}
            role="presentation"
          >
            <Mermaid>{codeText}</Mermaid>
          </div>
        )
      }

      return (
        <div
          className={styles.blockCodeWrap}
          onClick={() => {
            onOpenPreview(buildCodePreviewPayload(language, codeText))
          }}
          role="presentation"
        >
          <CodeHighlighter lang={language || 'text'}>{codeText}</CodeHighlighter>
        </div>
      )
    }

    const DivRenderer: React.FC<MarkdownComponentProps> = ({ children, className, domNode }) => {
      const attrs = getDomDataAttributes(domNode)
      const isPreviewCard = attrs['data-preview-card'] === 'true'
      if (!isPreviewCard) {
        return <div className={className}>{children}</div>
      }

      const title = attrs['data-preview-title'] || '回答卡片'
      const content = attrs['data-preview-content'] || normalizeMarkdownText(children)

      return (
        <div
          className={styles.previewCard}
          onClick={() => {
            onOpenPreview(buildCardPreviewPayload(title, content))
          }}
          role="presentation"
        >
          <span className={styles.previewCardTitle}>{title}</span>
          <span className={styles.previewCardDesc}>{content}</span>
        </div>
      )
    }

    return {
      code: CodeRenderer,
      div: DivRenderer,
    }
  }, [onOpenPreview])

  const answerContent = turn.answerMarkdown || (turn.answerLoading ? '处理中...' : '')

  return (
    <div className={clsx('AiAnswerBubble', styles.root)}>
      <Bubble
        className={styles.bubble}
        content={answerContent}
        streaming={turn.answerStreaming}
        typing={turn.answerStreaming ? { effect: 'fade-in' } : false}
        loading={turn.answerLoading && isEmpty(turn.answerMarkdown)}
        contentRender={(content) => {
          return (
            <XMarkdown className={styles.markdownRoot} components={markdownComponents}>
              {normalizeMarkdownText(content)}
            </XMarkdown>
          )
        }}
        footer={
          <div className={styles.actionsWrap}>
            <MessageActions
              actions={[
                {
                  key: 'copy-answer',
                  title: '复制回答',
                  icon: <CopyOutlined />,
                  onClick: onCopy,
                },
                {
                  key: 'regenerate-answer',
                  title: '重新生成',
                  icon: <RedoOutlined />,
                  onClick: onRegenerate,
                },
              ]}
            />
          </div>
        }
      />
      {turn.answerError && <div className={styles.errorText}>{turn.answerError}</div>}
    </div>
  )
}

export default AiAnswerBubble
