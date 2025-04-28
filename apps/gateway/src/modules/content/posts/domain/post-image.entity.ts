import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { Image } from '../../../../common/domain/image.entity';
import { Post } from './post.entity';

@Entity()
export class PostImage extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Column()
  postId: number;

  @OneToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn()
  image: Image;

  @Column()
  imageId: number;

  static create(data: { postId: number; imageId: number }) {
    const instance = new this();

    Object.assign(instance, data);

    return instance;
  }
}
