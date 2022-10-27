import { useAsyncEffect } from '@edsolater/hookit'
import { useState } from 'react'
import { getXDBObjectStore } from '../xdb'
import { AlbumItem, initData } from './dataStore'

export const useXDB = () => {
  const [list, setList] = useState<AlbumItem[]>([])
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
    setList(await objectStore.getAll())
  }, [])
  return list
}
