import { Button, componentkit, Div, Input, Row } from '@edsolater/uikit'
import { useState } from 'react'
import { TodoListDisplayer } from './ItemsDisplayer'

export type TodoListProps = {
  items: Record<string, any>[]
  onInsert?: (utils: { text: string }) => void
  onDeleteItem?: (utils: { item: Record<string, any> }) => void
}

export const TodoList = componentkit('TodoList', (ComponentRoot) => (props: TodoListProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>()
  const uploadNewTodoItem = () => {
    if (newTodoTitle) {
      props.onInsert?.({ text: newTodoTitle })
      setNewTodoTitle(undefined)
    }
  }
  return (
    <ComponentRoot>
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

        {props.items.length > 0 && (
          <TodoListDisplayer componentParts={{}} icss={{ width: '100%' }} items={props.items} />
        )}
      </Div>
    </ComponentRoot>
  )
})
