import { TODO } from '../typeTools'

export type GetTransactionParams = {
  name: string
  mode?: IDBTransactionMode
  options?: IDBTransactionOptions
}

export type GetObjectStoreParams = { name: string }

export type XDBDatabase = {
  originalIDB: IDBDatabase
  getTransaction(opt: GetTransactionParams): XDBTransaction
}

export type XDBTransaction = {
  originalTransaction: IDBTransaction
  getObjectStore(opt?: GetTransactionParams): XDBObjectStore
}

export type XDBObjectStore = {
  originalObjectStore: IDBObjectStore
  get(opts: { query: TODO }): Promise<TODO[]>
  get(key: string /** the value of keyPath */): Promise<TODO>
  set(key: string /** the value of keyPath */, value: TODO): Promise<boolean>
  delete(key: string /** the value of keyPath */):Promise<boolean>
  clear():Promise<boolean>
  /** @todo more operate methods */
} & IDBObjectStore
