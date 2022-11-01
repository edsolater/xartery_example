import { AnyFn } from '@edsolater/fnkit'

export interface Subscription<F extends AnyFn | undefined> {
  unsubscribe(): void
}

export function Subscription() {}

function createSubscriptionInstance<F extends AnyFn | undefined>(info: { unsubscribe(): void }): Subscription<F> {
  return { unsubscribe: info.unsubscribe }
}

Subscription.of = createSubscriptionInstance
