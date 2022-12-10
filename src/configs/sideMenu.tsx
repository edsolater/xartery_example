import { ReactNode } from 'react'
import { MotionGrid } from '../components/MotionGrid'
import { MatureTodoList } from '../components/TodoList/example/MatureTodoList'

export type SideMenuEntryItem = {
  group: string
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
      group: 'Examples',
      name: 'TodoList',
      iconPath: '/todo_list.svg',
      component: () => <MatureTodoList />
    },
    {
      group: 'Playground',
      name: 'motion grid',
      iconPath: '/todo_list.svg',
      component: () => <MotionGrid />
    }
  ]
} as SideMenuEntries
