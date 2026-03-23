import type { DipChatKitMessageTurn, DipChatKitPreviewPayload } from '../../../../types'

export interface AiAnswerBubbleProps {
  turn: DipChatKitMessageTurn
  onCopy: () => void
  onRegenerate: () => void
  onOpenPreview: (payload: DipChatKitPreviewPayload) => void
}

