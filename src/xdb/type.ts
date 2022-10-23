import { TODO } from '../typeTools'

export type GetTransactionParams = {
  name: string
  mode?: IDBTransactionMode
  options?: IDBTransactionOptions
}

export type GetObjectStoreParams = { name: string }

export type XDBDatabase = {
  _original: IDBDatabase
  getTransaction(opt: GetTransactionParams): XDBTransaction
}

export type XDBTransaction = {
  _original: IDBTransaction
  getObjectStore(opt?: GetTransactionParams): XDBObjectStore
}

export type XDBObjectStore= {
  _original: IDBObjectStore
  indexNames: IDBObjectStore['indexNames']
  keyPath: IDBObjectStore['keyPath']
  autoIncrement: IDBObjectStore['autoIncrement']
  transaction: IDBObjectStore['transaction']

  // NOTE: temporary do not care about objectStore's index
  /** hanle index */
  index(name: string): XDBIndex
  /** only in version change */
  createIndex(name: string, opts?: IDBIndexParameters): XDBIndex

  // mutate data
  getAll(opts: { query: TODO; direction?: IDBCursorDirection }): Promise<TODO[]>
  get(key: string /** the value of keyPath */): Promise<TODO>
  set(key: string /** the value of keyPath */, value: TODO): Promise<boolean>
  delete(key: string /** the value of keyPath */): Promise<boolean>
  clear(): Promise<boolean>
  /** @todo more operate methods */
}

export type XDBIndex = {
  _original: IDBIndex
  get(opts: { query: TODO }): Promise<TODO[]>
  get(key: string /** the value of keyPath */): Promise<TODO>
}
