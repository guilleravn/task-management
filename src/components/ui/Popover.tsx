import { useState, useRef, useEffect, type ReactNode } from 'react'
import styles from './Popover.module.css'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
}

export function Popover({ trigger, children }: PopoverProps) {
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
    <div className={styles.container} ref={containerRef}>
      <div onClick={() => setIsOpen((current) => !current)}>{trigger}</div>
      {isOpen && (
        <div className={styles.panel}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}
