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
} & IDBObjectStore
