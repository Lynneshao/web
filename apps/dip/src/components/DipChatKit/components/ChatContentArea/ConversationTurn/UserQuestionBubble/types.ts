import type { DipChatKitAttachment } from '../../../../types'

export interface UserQuestionBubbleProps {
  question: string
  attachments: DipChatKitAttachment[]
  onEdit: () => void
  onCopy: () => void
}

