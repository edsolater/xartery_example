import { extractRequest$, extractRequestValue } from './tools'
import { XDBDatabase, XDBTransaction, XDBObjectStore, XDBIndex } from './type'

export function getXDBFromOriginalIDB<T = any>(idb: IDBDatabase): XDBDatabase<T> {
  const getTransaction: XDBDatabase['getTransaction'] = ({ name, mode = 'readwrite' }) =>
    getXDBTransactionFromIDBTransaction<T>({
      originalTransaction: idb.transaction(name, mode),
      transactionName: name
    })
  return {
    _original: idb,
    getTransaction
  }
}

export function getXDBTransactionFromIDBTransaction<T>({
  originalTransaction,
  transactionName
}: {
  originalTransaction: IDBTransaction
  transactionName: string
}): XDBTransaction<T> {
  return {
    _original: originalTransaction,
    getObjectStore: (params) =>
      getXDBObjectStoreFromIDBObjectStore({
        originalObjectStore: originalTransaction.objectStore(params?.name ?? transactionName)
      })
  }
}

export function getXDBObjectStoreFromIDBObjectStore<T>({
  originalObjectStore
}: {
  originalObjectStore: IDBObjectStore
}): XDBObjectStore<T> {
  const index: XDBObjectStore<T>['index'] = (name) => getXDBIndexFromIDBIndex(originalObjectStore.index(name))

  const get: XDBObjectStore<T>['get'] = (key) => extractRequestValue(originalObjectStore.get(String(key)))

  const getAll: XDBObjectStore<T>['getAll'] = async ({ query, direction } = {}) => {
    return new Promise((resolve, reject) => {
      const values = [] as any[]
      const cursor$ = extractRequest$(originalObjectStore.openCursor(query, direction))
      cursor$.subscribe({
        next: (cursor) => {
          if (cursor) {
            values.push(cursor.value)
            cursor.continue()
          } else {
            resolve(values)
          }
        },
        error(err) {
          reject(err)
        }
      })
    })
  }

  const put: XDBObjectStore<T>['put'] = async (value, recordKey) => {
    const v = await extractRequestValue(originalObjectStore.put(value, recordKey))
    return Boolean(v)
  }

  const deleteFn: XDBObjectStore<T>['delete'] = () => {
    throw 'not imply yet'
  }

  const clear: XDBObjectStore<T>['clear'] = () => {
    throw 'not imply yet'
  }

  return {
    _original: originalObjectStore,
    indexNames: originalObjectStore.indexNames,
    keyPath: originalObjectStore.keyPath,
    autoIncrement: originalObjectStore.autoIncrement,
    transaction: originalObjectStore.transaction,

    index,
    createIndex: (name, opts) => getXDBIndexFromIDBIndex<T>(originalObjectStore.createIndex(name, name, opts)),

    getAll,
    get,
    put,
    delete: deleteFn,
    clear
  }
}

export function getXDBIndexFromIDBIndex<T>(originalIndex: IDBIndex): XDBIndex<T> {
  const get: XDBIndex<T>['get'] = () => {
    throw 'not'
  }
  return { _original: originalIndex, get }
}
