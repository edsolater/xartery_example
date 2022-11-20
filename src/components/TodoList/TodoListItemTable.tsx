import { formatDate } from '@edsolater/fnkit'
import { componentkit, Div, Icon, ICSS } from '@edsolater/uikit'
import { click, WrapTooltip } from '@edsolater/uikit/plugins'
import { ItemsListBasic, ItemsListBasicProps } from '../ItemsDisplayer'
import deleteIconUrl from '/delete.svg'

export type TodoListDisplayerProps<Item extends Record<string, any>> = {
  items: ItemsListBasicProps<Item>['items']
  layoutType?: 'table'
  getItemKey?: ItemsListBasicProps<Item>['getItemKey']
  onDeleteItem?: (item: Item) => void
  onClickClearBtn?: () => void
} & Partial<
  Pick<
    ItemsListBasicProps<Item>,
    'renderHeader' | 'renderItem' | 'propofHeader' | 'propofHeaderGroup' | 'propofItemGroup' | 'propofItem'
  >
>
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
              {...props}
              items={props.items}
              getItemKey={props.getItemKey ?? (({ item, idx }) => item.id ?? idx)}
              renderHeader={
                props.renderHeader ??
                (({ firstItem }) => {
                  if (!firstItem) return null
                  const itemValues = Object.keys(firstItem)
                  return (
                    <Div icss={gridICSS}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx} icss={{ marginBlock: 4, fontSize: 18, fontWeight: 'bold' }}>
                          {stringify(v)}
                        </Div>
                      ))}

                      <Div plugins={click(() => props.onClickClearBtn?.())}> Clear </Div>
                    </Div>
                  )
                })
              }
              renderItem={
                props.renderItem ??
                (({ item }) => {
                  const itemValues = Object.values(item)
                  return (
                    <Div icss={gridICSS}>
                      {itemValues.map((v, idx) => (
                        <Div key={idx}>{stringify(v)}</Div>
                      ))}
                      <Icon
                        src={deleteIconUrl}
                        icss={{ color: 'crimson' }}
                        plugins={[click(() => props.onDeleteItem?.(item)), WrapTooltip({ content: 'remove item' })]}
                      />
                    </Div>
                  )
                })
              }
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
