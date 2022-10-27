import { useXDB } from './dataHooks'
import { useConsoleLog } from '../hooks/useConsoleLog'

function App() {
  const list = useXDB()
  useConsoleLog({ list })
  return <div className='App'>hello xartery</div>
}

export default App


