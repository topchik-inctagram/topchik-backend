import { City, Country, Profile, User } from '../../../prisma/client';
import { ProfileView } from './profile.view';
import { ApiProperty } from '@nestjs/swagger';
import { AvatarResponseView } from '../../../../common/views/avatar-response.view';

export class UserView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ProfileView, nullable: true })
  profile?: ProfileView;

  static builder(
    user: User & {
      profile?: Profile & { city?: City; country?: Country };
    },
    avatarInfo?: AvatarResponseView,
  ) {
    const instance = new this();

    if (user.profile) {
      instance.profile = ProfileView.builder(user.profile, avatarInfo);
    }
    instance.id = user.id.toString();
    instance.email = user.email;
    instance.username = user.nickname;
    instance.createdAt = user.createdAt;

    return instance;
  }
}
