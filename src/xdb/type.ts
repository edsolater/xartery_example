export type TODO = unknown

type GetTransactionParams = {
  name: string
  mode?: IDBTransactionMode
  options?: IDBTransactionOptions
}

export type XDBDatabase = {
  originalIDB: IDBDatabase
  getTransaction(opt: GetTransactionParams): XDBTransaction
  /** only a shortcut */
  getObjectStore(opt: GetTransactionParams): XDBObjectStore
}

export type XDBTransaction = {
  originalTransaction: IDBTransaction
  getObjectStore(opt?: GetTransactionParams): XDBObjectStore
}

export type XDBObjectStore = {
  originalObjectStore: IDBObjectStore
} & IDBObjectStore
