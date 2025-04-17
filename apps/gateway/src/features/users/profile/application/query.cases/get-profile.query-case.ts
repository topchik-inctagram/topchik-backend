import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../../../../common/exeptions/custom.exeption';
import { NOT_FOUND } from '../../../../../core/swagger/swagger.constants';
import { Result } from '../../../../../core/results/result';
import { UserView } from '../../../../../common/views/user.view';
import { ImageService } from '../../../../../common/adapters/image/image.adapter';
import { CountryRepo } from '../../../../reference/repos/country-repo';
import { UserQueryRepo } from '../../api/query.repos/user.query.repo';

export class GetProfileQueryCommand {
  constructor(public userId: number) {}
}

@QueryHandler(GetProfileQueryCommand)
export class GetProfileQueryCase
  implements IQueryHandler<GetProfileQueryCommand>
{
  constructor(
    private userRepo: UserQueryRepo,
    private imageAdapter: ImageService,
    private countryRepo: CountryRepo,
  ) {}

  async execute({ userId }: GetProfileQueryCommand): Promise<Result<UserView>> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return Result.Err(new NotFoundError(NOT_FOUND));
    }

    if (!user.profile.avatarId) {
      return Result.Ok(UserView.builder(user));
    }

    const avatar = await this.imageAdapter.getAvatar(user.profile.avatarId);

    return Result.Ok(UserView.builder(user, avatar));
  }
}
