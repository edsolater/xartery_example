import { addItem, loopSelf } from '@edsolater/fnkit'
import { Button, componentKit, Div, For, Grid, Group } from '@edsolater/uikit'
import { WrappedByKit } from '@edsolater/uikit/plugins'
import { useState } from 'react'
import { Motion } from './Motion'

export type MotionGridProps = {}

export const MotionGrid = componentKit('MotionGrid', () => {
  const [items, setItems] = useState(['hello:0'])
  const insertItem = () => {
    setItems((s) => addItem(s, 'hello:' + s.length))
  }
  return (
    <Group name='MotionGrid'>
      <Button onClick={insertItem}>Increase</Button>
      <Grid icss={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        <For each={items} getKey={loopSelf}>
          {(item) => (
            <Div
              plugins={WrappedByKit(Motion)}
              icss={{ width: 100 + items.length * 10, height: 100 + items.length * 10, background: 'dodgerblue' }}
            >
              {item}
            </Div>
          )}
        </For>
      </Grid>
    </Group>
  )
})

// export const SkeletonDivBox = uikit('SkeletonDivBox',Div, {icss:[]}) // 💡 Skeleton is just a plugin
