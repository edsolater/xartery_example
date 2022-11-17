import { EventCenter, mergeEventCenterFeature } from '../eventCenter/EventCenter'
import { cachelyGetIdbTransaction } from './cachelyGetIdbTransaction'
import { observablize, respondRequestValue } from './tools'
import {
  XDBDatabase,
  XDBIndex,
  XDBObjectStore,
  XDBObjectStoreEventConfigs,
  XDBRecordTemplate,
  XDBTemplate
} from './type'

export function wrapToXDB<S extends XDBTemplate>({
  idb,
  request
}: {
  idb: IDBDatabase
  request: IDBOpenDBRequest
}): XDBDatabase<S> {
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, transactionMode = 'readwrite' }) =>
    wrapToXDBObjectStore({ idb, idbOpenRequest: request, name, transactionMode })
  return { _original: idb, getObjectStore }
}

export function wrapToXDBObjectStore<T extends XDBRecordTemplate = XDBRecordTemplate>({
  idb,
  idbOpenRequest,
  name,
  transactionMode = 'readwrite'
}: {
  idb: IDBDatabase
  idbOpenRequest: IDBOpenDBRequest
  name: string
  transactionMode?: IDBTransactionMode
}): XDBObjectStore<T> {
  const xdb = wrapToXDB({ idb, request: idbOpenRequest })

  if (idbOpenRequest.readyState === 'done') {
    setTimeout(() => {
      eventCenter.emit('init', [{ objectStore: xobjectStore, xdb }])
    }, 0)
  } else {
    idbOpenRequest.addEventListener('success', () => {
      eventCenter.emit('init', [{ objectStore: xobjectStore, xdb }])
    })
  }
  idbOpenRequest.readyState === 'done'

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

  const set: XDBObjectStore<T>['set'] = async (value) => {
    const objectStore = idbObjectStore()
    objectStore.transaction.addEventListener('complete', () => {
      eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
    })

    const coreAction = () => objectStore.put(value)

    return Boolean(await respondRequestValue(coreAction()))
  }

  const setItems: XDBObjectStore<T>['setItems'] = (values) =>
    Promise.all(values.map((value) => set(value))).then(
      () => true,
      () => false
    )

  const deleteItem: XDBObjectStore<T>['delete'] = async (key: string) => {
    const objectStore = idbObjectStore()
    objectStore.transaction.addEventListener('complete', () => {
      eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
    })

    const coreAction = () => objectStore.delete(key)

    return Boolean(await respondRequestValue(coreAction()))
  }

  const clear: XDBObjectStore<T>['clear'] = async () => {
    const objectStore = idbObjectStore()
    objectStore.transaction.addEventListener('complete', () => {
      eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
    })

    const coreAction = () => objectStore.clear()

    return Boolean(await respondRequestValue(coreAction()))
  }

  const eventCenter = EventCenter<XDBObjectStoreEventConfigs<T>>({
    // changeInitly({ emit }) {
    // const transaction = idbTransaction()
    // transaction.addEventListener('complete', () => {
    //   emit('change')
    // })
    // }
  })

  const createIndex = (name: string, opts: IDBIndexParameters | undefined): XDBIndex<T> =>
    wrapToXDBIndex<T>(idbObjectStore().createIndex(name, name, opts))

  const xobjectStore = mergeEventCenterFeature(
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
        return getKeyPath()
      },
      get autoIncrement() {
        return idbObjectStore().autoIncrement
      },

      index,
      createIndex,

      getAll,
      get,
      set,
      setItems,

      delete: deleteItem,
      clear
    },
    eventCenter
  )

  return xobjectStore

  function getKeyPath() {
    return String(idbObjectStore().keyPath)
  }
}

export function wrapToXDBIndex<T>(originalIndex: IDBIndex): XDBIndex<T> {
  const get: XDBIndex<T>['get'] = () => {
    throw 'not'
  }
  return { _original: originalIndex, get }
}
