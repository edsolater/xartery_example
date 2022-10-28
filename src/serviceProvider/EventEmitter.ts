import { AnyFn } from '@edsolater/fnkit'
import { TODO } from '../app/typeTools'

interface SupportedEventTable {
  [eventName: string]: AnyFn
}
type EventEmitter<T extends SupportedEventTable> = {
  on(register: T): EventEmitter<T>
} & TODO
// 💡 observable should be the core of js model. just like event target is the core of DOM
export function createEventEmitter() {
  return {}
}
