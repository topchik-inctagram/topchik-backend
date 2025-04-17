import { City, Country, Profile } from '../../../prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ImageResponseView } from '../../../../common/views/image-response.view';
import { AvatarResponseView } from '../../../../common/views/avatar-response.view';
import { CityView } from './city.view';
import { CountryView } from './country.view';

export class ProfileView {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dateOfBirth: Date | null;

  @ApiProperty({ type: CountryView, nullable: true })
  country: CountryView | null;

  @ApiProperty({ type: CityView, nullable: true })
  city: CityView | null;

  @ApiProperty()
  aboutMe: string | null;

  @ApiProperty({ type: ImageResponseView, nullable: true })
  avatarInfo: ImageResponseView | null;

  static builder(
    profile: Profile & { city?: City; country?: Country },
    avatarInfo?: AvatarResponseView,
  ): ProfileView {
    const instance = new this();

    instance.firstName = profile.firstName;
    instance.lastName = profile.lastName;
    instance.dateOfBirth = profile.dateOfBirth;
    instance.country = null;
    instance.city = null;
    instance.aboutMe = profile.aboutMe;
    instance.avatarInfo = null;

    if (avatarInfo) {
      instance.avatarInfo = new ImageResponseView();
      instance.avatarInfo.create(avatarInfo);
    }

    if (profile.country) {
      instance.country = CountryView.builder(profile.country);
    }

    if (profile.city) {
      instance.city = CityView.builder(profile.city);
    }

    return instance;
  }

  private convertDateOfBirth(birth: Date) {
    const correctedDate = new Date(
      birth.getTime() - birth.getTimezoneOffset() * 60000,
    );

    const day = String(correctedDate.getDate()).padStart(2, '0');
    const month = String(correctedDate.getMonth() + 1).padStart(2, '0');
    const year = correctedDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
