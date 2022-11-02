import { useXDB } from './dataHooks'
import { useConsoleLog } from '../hookit/useConsoleLog'

function App() {
  const { list, insertAnNewItem } = useXDB()
  useConsoleLog({ list })
  return (
    <div className='App'>
      <div>hello xartery</div>
      <button onClick={insertAnNewItem}>Insert Item</button>
    </div>
  )
}

export default App
