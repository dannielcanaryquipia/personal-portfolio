import styles from './DataTable.module.css';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  actions,
  emptyMessage = 'No data available',
  emptyIcon,
  onRowClick,
}: DataTableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        {emptyIcon && <div className={styles.emptyIcon}>{emptyIcon}</div>}
        <div className={styles.emptyMessage}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={styles.dataTable}>
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={styles.headerCell}
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
        {actions && actions.length > 0 && (
          <div className={styles.headerCell} style={{ width: '120px' }}>
            Actions
          </div>
        )}
      </div>
      <div className={styles.tableBody}>
        {data.map((row, index) => (
          <div
            key={index}
            className={`${styles.tableRow} ${onRowClick ? styles.clickable : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <div
                key={String(column.key)}
                className={styles.tableCell}
                style={{ width: column.width }}
              >
                {column.render
                  ? column.render(row[column.key as keyof T], row, index)
                  : String(row[column.key as keyof T] ?? '')}
              </div>
            ))}
            {actions && actions.length > 0 && (
              <div className={styles.tableCell} style={{ width: '120px' }}>
                <div className={styles.actions}>
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className={`${styles.actionButton} ${styles[action.variant || 'ghost']}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(row);
                      }}
                      title={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
