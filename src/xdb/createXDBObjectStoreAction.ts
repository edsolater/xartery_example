import { XDBObjectStoreAction, XDBRecordItem } from './type'

export function createXDBObjectStoreAction<I extends XDBRecordItem = XDBRecordItem>(options: {
  item: I
  actionType: 'set' | 'delete'
}): XDBObjectStoreAction<I>
export function createXDBObjectStoreAction<I extends XDBRecordItem = XDBRecordItem>(options: {
  items: I[]
  actionType: 'setItems' | 'deleteItems' | 'clear'
}): XDBObjectStoreAction<I>
export function createXDBObjectStoreAction<I extends XDBRecordItem = XDBRecordItem>(options: {
  item?: I
  items?: I[]
  actionType?: 'set' | 'delete' | 'setItems' | 'deleteItems' | 'clear'
}) {
  return options
}
