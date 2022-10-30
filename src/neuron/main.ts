import { notUndefined } from '@edsolater/fnkit'
import { mergeFunction } from '@edsolater/hookit'
import { WeakerSet } from './WeakerSet'

interface Subscription {
  unsubscribe(): void
  readonly closed: boolean
}

function isNeuron(data: any): data is Neuron<unknown> {
  return data instanceof Neuron
}

export class Neuron<T> {
  innerData: WeakerSet<T>
  subscribers: WeakerSet<(item: T) => void>
  /** record linked neurons */
  private subscribedNeurons: WeakerSet<Neuron<T>>

  constructor(
    iterable?: Iterable<T>,
    initProperties?: { subscribers?: Iterable<(item: T) => void>; subscribedNeurons?: Iterable<Neuron<T>> }
  ) {
    this.innerData = new WeakerSet(iterable)
    this.subscribers = new WeakerSet(initProperties?.subscribers)
    this.subscribedNeurons = new WeakerSet(initProperties?.subscribedNeurons)
    this.registSubscribers()
  }

  private registSubscribers() {
    this.innerData.onAddNewItem(mergeFunction(this.notifyAllSubscribers, this.notifyAllSubscribedNeurons))
  }

  clone(): Neuron<T> {
    return new Neuron<T>(this.innerData.clone(), {
      subscribers: this.subscribers.clone(),
      subscribedNeurons: this.subscribedNeurons.clone()
    })
  }
  /**
   * make neuron have more feature
   *
   * !`undefined` item will not pass to next operator
   *
   * ! it will also discard all subscribers(attached by {@link onItem}; disattached by {@link disonItem}) and subscribedNeurons(attached by {@link link}; disattached by {@link unlink})
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
  link(...otherNeurons: Neuron<T>[]): this {
    otherNeurons.forEach((otherNeuron) => {
      otherNeuron.acceptSubscriptionFromNeuron(this)
    })
    return this
  }

  /** like neuron is dead */
  unlink(...otherNeurons: Neuron<T>[]): this {
    otherNeurons.forEach((otherNeuron) => {
      otherNeuron.disconnectFromNeuron(this)
    })
    return this
  }

  /** used by other neuron's {@link link} */
  private acceptSubscriptionFromNeuron(neuron: Neuron<any>): this {
    neuron.subscribedNeurons.add(this)
    return this
  }

  /** used by other neuron's {@link unlink} */
  private disconnectFromNeuron(neuron: Neuron<any>): this {
    neuron.subscribedNeurons.delete(this)
    return this
  }

  onItem(callback: (item: T) => void): this {
    this.subscribers.add(callback)
    return this
  }

  disonItem(callback: (item: T) => void): this {
    this.subscribers.delete(callback)
    return this
  }

  private notifyAllSubscribers(item: T): void {
    this.subscribers.forEach((cb) => cb?.(item))
  }

  private notifyAllSubscribedNeurons(item: T): void {
    this.subscribedNeurons.forEach((neuron) => neuron.infuse(item, { fromNeuron: this }))
  }

  /** lifetime: self is dead */
  destory(): void {
    this.subscribedNeurons.forEach((otherNeuron) => {
      otherNeuron.disconnectFromNeuron(this)
    })
  }

  /** core input */
  infuse(infuseItem: T, options?: { fromNeuron?: Neuron<any> }): this {
    this.innerData.add(infuseItem)
    return this
  }
}
