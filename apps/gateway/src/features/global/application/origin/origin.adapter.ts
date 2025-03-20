import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable({ scope: Scope.REQUEST })
export class OriginService {
  private readonly asyncLocalStorage: AsyncLocalStorage<any>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  private origin: string;

  setOrigin(origin: string) {
    this.origin = origin;
    console.log(this);
  }

  getOrigin(): string {
    return this.origin;
  }
}

// @Injectable()
// export class TransactionHelper {
//   constructor(
//     @InjectDataSource()
//     private readonly dataSource: DataSource,
//   ) {
//     this.asyncLocalStorage = new AsyncLocalStorage();
//   }
//
//   private readonly asyncLocalStorage: AsyncLocalStorage<any>;
//
//   getManager(): EntityManager {
//     const storage = this.asyncLocalStorage.getStore();
//     if (storage && storage.has('typeOrmEntityManager')) {
//       return this.asyncLocalStorage.getStore().get('typeOrmEntityManager');
//     }
//     return this.dataSource.createEntityManager();
//   }
//
//   async doTransactional<T>(fn): Promise<T> {
//     // @ts-ignore
//     return this.dataSource.transaction(async (manager) => {
//       let response: T | undefined;
//       await this.asyncLocalStorage.run(
//         new Map<string, EntityManager>(),
//         async () => {
//           this.asyncLocalStorage
//             .getStore()
//             .set('typeOrmEntityManager', manager);
//           response = await fn(manager);
//         },
//       );
//       if (response !== undefined) {
//         return response;
//       } else {
//         // throw new Error('Response is not assigned.');
//         return response;
//       }
//     });
//   }
// }
