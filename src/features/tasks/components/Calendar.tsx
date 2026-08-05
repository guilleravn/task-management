import { useState } from 'react'
import styles from './Calendar.module.css'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarProps {
  value: Date | null
  onChange: (date: Date) => void
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getCalendarDays(viewedMonth: Date) {
  const firstOfMonth = startOfMonth(viewedMonth)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate()

  const days: { date: Date; isCurrentMonth: boolean }[] = []

  for (let i = startWeekday; i > 0; i--) {
    days.push({
      date: new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1 - i),
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), day),
      isCurrentMonth: true,
    })
  }

  while (days.length < 42) {
    const last = days[days.length - 1].date
    days.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      isCurrentMonth: false,
    })
  }

  return days
}

export function Calendar({ value, onChange }: CalendarProps) {
  const [viewedMonth, setViewedMonth] = useState(startOfMonth(value ?? new Date()))

  const days = getCalendarDays(viewedMonth)
  const monthLabel = viewedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const today = new Date()

  function goToMonth(offset: number) {
    setViewedMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + offset, 1))
  }

  function goToYear(offset: number) {
    setViewedMonth(new Date(viewedMonth.getFullYear() + offset, viewedMonth.getMonth(), 1))
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" onClick={() => goToYear(-1)} aria-label="Previous year">
          «
        </button>
        <button type="button" onClick={() => goToMonth(-1)} aria-label="Previous month">
          ‹
        </button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button type="button" onClick={() => goToMonth(1)} aria-label="Next month">
          ›
        </button>
        <button type="button" onClick={() => goToYear(1)} aria-label="Next year">
          »
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className={styles.days}>
        {days.map(({ date, isCurrentMonth }) => {
          const isSelected = value !== null && isSameDay(date, value)
          const isToday = isSameDay(date, today)

          const dayClass = [
            styles.day,
            !isCurrentMonth && styles.outsideMonth,
            isSelected && styles.selected,
            isToday && !isSelected && styles.today,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={dayClass}
              onClick={() => onChange(date)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <button type="button" className={styles.todayButton} onClick={() => onChange(today)}>
        Today
      </button>
    </div>
  )
}
