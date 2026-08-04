import styles from './BoardColumn.module.css'

interface BoardColumnProps {
  title: string;
}

export function BoardColumn({ title }: BoardColumnProps) {
    return (
        <div className={styles.column}>
            <h3 className={styles.Title}>{title}</h3>
        </div>
    );
}