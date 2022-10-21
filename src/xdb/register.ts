import { MayFn } from '@edsolater/fnkit'
import { TODO, XDBDatabase } from './type'
import { getXDBFromOriginalIDB } from './wrapToXDB'


/**
 * event:blocked or event:error will be a rejected promise
 * event:success will be a resolved promise
 */
export function getDB(params: {
  name: string
  version?: number
  structure: MayFn<TODO, [{ ev: IDBVersionChangeEvent }]>
}): Promise<{ xdb: XDBDatabase; originalRequest: IDBRequest }> {
  return new Promise((resolve, reject) => {
    const originalRequest = globalThis.indexedDB.open(params.name, params.version)
    originalRequest.addEventListener('success', (ev) => {
      const originalIDB = originalRequest.result
      const xdb = getXDBFromOriginalIDB(originalIDB)
      resolve({ xdb, originalRequest })
    })
    originalRequest.addEventListener('error', (ev) => reject(ev))
    originalRequest.addEventListener('blocked', (ev) => reject(ev))
    originalRequest.addEventListener('upgradeneeded', (ev) => {
      throw 'not imply upgradeneeded 📝' // do with props: structure
    })
  })
}
