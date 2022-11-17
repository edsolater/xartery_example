import { Button, Div, Text, Row, injectGlobalResetStyle, Input, Grid } from '@edsolater/uikit'
import { mergeFunction, useIsomorphicLayoutEffect } from '@edsolater/hookit'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'
import { _ItemsListBasic, ItemsListDisplayer } from './ItemsDisplayer'
import { useState } from 'react'

// should be a `<TodoList>` component
function App() {
  useIsomorphicLayoutEffect(injectGlobalResetStyle, [])

  const { todoList, insertTodoItem } = useXDBList()
  useConsoleLog({ data: { todoList }, disabled: true })
  const [newTodoTitle, setNewTodoTitle] = useState<string>()

  const insertNewTodoItem = () => {
    if (newTodoTitle) {
      insertTodoItem({ todoTitle: newTodoTitle })
    }
  }

  const clearTodoTitleInput = () => setNewTodoTitle(undefined)

  const uploadNewTodoItem = mergeFunction(insertNewTodoItem, clearTodoTitleInput)

  return (
    <Div className={App.name}>
      <Div
        icss={{
          width: 'min-content',
          display: 'grid',
          justifyItems: 'center',
          gap: 8,
          padding: 16,
          marginInline: 'auto'
        }}
      >
        <Row icss={{ alignItems: 'center', gap: 4 }}>
          <Input value={newTodoTitle} onUserInput={(t) => setNewTodoTitle(t)} onEnter={uploadNewTodoItem} />
          <Button size='sm' onClick={uploadNewTodoItem}>
            Insert Item
          </Button>
        </Row>

        {todoList.length > 0 && (
          <ItemsListDisplayer icss={{ width: '100%' }} items={todoList} getItemKey={({ item: i }) => i.title} />
        )}
      </Div>
    </Div>
  )
}

export default App
