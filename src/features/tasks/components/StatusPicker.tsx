import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { StatusIcon } from '../../../components/icons/StatusIcon'
import { STATUS_VALUES, STATUS_LABELS, type Status } from '../enums'
import styles from './StatusPicker.module.css'

interface StatusPickerProps {
  value: Status | null
  onChange: (value: Status) => void
}

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  const label = value ? STATUS_LABELS[value] : 'Status'

  return (
    <Popover fullWidth trigger={<PillButton icon={<StatusIcon />} label={label} />}>
      {(close) => (
        <>
          <p className={styles.title}>Status</p>
          <ul className={styles.list}>
            {STATUS_VALUES.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className={styles.option}
                  onClick={() => {
                    onChange(option)
                    close()
                  }}
                >
                  {STATUS_LABELS[option]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Popover>
  )
}
