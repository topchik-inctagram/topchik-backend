import { Injectable } from '@nestjs/common';
import { DbService } from '../../../../global/application/db/db.service';
import { CountView } from '../../../../../common/views/count.view';

@Injectable()
export class UserQueryRepo {
  constructor(private dbService: DbService) {}

  async findById(id: number) {
    const user = await this.dbService.user.findUnique({
      include: {
        profile: {
          include: {
            city: true,
            country: true,
          },
        },
      },
      where: {
        id,
      },
    });
    if (!user) return null;

    return user;
  }

  async getUserCount(): Promise<CountView> {
    const count = await this.dbService.user.count({
      where: {
        deletedAt: { equals: null },
      },
    });

    return CountView.builder(count);
  }
}
