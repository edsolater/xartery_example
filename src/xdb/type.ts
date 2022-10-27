import { SKeyof, Valueof } from '@edsolater/fnkit'
import { TODO } from '../app/typeTools'

export type XDBObjectStoreOptions = {
  name: string
  transactionMode?: IDBTransactionMode
}

export type XDBDatabase<S extends XDBTemplate = XDBTemplate> = {
  _original: IDBDatabase
  getObjectStore(opts: XDBObjectStoreOptions): XDBObjectStore<Valueof<S>[number]>
}

export type XDBObjectStore<T extends XDBRecordTemplate> = {
  _original: IDBObjectStore
  transaction: IDBObjectStore['transaction']
  xdb:XDBDatabase 

  name: IDBObjectStore['name']
  indexNames: IDBObjectStore['indexNames']
  keyPath: IDBObjectStore['keyPath']
  autoIncrement: IDBObjectStore['autoIncrement']
  

  // NOTE: temporary do not care about objectStore's index
  /** hanle index */
  index(name: string): XDBIndex<T>
  /** only in version change */
  createIndex(name: string, opts?: IDBIndexParameters): XDBIndex<T>
  // mutate data
  getAll(opts?: { query?: IDBKeyRange; direction?: IDBCursorDirection }): Promise<T[]>
  get(key: SKeyof<T>): Promise<T>
  put(value: T): Promise<boolean>
  putList(values: T[]): Promise<boolean>

  delete(key: SKeyof<T>): Promise<boolean>
  clear(): Promise<boolean>
  /** @todo more operate methods */
}

export type XDBIndex<T> = {
  _original: IDBIndex
  get(opts: { query: TODO }): Promise<T[]>
  get(key: string /** the value of keyPath */): Promise<T>
}

export type XDBRecordTemplate = Record<string, any>
export type XDBTemplate = Record<string, XDBRecordTemplate[]>
