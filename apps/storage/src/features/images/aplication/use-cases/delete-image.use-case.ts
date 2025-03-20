import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImageRepo } from '../../repos/image.repo';
import { StorageS3Adapter } from '../../../../core/adapters/storage-s3.adapter';
import { NotFoundError } from '../../../../../../common/exeptions/custom.exeption';
import { NOT_FOUND } from '../../../../../../gateway/src/core/swagger/swagger.constants';

export class DeleteImageCommand {
  constructor(public avatarId: string) {}
}

@CommandHandler(DeleteImageCommand)
export class DeleteImageUseCase implements ICommandHandler<DeleteImageCommand> {
  constructor(
    private readonly imageRepository: ImageRepo,
    public s3Adapter: StorageS3Adapter,
  ) {}

  async execute({ avatarId }: DeleteImageCommand): Promise<void> {
    const avatar = await this.imageRepository.getByKey(avatarId);

    if (!avatar) throw new NotFoundError(NOT_FOUND);

    await this.s3Adapter.removeFile({
      small: avatar.small,
      medium: avatar.medium,
      original: avatar.original,
    });

    avatar.delete();
    await this.imageRepository.saveAvatar(avatar);

    return;
  }
}
