import {
  City,
  Country,
  Prisma,
  Profile,
} from '../../../../../../prisma/client';
import { CountyEntity } from './county.entity';
import { CityEntity } from './city.entity';

export class ProfileEntity implements Profile {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  cityId: number | null;
  countryId: number | null;
  aboutMe: string | null;

  userId: number;

  avatarId: string | null;

  country?: CountyEntity;
  city?: CityEntity;

  constructor(profile: Profile) {
    this.id = Number(profile.id);
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.dateOfBirth = profile.dateOfBirth;
    this.cityId = profile.cityId;
    this.countryId = profile.countryId;
    this.aboutMe = profile.aboutMe;

    this.userId = profile.userId;

    this.avatarId = profile.avatarId;
  }

  static builder(
    profile: Profile & { city?: City; country?: Country },
  ): ProfileEntity {
    const instance = new this(profile);

    if (profile.country) {
      instance.country = CountyEntity.builder(profile.country);
    }

    if (profile.city) {
      instance.city = CityEntity.builder(profile.city);
    }
    return instance;
  }

  static create(): Prisma.ProfileCreateNestedOneWithoutUserInput {
    return {
      create: {
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        aboutMe: null,
      },
    };
  }

  updateAvatar(id: string) {
    this.avatarId = id;
  }

  deleteAvatar() {
    this.avatarId = null;
  }
}
