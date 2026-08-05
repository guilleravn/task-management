import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { EstimateIcon } from '../../../components/icons/EstimateIcon'
import { POINT_ESTIMATE_VALUES, POINT_ESTIMATE_LABELS, type PointEstimate } from '../enums'
import styles from './EstimatePicker.module.css'

interface EstimatePickerProps {
  value: PointEstimate | null
  onChange: (value: PointEstimate) => void
}

export function EstimatePicker({ value, onChange }: EstimatePickerProps) {
  const label = value ? `${POINT_ESTIMATE_LABELS[value]} Points` : 'Estimate'

  return (
    <Popover trigger={<PillButton icon={<EstimateIcon />} label={label} />}>
      {(close) => (
        <ul className={styles.list}>
          {POINT_ESTIMATE_VALUES.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={styles.option}
                onClick={() => {
                  onChange(option)
                  close()
                }}
              >
                {POINT_ESTIMATE_LABELS[option]} Points
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  )
}
