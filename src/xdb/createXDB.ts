import {
  XDBDatabase,
  XDBTemplate
} from './type'
import { createXDBObjectStore } from './createXDBObjectStore'

export function createXDB<S extends XDBTemplate>({
  idb,
  request
}: {
  idb: IDBDatabase
  request: IDBOpenDBRequest
}): XDBDatabase<S> {
  const getObjectStore: XDBDatabase['getObjectStore'] = ({ name, transactionMode = 'readwrite' }) =>
    createXDBObjectStore({ idb, idbOpenRequest: request, name, transactionMode })
  return { _original: idb, getObjectStore }
}


