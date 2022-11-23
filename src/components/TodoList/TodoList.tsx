import { Button, componentkit, Div, Input, Row } from '@edsolater/uikit'
import { click, keyboardShortcut } from '@edsolater/uikit/plugins'
import { useState } from 'react'
import { TodoListDisplayerProps, TodoListItemTable } from './TodoListItemTable'

export type TodoListProps<T extends Record<string, any>> = {
  onInsert?: (text: string) => void
  onUndo?: () => void
  onRedo?: () => void
} & Pick<TodoListDisplayerProps<T>, 'items' | 'getItemKey' | 'onDeleteItem' | 'onClickClearBtn'>

export const TodoList = componentkit(
  'TodoList',
  (ComponentRoot) =>
    <T extends Record<string, any>>({ onInsert, onUndo, onRedo, ...props }: TodoListProps<T>) => {
      const [newTodoTitle, setNewTodoTitle] = useState<string>()
      const uploadNewTodoItem = () => {
        if (!newTodoTitle) return
        onInsert?.(newTodoTitle)
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
            plugins={keyboardShortcut({
              'ctrl + z': onUndo,
              'ctrl + shift + z': onRedo
            })}
          >
            <Row icss={{ alignItems: 'center', gap: 4 }}>
              <Input value={newTodoTitle} onUserInput={(t) => setNewTodoTitle(t)} onEnter={uploadNewTodoItem} />
              <Button size='sm' onClick={uploadNewTodoItem}>
                Insert Item
              </Button>
            </Row>

            <TodoListItemTable {...props} />
          </Div>
        </ComponentRoot>
      )
    }
)
