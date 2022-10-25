import { Valueof } from '@edsolater/fnkit'
import { TODO } from '../typeTools'

export type GetXDBObjectStoreParams = {
  name: string,
  transactionMode?: IDBTransactionMode
}

export type XDBDatabase<S extends XDBTemplate = XDBTemplate> = {
  _original: IDBDatabase
  getObjectStore(opts: GetXDBObjectStoreParams): XDBObjectStore<Valueof<S>[number]>
}

export type XDBObjectStore<T extends XDBRecordTemplate> = {
  _original: IDBObjectStore
  indexNames: IDBObjectStore['indexNames']
  keyPath: IDBObjectStore['keyPath']
  autoIncrement: IDBObjectStore['autoIncrement']
  transaction: IDBObjectStore['transaction']

  // NOTE: temporary do not care about objectStore's index
  /** hanle index */
  index(name: string): XDBIndex<T>
  /** only in version change */
  createIndex(name: string, opts?: IDBIndexParameters): XDBIndex<T>
  // mutate data
  getAll(opts?: { query?: IDBKeyRange; direction?: IDBCursorDirection }): Promise<T[]>
  get(key: keyof T): Promise<T>
  put(value: T): Promise<boolean>
  putList(values: T[]): Promise<boolean>

  delete(key: keyof T): Promise<boolean>
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
