import { isFunction, MayPromise } from '@edsolater/fnkit'
import { useEvent } from '@edsolater/hookit'
import { useEffect, useRef, useState } from 'react'
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

    const subscription = objectStore.onChange(async ({ objectStore }) => {
      const list = await objectStore.getAll()
      setList(list)
    })
    return subscription.unsubscribe
  }, [])

  const count = useRef(1)
  const insertAnNewItem = useEvent(() => {
    const newItem = { title: 'test', year: count.current } as AlbumItem
    count.current += 1
    objectStoreRef.current?.set(newItem)
  })
  return { list, insertAnNewItem }
}

function useAsyncEffect<CleanFn>(asyncEffect: () => MayPromise<CleanFn>, dependenceList?: any[]): void {
  const cleanFunction = useRef<CleanFn>()
  useEffect(() => {
    Promise.resolve(asyncEffect()).then((cleanFn) => (cleanFunction.current = cleanFn))
    return () => {
      if (isFunction(cleanFunction.current)) cleanFunction.current()
    }
  }, dependenceList)
}
