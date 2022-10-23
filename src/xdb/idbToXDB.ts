import { XDBDatabase, XDBTransaction, XDBObjectStore } from './type'

export function getXDBFromOriginalIDB(idb: IDBDatabase): XDBDatabase {
  const getTransaction: XDBDatabase['getTransaction'] = ({ name, mode, options }) =>
    getXdbTransactionFromOriginalTransaction({ originalTransaction: idb.transaction(name, mode, options), name })
  return {
    originalIDB: idb,
    getTransaction
  }
}

export function getXdbTransactionFromOriginalTransaction({
  originalTransaction,
  name
}: {
  originalTransaction: IDBTransaction
  name: string
}): XDBTransaction {
  return {
    originalTransaction,
    getObjectStore: (params) =>
      getXdbObjectStoreFromOriginalObjectStore({
        originalObjectStore: originalTransaction.objectStore(params?.name ?? name)
      })
  }
}

export function getXdbObjectStoreFromOriginalObjectStore({
  originalObjectStore
}: {
  originalObjectStore: IDBObjectStore
}): XDBObjectStore {
  const get: XDBObjectStore['get'] = () => {
    throw 'not'
  }
  const set: XDBObjectStore['set'] = () => {
    throw 'not imply yet'
  }
  const deleteFn: XDBObjectStore['delete'] = () => {
    throw 'not imply yet'
  }
  const clear: XDBObjectStore['clear'] = () => {
    throw 'not imply yet'
  }
  return Object.assign(originalObjectStore, { originalObjectStore, get, set, delete: deleteFn, clear })
}
