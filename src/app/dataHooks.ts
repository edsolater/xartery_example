import { mergeFunction, useAsyncEffect } from '@edsolater/hookit'
import { RefObject, useRef, useState } from 'react'
import { getXDBObjectStore } from '../xdb'
import { XDBObjectStore, XDBTrashStore } from '../xdb/type'
import { initData, TodoListItem } from './dataInitShape'

export const useXDBList = () => {
  const [todoList, setList] = useState<TodoListItem[]>([])
  const [trashTodoList, setTrashTodoList] = useState<TodoListItem[]>([])
  const objectStoreRef = useRef<XDBObjectStore<TodoListItem>>()

  //#region ------------------- subscribe to xdb's onChange -------------------
  useAsyncEffect(async () => {
    const objectStore = await getXDBObjectStore<TodoListItem>({
      dbOptions: {
        name: 'my-database',
        version: 2
      },
      objectStoreInitOptions: {
        name: 'album',
        keyPath: 'createAt',
        initRecords: initData
      }
    })

    objectStoreRef.current = objectStore

    const subscription = objectStore.onInit(async ({ objectStore }) => {
      const list = await objectStore.getAll()
      setList(list)
    }, {})

    const subscription2 = objectStore.onChange(async ({ objectStore }) => {
      const list = await objectStore.getAll()
      setList(list)
    })

    return mergeFunction(subscription.unsubscribe, subscription2.unsubscribe)
  }, [])
  //#endregion

  //#region ------------------- ioninser Data -------------------
  const insertTodoItem =
    (objectStore: RefObject<XDBObjectStore | XDBTrashStore | undefined>) => (info: { todoTitle: string }) => {
      if (!objectStore.current) return
      const newItem = { title: info.todoTitle, createAt: new Date() } as TodoListItem
      objectStore.current.set(newItem)
    }

  const deleteTodoItem =
    (objectStore: RefObject<XDBObjectStore | XDBTrashStore | undefined>) => (info: { item: TodoListItem }) => {
      if (!objectStore.current) return
      console.log('objectStore.current.keyPath: ', objectStore.current.keyPath)
      objectStore.current.delete(info.item[objectStore.current.keyPath])
    }

  const clearItems = (objectStore: RefObject<XDBObjectStore | XDBTrashStore | undefined>) => () => {
    if (!objectStore.current) return
    objectStore.current.clear()
  }
  //#endregion

  return {
    todoList,
    trashTodoList,

    insertTodoItem: insertTodoItem(objectStoreRef),
    deleteTodoItem: deleteTodoItem(objectStoreRef),
    clear: clearItems(objectStoreRef)
  }
}

function getOfRef<T, P extends keyof T>(ref: React.MutableRefObject<T | undefined>, property: P): RefObject<T[P]> {
  return {
    get current() {
      return ref.current?.[property] ?? null
    }
  }
}
