export interface DipChatKitCreateSessionKeyResponse {
  sessionKey: string
}

export interface DipChatKitCreateSessionKeyRequest {
  agentId: string
}

export interface DipChatKitDigitalHuman {
  id: string
  name: string
}

export type DipChatKitDigitalHumanList = DipChatKitDigitalHuman[]

export interface DipChatKitResponseSSEOptions {
  sessionKey: string
  timeout?: number
  signal?: AbortSignal
}

export type DipChatKitResponseRequestBody = Record<string, unknown>
