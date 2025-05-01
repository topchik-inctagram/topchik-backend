import { BaseEntity } from '../../../../common/domain/base.entity';
import { PostImage } from './post-image.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../../users/domain/user.entity';

@Entity()
export class Post extends BaseEntity {
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  description: string | null;

  @OneToMany(() => PostImage, (postImage) => postImage.post, {
    onDelete: 'CASCADE',
  })
  images: PostImage[];

  static create(data: { userId: number; description: string | null }) {
    const instance = new this();

    Object.assign(instance, data);

    return instance;
  }

  update({ description }: { description: string }) {
    this.description = description;
  }
}
