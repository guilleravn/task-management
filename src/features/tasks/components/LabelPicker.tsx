import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { LabelIcon } from '../../../components/icons/LabelIcon'
import { TASK_TAG_VALUES, TASK_TAG_LABELS, type TaskTag } from '../enums'
import styles from './LabelPicker.module.css'

interface LabelPickerProps {
  value: TaskTag[]
  onChange: (value: TaskTag[]) => void
}

export function LabelPicker({ value, onChange }: LabelPickerProps) {
  const label = value.length > 0 ? value.map((tag) => TASK_TAG_LABELS[tag]).join(', ') : 'Label'

  function toggleTag(tag: TaskTag) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag])
  }

  return (
    <Popover trigger={<PillButton icon={<LabelIcon />} label={label} />}>
      <ul className={styles.list}>
        {TASK_TAG_VALUES.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              className={value.includes(tag) ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => toggleTag(tag)}
            >
              {TASK_TAG_LABELS[tag]}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  )
}
