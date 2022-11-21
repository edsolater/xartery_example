import { SKeyof, Valueof } from '@edsolater/fnkit'
import { TODO } from '../app/types'
import { EventCenter } from '../eventCenter/EventCenter'
import { WeakerSet } from '../neuron/WeakerSet'

export type XDBObjectStoreOptions = {
  name: string
  transactionMode?: IDBTransactionMode
}

export type XDBDatabase<S extends XDBTemplate = XDBTemplate> = {
  _original: IDBDatabase
  getObjectStore(opts: XDBObjectStoreOptions): XDBObjectStore<Valueof<S>[number]>
}

export type XDBObjectStoreEventConfigs<I extends XDBRecordItem> = {
  change: (utils: { objectStore: XDBObjectStore<I>; xdb: XDBDatabase }) => void
  init: (utils: { objectStore: XDBObjectStore<I>; xdb: XDBDatabase }) => void
}

export type XDBObjectStoreAction<I extends XDBRecordItem> =
  | {
      item: I
      actionType: 'set' | 'delete'
    }
  | {
      items: I[]
      actionType: 'setItems' | 'deleteItems' | 'clear'
    }

export type XDBObjectStore<I extends XDBRecordItem = XDBRecordItem> = {
  _original: IDBObjectStore
  _transaction: IDBObjectStore['transaction']
  _xdb: XDBDatabase

  name: IDBObjectStore['name']
  indexNames: IDBObjectStore['indexNames']
  keyPath: string
  autoIncrement: IDBObjectStore['autoIncrement']

  // NOTE: temporary do not care about objectStore's index
  index(name: string): XDBIndex<I>
  createIndex(name: string, opts?: IDBIndexParameters): XDBIndex<I>

  getAll(opts?: { query?: IDBKeyRange; direction?: IDBCursorDirection }): Promise<I[]>
  get(key: SKeyof<I>): Promise<I>

  set(item: I, options?: { ignoreRecordInStack?: boolean }): Promise<boolean>
  setItems(items: I[], options?: { ignoreRecordInStack?: boolean }): Promise<boolean>
  delete(item: I, options?: { ignoreRecordInStack?: boolean }): Promise<boolean>
  deleteItems(items: I[], options?: { ignoreRecordInStack?: boolean }): Promise<boolean>
  clear(options?: { ignoreRecordInStack?: boolean }): Promise<boolean>

  _redoActionStack: WeakerSet<XDBObjectStoreAction<I>>
  _actionStack: WeakerSet<XDBObjectStoreAction<I>>
  undo(): void
  redo(): void
  /** @todo more operate methods */
} & EventCenter<XDBObjectStoreEventConfigs<I>>

export type XDBIndex<I extends XDBRecordItem = XDBRecordItem> = {
  _original: IDBIndex
  get(opts: { query: TODO }): Promise<I[]>
  get(key: string /** the value of keyPath */): Promise<I>
}

export type XDBRecordItem = Record<string, any>
export type XDBTemplate = Record<string, XDBRecordItem[]>
