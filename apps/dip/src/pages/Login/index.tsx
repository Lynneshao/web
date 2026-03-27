import { LockFilled, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGuideStatus } from '@/apis/dip-studio/guide'
import { useUserInfoStore } from '@/stores'
import { setAccessToken } from '@/utils/http/token-config'
import styles from './index.module.less'
import dipStudioIcon from './logodemo.svg'

function Login() {
  const navigate = useNavigate()
  const { setUserInfo } = useUserInfoStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const account = username.trim()
    const pwd = password.trim()

    if (!account) {
      message.error('请输入账号和密码')
      return
    }
    if (!pwd) {
      message.error('请输入账号和密码')
      return
    }

    const isAdmin = account === 'admin'
    setUserInfo({
      id: `${Date.now()}`,
      account,
      vision_name: isAdmin ? 'admin' : account,
    })
    setAccessToken(`mock-token-${account}`, `mock-refresh-token-${account}`)

    if (!isAdmin) {
      navigate('/home', { replace: true })
      return
    }

    try {
      const guideStatus = await getGuideStatus()
      if (guideStatus.ready) {
        navigate('/digital-human/management', { replace: true })
        return
      }

      navigate('/initial-configuration', {
        replace: true,
        state: { guideStatus, breadcrumbMode: 'init-only' },
      })
    } catch {
      navigate('/digital-human/management', { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.logoBlock}>
            <img src={dipStudioIcon} alt="KWeaver DIP" className={styles.logoIcon} />
          </div>

          <div className={styles.form}>
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="请输入账号"
              variant="borderless"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={() => {
                void handleLogin()
              }}
            />
            <Input.Password
              prefix={<LockFilled className={styles.inputIcon} />}
              placeholder="请输入密码"
              variant="borderless"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={() => {
                void handleLogin()
              }}
            />
            <Checkbox className={styles.checkbox}>记住登录状态</Checkbox>
            <Button type="primary" block className={styles.loginButton} onClick={handleLogin}>
              立即登录
            </Button>
          </div>

          <div className={styles.agreement}>
            登录即表示同意
            <a href="/" onClick={(e) => e.preventDefault()}>
              用户协议
            </a>
            、
            <a href="/" onClick={(e) => e.preventDefault()}>
              隐私政策
            </a>
          </div>
        </div>
        <div className={styles.footer}>版本信息 ｜ 沪ICP备09089247号-9</div>
      </div>
    </div>
  )
}

export default Login
