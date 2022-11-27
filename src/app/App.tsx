import { AppRoot, componentkit, Div, For, Icon, Row } from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { lazy, Suspense } from 'react'
import TodoListPage from '../components/TodoList/example/TodoListPage'
import { sideMenu, SideMenuEntryItem } from './configs/sideMenu'

export function App() {
  return (
    <AppRoot>
      <EntriesBar />
      <MainContentArea />
    </AppRoot>
  )
}

export function useGlobalEntries() {
  const [activeEntryItem, setActiveEntryItem] = useGlobalState('activeTabName', sideMenu.entries[0])
  return { activeEntryItem, setActiveEntryItem, entries: sideMenu.entries, sideMenuConfig: sideMenu }
}

export const EntriesBar = componentkit('EntriesBar', (ComponentRoot) => () => {
  const { activeEntryItem, setActiveEntryItem } = useGlobalEntries()
  return (
    <ComponentRoot icss={{ border: '1px solid black' }}>
      <For each={sideMenu.entries} getKey={(entry) => entry.name}>
        {(entry) => (
          <Row>
            <Icon
              src={entry.iconPath}
              cssColor={activeEntryItem?.name === entry.name ? 'crimson' : 'dodgerblue'}
              onClick={() => {
                setActiveEntryItem(entry)
              }}
            />
            <Div>{entry.name}</Div>
          </Row>
        )}
      </For>
    </ComponentRoot>
  )
})

export type ConcentSectionProps = {}

export const MainContentArea = componentkit('ConcentSection', (ComponentRoot) => ({}: ConcentSectionProps) => {
  const { activeEntryItem } = useGlobalEntries()
  const ContentComponent = activeEntryItem && lazy(() => import(activeEntryItem.componentPath))
  return (
    <ComponentRoot>
      {ContentComponent ? (
        <Suspense fallback='loading'>
          <ContentComponent />
        </Suspense>
      ) : null}
    </ComponentRoot>
  )
})
