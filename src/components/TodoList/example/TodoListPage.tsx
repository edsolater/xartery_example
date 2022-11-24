import { Row } from '@edsolater/uikit'
import { TodoList } from '..'
import { useXDBList } from './dataHooks'

// should be a `<TodoList>` component

export function TodoListPage() {
  const { todoList, insertTodoItem, deleteTodoItem, clear, undo, redo } = useXDBList()

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
        onClickClearBtn={clear}
        onUndo={undo}
        onRedo={redo}
      />
    </Row>
  )
}
