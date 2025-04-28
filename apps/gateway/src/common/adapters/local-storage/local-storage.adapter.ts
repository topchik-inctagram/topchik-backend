import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncStorageAdapter {
  private asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  run(callback: () => void) {
    this.asyncLocalStorage.run(new Map<string, any>(), callback);
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string) {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  delete(key: string) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.delete(key);
    }
  }
}
