import { ProfileView } from './profile.view';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../modules/users/domain/user.entity';

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

  static builder(user: User) {
    const instance = new this();

    instance.id = user.id.toString();
    instance.email = user.email;
    instance.username = user.nickname;
    instance.createdAt = user.createdAt;

    instance.profile = ProfileView.builder(user.profile);

    return instance;
  }
}
