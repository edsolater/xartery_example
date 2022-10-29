export interface Neuron<T> {
  pipe<U>(operatorA: (item: T) => U): Neuron<U>
}
