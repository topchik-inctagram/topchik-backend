import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileInputDto } from '../../api/dtos/profile-input.dto';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { CountryRepo } from '../../../../reference/country-cities/repos/country-repo';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

export class UpdateProfileCommand {
  constructor(
    public userId: number,
    public profile: ProfileInputDto,
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    protected readonly userRepo: UserRepo,
    private countryRepo: CountryRepo,
  ) {}

  async execute({
    userId,
    profile: {
      firstName,
      lastName,
      username,
      cityId,
      countryId,
      dateOfBirth,
      aboutMe,
    },
  }: UpdateProfileCommand) {
    const user = await this.userRepo.findByIdOrFail(userId);

    const existingByNickname = await this.userRepo.findByNickname(username);

    if (existingByNickname && user.nickname !== username) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.ALREADY_REGISTERED_BY_USERNAME,
        metadata: {
          username: UserDomainMessages.ALREADY_REGISTERED_BY_USERNAME,
        },
      });
    }
    const location = await this.checkCountryWithCity(countryId, cityId);

    user.update({ nickname: username });
    user.profile.update({
      firstName,
      lastName,
      countryId: location.countryId,
      cityId: location.cityId,
      dateOfBirth,
      aboutMe,
    });

    await this.userRepo.save(user);

    return Result.Ok();
  }

  private async checkCountryWithCity(
    countryId?: number,
    cityId?: number,
  ): Promise<{
    cityId: number | null;
    countryId: number | null;
  }> {
    const city = cityId
      ? await this.countryRepo.getCityWithCountyOrFail(cityId, countryId)
      : null;

    const country =
      countryId || city?.countryId
        ? await this.countryRepo.getCountryByIdOrFail(countryId)
        : null;

    return {
      cityId: city ? city.id : null,
      countryId: country ? country.id : null,
    };
  }
}
