import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../../../../common/exeptions/custom.exeption';
import { NOT_FOUND } from '../../../../../common/swagger/swagger.constants';
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
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return Result.Err(new NotFoundError(NOT_FOUND));
    }

    return Result.Ok(UserView.builder(user));
  }
}
