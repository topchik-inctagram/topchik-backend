import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileInputDto } from '../../api/dtos/profile-input.dto';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../../auth/repos/user.repo';
import { Result } from '../../../../../core/results/result';
import {
  NOT_EXIST,
  UserMessages,
} from '../../../../../core/constants/message.constants';
import { ProfileEntity } from '../../../../global/application/db/domain/profile.entity';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { CountryRepo } from '../../../../reference/repos/country-repo';

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
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
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
    let user = await this.userRepo.findById(userId);
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

    if (!user.profile) {
      await this.userRepo.createProfile(user.id, ProfileEntity.create());

      user = await this.userRepo.findById(userId);
    }

    user.updateWithProfile({
      firstName,
      lastName,
      username,
      countryId: result.value.countryId,
      cityId: result.value.cityId,
      dateOfBirth,
      aboutMe,
    });

    console.log(user.profile.cityId);
    console.log(user.profile.countryId);

    await this.userRepo.update(user);

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
