import { useAsyncEffect } from '@edsolater/hookit'
import { useEffect, useState } from 'react'
import { getXDB, getXDBObjectStore } from './xdb/main'

const initData = [
  { title: 'Power windows', year: 1985 },
  { title: 'Grace under pressure', year: 1984 },
  { title: 'Signals', year: 1982 },
  { title: 'Moving pictures', year: 1981 },
  { title: 'Permanent waves', year: 1980 },
  { title: 'Hemispheres', year: 1978 },
  { title: 'A farewell to kings', year: 1977 },
  { title: '2112', year: 1976 },
  { title: 'Caress of steel', year: 1975 },
  { title: 'Fly by night', year: 1975 },
  { title: 'Rush', year: 1974 }
]

type AlbumItem = {
  title: string
  year: number
}

export const useList = () => {
  const [list, setList] = useState<AlbumItem[]>([])
  useAsyncEffect(async () => {
    const objectStore = await getXDBObjectStore<AlbumItem>({
      dbOptions: {
        name: 'my-database',
        onUpgradeneeded: ({ createObjectStore }) => {
          // 💡 IDEA: can just auto create?
          createObjectStore({ name: 'album', options: { keyPath: 'title' } })
        }
      },
      objectStoreOptions: {
        name: 'album'
      }
    })
    objectStore.putList(initData)
    setList(await objectStore.getAll())
  }, [])
  return list
}
