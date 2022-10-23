import { TODO } from '../typeTools'

export type GetTransactionParams = {
  name: string
  mode?: IDBTransactionMode
  options?: IDBTransactionOptions
}

export type GetObjectStoreParams = { name: string }

export type XDBDatabase<S = Record<string, any>> = {
  _original: IDBDatabase
  getTransaction(opt: GetTransactionParams): XDBTransaction<S[keyof S]>
}

export type XDBTransaction<T> = {
  _original: IDBTransaction
  getObjectStore(opt?: GetTransactionParams): XDBObjectStore<T>
}

export type XDBObjectStore<T> = {
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
  getAll(opts: { query: IDBKeyRange; direction?: IDBCursorDirection }): Promise<T[]>
  get(key: keyof T): Promise<T>
  put(value: T, recordKey?: IDBValidKey): Promise<boolean>

  delete(key: keyof T): Promise<boolean>
  clear(): Promise<boolean>
  /** @todo more operate methods */
}

export type XDBIndex<T> = {
  _original: IDBIndex
  get(opts: { query: TODO }): Promise<T[]>
  get(key: string /** the value of keyPath */): Promise<T>
}
