import { addDefault, formatDate } from '@edsolater/fnkit'
import { componentkit, Div, hover, Icon, ICSS } from '@edsolater/uikit'
import { ItemsListBasic, ItemsListBasicProps } from '../ItemsDisplayer'
import deleteIconUrl from '/delete.svg'

export type TodoListDisplayerProps<Item extends Record<string, any>> = {
  items: ItemsListBasicProps<Item>['items']
  layoutType?: 'table'
  getItemKey?: ItemsListBasicProps<Item>['getItemKey']
  onDeleteItem?: (item: Item) => void
  onClickClearBtn?: () => void
  componentParts?: Partial<ItemsListBasicProps<Item>['componentParts']>
}
/** just basic layout  */

export const TodoListItemTable = componentkit(
  'TodoListItemsDisplayer',
  (ComponentRoot) =>
    <Item extends Record<string, any>>(props: TodoListDisplayerProps<Item>) => {
      const gridICSS: ICSS = { display: 'grid', gap: 12, gridTemplateColumns: `1fr 2fr 48px`, placeItems: 'center' }
      return (
        <ComponentRoot>
          {props.items.length > 0 ? (
            <ItemsListBasic
              items={props.items}
              getItemKey={props.getItemKey ?? (({ item, idx }) => item.id ?? idx)}
              componentParts={addDefault(props.componentParts ?? {}, {
                renderHeader({ firstItem }) {
                  if (!firstItem) return null
                  const itemValues = Object.keys(firstItem)
                  return (
                    <Div icss={gridICSS}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx} icss={{ marginBlock: 4, fontSize: 18, fontWeight: 'bold' }}>
                          {stringify(v)}
                        </Div>
                      ))}

                      <Div onClick={() => props.onClickClearBtn?.()}> Clear </Div>
                    </Div>
                  )
                },
                renderItem({ item }) {
                  console.log('item: ', item)
                  const itemValues = Object.values(item)
                  return (
                    <Div icss={gridICSS}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx}>{stringify(v)}</Div>
                      ))}

                      {/* delete item */}
                      <Icon
                        src={deleteIconUrl}
                        onClick={() => {
                          props.onDeleteItem?.(item)
                        }}
                        plugins={hover(({ is }) => {
                          if (is === 'start') {
                            console.log('hover: ', itemValues)
                          }
                        })}
                      />
                    </Div>
                  )
                }
              })}
            />
          ) : null}
        </ComponentRoot>
      )
    }
)

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
