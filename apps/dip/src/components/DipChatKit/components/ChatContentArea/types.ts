import type { AiPromptMentionOption } from '../AiPromptInput/types'
import type { DipChatKitSendHandler } from '../../types'

export interface ChatContentAreaProps {
  employeeOptions?: AiPromptMentionOption[]
  defaultEmployeeValue?: string
  inputPlaceholder?: string
  onSend?: DipChatKitSendHandler
  onRegenerate?: DipChatKitSendHandler
}
