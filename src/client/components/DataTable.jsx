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
                          // Handle object or string status safely
                          (() => {
                            const raw = row[column.key];
                            const value = typeof raw === 'object' && raw !== null ? (raw.value || raw.display_value || raw) : raw;
                            const display = typeof raw === 'object' && raw !== null ? (raw.display_value || raw.value || String(raw)) : value;
                            return (
                              <span className={`status-pill status-${String(value || '').toLowerCase().replace(/\s+/g, '_')}`}>
                                {display}
                              </span>
                            );
                          })()
                        ) : column.type === 'avatar' ? (
                          // Normalize value (could be object with display_value)
                          (() => {
                            const raw = row[column.key];
                            const display = typeof raw === 'object' && raw !== null ? (raw.display_value || raw.value || '') : (raw || '');
                            const initial = display ? String(display).charAt(0).toUpperCase() : '?';
                            return (
                              <div className="avatar-cell">
                                <div className="avatar">
                                  {initial}
                                </div>
                                <span>{display}</span>
                              </div>
                            );
                          })()
                        ) : (
                          // Fallback: render display_value for objects, else raw
                          (() => {
                            const raw = row[column.key];
                            return typeof raw === 'object' && raw !== null ? (raw.display_value ?? raw.value ?? JSON.stringify(raw)) : raw;
                          })()
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