import { map } from '@edsolater/fnkit'
import { cssCol, cssGrid, Div } from '@edsolater/uikit'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'

function App() {
  const { list, insertAnNewItem } = useXDBList()
  useConsoleLog({ data: { list }, disabled: true })
  return (
    <div className='App'>
      <Div>
        <Div icss={{ fontSize: '24px' }}>Current idb:</Div>
        <button onClick={insertAnNewItem}>Insert Item</button>
      </Div>

      <Div>
        {/* <Div icss={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {list.map((i) => (
            <ObjectIllustrator item={i} />
          ))}
        </Div> */}
        <ListObjectIllustrator items={list} getItemKey={(i) => i.title} />
      </Div>
    </div>
  )
}

function ListObjectIllustrator<T extends object>({
  items,
  getItemKey,
  layoutType = 'table'
}: {
  items: T[]
  getItemKey?: (item: T) => string | number
  layoutType?: 'table'
}) {
  console.log('items: ', items)

  const itemProperties = Object.keys(items[0] ?? {})
  const typeMap = {
    table: () => (
      <table style={{ border: '1px solid', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {map(itemProperties, (p) => (
              <th key={p}>{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {map(items, (i) => (
            <tr key={getItemKey?.(i)}>
              {map(Object.entries(i), ([key, value]) => (
                <td key={key}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return typeMap[layoutType]()
}

function ObjectIllustrator({ item, layoutType = 'table' }: { item: object; layoutType?: 'table' | 'row' }) {
  const typeMap = {
    row: () => (
      <Div icss={cssCol({ gap: 8 })}>
        {Object.entries(item).map(([propertyName, value]) => (
          <Div key={propertyName} icss={cssGrid({ gridTemplateColumns: '1fr 2fr', gap: 4 })}>
            <Div icss={{ fontWeight: 'bold' }}>{propertyName}:</Div>
            <Div>{String(value)}</Div>
          </Div>
        ))}
      </Div>
    ),
    table: () => (
      <table style={{ border: '1px solid' }}>
        {Object.entries(item).map(([propertyName, value]) => (
          <tr key={propertyName}>
            <td style={{ fontWeight: 'bold' }}>{propertyName}:</td>
            <td>{String(value)}</td>
          </tr>
        ))}
      </table>
    )
  }
  return typeMap[layoutType]()
}

export default App
