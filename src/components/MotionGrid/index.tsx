import { addItem, loopSelf } from '@edsolater/fnkit'
import { Button, Col, componentKit, Div, For, Grid, Group, Motion } from '@edsolater/uikit'
import { WrappedBy } from '@edsolater/uikit/plugins'
import { useState } from 'react'
import { TabExample } from './tabs'

export type MotionGridProps = {}

export const MotionGrid = componentKit('MotionGrid', () => {
  const [items, setItems] = useState(['hello:0'])
  const insertItem = () => {
    setItems((s) => addItem(s, 'hello:' + s.length))
  }
  return (
    <Col icss={{ gap: 16 }}>
      <Button onClick={insertItem}>Increase</Button>
      <Grid icss={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        <For each={items} getKey={loopSelf}>
          {(item) => (
            <Div
              plugins={WrappedBy(Motion)}
              icss={{ width: 100 + items.length * 10, height: 100 + items.length * 10, background: 'dodgerblue' }}
            >
              {item}
            </Div>
          )}
        </For>
      </Grid>

      {/* TODO temp for dev */}
      <TabExample tabs={[{ value: 'hello' }, {value: 'world'}, {value: 'hahaha'}, {value: 'hehehe'}]}></TabExample>
    </Col>
  )
})

// export const SkeletonDivBox = uikit('SkeletonDivBox',Div, {icss:[]}) // 💡 Skeleton is just a plugin
