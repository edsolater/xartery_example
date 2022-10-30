import { notUndefined } from '@edsolater/fnkit'
import { mergeFunction } from '@edsolater/hookit'
import { WeakerSet } from './WeakerSet'

export interface Subscription<T = any> {
  unsubscribe(): void
  readonly neuron: Neuron<T>
}

function isNeuron(data: any): data is Neuron<unknown> {
  return data instanceof Neuron
}

function clone<T>(neuron: Neuron<T>): Neuron<T> {
  return new Neuron<T>(neuron.innerData.clone(), {
    isDead: neuron.isDead,
    subscribers: neuron.subscribers.clone(),
    linked: neuron.subscribedNeurons.clone()
  })
}

export class Neuron<T> {
  isDead: boolean

  innerData: WeakerSet<T>
  subscribers: WeakerSet<(item: T) => void>
  /** record linked neurons */
  subscribedNeurons: WeakerSet<Neuron<T>>

  constructor(
    iterable?: Iterable<T>,
    initOptions?: {
      isDead?: boolean
      subscribers?: Iterable<(item: T) => void>
      linked?: Iterable<Neuron<T>>
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
  dealWith<U>(operatorA: (item: T) => U): Neuron<U>
  dealWith<U, K>(operatorA: (item: T) => U, operatorB: (item: U) => K): Neuron<K>
  dealWith<U, K, W>(operatorA: (item: T) => U, operatorB: (item: U) => K, operatorC: (item: K) => W): Neuron<W>
  dealWith<U, K, W, V>(
    operatorA: (item: T) => U,
    operatorB: (item: U) => K,
    operatorC: (item: K) => W,
    operatorD: (item: W) => V
  ): Neuron<V>
  dealWith(...operators: ((item: T) => T)[]): Neuron<T>
  dealWith(...operators: ((item: any) => any)[]): Neuron<any> {
    return operators.reduce((acc, currentOperator) => acc.mapInnerData(currentOperator), this as Neuron<any>)
  }

  /**
   * single action of dealWith
   * @param operator
   * @returns
   */
  private mapInnerData<U>(operator: (item: T) => U): Neuron<U> {
    const newInitList = this.innerData.map(operator).filter(notUndefined)
    return new Neuron(newInitList)
  }

  /**
   * like neuron link to others
   *
   * it core is `B.subscrive(this)`
   **/
  private link(otherNeuron: Neuron<T>): this {
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
  infuse(infuseItem: T, options?: { fromNeuron?: Neuron<any> }): this {
    this.innerData.add(infuseItem)
    return this
  }
}
