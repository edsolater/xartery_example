import { AnyFn } from '@edsolater/fnkit'

export class Subscription<F extends AnyFn = any> {
  private onUnsubscribe: () => void

  static of<F extends AnyFn = any>(info: { onUnsubscribe(): void }): Subscription<F> {
    return new Subscription(info)
  }

  constructor(info: { onUnsubscribe(): void }) {
    this.onUnsubscribe = info.onUnsubscribe
  }

  unsubscribe(): void {
    this.onUnsubscribe()
  }
}
