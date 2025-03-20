import { $Enums, Prisma, Provider } from '../../../../../../prisma/client';
import ProviderType = $Enums.ProviderType;

export class ProviderEntity implements Provider {
  id: number;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
  type: ProviderType;

  userId: number;

  static builder(provider: Provider) {
    return Object.assign(this, provider);
  }

  static create(
    userId: number,
    providerId: string,
    type: ProviderType,
  ): Prisma.ProviderUncheckedCreateInput {
    return {
      type,
      providerId,
      userId,
    };
  }
}
