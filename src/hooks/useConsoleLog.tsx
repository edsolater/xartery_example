import { useRecordedEffect } from '@edsolater/hookit'

/**
 * @todo  move to hookit
 */
export function useConsoleLog(config: Record<string, any>) {
  const values = Object.values(config)
  const keys = Object.keys(config)
  useRecordedEffect((prevValues) => {
    values.forEach((value, idx) => {
      const key = keys[idx]
      const prevValue = prevValues[idx]
      if (prevValue !== value) {
        console.log(`${key}: `, value)
      }
    })
  }, values)
}
