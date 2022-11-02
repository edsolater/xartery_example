import { cachelyGetIdbTransaction } from './cachelyGetIdbTransaction'
import { observablize, respondRequestValue } from './tools'
import { XDBDatabase, XDBIndex, XDBObjectStore, XDBRecordTemplate, XDBTemplate } from './type'

export function wrapToXDB<S extends XDBTemplate>(idb: IDBDatabase): XDBDatabase<S> {
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, transactionMode = 'readwrite' }) =>
    wrapToXDBObjectStore({ idb, name, transactionMode })
  return { _original: idb, getObjectStore }
}

export function wrapToXDBObjectStore<T extends XDBRecordTemplate = XDBRecordTemplate>({
  idb,
  name,
  transactionMode = 'readwrite'
}: {
  idb: IDBDatabase
  name: string
  transactionMode?: IDBTransactionMode
}): XDBObjectStore<T> {
  const xdb = wrapToXDB(idb)
  const objectStore = () => cachelyGetIdbTransaction({ idb, name, transactionMode }).objectStore(name)

  const index: XDBObjectStore<T>['index'] = (name) => wrapToXDBIndex(objectStore().index(name))

  const get: XDBObjectStore<T>['get'] = (key) => respondRequestValue(objectStore().get(String(key)))

  const getAll: XDBObjectStore<T>['getAll'] = ({ query, direction } = {}) =>
    new Promise((resolve, reject) => {
      const values = [] as any[]
      const cursor$ = observablize(objectStore().openCursor(query, direction))
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

  const put: XDBObjectStore<T>['put'] = async (value) => {
    console.log('put value: ', value)
    const v = await respondRequestValue(objectStore().put(value))
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
    get _original() {
      return objectStore()
    },
    get transaction() {
      return objectStore().transaction
    },
    xdb,

    get name() {
      return objectStore().name
    },
    get indexNames() {
      return objectStore().indexNames
    },
    get keyPath() {
      return objectStore().keyPath
    },
    get autoIncrement() {
      return objectStore().autoIncrement
    },

    index,
    createIndex: (name, opts) => wrapToXDBIndex<T>(objectStore().createIndex(name, name, opts)),

    getAll,
    get,
    put,
    putList,

    delete: deleteFn,
    clear
  }
}

export function wrapToXDBIndex<T>(originalIndex: IDBIndex): XDBIndex<T> {
  const get: XDBIndex<T>['get'] = () => {
    throw 'not'
  }
  return { _original: originalIndex, get }
}
