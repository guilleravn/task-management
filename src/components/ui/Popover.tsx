import { useState, useRef, useEffect, useLayoutEffect, useId, type ReactNode } from 'react'
import styles from './Popover.module.css'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
  fullWidth?: boolean
}

export function Popover({ trigger, children, fullWidth = false }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [alignEnd, setAlignEnd] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()

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

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    setAlignEnd(rect.right > window.innerWidth)
  }, [isOpen])

  function toggleOpen() {
    const next = !isOpen
    setIsOpen(next)
    if (next) setAlignEnd(false)
  }

  // Choosing an option unmounts the panel, so hand focus back to the trigger. A modal opened
  // from the option (Edit/Delete) then has a focused element to restore when it closes.
  // Looked up by id rather than a ref because `close` is handed to children during render.
  function close() {
    setIsOpen(false)
    document.getElementById(triggerId)?.focus()
  }

  return (
    <div
      className={fullWidth ? `${styles.container} ${styles.fullWidth}` : styles.container}
      ref={containerRef}
    >
      <button
        id={triggerId}
        type="button"
        className={fullWidth ? `${styles.trigger} ${styles.triggerFullWidth}` : styles.trigger}
        onClick={toggleOpen}
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          className={alignEnd ? `${styles.panel} ${styles.alignEnd}` : styles.panel}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}
