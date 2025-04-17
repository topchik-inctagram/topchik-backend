import { UserInfoView } from './user-info.view';
import { ApiProperty } from '@nestjs/swagger';
import { Post, PostImage, Profile, User } from '../../../prisma/client';
import { PostView } from './post.view';
import { AvatarResponseView } from '../../../../common/views/avatar-response.view';
import { ImageResponseView } from '../../../../common/views/image-response.view';

export class PublicPostView extends PostView {
  @ApiProperty({ type: UserInfoView })
  userInfo: UserInfoView;

  static build(
    post: Post & { images?: PostImage[] },
    images: ImageResponseView[],
    user?: User & {
      profile?: Profile;
    },
    avatarInfo?: AvatarResponseView,
  ) {
    const result = this.builder(post, images);

    const instance = new this();

    instance.id = result.id;
    instance.description = result.description;
    instance.images = result.images;

    if (user) {
      instance.userInfo = UserInfoView.build(user, avatarInfo);
    }

    return instance;
  }
}
