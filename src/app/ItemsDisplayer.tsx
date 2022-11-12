import { formatDate, map } from '@edsolater/fnkit'

export function ItemsDisplayer<T extends Record<string, any>>({
  items,
  getItemKey,
  layoutType = 'table'
}: {
  items: T[]
  getItemKey?: (item: T) => string | number
  layoutType?: 'table'
}) {
  const itemProperties = Object.keys(items[0] ?? {})
  const typeMap = {
    table: () => (
      <table className={ItemsDisplayer.name} style={{ border: '1px solid', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {map(itemProperties, (p) => (
              <th key={p}>{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {map(items, (i, idx) => (
            <tr key={getItemKey?.(i) ?? i.id ?? idx}>
              {map(Object.entries(i), ([key, value]) => (
                <td key={key} style={{ paddingInline: 8, paddingBlock: 4 }}>
                  {stringify(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return typeMap[layoutType]()
}

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
