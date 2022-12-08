import { pickProperty } from '@edsolater/fnkit'
import {
  AddProps,
  AppRoot,
  Button,
  componentKit,
  Div,
  DivChildNode,
  For,
  Grid,
  Icon,
  Row,
  Text,
  uikit,
  UncontrolledSwitch
} from '@edsolater/uikit'
import { useGlobalState } from '@edsolater/uikit/hooks'
import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
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
      <UncontrolledSwitch defaultCheck={flag} onToggle={setFlag} />
      <Grid icss={{ width: 200, border: '1px solid black', justifyContent: flag ? 'end' : 'start' }}>
        <Motion>
          <Div icss={{ width: 40, height: 40, background: 'dodgerblue' }}></Div>
        </Motion>
      </Grid>
      <Button onClick={() => setTheme?.(lightTheme)}>Light Theme</Button>
      <Button onClick={() => setTheme?.(defaultTheme)}>Default Theme</Button>
    </Row>
  )
})
export interface MotionProps {
  children?: DivChildNode
}

function calcDeltaTrasformCSS(from: DOMRect, to: DOMRect) {
  // get the difference in position
  const deltaX = to.x - from.x
  return `translate(${-deltaX}px)`
}
export const Motion = uikit('Motion', ({ children }: MotionProps) => {
  const squareRef = useRef<HTMLElement>()
  const fromRect = useRef<DOMRect>()
  useLayoutEffect(() => {
    // so css change must cause rerender by React, so useLayoutEffect can do something before change attach to DOM
    if (!squareRef.current) return

    const toRect = squareRef.current.getBoundingClientRect()

    let animationControl: Animation | undefined
    if (fromRect.current && toRect && hasRectChanged(fromRect.current, toRect)) {
      animationControl = squareRef.current.animate(
        [{ transform: calcDeltaTrasformCSS(fromRect.current, toRect) }, { transform: '', offset: 1 }],
        { duration: 300, iterations: 1 , easing:'ease'} // iteration 1 can use to moke transition
      )
    }

    return () => {
      if (animationControl?.playState === 'finished') {
        // record for next frame
        fromRect.current = toRect
      } else {
        // record for next frame
        fromRect.current = squareRef.current?.getBoundingClientRect()
        animationControl?.cancel()
      }
    }
  })

  return <AddProps domRef={squareRef}>{children}</AddProps>
})

const hasRectChanged = (
  initialBox: { x: number; y: number } | undefined,
  finalBox: { x: number; y: number } | undefined
) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false
  const xMoved = initialBox.x !== finalBox.x
  const yMoved = initialBox.y !== finalBox.y
  return xMoved || yMoved
}

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
