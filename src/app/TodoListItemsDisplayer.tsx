import { addDefault, formatDate } from '@edsolater/fnkit'
import { componentkit, Div, Icon } from '@edsolater/uikit'
import { ItemsListBasic, ItemsListBasicProps } from './ItemsDisplayer'
import deleteIconUrl from '/delete.svg'

export type TodoListDisplayerProps<Item extends Record<string, any>> = {
  items: ItemsListBasicProps<Item>['items']
  layoutType?: 'table'
  getItemKey?: ItemsListBasicProps<Item>['getItemKey']
  onDeleteItem?: (item: Item) => void
  componentParts?: Partial<ItemsListBasicProps<Item>['componentParts']>
}
/** just basic layout  */

export const TodoListItemsDisplayer = componentkit(
  'TodoListItemsDisplayer',
  (ComponentRoot) =>
    <Item extends Record<string, any>>(props: TodoListDisplayerProps<Item>) =>
      (
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
                    <Div icss={{ display: 'grid', gridTemplateColumns: `repeat(${itemValues.length}, 1fr)` }}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx} icss={{ fontWeight: 'bold' }}>
                          {stringify(v)}
                        </Div>
                      ))}
                    </Div>
                  )
                },
                renderItem({ item }) {
                  const itemValues = Object.values(item)
                  return (
                    <Div icss={{ display: 'grid', gap: 8, gridTemplateColumns: `1fr auto auto` }}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx}>{stringify(v)}</Div>
                      ))}

                      {/* delete item */}
                      <Icon
                        src={deleteIconUrl}
                        onClick={() => {
                          console.log('item: ', item, itemValues)
                          props.onDeleteItem?.(item)
                        }}
                      />
                    </Div>
                  )
                }
              })}
            />
          ) : null}
        </ComponentRoot>
      )
)

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
