import { useAsyncEffect, useEvent } from '@edsolater/hookit'
import { useRef, useState } from 'react'
import { getXDBObjectStore } from '../xdb'
import { XDBObjectStore } from '../xdb/type'
import { AlbumItem, initData } from './dataShape'

export const useXDB = () => {
  const [list, setList] = useState<AlbumItem[]>([])
  const objectStoreRef = useRef<XDBObjectStore<AlbumItem>>()
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
    objectStore.onChange(() => {
      console.log(2)
    })
    setList(await objectStore.getAll())
  }, [])

  const count = useRef(1)
  const insertAnNewItem = useEvent(() => {
    const newItem = { title: 'test', year: count.current } as AlbumItem
    count.current += 1
    objectStoreRef.current?.put(newItem)
  })
  return { list, insertAnNewItem }
}
