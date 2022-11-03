import { AnyFn, map } from '@edsolater/fnkit'
import { WeakerSet } from '../neuron/WeakerSet'
import { Subscription } from './Subscription'

type EventConfig = {
  [eventName: string]: AnyFn
}

type EventCenter<T extends EventConfig> = {
  emit<N extends keyof T>(eventName: N, parameters: Parameters<T[N]>): void
  on<U extends Partial<T>>(subscriptionFns: U): { [P in keyof U]: U[P] extends {} ? Subscription<U[P]> : undefined }
} & {
  [P in keyof T as `on${Capitalize<P & string>}`]: (
    subscriptionFn: (...params: Parameters<T[P]>) => void
  ) => Subscription<T[P]>
}

/**
 * 
 * @example
 *  // client side
 * cc.on({
 *   change({ status }) {
 *     // status is 'success' | 'error'
 *     // do something
 *   }
 * })
 * cc.onChange(({ status }) => {
 *   // status is 'success' | 'error'
 * })
 * 
 * // server side
 * cc.emit('change', [{ status: 'success' }])
 */
// 💡 observable should be the core of js model. just like event target is the core of DOM
export function createEventCenter<T extends EventConfig>(): EventCenter<T> {
  const storedCallbackStore = new Map<keyof T, WeakerSet<AnyFn>>()

  const emit = ((eventName, paramters) => {
    const handlerFns = storedCallbackStore.get(eventName)
    handlerFns?.forEach((fn) => {
      fn.call(undefined, paramters)
    })
  }) as EventCenter<T>['emit']

  const specifiedOn = (eventName: string, handlerFn: AnyFn) => {
    storedCallbackStore.set(eventName, (storedCallbackStore.get(eventName) ?? new WeakerSet()).add(handlerFn))
    const subscription = Subscription.of({
      onUnsubscribe() {
        storedCallbackStore.get(eventName)?.delete(handlerFn)
      }
    })
    subscription.unsubscribe()
    return subscription
  }

  const on = ((subscriptionFns) =>
    map(
      subscriptionFns,
      (handlerFn, eventName) => handlerFn && specifiedOn(String(eventName), handlerFn)
    )) as EventCenter<T>['on']

  const eventCenter = new Proxy(
    { on, emit },
    {
      get(target, p) {
        if (target[p] !== undefined) return target[p]
        if (String(p).startsWith('on')) return (p: string, handler: AnyFn) => specifiedOn(p, handler)
        return undefined
      }
    }
  ) as unknown as EventCenter<T>
  return eventCenter
}

