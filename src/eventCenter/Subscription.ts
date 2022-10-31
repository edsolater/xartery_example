import { AnyFn } from '@edsolater/fnkit';

export interface Subscription<F extends AnyFn | undefined> {
  unsubscribe(): void;
}
export function createSubscription<F extends AnyFn | undefined>(info: { unsubscribe(): void; }): Subscription<F> {
  return { unsubscribe: info.unsubscribe };
}
