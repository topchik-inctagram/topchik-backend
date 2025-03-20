import { Profile, User } from '../../../prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AvatarResponseView } from '../../../../common/views/avatar-response.view';
import { ImageResponseView } from '../../../../common/views/image-response.view';

export class UserInfoView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: ImageResponseView, nullable: true })
  avatarInfo: ImageResponseView | null;

  static build(
    user: User & {
      profile?: Profile;
    },
    avatarInfo?: AvatarResponseView,
  ) {
    const instance = new this();

    instance.id = user.id.toString();
    instance.firstName = user.profile.firstName;
    instance.lastName = user.profile.lastName;

    if (avatarInfo) {
      instance.avatarInfo = new ImageResponseView();
      instance.avatarInfo.create(avatarInfo);
    }
    return instance;
  }
}
