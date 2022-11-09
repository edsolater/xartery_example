import { Button, Div, Row, injectGlobalResetStyle, Input, Grid } from '@edsolater/uikit'
import { useIsomorphicLayoutEffect } from '@edsolater/hookit'
import { useConsoleLog } from '../hookit/useConsoleLog'
import { useXDBList } from './dataHooks'
import { ItemsDisplayer } from './ItemsDisplayer'

function App() {
  useIsomorphicLayoutEffect(injectGlobalResetStyle, [])

  const { todoList, insertTodoItem } = useXDBList()
  useConsoleLog({ data: { todoList }, disabled: true })
  return (
    <div className='App'>
      <Grid>
        <Row icss={{ alignItems: 'center', gap: 4 }}>
          <Div icss={{ fontSize: 24 }}>new todo:</Div>
          <Input onEnter={}/>
          <Button onClick={() => insertTodoItem}>Insert Item</Button>
        </Row>

        <Div>
          {/* <Div icss={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {list.map((i) => (
            <ObjectIllustrator item={i} />
            ))}
          </Div> */}
          <ItemsDisplayer items={todoList} getItemKey={(i) => i.title} />
        </Div>
      </Grid>
    </div>
  )
}

export default App
