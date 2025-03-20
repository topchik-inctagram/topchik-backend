import { $Enums, Confirmation, Prisma } from '../../../../../../prisma/client';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import ConfirmationStatus = $Enums.ConfirmationStatus;

export class ConfirmationEntity implements Confirmation {
  id: number;
  userId: number;
  code: string | null;
  exp: Date | null;
  status: ConfirmationStatus;

  constructor(confirmation: Confirmation) {
    this.id = confirmation.id;
    this.userId = confirmation.userId;
    this.code = confirmation.code;
    this.exp = confirmation.exp;
    this.status = confirmation.status;
  }

  static builder(confirmation: Confirmation) {
    return new this(confirmation);
  }

  static create(): Prisma.ConfirmationCreateNestedOneWithoutUserInput {
    return {
      create: {
        code: randomUUID(),
        exp: add(new Date(), {
          minutes: 5,
        }),
        status: ConfirmationStatus.NOT_CONFIRM,
      },
    };
  }

  static createConfirmed(): Prisma.ConfirmationCreateNestedOneWithoutUserInput {
    return {
      create: {
        code: null,
        exp: null,
        status: 'CONFIRM',
      },
    };
  }
}
