import { observablize, respondRequestValue } from './tools'
import { XDBDatabase, XDBIndex, XDBObjectStore, XDBRecordTemplate, XDBTemplate } from './type'

export function getXDBFromOriginalIDB<S extends XDBTemplate>(idb: IDBDatabase): XDBDatabase<S> {
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, transactionMode }) =>
    getXDBObjectStoreFromIDBObjectStore({
      idbObjectStore: idb.transaction(name, transactionMode).objectStore(name)
    })

  return {
    _original: idb,
    getObjectStore
  }
}

export function getXDBObjectStoreFromIDBObjectStore<T extends XDBRecordTemplate = XDBRecordTemplate>({
  idbObjectStore
}: {
  idbObjectStore: IDBObjectStore
}): XDBObjectStore<T> {
  const index: XDBObjectStore<T>['index'] = (name) => getXDBIndexFromIDBIndex(idbObjectStore.index(name))

  const get: XDBObjectStore<T>['get'] = (key) => respondRequestValue(idbObjectStore.get(String(key)))

  const getAll: XDBObjectStore<T>['getAll'] = async ({ query, direction } = {}) => {
    return new Promise((resolve, reject) => {
      const values = [] as any[]
      const cursor$ = observablize(idbObjectStore.openCursor(query, direction))
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
    const v = await respondRequestValue(idbObjectStore.put(value))
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
    _original: idbObjectStore,
    name: idbObjectStore.name,
    indexNames: idbObjectStore.indexNames,
    keyPath: idbObjectStore.keyPath,
    autoIncrement: idbObjectStore.autoIncrement,
    transaction: idbObjectStore.transaction,

    index,
    createIndex: (name, opts) => getXDBIndexFromIDBIndex<T>(idbObjectStore.createIndex(name, name, opts)),

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
