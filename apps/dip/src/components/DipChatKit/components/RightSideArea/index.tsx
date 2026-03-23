import { CloseOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import clsx from 'clsx'
import type React from 'react'
import styles from './index.module.less'
import type { RightSideAreaProps } from './types'

const RightSideArea: React.FC<RightSideAreaProps> = ({ visible, payload, onClose }) => {
  return (
    <div className={clsx('RightSideArea', styles.root)}>
      <div className={styles.header}>
        <span className={styles.title}>预览区</span>
        <Tooltip title="关闭预览">
          <Button
            type="text"
            aria-label="关闭预览"
            icon={<CloseOutlined />}
            onClick={onClose}
            disabled={!visible}
          />
        </Tooltip>
      </div>
      <div className={styles.content}>
        <div className={styles.placeholderCard}>
          <div className={styles.placeholderTitle}>{payload?.title || 'RightSideArea 占位区域'}</div>
          <p className={styles.placeholderContent}>
            {payload?.content || '后续会在这里承载回答卡片联动的详细预览内容。'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RightSideArea
