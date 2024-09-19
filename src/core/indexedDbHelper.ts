export class IndexedDBHelper {
    private db: IDBDatabase | null = null;
  
    constructor(private dbName: string, private storeName: string) {
      this.initDB();
    }
  
    initDB() {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        this.db.createObjectStore(this.storeName, { keyPath: 'id' });
      };
  
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
      };
    }
  
    async saveData(id: string, data: any) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject('DB not initialized');
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put({ id, data });
  
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e);
      });
    }
  
    async getData(id: string) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject('DB not initialized');
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = (e) => reject(e);
      });
    }
  }
  