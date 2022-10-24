import { useRecordedEffect } from '@edsolater/hookit'
import { useEffect } from 'react'
import { useList } from './dataHandler'

function App() {
  const list = useList()
  useConsoleLog({list})
  return <div className='App'>hello xartery</div>
}

export default App

function useConsoleLog(config: Record<string, any>) {
  const values = Object.values(config)
  const keys = Object.keys(config)
  useRecordedEffect((prevValues) => {
    values.forEach((value, idx) => {
      const key = keys[idx]
      const prevValue = prevValues[idx]
      if (prevValue !== value) {
        console.log(`${key}: `, { value, prevValue })
      }
    })
  }, values)
}
