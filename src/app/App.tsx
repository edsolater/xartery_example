import { pickProperty } from '@edsolater/fnkit'
import { AppRoot, Button, componentKit, Div, For, Grid, Icon, Motion, Row, Switch, Text } from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { WrappedByKit } from '@edsolater/uikit/plugins'
import { lazy, Suspense, useState } from 'react'
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
  const [flag, setFlag] = useState(false)
  return (
    <Row icss={{ backgroundColor: theme?.colors.navBarBg, justifyContent: 'end', gap: 16 }}>
      <Row>
        <Div>Default Theme</Div>
        <Switch defaultCheck={flag} onToggle={(open) => (open ? setTheme(defaultTheme) : setTheme(lightTheme))} />
      </Row>
      <Grid icss={{ width: 200, border: '1px solid black', justifyContent: flag ? 'end' : 'start' }}>
        <Div plugins={WrappedByKit(Motion)} icss={{ width: 40, height: 40, background: 'dodgerblue' }}></Div>
      </Grid>
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
      <For each={sideMenu.entries} getKey={(i) => i.name}>
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
  return <Div>{activeEntryItem.component()}</Div>
})
