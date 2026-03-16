import { vi } from 'vitest'

const { mockRequest, mockResponseUse, mockRequestUse } = vi.hoisted(() => ({
  mockRequest: vi.fn(),
  mockResponseUse: vi.fn(),
  mockRequestUse: vi.fn(),
}))

vi.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: mockRequestUse,
      },
      response: {
        use: mockResponseUse,
      },
    },
    request: mockRequest,
  }

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
    CancelToken: {
      source: vi.fn(() => ({
        token: 'mock-token',
        cancel: vi.fn(),
      })),
    },
    isCancel: vi.fn(),
  }
})

// 导入axiosInstance，这里axios已经被mock了
import axiosInstance from '@/utils/http/axios-instance'

export { mockRequest, mockResponseUse, mockRequestUse, axiosInstance }
