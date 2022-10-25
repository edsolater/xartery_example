import { GetXDBObjectStoreParams, XDBDatabase, XDBObjectStore, XDBRecordTemplate, XDBTemplate } from './type'
import { getXDBFromOriginalIDB } from './wrapToXDB'

type GetXDBParams = {
  name: string
  version?: number
  onUpgradeneeded(util: {
    ev: IDBVersionChangeEvent
    xdb: XDBDatabase
    createObjectStore: (opts: { name: string; options?: IDBObjectStoreParameters }) => void
  }): void
}

/**
 * event:blocked or event:error will be a rejected promise
 * event:success will be a resolved promise
 */
export function getXDB<S extends XDBTemplate = XDBTemplate>(params: GetXDBParams): Promise<XDBDatabase<S>> {
  return new Promise((resolve, reject) => {
    const originalRequest = globalThis.indexedDB.open(params.name, params.version)
    originalRequest.addEventListener('success', () => {
      const originalIDB = originalRequest.result
      const xdb = getXDBFromOriginalIDB(originalIDB)
      resolve(xdb)
    })
    originalRequest.addEventListener('error', (ev) => reject(ev))
    originalRequest.addEventListener('blocked', (ev) => reject(ev))
    originalRequest.addEventListener('upgradeneeded', (ev) => {
      const { result: idb } = ev.target as unknown as { result: IDBDatabase }
      const xdb = getXDBFromOriginalIDB(idb)
      params.onUpgradeneeded({
        ev,
        xdb,
        createObjectStore: ({ name, options }) => idb.createObjectStore(name, options)
      })
    })
  })
}

export async function getXDBObjectStore<T extends XDBRecordTemplate = XDBRecordTemplate>(params: {
  dbOptions: GetXDBParams
  objectStoreOptions: GetXDBObjectStoreParams
}): Promise<XDBObjectStore<T>> {
  const xdb = await getXDB<Record<string, T[]>>(params.dbOptions)
  const objectStore = xdb.getObjectStore(params.objectStoreOptions)
  return objectStore
}
