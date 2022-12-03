import { pickProperty } from '@edsolater/fnkit'
import { AppRoot, Button, componentKit, Div, For, Icon, Row, Text } from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { lazy, Suspense } from 'react'
import { sideMenu } from './configs/sideMenu'
import { LightThemeProvider, useTheme } from './theme/ThemeProvider'

export function App() {
  return (
    <LightThemeProvider>
      <AppRoot icss={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
        <TopNavBar />
        <SideMenuBar />
        <MainContentArea />
      </AppRoot>
    </LightThemeProvider>
  )
}

export function useGlobalEntries() {
  const [activeEntryItem, setActiveEntryItem] = useGlobalState('activeTabName', sideMenu.entries[0])
  return { activeEntryItem, setActiveEntryItem, entries: sideMenu.entries, sideMenuConfig: sideMenu }
}

export const TopNavBar = componentKit('EntriesBar', () => {
  const { contextComponentProps, contextComponentSet } = useTheme()
  console.log('theme: ', contextComponentProps, contextComponentSet)
  return (
    <Div>
      <Button
        onClick={() =>
          contextComponentSet?.((theme) => {
            theme.colors.white = 'dodgerblue'
          })
        }
      ></Button>
    </Div>
  )
})

export const SideMenuBar = componentKit('EntriesBar', () => {
  const { activeEntryItem, setActiveEntryItem } = useGlobalEntries()
  const theme = useTheme()
  console.log('theme: ', theme)
  return (
    <Div>
      <For each={sideMenu.entries} getKey={pickProperty('name')}>
        {(entry) => (
          <Row>
            <Icon
              src={entry.iconPath}
              cssColor={activeEntryItem?.name === entry.name ? 'cornflowerblue' : 'dodgerblue'}
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
