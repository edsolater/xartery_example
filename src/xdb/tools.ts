import { Observable } from 'rxjs'

export function respondRequestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => {
      resolve(request.result)
    })
    request.addEventListener('error', () => {
      reject(request.error)
    })
  })
}

export function extractRequest$<T>(request: IDBRequest<T>): Observable<T> {
  return new Observable((subscriber) => {
    request.addEventListener('success', () => {
      subscriber.next(request.result)
    })
    request.addEventListener('error', () => {
      subscriber.error(request.error)
    })
  })
}
