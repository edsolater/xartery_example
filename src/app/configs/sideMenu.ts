export type SideMenuEntryItem = {
  name: string
  iconPath: string
  componentPath: string
}

export type SideMenuEntries = {
  entries: SideMenuEntryItem[]
}

export const sideMenu = {
  entries: [
    {
      name: 'TodoList',
      iconPath: '/todo_list.svg',
      componentPath: '../components/TodoList/example/TodoListPage.tsx'
    }
  ]
} as SideMenuEntries
