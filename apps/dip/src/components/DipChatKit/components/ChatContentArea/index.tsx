import { VerticalAlignBottomOutlined } from '@ant-design/icons'
import { Button, message, Tooltip } from 'antd'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDipChatKitStore } from '../../store'
import type { DipChatKitSendHandler } from '../../types'
import { isAsyncIterable, normalizeStreamChunk, splitTextToChunks, wait } from '../../utils'
import AiPromptInput from '../AiPromptInput'
import type { AiPromptSubmitPayload } from '../AiPromptInput/types'
import ConversationTurn from './ConversationTurn'
import ScrollContainer from '../ScrollContainer'
import type { ScrollContainerRef } from '../ScrollContainer/types'
import styles from './index.module.less'
import type { ChatContentAreaProps } from './types'
import { buildRegeneratePayload, getFallbackAnswer } from './utils'

const ChatContentArea: React.FC<ChatContentAreaProps> = ({
  employeeOptions,
  defaultEmployeeValue,
  inputPlaceholder,
  onSend,
  onRegenerate,
}) => {
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<ScrollContainerRef | null>(null)
  const {
    dipChatKitStore: { messageTurns, scroll },
    appendQuestionTurn,
    startAnswerStream,
    appendAnswerChunk,
    finishAnswerStream,
    failAnswerStream,
    openPreview,
    setAutoScrollEnabled,
    setShowBackToBottom,
    setIsAtBottom,
  } = useDipChatKitStore()

  const streamLoading = useMemo(() => {
    return messageTurns.some((turn) => turn.answerStreaming)
  }, [messageTurns])

  const streamFingerprint = useMemo(() => {
    return messageTurns
      .map((turn) => `${turn.id}:${turn.answerMarkdown.length}:${turn.answerStreaming ? '1' : '0'}`)
      .join('|')
  }, [messageTurns])

  const consumeSendResult = useCallback(
    async (turnId: string, result: Awaited<ReturnType<DipChatKitSendHandler>>) => {
      if (isString(result)) {
        if (result) {
          appendAnswerChunk(turnId, result)
        }
        finishAnswerStream(turnId)
        return
      }

      if (isAsyncIterable(result)) {
        for await (const chunk of result) {
          const textChunk = normalizeStreamChunk(chunk)
          if (textChunk) {
            appendAnswerChunk(turnId, textChunk)
          }
        }
        finishAnswerStream(turnId)
        return
      }

      finishAnswerStream(turnId)
    },
    [appendAnswerChunk, finishAnswerStream],
  )

  const runFallbackStream = useCallback(
    async (turnId: string, question: string) => {
      const fallbackAnswer = getFallbackAnswer(question)
      const chunks = splitTextToChunks(fallbackAnswer, 18)
      for (const chunk of chunks) {
        appendAnswerChunk(turnId, chunk)
        await wait(70)
      }
      finishAnswerStream(turnId)
    },
    [appendAnswerChunk, finishAnswerStream],
  )

  const runSendFlow = useCallback(
    async (payload: AiPromptSubmitPayload, turnId: string, regenerate: boolean) => {
      const handler = regenerate ? onRegenerate || onSend : onSend
      startAnswerStream(turnId, regenerate)

      try {
        if (!handler) {
          await runFallbackStream(turnId, payload.content)
          return
        }

        const result = await handler(payload, { turnId, regenerate })
        await consumeSendResult(turnId, result)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '回答生成失败，请稍后重试'
        failAnswerStream(turnId, errorMessage)
        message.error(errorMessage)
      }
    },
    [consumeSendResult, failAnswerStream, onRegenerate, onSend, runFallbackStream, startAnswerStream],
  )

  useEffect(() => {
    if (!scroll.autoScrollEnabled) return
    scrollRef.current?.scrollToBottom('auto')
  }, [streamFingerprint, scroll.autoScrollEnabled])

  const handleSubmit = useCallback(
    async (payload: AiPromptSubmitPayload) => {
      const turnId = appendQuestionTurn(payload)
      setInputValue('')
      setAutoScrollEnabled(true)
      setShowBackToBottom(false)
      await runSendFlow(payload, turnId, false)
    },
    [appendQuestionTurn, runSendFlow, setAutoScrollEnabled, setShowBackToBottom],
  )

  const copyText = useCallback(async (text: string, successMessage: string) => {
    if (!text) {
      message.warning('暂无可复制内容')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      message.success(successMessage)
    } catch {
      message.error('复制失败，请检查浏览器权限设置')
    }
  }, [])

  return (
    <div className={clsx('ChatContentArea', styles.root)}>
      <ScrollContainer
        ref={scrollRef}
        className={styles.scrollArea}
        onUserScrollUp={() => {
          setAutoScrollEnabled(false)
          setShowBackToBottom(true)
        }}
        onReachBottomChange={(isAtBottom) => {
          setIsAtBottom(isAtBottom)
          if (isAtBottom) {
            setShowBackToBottom(false)
          }
        }}
      >
        <div className={styles.messageList}>
          <div className={styles.messageListContent}>
            {isEmpty(messageTurns) && <div className={styles.emptyState}>请输入问题开始对话。</div>}
            {messageTurns.map((turn) => {
              return (
                <ConversationTurn
                  key={turn.id}
                  turn={turn}
                  onEditQuestion={(_, question) => {
                    setInputValue(question)
                    message.success('问题内容已回填至输入框')
                  }}
                  onCopyQuestion={(question) => {
                    void copyText(question, '问题复制成功')
                  }}
                  onCopyAnswer={(answer) => {
                    void copyText(answer, '回答复制成功')
                  }}
                  onRegenerateAnswer={(turnId) => {
                    const targetTurn = messageTurns.find((item) => item.id === turnId)
                    if (!targetTurn) {
                      message.error('未找到可重新生成的问题')
                      return
                    }

                    const regeneratePayload = buildRegeneratePayload(targetTurn)
                    setAutoScrollEnabled(true)
                    setShowBackToBottom(false)
                    void runSendFlow(regeneratePayload, turnId, true)
                  }}
                  onOpenPreview={(turnId, payload) => {
                    openPreview(turnId, payload)
                  }}
                />
              )
            })}
          </div>
        </div>
      </ScrollContainer>

      {scroll.showBackToBottom && (
        <div className={styles.backToBottomWrap}>
          <div className={styles.backToBottomBtn}>
            <Tooltip title="返回底部">
              <Button
                type="primary"
                shape="circle"
                aria-label="返回底部"
                icon={<VerticalAlignBottomOutlined />}
                onClick={() => {
                  scrollRef.current?.scrollToBottom('smooth')
                  setShowBackToBottom(false)
                  if (streamLoading) {
                    setAutoScrollEnabled(true)
                  }
                }}
              />
            </Tooltip>
          </div>
        </div>
      )}

      <div className={styles.inputArea}>
        <div className={styles.inputContent}>
          <div className={styles.inputInner}>
            <AiPromptInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={(payload) => {
                void handleSubmit(payload)
              }}
              employeeOptions={employeeOptions}
              defaultEmployeeValue={defaultEmployeeValue}
              loading={streamLoading}
              placeholder={inputPlaceholder || '发送消息...'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContentArea


