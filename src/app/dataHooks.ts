import { mergeFunction, useAsyncEffect, useEvent } from '@edsolater/hookit'
import { useRef, useState } from 'react'
import { getXDBObjectStore } from '../xdb'
import { XDBObjectStore } from '../xdb/type'
import { AlbumItem, initData } from './dataShape'

export const useXDB = () => {
  const [list, setList] = useState<AlbumItem[]>([])
  const objectStoreRef = useRef<XDBObjectStore<AlbumItem>>()

  //#region ------------------- subscribe to xdb's onChange -------------------
  useAsyncEffect(async () => {
    const objectStore = await getXDBObjectStore<AlbumItem>({
      dbOptions: {
        name: 'my-database'
      },
      objectStoreInitOptions: {
        name: 'album',
        keyPath: 'title',
        indexes: [{ property: 'year' }],
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
  const count = useRef(1)
  const insertAnNewItem = useEvent(() => {
    const newItem = { title: 'test', year: count.current } as AlbumItem
    count.current += 1
    objectStoreRef.current?.set(newItem)
  })
  //#endregion

  return { list, insertAnNewItem }
}
