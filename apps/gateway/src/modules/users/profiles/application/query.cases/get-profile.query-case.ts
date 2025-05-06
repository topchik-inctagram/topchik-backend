import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../../core/results/result';
import { UserView } from '../../../../../common/views/user.view';
import { UserQueryRepo } from '../../../repos/user.query.repo';

export class GetProfileQueryCommand {
  constructor(public userId: number) {}
}

@QueryHandler(GetProfileQueryCommand)
export class GetProfileQueryCase
  implements IQueryHandler<GetProfileQueryCommand>
{
  constructor(private userRepo: UserQueryRepo) {}

  async execute({ userId }: GetProfileQueryCommand): Promise<Result<UserView>> {
    const user = await this.userRepo.findByIdOrFail(userId);

    return Result.Ok(UserView.builder(user));
  }
}
