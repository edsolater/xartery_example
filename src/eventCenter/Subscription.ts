import { AnyFn } from '@edsolater/fnkit'

export interface Subscription<F extends AnyFn | undefined> {
  unsubscribe(): void
}

// inner method
function createSubscriptionInstance<F extends AnyFn | undefined>(info: { onUnsubscribe(): void }): Subscription<F> {
  return { unsubscribe: info.onUnsubscribe }
}

/**
 * @example
 * const s = Subscription({ onUnsubscribe: () => {} })
 */
export function Subscription<F extends AnyFn = any>(
  ...params: Parameters<typeof createSubscriptionInstance>
): Subscription<F> {
  const instance = createSubscriptionInstance<F>(...params)
  return instance
}

Subscription.of = createSubscriptionInstance
