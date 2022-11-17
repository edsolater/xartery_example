import { SKeyof, Valueof } from '@edsolater/fnkit'
import { TODO } from '../app/types'
import { EventCenter } from '../eventCenter/EventCenter'

export type XDBObjectStoreOptions = {
  name: string
  transactionMode?: IDBTransactionMode
}

export type XDBDatabase<S extends XDBTemplate = XDBTemplate> = {
  _original: IDBDatabase
  getObjectStore(opts: XDBObjectStoreOptions): XDBObjectStore<Valueof<S>[number]>
}

export type XDBObjectStoreEventConfigs<T extends XDBRecordTemplate> = {
  change: (utils: {
    objectStore: XDBObjectStore<T>
    xdb: XDBDatabase
  }) => void
  init: (utils: {
    objectStore: XDBObjectStore<T>
    xdb: XDBDatabase
  }) => void
}

export type XDBObjectStore<T extends XDBRecordTemplate> = {
  _original: IDBObjectStore
  transaction: IDBObjectStore['transaction']
  xdb: XDBDatabase

  name: IDBObjectStore['name']
  indexNames: IDBObjectStore['indexNames']
  keyPath: string
  autoIncrement: IDBObjectStore['autoIncrement']

  // NOTE: temporary do not care about objectStore's index
  /** hanle index */
  index(name: string): XDBIndex<T>
  /** only in version change */
  createIndex(name: string, opts?: IDBIndexParameters): XDBIndex<T>
  // mutate data
  getAll(opts?: { query?: IDBKeyRange; direction?: IDBCursorDirection }): Promise<T[]>
  get(key: SKeyof<T>): Promise<T>
  set(value: T): Promise<boolean>
  setItems(values: T[]): Promise<boolean>

  delete(key: SKeyof<T>): Promise<boolean>
  clear(): Promise<boolean>
  /** @todo more operate methods */
} & EventCenter<XDBObjectStoreEventConfigs<T>>

export type XDBIndex<T> = {
  _original: IDBIndex
  get(opts: { query: TODO }): Promise<T[]>
  get(key: string /** the value of keyPath */): Promise<T>
}

export type XDBRecordTemplate = Record<string, any>
export type XDBTemplate = Record<string, XDBRecordTemplate[]>
