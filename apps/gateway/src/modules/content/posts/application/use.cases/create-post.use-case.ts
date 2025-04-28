import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileListDto } from '../../../../../../../storage/src/modules/images/application/dtos/file-list.dto';
import { ImageService } from '../../../../../common/adapters/image/image.adapter';
import { PostRepo } from '../../repos/post.repo';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { PostsMessages } from '../../../../../common/constants/message.constants';
import { Post } from '../../domain/post.entity';
import { ImageMetaType } from '../../../../../../../common/types/image/image.dto';
import { ImageType } from '../../../../../../../common/types/image/image-owner-type';
import { imageConstants } from '../../../../../common/constants/image.constants';
import { PostImage } from '../../domain/post-image.entity';

export class CreatePostCommand {
  constructor(
    public userId: number,
    public images: FileListDto[],
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  imgMeta: ImageMetaType;
  constructor(
    private imageAdapter: ImageService,
    private postRepo: PostRepo,
  ) {
    const imageType = ImageType.POST;

    this.imgMeta = {
      imageType,
      sizes: {
        medium: imageConstants[imageType].medium,
        small: imageConstants[imageType].small,
      },
    };
  }

  async execute({
    userId,
    images,
  }: CreatePostCommand): Promise<Result<number>> {
    const post = await this.postRepo.save(
      Post.create({ userId, description: null }),
    );

    const uploadingImageIds = await this.imageAdapter.uploadImageList(
      post.id,
      images,
      this.imgMeta,
    );

    if (!uploadingImageIds.length) {
      return Result.Err(
        new BadRequestError(PostsMessages.ERROR_UPLOAD, 'files'),
      );
    }

    const postImages = uploadingImageIds.map((imageId) =>
      PostImage.create({ imageId, postId: post.id }),
    );

    await this.postRepo.createPostImages(postImages);

    return Result.Ok(post.id);
  }
}
