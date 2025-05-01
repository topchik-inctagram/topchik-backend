import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../modules/users/domain/user.entity';
import { ImageView } from './image.view';

export class UserInfoView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: ImageView, nullable: true })
  avatarInfo: ImageView | null;

  static builder(user: User) {
    const instance = new this();

    instance.id = user.id.toString();
    instance.firstName = user.profile.firstName;
    instance.lastName = user.profile.lastName;

    if (user.profile.avatar) {
      instance.avatarInfo = ImageView.builder(
        user.profile.avatar.id,
        user.profile.avatar.image,
      );
    }
    return instance;
  }
}
