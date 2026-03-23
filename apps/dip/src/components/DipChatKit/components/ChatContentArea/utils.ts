import type { AiPromptSubmitPayload } from '../AiPromptInput/types'
import type { DipChatKitMessageTurn } from '../../types'

export const buildRegeneratePayload = (turn: DipChatKitMessageTurn): AiPromptSubmitPayload => {
  const files = turn.questionAttachments
    .map((attachment) => attachment.file)
    .filter((file): file is File => file instanceof File)

  return {
    content: turn.question,
    files,
    employees: turn.questionEmployees || [],
  }
}
