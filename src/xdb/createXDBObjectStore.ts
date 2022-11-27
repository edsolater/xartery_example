import { createEventCenter, mergeEventCenterFeature } from '@edsolater/fnkit'
import { cachelyGetIdbTransaction } from './cachelyGetIdbTransaction'
import { createXDB } from './createXDB'
import { createXDBIndex } from './createXDBIndex'
import { createXDBObjectStoreAction } from './createXDBObjectStoreAction'
import { observablize, respondRequestValue } from './tools'
import { XDBIndex, XDBObjectStore, XDBObjectStoreAction, XDBObjectStoreEventConfigs, XDBRecordItem } from './type'

export function createXDBObjectStore<I extends XDBRecordItem = XDBRecordItem>({
  idb,
  idbOpenRequest,
  name,
  transactionMode = 'readwrite'
}: {
  idb: IDBDatabase
  idbOpenRequest: IDBOpenDBRequest
  name: string
  transactionMode?: IDBTransactionMode
}): XDBObjectStore<I> {
  const xdb = createXDB({ idb, request: idbOpenRequest })

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
  const redoStack = new Set<XDBObjectStoreAction<I>>() // TODO: maxSet size
  const actionStack = new Set<XDBObjectStoreAction<I>>() // TODO: maxSet size
  const idbTransaction = () => cachelyGetIdbTransaction({ idb, name, transactionMode })
  const idbObjectStore = () => idbTransaction().objectStore(name)
  const index: XDBObjectStore<I>['index'] = (name) => createXDBIndex(idbObjectStore().index(name))

  const get: XDBObjectStore<I>['get'] = (key) => respondRequestValue(idbObjectStore().get(key))
  const getAll: XDBObjectStore<I>['getAll'] = ({ query, direction } = {}) =>
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

  const setItem: XDBObjectStore<I>['set'] = async (item, options) => {
    const objectStore = idbObjectStore()
    objectStore.transaction.addEventListener('complete', () => {
      eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
    })
    const coreAction = () => {
      // record in stack
      !options?.ignoreRecordInStack && actionStack.add(createXDBObjectStoreAction({ actionType: 'set', item }))
      !options?.ignoreRecordInStack && redoStack.clear()
      
      return objectStore.put(item)
    }
    return Boolean(await respondRequestValue(coreAction()))
  }

  const setItems: XDBObjectStore<I>['setItems'] = async (items, options) => {
    const actionResult = await Promise.all(items.map((item) => setItem(item, { ignoreRecordInStack: true }))).then(
      () => true,
      () => false
    )
    // record in stack
    !options?.ignoreRecordInStack && actionStack.add(createXDBObjectStoreAction({ actionType: 'setItems', items }))
    !options?.ignoreRecordInStack && redoStack.clear()

    return actionResult
  }

  const deleteItem: XDBObjectStore<I>['delete'] = async (item, options) => {
    const key = item[getKeyPath()]
    const coreLogic = () => {
      // record in stack
      !options?.ignoreRecordInStack && actionStack.add(createXDBObjectStoreAction({ actionType: 'delete', item }))
      !options?.ignoreRecordInStack && redoStack.clear()

      const objectStore = idbObjectStore()
      objectStore.transaction.addEventListener('complete', () => {
        eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
      })
      return objectStore.delete(key)
    }

    return Boolean(await respondRequestValue(coreLogic()))
  }

  const deleteItems: XDBObjectStore<I>['deleteItems'] = async (items, options) => {
    const actionResult = await Promise.all(items.map((item) => deleteItem(item, { ignoreRecordInStack: true }))).then(
      () => true,
      () => false
    )
    // record in stack
    !options?.ignoreRecordInStack && actionStack.add(createXDBObjectStoreAction({ actionType: 'deleteItems', items }))
    !options?.ignoreRecordInStack && redoStack.clear()
    return actionResult
  }

  const clear: XDBObjectStore<I>['clear'] = async (options) => {
    const coreLogic = async () => {
      await getAll().then((items) => {
        !options?.ignoreRecordInStack && actionStack.add(createXDBObjectStoreAction({ actionType: 'clear', items }))
        !options?.ignoreRecordInStack && redoStack.clear()
      })

      const objectStore = idbObjectStore()
      objectStore.transaction.addEventListener('complete', () => {
        eventCenter.emit('change', [{ objectStore: xobjectStore, xdb }])
      })
      return objectStore.clear()
    }

    return Boolean(await respondRequestValue(await coreLogic()))
  }

  const redo: XDBObjectStore<I>['redo'] = () => {
    const action = [...redoStack.values()].at(-1)
    console.log('action: ', action)
    console.log('redoStack: ', redoStack)
    if (!action) return
    redoStack.delete(action)
    actionStack.add(action)
    if (action.actionType === 'set') {
      setItem(action.item, { ignoreRecordInStack: true })
    } else if (action.actionType === 'setItems') {
      setItems(action.items, { ignoreRecordInStack: true })
    } else if (action.actionType === 'clear') {
      clear({ ignoreRecordInStack: true })
    } else if (action.actionType === 'delete') {
      deleteItem(action.item, { ignoreRecordInStack: true })
    } else if (action.actionType === 'deleteItems') {
      deleteItems(action.items, { ignoreRecordInStack: true })
    }
  }

  const undo: XDBObjectStore<I>['undo'] = () => {
    const action = [...actionStack.values()].at(-1)
    if (!action) return
    actionStack.delete(action)
    console.log('add action to redoStack: ', action)
    redoStack.add(action)
    console.log('redoStack: ', redoStack)
    if (action.actionType === 'set') {
      deleteItem(action.item, { ignoreRecordInStack: true })
    } else if (action.actionType === 'setItems') {
      deleteItems(action.items, { ignoreRecordInStack: true })
    } else if (action.actionType === 'clear') {
      setItems(action.items, { ignoreRecordInStack: true })
    } else if (action.actionType === 'delete') {
      setItem(action.item, { ignoreRecordInStack: true })
    } else if (action.actionType === 'deleteItems') {
      setItems(action.items, { ignoreRecordInStack: true })
    }
  }

  const createIndex = (name: string, opts: IDBIndexParameters | undefined): XDBIndex<I> =>
    createXDBIndex<I>(idbObjectStore().createIndex(name, name, opts))

  const eventCenter = createEventCenter<XDBObjectStoreEventConfigs<I>>({
    // changeInitly({ emit }) {
    // const transaction = idbTransaction()
    // transaction.addEventListener('complete', () => {
    //   emit('change')
    // })
    // }
  })
  const xobjectStore = mergeEventCenterFeature(
    {
      get _original() {
        return idbObjectStore()
      },
      get _transaction() {
        return idbObjectStore().transaction
      },
      get _xdb() {
        return xdb
      },
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
      set: setItem,
      setItems,

      delete: deleteItem,
      deleteItems,
      clear,

      _redoActionStack: redoStack,
      _actionStack: actionStack,
      undo,
      redo
    },
    eventCenter
  )
  return xobjectStore

  function getKeyPath() {
    return String(idbObjectStore().keyPath)
  }
}
