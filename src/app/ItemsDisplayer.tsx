import { formatDate } from '@edsolater/fnkit'
import { componentkit, Div, DivProps, Group } from '@edsolater/uikit'
import { ReactNode } from 'react'

type _ItemsListBasicProps<T extends Record<string, any> = Record<string, any>> = {
  items: T[]
  getItemKey: (info: { item: T; idx: number }) => string | number
  renderItem: (info: { item: T }) => ReactNode
  renderHeader: (info: { items: T[]; firstItem?: T }) => ReactNode
  propOfListItemGroup?: DivProps
  propOfListHeader?: DivProps
}

/** basic  */
// export function _ItemsListBasic<T extends Record<string, any>>({
//   items,
//   getItemKey,

//   renderHeader,
//   renderItem,
//   propOfListHeader,
//   propOfListItemGroup,
//   ...divProps
// }: _ItemsListBasicProps<T> & DivProps) {
//   return (
//     <Div {...divProps} className={_ItemsListBasic.name} icss={{ border: '1px solid', padding: 4 }}>
//       <Group {...propOfListHeader} name='list-header'>
//         <Div>{renderHeader({ items, firstItem: items.at(0) })}</Div>
//       </Group>
//       <Group {...propOfListItemGroup} name='list-item-group' icss={{ display: 'grid', gap: 8 }}>
//         {items.map((item, idx) => (
//           <Div key={getItemKey({ item, idx })}>{renderItem({ item })}</Div>
//         ))}
//       </Group>
//     </Div>
//   )
// }

/** basic  */
export const _ItemsListBasic = componentkit(
  '_ItemsListBasic',
  (ComponentRoot) =>
    <T extends Record<string, any>>({
      items,
      getItemKey,
      renderHeader,
      renderItem,
      propOfListHeader,
      propOfListItemGroup
    }: _ItemsListBasicProps<T>) =>
      (
        <ComponentRoot icss={{ border: '1px solid', padding: 4 }}>
          <Group mergeProps={propOfListHeader} name='list-header'>
            <Div>{renderHeader({ items, firstItem: items.at(0) })}</Div>
          </Group>
          <Group mergeProps={propOfListItemGroup} name='list-item-group' icss={{ display: 'grid', gap: 8 }}>
            {items.map((item, idx) => (
              <Div key={getItemKey({ item, idx })}>{renderItem({ item })}</Div>
            ))}
          </Group>
        </ComponentRoot>
      )
)

/** basic  */
export function ItemsListDisplayer<Item extends Record<string, any>>({
  items,
  layoutType = 'table',
  getItemKey,
  renderHeader,
  renderItem
}: {
  items: _ItemsListBasicProps<Item>['items']
  layoutType?: 'table'
  getItemKey?: _ItemsListBasicProps<Item>['getItemKey']
  renderItem?: _ItemsListBasicProps<Item>['renderItem']
  renderHeader?: _ItemsListBasicProps<Item>['renderHeader']
}) {
  const typeMap = {
    table: () => (
      <_ItemsListBasic
        items={items}
        getItemKey={getItemKey ?? (({ item, idx }) => item.id ?? idx)}
        renderHeader={
          renderHeader ??
          (({ firstItem }) => {
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
          })
        }
        renderItem={
          renderItem ??
          (({ item }) => {
            const itemValues = Object.values(item)
            return (
              <Div icss={{ display: 'grid', gridTemplateColumns: `repeat(${itemValues.length}, 1fr)` }}>
                {itemValues.map((v, idx) => (
                  <Div key={idx}>{stringify(v)}</Div>
                ))}
              </Div>
            )
          })
        }
      />
    )
  }
  return typeMap[layoutType]()
}

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
