import { pickProperty } from '@edsolater/fnkit'
import { AppRoot, Button, componentKit, Div, For, Icon, Row, Text, UncontrolledSwitch } from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { lazy, Suspense } from 'react'
import { sideMenu } from './configs/sideMenu'
import { defaultTheme } from './theme/defaultTheme'
import { lightTheme } from './theme/lightTheme'
import { ThemeProvider, useTheme } from './theme/ThemeProvider'

export function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppRoot
        icss={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gridTemplate: `
            "nav  nav" 48px
            "side con" 40px / 20% 1fr`
        }}
      >
        <TopNavBar icss={{ gridArea: 'nav' }} />
        <SideMenuBar icss={{ gridArea: 'side' }} />
        <MainContentArea icss={{ gridArea: 'con' }} />
      </AppRoot>
    </ThemeProvider>
  )
}

export function useGlobalEntries() {
  const [activeEntryItem, setActiveEntryItem] = useGlobalState('activeTabName', sideMenu.entries[0])
  return { activeEntryItem, setActiveEntryItem, entries: sideMenu.entries, sideMenuConfig: sideMenu }
}

export const TopNavBar = componentKit('TopNavBar', () => {
  const { value: theme, set: setTheme } = useTheme()
  return (
    <Row icss={{ backgroundColor: theme?.colors.navBarBg, justifyContent: 'end', gap:16 }}>
      <UncontrolledSwitch />
      <Button onClick={() => setTheme?.(lightTheme)}>Light Theme</Button>
      <Button onClick={() => setTheme?.(defaultTheme)}>Default Theme</Button>
    </Row>
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

export const MainContentArea = componentKit('ConcentSection', () => {
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
