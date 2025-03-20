import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../../core/results/result';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../../../../common/exeptions/custom.exeption';
import { PostsMessages } from '../../../../../core/constants/message.constants';
import { PostRepo } from '../../repos/post.repo';
import { ImageService } from '../../../../../core/adapters/image/image.adapter';
import { PostView } from '../../../../../core/views/post.view';

export class GetPostQueryCommand {
  constructor(public postId: number) {}
}

@QueryHandler(GetPostQueryCommand)
export class GetPostQueryCase implements IQueryHandler<GetPostQueryCommand> {
  constructor(
    private postRepo: PostRepo,
    private imageAdapter: ImageService,
  ) {}

  async execute({ postId }: GetPostQueryCommand): Promise<Result<PostView>> {
    const post = await this.postRepo.findById(postId);

    if (!post) return Result.Err(new NotFoundError(PostsMessages.NOT_EXIST));

    const data = await this.imageAdapter.getPostImages(post.id);

    if (!data) {
      return Result.Err(
        new BadRequestError(PostsMessages.ERROR_UPLOAD, 'files'),
      );
    }

    return Result.Ok(PostView.builder(post, data.images));
  }
}
