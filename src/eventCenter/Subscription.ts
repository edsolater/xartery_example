import { AnyFn } from '@edsolater/fnkit'

export interface Subscription<F extends AnyFn | undefined> {
  unsubscribe(): void
}

export function Subscription<F extends AnyFn | undefined>(info: { onUnsubscribe(): void }): Subscription<F> {
  return { unsubscribe: info.onUnsubscribe }
}
