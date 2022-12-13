import { pickProperty } from '@edsolater/fnkit'
import { componentKit, Div, DivChildNode, DivProps, For, Row } from '@edsolater/uikit'
import { withFloatBg, WithFloatBgOptions } from '@edsolater/uikit/plugins'
import { useState } from 'react'

type TabItem<T extends string> = {
  value: T
  renderLabel?: (value: T) => DivChildNode
}

type TabProps<T extends string> = {
  tabs: TabItem<T>[]
  defaultTab?: TabItem<T>
  labelBoxProps?: DivProps
  withFloatBgOptions?: WithFloatBgOptions
}

export const Tab = componentKit(
  'Tab',
  <T extends string>({ tabs, defaultTab, labelBoxProps, withFloatBgOptions }: TabProps<T>) => {
    const [activeTab, setActiveTab] = useState(defaultTab)
    return (
      <Row
        plugins={withFloatBg({ ...withFloatBgOptions, defaultActiveItemIndex: defaultTab && tabs.indexOf(defaultTab) })}
      >
        <For each={tabs} getKey={pickProperty('value')}>
          {(tab) => (
            <Div
              shadowProps={labelBoxProps}
              onClick={() => {
                setActiveTab(tab)
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
