import { Button, componentkit, Div, Input, Row } from '@edsolater/uikit'
import { useState } from 'react'
import { TodoListDisplayerProps, TodoListItemTable } from './TodoListItemTable'

export type TodoListProps<T extends Record<string, any>> = {
  items: T[]
  getItemKey: TodoListDisplayerProps<T>['getItemKey']
  onInsert?: (text: string) => void
} & Pick<TodoListDisplayerProps<T>, 'onDeleteItem' | 'onClickClearBtn'>

export const TodoList = componentkit(
  'TodoList',
  (ComponentRoot) =>
    <T extends Record<string, any>>(props: TodoListProps<T>) => {
      const [newTodoTitle, setNewTodoTitle] = useState<string>()
      const uploadNewTodoItem = () => {
        if (!newTodoTitle) return
        props.onInsert?.(newTodoTitle)
        setNewTodoTitle(undefined)
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

            <TodoListItemTable {...props} items={props.items} getItemKey={props.getItemKey} />
          </Div>
        </ComponentRoot>
      )
    }
)
