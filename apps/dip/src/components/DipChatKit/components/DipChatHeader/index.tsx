import clsx from 'clsx'
import type React from 'react'
import IconFont from '@/components/IconFont'
import styles from './index.module.less'
import type { DipChatHeaderProps } from './types'

const DipChatHeader: React.FC<DipChatHeaderProps> = ({ title }) => {
  return (
    <div className={clsx('DipChatHeader', styles.root)}>
      <div className={styles.titleWrap}>
        <IconFont type="icon-dip-color-wendangxieru" className={styles.titleIcon} />
        <span className={styles.titleText} title={title}>
          {title}
        </span>
      </div>
    </div>
  )
}

export default DipChatHeader
