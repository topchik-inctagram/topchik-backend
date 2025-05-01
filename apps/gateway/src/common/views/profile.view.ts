import { ApiProperty } from '@nestjs/swagger';
import { CityView } from './city.view';
import { CountryView } from './country.view';
import { Profile } from '../../modules/users/domain/profile.entity';
import { ImageView } from './image.view';

export class ProfileView {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dateOfBirth: string | null;

  @ApiProperty({ type: CountryView, nullable: true })
  country: CountryView | null;

  @ApiProperty({ type: CityView, nullable: true })
  city: CityView | null;

  @ApiProperty()
  aboutMe: string | null;

  @ApiProperty({ type: ImageView, nullable: true })
  avatarInfo: ImageView | null;

  static builder(profile: Profile): ProfileView {
    const instance = new this();

    instance.firstName = profile.firstName;
    instance.lastName = profile.lastName;
    instance.dateOfBirth = profile.dateOfBirth;
    instance.country = null;
    instance.city = null;
    instance.aboutMe = profile.aboutMe;
    instance.avatarInfo = null;

    if (profile.avatar) {
      instance.avatarInfo = ImageView.builder(
        profile.avatar.id,
        profile.avatar.image,
      );
    }

    if (profile.country) {
      instance.country = CountryView.builder(profile.country);
    }

    if (profile.city) {
      instance.city = CityView.builder(profile.city);
    }

    return instance;
  }
}
