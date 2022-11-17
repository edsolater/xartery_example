import { useIsomorphicLayoutEffect } from '@edsolater/hookit'
import { Div, injectGlobalResetStyle } from '@edsolater/uikit'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'
import { TodoList } from './TodoList'

// should be a `<TodoList>` component
export function App() {
  useIsomorphicLayoutEffect(injectGlobalResetStyle, [])

  const { todoList, insertTodoItem, deleteTodoItem, clear } = useXDBList()
  useConsoleLog({ data: { todoList }, disabled: true })

  return (
    <Div className={App.name}>
      <TodoList
        items={todoList}
        getItemKey={({ item }) => item.title}
        onInsert={(text) => {
          insertTodoItem({ todoTitle: text })
        }}
        onDeleteItem={(item) => {
          deleteTodoItem({ item })
        }}
        onClickClearBtn={() => {
          clear()
        }}
      />
    </Div>
  )
}
