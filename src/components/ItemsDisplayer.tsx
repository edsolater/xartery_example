import { AddProps, componentkit, DivProps, For, Group } from '@edsolater/uikit'
import { ReactNode } from 'react'


export type ItemsListBasicProps<T extends Record<string, any> = Record<string, any>> = {
  items: T[]
  getItemKey: (info: { item: T; idx: number }) => string | number

  renderItem: (info: { item: T }) => ReactNode
  renderHeader: (info: { items: T[]; firstItem?: T }) => ReactNode
  /** only when renderItem is not set */
  propofItem?: DivProps
  /** only when renderHeader is not set */
  propofHeader?: DivProps
  /** only when renderItemGroup* is not set */
  propofItemGroup?: DivProps
  /** only when renderHeaderGroup is not set */
  propofHeaderGroup?: DivProps
}

/** basic  */
export const ItemsListBasic = componentkit(
  'ItemsListBasic',
  (ComponentRoot) =>
    <T extends Record<string, any>>(props: ItemsListBasicProps<T>) =>
      (
        <ComponentRoot icss={{ border: '1px solid', padding: 4 }}>
          <Group shadowProps={props.propofHeaderGroup} name='list-header'>
            <AddProps shadowProps={props.propofHeader}>
              {props.renderHeader({ items: props.items, firstItem: props.items.at(0) })}
            </AddProps>
          </Group>

          <Group shadowProps={props.propofItemGroup} name='list-item-group' icss={{ display: 'grid', gap: 8 }}>
            <For each={props.items} getKey={(item, idx) => props.getItemKey({ item, idx })}>
              {(item) => <AddProps shadowProps={props.propofItem}>{props.renderItem({ item })}</AddProps>}
            </For>
          </Group>
        </ComponentRoot>
      )
)
