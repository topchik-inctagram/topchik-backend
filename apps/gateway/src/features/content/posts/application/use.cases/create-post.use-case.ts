import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesDto } from '../../../../../../../common/dtos/images.dto';
import { ImageService } from '../../../../../core/adapters/image/image.adapter';
import { PostRepo } from '../../repos/post.repo';
import { PostView } from '../../../../../core/views/post.view';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { PostsMessages } from '../../../../../core/constants/message.constants';
import { PostImageEntity } from '../../../../global/application/db/domain/post-image.entity';

export class CreatePostCommand {
  constructor(
    public userId: number,
    public images: ImagesDto[],
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private imageAdapter: ImageService,
    private postRepo: PostRepo,
  ) {}

  async execute({
    userId,
    images,
  }: CreatePostCommand): Promise<Result<PostView>> {
    const post = await this.postRepo.create(userId);

    const uploadingImage = await this.imageAdapter.sendPostImages(
      post.id,
      images,
    );

    if (!uploadingImage) {
      return Result.Err(
        new BadRequestError(PostsMessages.ERROR_UPLOAD, 'files'),
      );
    }

    await this.postRepo.createPostImages(
      PostImageEntity.create(uploadingImage),
    );

    return Result.Ok(PostView.builder(post, uploadingImage.images));
  }
}
