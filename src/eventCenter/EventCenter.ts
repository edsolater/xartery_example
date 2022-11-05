import { AnyFn, capitalize, map, uncapitalize } from '@edsolater/fnkit'
import { WeakerSet } from '../neuron/WeakerSet'
import { Subscription } from './Subscription'

type EventConfig = {
  [eventName: string]: AnyFn
}

let eventCenterIdCounter = 1
function generateEventCenterId() {
  return eventCenterIdCounter++
}

export type EventCenter<T extends EventConfig> = {
  emit<N extends keyof T>(
    eventName: N,
    parameters?: [] extends Parameters<T[N]> ? [] | undefined : Parameters<T[N]>
  ): void
  on<U extends Partial<T>>(subscriptionFns: U): { [P in keyof U]: U[P] extends {} ? void : void }
} & {
  [P in keyof T as `on${Capitalize<P & string>}`]: (subscriptionFn: (...params: Parameters<T[P]>) => void) => void
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
export function EventCenter<T extends EventConfig>(
  whenAttach?: {
    [P in keyof T as `${P & string}`]?: (utils: {
      fn: (...params: Parameters<T[P]>) => void
      emit: EventCenter<T>['emit']
    }) => void
  } & {
    [P in keyof T as `${P & string}Initly`]?: (utils: {
      fn: (...params: Parameters<T[P]>) => void
      emit: EventCenter<T>['emit']
    }) => void
  }
): EventCenter<T> {
  const _eventCenterId = generateEventCenterId()
  const storedCallbackStore = new Map<keyof T, WeakerSet<AnyFn>>()

  const emit = ((eventName, paramters) => {
    const handlerFns = storedCallbackStore.get(eventName)
    handlerFns?.forEach((fn) => {
      fn.apply(undefined, paramters ?? [])
    })
  }) as EventCenter<T>['emit']

  const singlyOn = (eventName: string, fn: AnyFn) => {
    const callbackList = storedCallbackStore.get(eventName) ?? new WeakerSet()
    callbackList.add(fn) //NUG:  <-- add failed??
    storedCallbackStore.set(eventName, callbackList)

    whenAttach?.[eventName]?.({ fn, emit })
    if (!storedCallbackStore.has(eventName)) whenAttach?.[`${eventName}Initly`]?.({ fn, emit })

    return Subscription({
      onUnsubscribe() {
        storedCallbackStore.get(eventName)?.delete(fn)
      }
    })
  }

  const on = ((subscriptionFns) =>
    map(
      subscriptionFns,
      (handlerFn, eventName) => handlerFn && singlyOn(String(eventName), handlerFn)
    )) as EventCenter<T>['on']

  const eventCenter = new Proxy(
    { on, emit, _eventCenterId },
    {
      get(target, p) {
        if (target[p] !== undefined) return target[p]
        if (String(p).startsWith('on')) return (fn: AnyFn) => singlyOn(uncapitalize(String(p).slice(2)), fn)
        return undefined
      }
    }
  ) as unknown as EventCenter<T>
  return eventCenter
}

export function mergeEventCenterFeature<O extends object, T extends EventConfig>(
  targetObject: O,
  eventCenter: EventCenter<T>
): O & EventCenter<T> {
  const merged = new Proxy(targetObject, {
    get(target, p) {
      if (p in targetObject) return target[p]
      return eventCenter[p]
    }
  }) as O & EventCenter<T>
  return merged
}
