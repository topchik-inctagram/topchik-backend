import { $Enums, Prisma, Recovery } from '../../../../../../prisma/client';
import RecoveryStatus = $Enums.RecoveryStatus;

export class RecoveryEntity implements Recovery {
  id: number;
  userId: number;
  code: string | null;
  exp: Date | null;
  status: RecoveryStatus;

  static builder(recovery: Recovery) {
    return Object.assign(this, recovery);
  }

  static create(): Prisma.RecoveryCreateNestedOneWithoutUserInput {
    return {
      create: {
        code: null,
        exp: null,
        status: RecoveryStatus.DONE,
      },
    };
  }
}
