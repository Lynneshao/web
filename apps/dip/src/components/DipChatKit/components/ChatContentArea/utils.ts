import type { AiPromptSubmitPayload } from '../AiPromptInput/types'
import type { DipChatKitMessageTurn } from '../../types'

export const buildRegeneratePayload = (turn: DipChatKitMessageTurn): AiPromptSubmitPayload => {
  const files = turn.questionAttachments
    .map((attachment) => attachment.file)
    .filter((file): file is File => file instanceof File)

  return {
    content: turn.question,
    files,
    employees: [],
  }
}

export const getFallbackAnswer = (question: string): string => {
  return [
    `已收到你的问题："${question}"。`,
    '当前组件已完成基础结构与交互，可接入真实 SSE 数据流。',
    '如果你希望我继续，我会在下一步对接后端流式接口并补齐业务卡片渲染。',
  ].join('\n\n')
}
