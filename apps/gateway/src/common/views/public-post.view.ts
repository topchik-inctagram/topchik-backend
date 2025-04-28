import { UserInfoView } from './user-info.view';
import { ApiProperty } from '@nestjs/swagger';
import { PostView } from './post.view';
import { Post } from '../../modules/content/posts/domain/post.entity';
import { ImageView } from './image.view';

export class PublicPostView extends PostView {
  @ApiProperty({ type: UserInfoView })
  userInfo: UserInfoView;

  static builder(post: Post) {
    const instance = new this();

    instance.id = post.id;
    instance.description = post.description;
    instance.images = post.images.map((postImg) =>
      ImageView.builder(postImg.id, postImg.image),
    );
    instance.createdAt = post.createdAt.toISOString();
    instance.updatedAt = post.updatedAt ? post.updatedAt.toISOString() : null;

    if (post.user) {
      instance.userInfo = UserInfoView.builder(post.user);
    }

    return instance;
  }
}
