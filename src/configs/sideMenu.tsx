import { ReactNode } from 'react'
import { ExampleMaker } from '../components/ExampleMaker'
import { MotionGrid } from '../components/MotionGrid'
import { MatureTodoList } from '../components/TodoList/example/MatureTodoList'

export type SideMenuEntryItem = {
  group: string
  name: string
  entryIcon: string
  component: () => ReactNode
}

export type SideMenuEntries = {
  entries: SideMenuEntryItem[]
}

export const sideMenu = {
  entries: [
    {
      group: 'Playground',
      name: 'motion grid',
      entryIcon: '/todo_list.svg',
      component: () => <MotionGrid />
    },
    {
      group: 'Examples',
      name: 'TodoList',
      entryIcon: '/todo_list.svg',
      component: () => <MatureTodoList />
    },
    {
      group: 'Examples',
      name: 'ExampleMaker',
      entryIcon: '/todo_list.svg',
      component: () => <ExampleMaker />
    }
  ]
} as SideMenuEntries
