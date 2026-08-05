import { useState } from 'react'
import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { LabelIcon } from '../../../components/icons/LabelIcon'
import { TASK_TAG_VALUES, TASK_TAG_LABELS, TASK_TAG_COLOR_VARS, type TaskTag } from '../enums'
import styles from './LabelPicker.module.css'

interface LabelPickerProps {
  value: TaskTag[]
  onChange: (value: TaskTag[]) => void
}

export function LabelPicker({ value, onChange }: LabelPickerProps) {
  const [query, setQuery] = useState('')

  function toggleTag(tag: TaskTag) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag])
  }

  const filteredTags = TASK_TAG_VALUES.filter((tag) =>
    TASK_TAG_LABELS[tag].toLowerCase().includes(query.toLowerCase()),
  )

  const trigger =
    value.length > 0 ? (
      <span className={styles.chips}>
        {value.map((tag) => {
          const colorVar = `var(${TASK_TAG_COLOR_VARS[tag]})`
          return (
            <span
              key={tag}
              className={styles.chip}
              style={{
                color: colorVar,
                backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)`,
              }}
            >
              {TASK_TAG_LABELS[tag]}
            </span>
          )
        })}
      </span>
    ) : (
      <PillButton icon={<LabelIcon />} label="Label" />
    )

  return (
    <Popover trigger={trigger}>
      <p className={styles.title}>Label</p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search labels..."
        className={styles.search}
      />
      <ul className={styles.list}>
        {filteredTags.map((tag) => (
          <li key={tag}>
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {TASK_TAG_LABELS[tag]}
            </label>
          </li>
        ))}
        {filteredTags.length === 0 && <li className={styles.empty}>No labels found.</li>}
      </ul>
    </Popover>
  )
}
