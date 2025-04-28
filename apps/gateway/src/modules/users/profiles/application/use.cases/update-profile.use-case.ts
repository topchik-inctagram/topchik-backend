import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileInputDto } from '../../api/dtos/profile-input.dto';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import {
  NOT_EXIST,
  UserMessages,
} from '../../../../../common/constants/message.constants';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { CountryRepo } from '../../../../reference/country-cities/repos/country-repo';

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
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'id'));
    }

    const existingByNickname = await this.userRepo.findByNickname(username);

    if (existingByNickname && user.nickname !== username) {
      return Result.Err(
        new BadRequestError(
          UserMessages.ALREADY_REGISTERED_BY_USERNAME,
          'username',
        ),
      );
    }
    const result = await this.checkCountryWithCity(countryId, cityId);
    if (!result.isSuccess) {
      return result;
    }

    user.update({ nickname: username });
    user.profile.update({
      firstName,
      lastName,
      countryId: result.value.countryId,
      cityId: result.value.cityId,
      dateOfBirth,
      aboutMe,
    });

    console.log(user.profile.cityId);
    console.log(user.profile.countryId);

    await this.userRepo.save(user);

    return Result.Ok();
  }

  private async checkCountryWithCity(
    countryId?: number,
    cityId?: number,
  ): Promise<
    Result<{
      cityId: number | null;
      countryId: number | null;
    }>
  > {
    if (cityId) {
      const city = await this.countryRepo.getCityWithCounty(cityId, countryId);

      if (!city) {
        return Result.Err(new BadRequestError(NOT_EXIST, 'cityId'));
      }

      return Result.Ok({
        cityId: city.id,
        countryId: city.countryId,
      });
    }

    if (countryId) {
      const country = await this.countryRepo.getCountryById(countryId);

      if (!country) {
        return Result.Err(new BadRequestError(NOT_EXIST, 'countryId'));
      }

      return Result.Ok({
        cityId: null,
        countryId: country.id,
      });
    }

    return Result.Ok({
      cityId: null,
      countryId: null,
    });
  }
}
