import type { DipChatKitMessageTurn } from '@/components/DipChatKit/types'
import type { AiPromptSubmitPayload } from '@/components/DipChatKit/components/AiPromptInput/types'

export interface ChatKitTestRouteState {
  submitData?: AiPromptSubmitPayload
}

export interface ChatKitTestLocationState {
  state: ChatKitTestRouteState
}

export type BuildDefaultMessageTurns = (submitData?: AiPromptSubmitPayload) => DipChatKitMessageTurn[]
