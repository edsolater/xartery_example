import { formatDate } from '@edsolater/fnkit'
import { componentKit, Div, Icon, ICSS, Tooltip } from '@edsolater/uikit'
import { click, Kit } from '@edsolater/uikit/plugins'
import { ItemsListBasic, ItemsListBasicProps } from './ItemsDisplayer'

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

export const TodoListItemTable = componentKit(
  'TodoListItemsDisplayer',
  <Item extends Record<string, any>>({
    items,
    layoutType,
    getItemKey,
    onDeleteItem,
    onClickClearBtn,

    renderHeader,
    renderItem,
    ...props
  }: TodoListDisplayerProps<Item>) => {
    const gridICSS: ICSS = { display: 'grid', gap: 12, gridTemplateColumns: `1fr 2fr 48px`, placeItems: 'center' }
    return (
      <Div>
        {items.length > 0 ? (
          <ItemsListBasic
            {...props}
            items={items}
            getItemKey={getItemKey ?? (({ item, idx }) => item.id ?? idx)}
            renderHeader={
              renderHeader ??
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

                    <Div plugins={click(() => onClickClearBtn?.())}> Clear </Div>
                  </Div>
                )
              })
            }
            renderItem={
              renderItem ??
              (({ item }) => {
                const itemValues = Object.values(item)
                return (
                  <Div icss={gridICSS}>
                    {itemValues.map((v, idx) => (
                      <Div key={idx}>{stringify(v)}</Div>
                    ))}
                    <Icon
                      src='/delete.svg'
                      icss={{ color: 'crimson' }}
                      plugins={[
                        click(() => onDeleteItem?.(item)),
                        Kit((self) => (
                          <Tooltip placement='right' renderButton={self}>
                            delete
                          </Tooltip>
                        ))
                      ]}
                    />
                  </Div>
                )
              })
            }
          />
        ) : null}
      </Div>
    )
  }
)

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
