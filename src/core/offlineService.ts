export class OfflineService {
  constructor() {
    this.registerServiceWorker();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {
          console.log('Service Worker Registered');
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  async cacheAssets(assets: string[]) {
    if ('caches' in window) {
      const cache = await caches.open('loomia-whiteboard');
      cache.addAll(assets);
    }
  }

  async saveToIndexedDB(data: any, storeName: string) {
    const dbRequest = indexedDB.open('loomiaDB', 1);
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(data);
    };
  }

  async getFromIndexedDB(id: string, storeName: string) {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open('loomiaDB', 1);
      dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(id);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = reject;
      };
    });
  }
}
