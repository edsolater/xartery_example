import { AnyFn } from '@edsolater/fnkit'
import { EventCenter, mergeEventCenterFeature } from '../eventCenter/EventCenter'
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
  const idbTransaction = () => cachelyGetIdbTransaction({ idb, name, transactionMode })
  const idbObjectStore = () => idbTransaction().objectStore(name)

  const index: XDBObjectStore<T>['index'] = (name) => wrapToXDBIndex(idbObjectStore().index(name))

  const get: XDBObjectStore<T>['get'] = (key) => respondRequestValue(idbObjectStore().get(String(key)))

  const getAll: XDBObjectStore<T>['getAll'] = ({ query, direction } = {}) =>
    new Promise((resolve, reject) => {
      const values = [] as any[]
      const cursor$ = observablize(idbObjectStore().openCursor(query, direction))
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

  const put: XDBObjectStore<T>['put'] = (value) => {
    console.log('put value: ', value)
    const actionRequest = idbObjectStore().put(value)
    return respondRequestValue(actionRequest).then((v) => Boolean(v))
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

  // const onChange: XDBObjectStore<T>['onChange'] = (fn) => {
  //   const transaction = idbTransaction()
  //   transaction.addEventListener('complete', fn)
  //   return objectStore
  // }

  const eventCenter = EventCenter<{ change: () => void }>({
    whenListenChangeInitly({ emit }) {
      const transaction = idbTransaction()
      transaction.addEventListener('complete', () => {
        emit('change', [])
      })
    }
  })

  const createIndex = (name: string, opts: IDBIndexParameters | undefined): XDBIndex<T> =>
    wrapToXDBIndex<T>(idbObjectStore().createIndex(name, name, opts))

  const objectStore = mergeEventCenterFeature(
    {
      get _original() {
        return idbObjectStore()
      },
      get transaction() {
        return idbObjectStore().transaction
      },
      xdb,

      get name() {
        return idbObjectStore().name
      },
      get indexNames() {
        return idbObjectStore().indexNames
      },
      get keyPath() {
        return idbObjectStore().keyPath
      },
      get autoIncrement() {
        return idbObjectStore().autoIncrement
      },

      index,
      createIndex,

      getAll,
      get,
      put,
      putList,

      delete: deleteFn,
      clear
    },
    eventCenter
  )

  return objectStore
}

export function wrapToXDBIndex<T>(originalIndex: IDBIndex): XDBIndex<T> {
  const get: XDBIndex<T>['get'] = () => {
    throw 'not'
  }
  return { _original: originalIndex, get }
}
