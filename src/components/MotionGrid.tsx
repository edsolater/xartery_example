import { addItem, loopSelf } from '@edsolater/fnkit'
import { componentKit, Div, For, Grid, renamedKit, uikit } from '@edsolater/uikit'
import { useState } from 'react'

export type MotionGridProps = {}

export const MotionGrid = componentKit('MotionGrid', () => {
  const [items, setItems] = useState(['hello', 'world'])
  const insertItem = () => {
    setItems((s) => addItem(s, 'yeah'))
  }
  return (
    <Grid icss={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <For each={items} getKey={loopSelf}>
        {(item) => (
          <Div icss={{ width: items.length * 100, height: items.length * 100, background: 'dodgerblue' }}>{item}</Div>
        )}
      </For>
    </Grid>
  )
})

// export const SkeletonDivBox = uikit('SkeletonDivBox',Div, {icss:[]}) // 💡 Skeleton is just a plugin
