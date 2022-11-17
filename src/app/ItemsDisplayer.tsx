import { formatDate } from '@edsolater/fnkit'
import { AddProps, componentkit, Div, DivProps, Group } from '@edsolater/uikit'
import { ReactNode } from 'react'

type _ItemsListBasicProps<T extends Record<string, any> = Record<string, any>> = {
  items: T[]
  getItemKey: (info: { item: T; idx: number }) => string | number

  componentParts: {
    renderItem: (info: { item: T }) => ReactNode
    renderHeader: (info: { items: T[]; firstItem?: T }) => ReactNode
    /** only when renderItem is not set */
    ItemProps?: DivProps
    /** only when renderHeader is not set */
    HeaderProps?: DivProps
    /** only when renderItemGroup* is not set */
    ItemGroupProps?: DivProps
    /** only when renderHeaderGroup is not set */
    HeaderGroupProps?: DivProps
  }
}

/** basic  */
export const _ItemsListBasic = componentkit(
  '_ItemsListBasic',
  (ComponentRoot) =>
    <T extends Record<string, any>>({
      items,
      getItemKey,
      componentParts: { renderHeader, renderItem, HeaderProps, ItemProps, HeaderGroupProps, ItemGroupProps }
    }: _ItemsListBasicProps<T>) =>
      (
        <ComponentRoot icss={{ border: '1px solid', padding: 4 }}>
          <Group shadowProps={HeaderGroupProps} name='list-header'>
            <AddProps shadowProps={HeaderProps}>{renderHeader({ items, firstItem: items.at(0) })}</AddProps>
          </Group>

          <Group shadowProps={ItemGroupProps} name='list-item-group' icss={{ display: 'grid', gap: 8 }}>
            {items.map((item, idx) => (
              <AddProps shadowProps={ItemProps} key={getItemKey({ item, idx })}>
                {renderItem({ item })}
              </AddProps>
            ))}
          </Group>
        </ComponentRoot>
      )
)

type ItemsListDisplayerProps<Item extends Record<string, any>> = {
  items: _ItemsListBasicProps<Item>['items']
  layoutType?: 'table'
  getItemKey?: _ItemsListBasicProps<Item>['getItemKey']
  componentParts?: Partial<Pick<_ItemsListBasicProps<Item>['componentParts'], 'renderHeader' | 'renderItem'>>
}

/** just basic layout  */
export const ItemsListDisplayer = componentkit(
  'ItemsListDisplayer',
  (ComponentRoot) =>
    <Item extends Record<string, any>>({
      items,
      layoutType = 'table',
      getItemKey,
      componentParts
    }: ItemsListDisplayerProps<Item>) => {
      const typeMap = {
        table: () => (
          <_ItemsListBasic
            items={items}
            getItemKey={getItemKey ?? (({ item, idx }) => item.id ?? idx)}
            componentParts={{
              renderHeader:
                componentParts?.renderHeader ??
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
                }),
              renderItem:
                componentParts?.renderItem ??
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
            }}
          />
        )
      }
      return <ComponentRoot>{typeMap[layoutType]()}</ComponentRoot>
    }
)

function stringify(value: any): string {
  if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD HH:mm:ss')
  return String(value)
}
