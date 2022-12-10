import { ReactNode } from 'react'
import { MatureTodoList } from '../components/TodoList/example/MatureTodoList'

export type SideMenuEntryItem = {
  name: string
  iconPath: string
  component: () => ReactNode
}

export type SideMenuEntries = {
  entries: SideMenuEntryItem[]
}

export const sideMenu = {
  entries: [
    {
      name: 'TodoList',
      iconPath: '/todo_list.svg',
      component: () => <MatureTodoList />
    }
  ]
} as SideMenuEntries
