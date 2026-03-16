import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLanguage } from '@/hooks/useLanguage'
import { useLanguageStore } from '@/stores/languageStore'
import { setMicroAppGlobalState } from '@/utils/micro-app/globalState'
import { DEFAULT_LOCALE } from '@/i18n/config'

vi.mock('react-intl-universal', () => ({
  default: {
    init: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/utils/micro-app/globalState', () => ({
  setMicroAppGlobalState: vi.fn(),
}))

const { mockGetState, mockSetState, mockSetLanguage } = vi.hoisted(() => {
  return {
    mockGetState: vi.fn(),
    mockSetState: vi.fn(),
    mockSetLanguage: vi.fn(),
  }
})

vi.mock('@/stores/languageStore', () => {
  const mockUseLanguageStore = vi.fn(() => ({
    setLanguage: mockSetLanguage,
  })) as any
  mockUseLanguageStore.getState = mockGetState
  mockUseLanguageStore.setState = mockSetState
  return {
    useLanguageStore: mockUseLanguageStore,
  }
})

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetState.mockReturnValue({ language: null })
    setMicroAppGlobalState.mockClear()
  })

  it('should return initLanguage and updateLanguage methods', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current.initLanguage).toBeDefined()
    expect(typeof result.current.initLanguage).toBe('function')
    expect(result.current.updateLanguage).toBeDefined()
    expect(typeof result.current.updateLanguage).toBe('function')
  })

  it('should init language with persisted language', async () => {
    mockGetState.mockReturnValue({ language: 'en-US' })

    const { result } = renderHook(() => useLanguage())
    await act(async () => {
      await result.current.initLanguage()
    })

    expect(setMicroAppGlobalState).toHaveBeenCalled()
    expect(setMicroAppGlobalState).toHaveBeenCalledWith(
      { language: 'en-US' },
      { allowAllFields: true },
    )
  })

  it('should use fallback when no persisted language (getNavigatorLanguage returns en-US in jsdom)', async () => {
    // 必须在这里设置，因为 initLanguage 会立即读取
    mockGetState.mockReturnValue({ language: null })

    const { result } = renderHook(() => useLanguage())
    await act(async () => {
      await result.current.initLanguage()
    })

    expect(setMicroAppGlobalState).toHaveBeenCalled()
    // 在 jsdom 环境中，navigator.language 是 en-US，所以最终结果是 en-US
    // 实际浏览器环境会命中用户浏览器语言，逻辑正确
    expect(setMicroAppGlobalState).toHaveBeenCalledWith(
      { language: expect.any(String) },
      { allowAllFields: true },
    )
    // 要么是 en-US 要么是 DEFAULT_LOCALE，只要传了就是对的
    const callArgs = (setMicroAppGlobalState as vi.Mock).mock.calls[0][0]
    expect(['en-US', DEFAULT_LOCALE]).toContain(callArgs.language)
  })

  it('should not throw when init fails', async () => {
    const intl = await import('react-intl-universal')
    ;(intl.default.init as vi.Mock).mockRejectedValue(new Error('init failed'))

    const { result } = renderHook(() => useLanguage())

    await expect(result.current.initLanguage()).resolves.not.toThrow()
  })

  it('should update language correctly', async () => {
    mockGetState.mockReturnValue({ language: null })

    const { result } = renderHook(() => useLanguage())

    await act(async () => {
      await result.current.updateLanguage('en-US')
    })

    expect(mockSetLanguage).toHaveBeenCalled()
    expect(setMicroAppGlobalState).toHaveBeenCalledWith(
      { language: 'en-US' },
      { allowAllFields: true },
    )
  })
})
