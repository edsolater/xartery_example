// 💡 observable should be the core of js model. just like event target is the core of DOM
// 💡 class obray extends Array
export function createObservable(options: { supportEvents: {} }) {
  return {}
}

export class Obray<T> {
  innerArray: T[] = []
  length: number = 0
  constructor(iterable?: Iterable<T>) {
    this.innerArray = iterable ? Array.from(iterable) : []
    this.length = this.innerArray.length
  }
  push(...args: Parameters<Array<T>['push']>) {
    return this.innerArray.push(...args)
  }
  concat(...args: Parameters<Array<T>['concat']>) {
    return this.innerArray.concat(...args)
  }
}
