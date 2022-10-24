import { useEffect, useState } from 'react'
import { getXDB } from './xdb/main'

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

const xdb = getXDB<{ album: { title: string; year: number }[] }>({
  name: 'my-database',
  onUpgradeneeded: (xdb) => {
    xdb.idb.createObjectStore('album', { keyPath: 'title' })
  }
})

export const useList = () => {
  const [list, setList] = useState<{ title: string; year: number }[]>([])
  useEffect(() => {
    xdb.then((xdb) => {
      const objectStore = xdb.getObjectStore({ name: 'album' })
      objectStore.putList(initData)
    })
    xdb
      .then((xdb) => xdb.getObjectStore({ name: 'album' }))
      .then((data) => data.getAll())
      .then((list) => {
        setList(list)
      })
  }, [])
  return list
}
