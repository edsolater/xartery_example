import { XDBIndex, XDBRecordItem } from './type'

export function createXDBIndex<I extends XDBRecordItem = XDBRecordItem>(originalIndex: IDBIndex): XDBIndex<I> {
  const get: XDBIndex<I>['get'] = () => {
    throw 'not imply yet'
  }
  return { _original: originalIndex, get }
}
