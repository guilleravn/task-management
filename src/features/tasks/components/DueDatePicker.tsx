import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { DueDateIcon } from '../../../components/icons/DueDateIcon'
import { Calendar } from './Calendar'

interface DueDatePickerProps {
  value: Date | null
  onChange: (value: Date) => void
}

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const label = value
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Due date'

  return (
    <Popover fullWidth trigger={<PillButton icon={<DueDateIcon />} label={label} />}>
      {(close) => (
        <Calendar
          value={value}
          onChange={(date) => {
            onChange(date)
            close()
          }}
        />
      )}
    </Popover>
  )
}
