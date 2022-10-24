import { GetObjectStoreParams, GetTransactionParams, XDBDatabase, XDBObjectStore } from './type'
import { getXDBFromOriginalIDB } from './wrapToXDB'
import { Optional } from '../typeTools'

type GetDBParams = {
  name: string
  version?: number
  onUpgradeneeded(util: { ev: IDBVersionChangeEvent; xdb: XDBDatabase; idb: IDBDatabase }): void
}

/**
 * event:blocked or event:error will be a rejected promise
 * event:success will be a resolved promise
 */
export function getXDB<S>(params: GetDBParams): Promise<XDBDatabase<S>> {
  return new Promise((resolve, reject) => {
    const originalRequest = globalThis.indexedDB.open(params.name, params.version)
    originalRequest.addEventListener('success', (ev) => {
      const originalIDB = originalRequest.result
      const xdb = getXDBFromOriginalIDB(originalIDB)
      resolve(xdb)
    })
    originalRequest.addEventListener('error', (ev) => reject(ev))
    originalRequest.addEventListener('blocked', (ev) => reject(ev))
    originalRequest.addEventListener('upgradeneeded', (ev) => {
      const { result: idb } = ev.target as unknown as { result: IDBDatabase }
      const xdb = getXDBFromOriginalIDB(idb)
      params.onUpgradeneeded({ ev, xdb, idb })
    })
  })
}

export async function getXDBObjectStore<T>(params: {
  dbOptions: GetDBParams
  transactionOptions?: Optional<GetTransactionParams, 'name'>
  objectStoreOptions: GetObjectStoreParams
}): Promise<XDBObjectStore<T>> {
  const xdb = await getXDB<Record<string, T>>(params.dbOptions)
  const transaction = xdb.getTransaction({ ...params.transactionOptions, name: params.objectStoreOptions.name })
  const objectStore = transaction.getObjectStore(params.dbOptions)
  return objectStore
}
