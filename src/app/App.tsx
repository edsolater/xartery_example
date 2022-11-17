import { useIsomorphicLayoutEffect } from '@edsolater/hookit'
import { Div, injectGlobalResetStyle } from '@edsolater/uikit'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'
import { TodoList } from './TodoList'

// should be a `<TodoList>` component
export function App() {
  useIsomorphicLayoutEffect(injectGlobalResetStyle, [])

  const { todoList, insertTodoItem } = useXDBList()
  useConsoleLog({ data: { todoList }, disabled: true })

  return (
    <Div className={App.name}>
      <TodoList
        items={todoList}
        onInsert={({ text }) => {
          insertTodoItem({ todoTitle: text })
        }}
      />
    </Div>
  )
}
