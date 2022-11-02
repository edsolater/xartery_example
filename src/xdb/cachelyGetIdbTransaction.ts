export function cachelyGetIdbTransaction({
  idb, name, transactionMode
}: {
  idb: IDBDatabase;
  name: string;
  transactionMode: IDBTransactionMode;
}) {
  return idb.transaction(name, transactionMode);
}
