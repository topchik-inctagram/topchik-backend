import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Image } from '../../../common/domain/image.entity';
import { Profile } from './profile.entity';
import { BaseEntity } from '../../../common/domain/base.entity';

@Entity()
export class Avatar extends BaseEntity {
  @OneToOne(() => Profile, (profile) => profile.avatar, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @Column()
  profileId: number;

  @OneToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn()
  image: Image;

  @Column()
  imageId: number;

  static create(data: { imageId: number; profileId: number }) {
    const instance = new this();

    Object.assign(instance, data);

    return instance;
  }

  update(imageId: number) {
    this.imageId = imageId;
    this.deletedAt = null;
    this.createdAt = new Date();
  }
}
