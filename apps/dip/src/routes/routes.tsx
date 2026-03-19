import { lazy } from 'react'
import { SYSTEM_FIXED_APP_ADMIN_USER_ID, SYSTEM_FIXED_NORMAL_USER_ID } from '@/apis/types'
import applicationsUrl from '@/assets/images/sider/applications.svg'
import appStoreUrl from '@/assets/images/sider/appStore.svg'
import dipStudioUrl from '@/assets/images/sider/dipStudio.svg'
import type { RouteConfig } from './types'

const MyApp = lazy(() => import('../pages/MyApp'))
const AppStore = lazy(() => import('../pages/AppStore'))
const Home = lazy(() => import('../pages/Home'))
const WorkPlan = lazy(() => import('../pages/DigitalHuman/WorkPlan'))
const History = lazy(() => import('../pages/DigitalHuman/History'))
const DigitalHumanManagement = lazy(() => import('../pages/DigitalHuman/Management'))
const DESetting = lazy(() => import('../pages/DigitalHuman/DESetting'))

/**
 * 路由配置数组
 * 这里定义了所有路由信息，包括路径、组件、菜单显示等
 */
export const routeConfigs: RouteConfig[] = [
  // --- Home Section ---
  {
    path: 'home',
    key: 'home',
    label: '首页',
    iconUrl: dipStudioUrl,
    requiredRoleIds: [],
    element: <Home />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'home',
        headerType: 'micro-app',
      },
    },
  },

  // --- AI Store Section ---
  {
    path: 'store/my-app',
    key: 'my-app',
    label: '应用',
    iconUrl: applicationsUrl,
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    element: <MyApp />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: true,
        siderType: 'store',
        headerType: 'store',
      },
    },
  },
  {
    path: 'store/app-store',
    key: 'app-store',
    label: '应用商店',
    iconUrl: appStoreUrl,
    requiredRoleIds: [SYSTEM_FIXED_APP_ADMIN_USER_ID],
    element: <AppStore />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: true,
        siderType: 'store',
        headerType: 'store',
      },
    },
  },

  // --- Digital Human Section ---
  {
    path: 'digital-human/work-plan',
    key: 'work-plan',
    label: '工作计划',
    iconUrl: dipStudioUrl,
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    element: <WorkPlan />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
  {
    path: 'digital-human/work-plan/:workPlanId',
    key: 'work-plan-item',
    label: '工作计划',
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    // element: <WorkPlan />,
    showInSidebar: false,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
  {
    path: 'digital-human/history',
    key: 'history',
    label: '历史记录',
    iconUrl: dipStudioUrl,
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    element: <History />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
  {
    path: 'digital-human/history/:historyId',
    key: 'history-item',
    label: '历史记录',
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    // element: <WorkPlan />,
    showInSidebar: false,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
  {
    path: 'digital-human/management',
    key: 'digital-human-management',
    label: '数字员工',
    iconUrl: dipStudioUrl,
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    element: <DigitalHumanManagement />,
    showInSidebar: true,
    handle: {
      layout: {
        hasSider: true,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
  {
    path: 'digital-human/management/:id/setting',
    key: 'digital-employee-setting',
    label: '数字员工配置',
    requiredRoleIds: [SYSTEM_FIXED_NORMAL_USER_ID],
    element: <DESetting />,
    showInSidebar: false,
    handle: {
      layout: {
        hasSider: false,
        hasHeader: false,
        siderType: 'digital-human',
        headerType: 'home',
      },
    },
  },
]
