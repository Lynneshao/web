import isString from 'lodash/isString'
import type { DipChatKitPreviewPayload } from '../../../../types'

export const normalizeMarkdownText = (value: unknown): string => {
  if (isString(value)) return value
  if (value === null || value === undefined) return ''
  return String(value)
}

export const normalizeLanguage = (lang?: string): string => {
  if (!lang) return ''
  return lang.trim().split(/\s+/)[0]?.toLowerCase() || ''
}

export const isMermaidLanguage = (lang: string): boolean => {
  return lang === 'mermaid'
}

export const getDomDataAttributes = (domNode: unknown): Record<string, string> => {
  if (!domNode || typeof domNode !== 'object') return {}
  if (!('attribs' in domNode)) return {}

  const attrs = (domNode as { attribs?: Record<string, string> }).attribs
  if (!attrs || typeof attrs !== 'object') return {}
  return attrs
}

export const buildCodePreviewPayload = (lang: string, code: string): DipChatKitPreviewPayload => {
  const sourceType = isMermaidLanguage(lang) ? 'mermaid' : 'code'
  return {
    title: isMermaidLanguage(lang) ? 'Mermaid 预览' : `${lang || 'text'} 代码片段`,
    content: code,
    sourceType,
  }
}

export const buildCardPreviewPayload = (
  title: string,
  content: string,
): DipChatKitPreviewPayload => {
  return {
    title,
    content,
    sourceType: 'card',
  }
}

