import { XDBIndex } from './type'

export function createXDBIndex<T>(originalIndex: IDBIndex): XDBIndex<T> {
  const get: XDBIndex<T>['get'] = () => {
    throw 'not imply yet'
  }
  return { _original: originalIndex, get }
}
