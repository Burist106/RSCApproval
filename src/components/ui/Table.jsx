/**
 * Table Component
 * Reusable data table with consistent styling
 * 
 * @param {Array} columns - Column definitions { key, label, width, render }
 * @param {Array} data - Data array
 * @param {function} onRowClick - Row click handler
 */

export default function Table({ 
  columns = [], 
  data = [],
  onRowClick,
  emptyMessage = 'ไม่พบข้อมูล',
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`
                    px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider
                    ${col.width || ''}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <i className="fa-solid fa-inbox text-4xl mb-4 block opacity-50"></i>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    hover:bg-slate-50 transition
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
