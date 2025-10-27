import React from 'react';
import './DataTable.css';

export default function DataTable({ data, columns, emptyMessage, onAction }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>{emptyMessage || 'No data available'}</h3>
        <p>Data will appear here once available</p>
      </div>
    );
  }

  return (
    <div className="modern-table-container">
      <div className="modern-table">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.icon && <span className="column-icon">{column.icon}</span>}
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || index} className="table-row-hover">
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`}>
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : (
                      <div className="cell-content">
                        {column.type === 'status' ? (
                          <span className={`status-pill status-${row[column.key]?.toLowerCase()}`}>
                            {row[column.key]}
                          </span>
                        ) : column.type === 'avatar' ? (
                          <div className="avatar-cell">
                            <div className="avatar">
                              {row[column.key]?.charAt(0) || '?'}
                            </div>
                            <span>{row[column.key]}</span>
                          </div>
                        ) : (
                          row[column.key]
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}