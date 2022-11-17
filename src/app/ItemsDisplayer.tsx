import { AddProps, componentkit, Div, DivProps, Group } from '@edsolater/uikit'
import { ReactNode } from 'react'

export type ItemsListBasicProps<T extends Record<string, any> = Record<string, any>> = {
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
export const ItemsListBasic = componentkit(
  'ItemsListBasic',
  (ComponentRoot) =>
    <T extends Record<string, any>>(props: ItemsListBasicProps<T>) =>
      (
        <ComponentRoot icss={{ border: '1px solid', padding: 4 }}>
          <Group shadowProps={props.componentParts.HeaderGroupProps} name='list-header'>
            <AddProps shadowProps={props.componentParts.HeaderProps}>
              {props.componentParts.renderHeader({ items: props.items, firstItem: props.items.at(0) })}
            </AddProps>
          </Group>

          <Group
            shadowProps={props.componentParts.ItemGroupProps}
            name='list-item-group'
            icss={{ display: 'grid', gap: 8 }}
          >
            {props.items.map((item, idx) => {
              const key = props.getItemKey({ item, idx })
              return (
                <AddProps shadowProps={props.componentParts.ItemProps} key={key}>
                  {props.componentParts.renderItem({ item })}
                </AddProps>
              )
            })}
          </Group>
        </ComponentRoot>
      )
)
