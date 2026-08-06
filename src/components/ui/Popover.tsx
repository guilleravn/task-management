import { useState, useRef, useEffect, type ReactNode } from 'react'
import styles from './Popover.module.css'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
  fullWidth?: boolean
}

export function Popover({ trigger, children, fullWidth = false }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function close() {
    setIsOpen(false)
  }

  return (
    <div
      className={fullWidth ? `${styles.container} ${styles.fullWidth}` : styles.container}
      ref={containerRef}
    >
      <button
        type="button"
        className={fullWidth ? `${styles.trigger} ${styles.triggerFullWidth}` : styles.trigger}
        onClick={() => setIsOpen((current) => !current)}
      >
        {trigger}
      </button>
      {isOpen && (
        <div className={styles.panel}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}
