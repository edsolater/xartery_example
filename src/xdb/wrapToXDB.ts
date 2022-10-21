import { XDBDatabase, XDBTransaction, XDBObjectStore } from './type'

export function getXDBFromOriginalIDB(idb: IDBDatabase): XDBDatabase {
  const getTransaction: XDBDatabase['getTransaction'] = ({ name, mode, options }) =>
    getXdbTransactionFromOriginalTransaction({ originalTransaction: idb.transaction(name, mode, options), name })
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, mode, options }) => {
    const xdbTransaction = getTransaction({ name, mode, options })
    const originalObjecStore = xdbTransaction.getObjectStore({ name, mode, options })
    const xdbObjectStore = getXdbObjectStoreFromOriginalObjectStore({ originalObjectStore: originalObjecStore })
    return xdbObjectStore
  }
  return {
    originalIDB: idb,
    getTransaction,
    getObjectStore
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
  return Object.assign(originalObjectStore, { originalObjectStore })
}
