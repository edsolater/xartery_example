import { extractRequestValue } from './tools'
import { XDBDatabase, XDBTransaction, XDBObjectStore, XDBIndex } from './type'

export function getXDBFromOriginalIDB(idb: IDBDatabase): XDBDatabase {
  const getTransaction: XDBDatabase['getTransaction'] = ({ name, mode = 'readwrite', options }) =>
    getXDBTransactionFromIDBTransaction({
      originalTransaction: idb.transaction(name, mode, options),
      transactionName: name
    })
  return {
    _original: idb,
    getTransaction
  }
}

export function getXDBTransactionFromIDBTransaction({
  originalTransaction,
  transactionName
}: {
  originalTransaction: IDBTransaction
  transactionName: string
}): XDBTransaction {
  return {
    _original: originalTransaction,
    getObjectStore: (params) =>
      getXDBObjectStoreFromIDBObjectStore({
        originalObjectStore: originalTransaction.objectStore(params?.name ?? transactionName)
      })
  }
}

export function getXDBObjectStoreFromIDBObjectStore({
  originalObjectStore
}: {
  originalObjectStore: IDBObjectStore
}): XDBObjectStore {
  const index: XDBObjectStore['index'] = (name) => getXDBIndexFromIDBIndex(originalObjectStore.index(name))

  const get: XDBObjectStore['get'] = (key) => extractRequestValue(originalObjectStore.get(key))
  
  const getAll: XDBObjectStore['getAll'] = () => {
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

  return {
    _original: originalObjectStore,
    indexNames: originalObjectStore.indexNames,
    keyPath: originalObjectStore.keyPath,
    autoIncrement: originalObjectStore.autoIncrement,
    transaction: originalObjectStore.transaction,

    index,
    createIndex: (name, opts) => getXDBIndexFromIDBIndex(originalObjectStore.createIndex(name, name, opts)),

    getAll,
    get,
    set,
    delete: deleteFn,
    clear
  }
}

export function getXDBIndexFromIDBIndex(originalIndex: IDBIndex): XDBIndex {
  const get: XDBIndex['get'] = () => {
    throw 'not'
  }
  return { _original: originalIndex, get }
}
