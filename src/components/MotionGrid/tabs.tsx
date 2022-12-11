import { pickProperty } from '@edsolater/fnkit'
import { componentKit, Div, DivChildNode, DivProps, For, Motion, MotionProps, Row } from '@edsolater/uikit'
import { WrappedBy } from '@edsolater/uikit/plugins'
import { useRef, useState } from 'react'

type Tab<T extends string> = {
  value: T
  renderLabel?: (value: T) => DivChildNode
}

type TabProps<T extends string> = {
  tabs: Tab<T>[]
  defaultTab?: Tab<T>

  activeBgPanelProps?: DivProps
  activeBgPanelMotionProps?: MotionProps
  labelProps?: DivProps
}

export const TabExample = componentKit(
  'TabExample',
  <T extends string>({
    tabs,
    defaultTab = tabs[0],
    activeBgPanelProps,
    labelProps,
    activeBgPanelMotionProps
  }: TabProps<T>) => {
    const [activeTab, setActiveTab] = useState(defaultTab)
    const activeTabRef = useRef<HTMLElement>()
    return (
      <Row icss={{ position: 'relative' }}>
        <Div
          icss={{
            width: activeTabRef.current?.offsetWidth,
            height: activeTabRef.current?.offsetHeight,
            top: activeTabRef.current?.offsetTop,
            left: activeTabRef.current?.offsetLeft,
            position: 'absolute',
            background: '#d1d3d6'
          }}
          shadowProps={activeBgPanelProps}
          className='Tabs-active-bg-panel'
          plugins={WrappedBy(Motion, activeBgPanelMotionProps)}
        ></Div>
        <For each={tabs} getKey={pickProperty('value')}>
          {(tab) => (
            <Div
              shadowProps={labelProps}
              icss={{ zIndex: 30 }}
              onClick={({ el }) => {
                setActiveTab(tab)
                activeTabRef.current = el
              }}
            >
              {tab.renderLabel?.(tab.value) ?? tab.value}
            </Div>
          )}
        </For>
      </Row>
    )
  }
)
