import { notUndefined } from '@edsolater/fnkit'
import { mergeFunction } from '@edsolater/hookit'
import { WeakerSet } from './WeakerSet'

export interface Subscription<T = any> {
  unsubscribe(): void
  readonly neuron: Neuron_deprecated<T>
}

export function isNeuron(data: any): data is Neuron_deprecated<unknown> {
  return data instanceof Neuron_deprecated
}

function clone<T>(neuron: Neuron_deprecated<T>): Neuron_deprecated<T> {
  return new Neuron_deprecated<T>(neuron.innerData.clone(), {
    isDead: neuron.isDead,
    subscribers: neuron.subscribers.clone(),
    linked: neuron.subscribedNeurons.clone()
  })
}

export class Neuron_deprecated<T> {
  isDead: boolean

  innerData: WeakerSet<T>
  subscribers: WeakerSet<(item: T) => void>
  /** record linked neurons */
  subscribedNeurons: WeakerSet<Neuron_deprecated<T>>

  constructor(
    iterable?: Iterable<T>,
    initOptions?: {
      isDead?: boolean
      subscribers?: Iterable<(item: T) => void>
      linked?: Iterable<Neuron_deprecated<T>>
    }
  ) {
    this.isDead = initOptions?.isDead ?? false
    this.innerData = new WeakerSet(iterable)
    this.subscribers = new WeakerSet()
    this.subscribedNeurons = new WeakerSet()
    this.registSubscribers()

    if (initOptions?.subscribers) {
      for (const subscriber of initOptions.subscribers) {
        this.subscribe(subscriber)
      }
    }

    if (initOptions?.linked) {
      for (const otherNeuron of initOptions.linked) {
        this.link(otherNeuron)
      }
    }
  }

  private registSubscribers() {
    this.innerData.onAddNewItem(mergeFunction(this.notifyAllSubscribers, this.notifyAllSubscribedNeurons))
  }

  /**
   * make neuron have more feature
   *
   * !`undefined` item will not pass to next operator
   *
   * ! it will also discard all subscribers(attached by {@link subscribe}; disattached by {@link unsubscribe}) and subscribedNeurons(attached by {@link link}; disattached by {@link unlink})
   */
  dealWith<U>(operatorA: (item: T) => U): Neuron_deprecated<U>
  dealWith<U, K>(operatorA: (item: T) => U, operatorB: (item: U) => K): Neuron_deprecated<K>
  dealWith<U, K, W>(operatorA: (item: T) => U, operatorB: (item: U) => K, operatorC: (item: K) => W): Neuron_deprecated<W>
  dealWith<U, K, W, V>(
    operatorA: (item: T) => U,
    operatorB: (item: U) => K,
    operatorC: (item: K) => W,
    operatorD: (item: W) => V
  ): Neuron_deprecated<V>
  dealWith(...operators: ((item: T) => T)[]): Neuron_deprecated<T>
  dealWith(...operators: ((item: any) => any)[]): Neuron_deprecated<any> {
    return operators.reduce((acc, currentOperator) => acc.mapInnerData(currentOperator), this as Neuron_deprecated<any>)
  }

  /**
   * single action of dealWith
   * @param operator
   * @returns
   */
  private mapInnerData<U>(operator: (item: T) => U): Neuron_deprecated<U> {
    const newInitList = this.innerData.map(operator).filter(notUndefined)
    return new Neuron_deprecated(newInitList)
  }

  /**
   * like neuron link to others
   *
   * it core is `B.subscrive(this)`
   **/
  private link(otherNeuron: Neuron_deprecated<T>): this {
    otherNeuron.subscribedNeurons.add(this)
    return this
  }

  subscribe(callback: (item: T) => void): Subscription<T> {
    this.subscribers.add(callback)
    return {
      neuron: this,
      unsubscribe: () => this.unsubscribe(callback)
    }
  }

  private unsubscribe(callback: (item: T) => void): this {
    this.subscribers.delete(callback)
    return this
  }

  private notifyAllSubscribers(item: T): void {
    if (this.isDead) return
    this.subscribers.forEach((cb) => cb?.(item))
  }

  private notifyAllSubscribedNeurons(item: T): void {
    if (this.isDead) return
    this.subscribedNeurons.forEach((neuron) => neuron.infuse(item, { fromNeuron: this }))
  }

  /** lifetime: self is dead */
  destory(): void {
    this.isDead = true
  }

  /** core input */
  infuse(infuseItem: T, options?: { fromNeuron?: Neuron_deprecated<any> }): this {
    this.innerData.add(infuseItem)
    return this
  }
}
