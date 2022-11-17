import { mergeFunction, useAsyncEffect } from '@edsolater/hookit'
import { useRef, useState } from 'react'
import { getXDBObjectStore } from '../xdb'
import { XDBObjectStore } from '../xdb/type'
import { initData, TodoListItem } from './dataShape'

export const useXDBList = () => {
  const [todoList, setList] = useState<TodoListItem[]>([])
  const objectStoreRef = useRef<XDBObjectStore<TodoListItem>>()

  //#region ------------------- subscribe to xdb's onChange -------------------
  useAsyncEffect(async () => {
    const objectStore = await getXDBObjectStore<TodoListItem>({
      dbOptions: {
        name: 'my-database'
      },
      objectStoreInitOptions: {
        name: 'album',
        keyPath: 'title',
        indexes: [{ property: 'createAt' }],
        initRecords: initData
      }
    })
    objectStoreRef.current = objectStore

    const subscription = objectStore.onInit(async ({ objectStore }) => {
      const list = await objectStore.getAll()
      setList(list)
    }, {})

    const subscription2 = objectStore.onChange(async ({ objectStore }) => {
      const list = await objectStore.getAll() // TODO: getAll should be cached, or it will cause too much
      setList(list)
    })

    return mergeFunction(subscription.unsubscribe, subscription2.unsubscribe)
  }, [])
  //#endregion

  //#region ------------------- ioninser Data -------------------
  const insertTodoItem = (info: { todoTitle: string }) => {
    if (!objectStoreRef.current) return
    const newItem = { title: info.todoTitle, createAt: new Date() } as TodoListItem
    objectStoreRef.current.set(newItem)
  }

  const deleteTodoItem = (info: { item: TodoListItem }) => {
    if (!objectStoreRef.current) return
    const keyPath = objectStoreRef.current.keyPath
    objectStoreRef.current.delete(info.item[keyPath])
  }
  const clearItems = () => {
    if (!objectStoreRef.current) return
    objectStoreRef.current.clear()
  }
  //#endregion

  return { todoList, insertTodoItem, deleteTodoItem, clear: clearItems }
}
