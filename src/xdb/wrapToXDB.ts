import { observablize, respondRequestValue } from './tools'
import { XDBDatabase, XDBIndex, XDBObjectStore, XDBRecordTemplate, XDBTemplate } from './type'

export function getXDBFromOriginalIDB<S extends XDBTemplate>(idb: IDBDatabase): XDBDatabase<S> {
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, transactionMode }) =>
    getXDBObjectStoreFromIDBObjectStore({
      originalObjectStore: idb.transaction(name, transactionMode).objectStore(name)
    })

  return {
    _original: idb,
    getObjectStore
  }
}

export function getXDBObjectStoreFromIDBObjectStore<T extends XDBRecordTemplate = XDBRecordTemplate>({
  originalObjectStore
}: {
  originalObjectStore: IDBObjectStore
}): XDBObjectStore<T> {
  const index: XDBObjectStore<T>['index'] = (name) => getXDBIndexFromIDBIndex(originalObjectStore.index(name))

  const get: XDBObjectStore<T>['get'] = (key) => respondRequestValue(originalObjectStore.get(String(key)))

  const getAll: XDBObjectStore<T>['getAll'] = async ({ query, direction } = {}) => {
    return new Promise((resolve, reject) => {
      const values = [] as any[]
      const cursor$ = observablize(originalObjectStore.openCursor(query, direction))
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

  const put: XDBObjectStore<T>['put'] = async (value) => {
    const v = await respondRequestValue(originalObjectStore.put(value))
    return Boolean(v)
  }
  const putList: XDBObjectStore<T>['putList'] = (values) =>
    Promise.all(values.map((value) => put(value))).then(
      () => true,
      () => false
    )

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
    putList,

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
