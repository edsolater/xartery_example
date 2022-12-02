import { pickProperty } from '@edsolater/fnkit'
import { AppRoot, componentKit, Div, For, Icon, renamedKit, Row, Text } from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { lazy, Suspense } from 'react'
import { sideMenu } from './configs/sideMenu'

export function App() {
  return (
    <Root>
      <EntriesBar />
      <MainContentArea />
    </Root>
  )
}

export const Root = renamedKit('Root', AppRoot, { icss: { display: 'grid', gridTemplateColumns: '300px 1fr' } })

export function useGlobalEntries() {
  const [activeEntryItem, setActiveEntryItem] = useGlobalState('activeTabName', sideMenu.entries[0])
  return { activeEntryItem, setActiveEntryItem, entries: sideMenu.entries, sideMenuConfig: sideMenu }
}

export const EntriesBar = componentKit('EntriesBar', () => {
  const { activeEntryItem, setActiveEntryItem } = useGlobalEntries()
  return (
    <Div icss={{ background: 'dodgerblue' }}>
      <For each={sideMenu.entries} getKey={pickProperty('name')}>
        {(entry) => (
          <Row>
            <Icon
              src={entry.iconPath}
              cssColor={activeEntryItem?.name === entry.name ? 'crimson' : 'dodgerblue'}
              onClick={() => {
                setActiveEntryItem(entry)
              }}
            />
            <Text>{entry.name}</Text>
          </Row>
        )}
      </For>
    </Div>
  )
})

export type ConcentSectionProps = {}

export const MainContentArea = componentKit('ConcentSection', ({}: ConcentSectionProps) => {
  const { activeEntryItem } = useGlobalEntries()
  const ContentComponent = activeEntryItem && lazy(() => import(/* @vite-ignore */ activeEntryItem.componentPath))
  return (
    <Div>
      {ContentComponent ? (
        <Suspense fallback='loading'>
          <ContentComponent />
        </Suspense>
      ) : null}
    </Div>
  )
})
