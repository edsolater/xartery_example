import { AnyFn, map } from '@edsolater/fnkit'
import { WeakerSet } from '../neuron/WeakerSet'
import { Subscription } from './Subscription'

type EventConfig = {
  [eventName: string]: AnyFn
}

type EventCenter<T extends EventConfig> = {
  /**
   * for server-provider
   */
  register<N extends keyof T>(eventName: N, handlerFn: T[N]): void
  emit<N extends keyof T>(eventName: N, parameters: Parameters<T[N]>): void
  on<U extends Partial<T>>(subscriptionFns: U): { [P in keyof U]: U[P] extends {} ? Subscription<U[P]> : undefined }
} & {
  [P in keyof T as `on${Capitalize<P & string>}`]: (
    subscriptionFn: (...params: Parameters<T[P]>) => void
  ) => Subscription<T[P]>
}

// 💡 observable should be the core of js model. just like event target is the core of DOM
export function createEventCenter<T extends EventConfig>(): EventCenter<T> {
  const callbackCenter = new Map<keyof T, WeakerSet<AnyFn>>()

  const emit = ((eventName, paramters) => {
    const handlerFns = callbackCenter.get(eventName)
    handlerFns?.forEach((fn) => {
      fn.call(undefined, paramters)
    })
  }) as EventCenter<T>['emit']

  const specifiedOn = (eventName: string, handlerFn: AnyFn) => {
    callbackCenter.set(eventName, (callbackCenter.get(eventName) ?? new WeakerSet()).add(handlerFn))
    const subscription = Subscription.of({
      unsubscribe() {
        callbackCenter.get(eventName)?.delete(handlerFn)
      }
    })
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
