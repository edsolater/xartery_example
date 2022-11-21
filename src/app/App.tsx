import { useIsomorphicLayoutEffect } from '@edsolater/hookit'
import { injectGlobalResetStyle, Row } from '@edsolater/uikit'
import { TodoList } from '../components/TodoList'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'

// should be a `<TodoList>` component
export function App() {
  useIsomorphicLayoutEffect(injectGlobalResetStyle, [])

  const { todoList, insertTodoItem, deleteTodoItem, clear, undo } = useXDBList()
  useConsoleLog({ data: { todoList }, disabled: true })

  return (
    <Row icss={{ justifyContent: 'center' }}>
      <TodoList
        items={todoList}
        getItemKey={({ item }) => item.createAt.getTime()}
        onInsert={(text) => {
          insertTodoItem({ todoTitle: text })
        }}
        onDeleteItem={(item) => {
          deleteTodoItem({ item })
        }}
        onClickClearBtn={() => {
          clear()
        }}
        onUndo={() => {
          undo()
        }}
      />
    </Row>
  )
}
