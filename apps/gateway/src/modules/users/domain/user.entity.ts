import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/domain/base.entity';
import { Confirmation } from './confirmation.entity';
import { Profile } from './profile.entity';
import { Recovery } from './recovery.entity';
import { Provider } from './provider.entity';
import { Device } from './device.entity';
import { Post } from '../../content/posts/domain/post.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @OneToOne(() => Confirmation, (confirmation) => confirmation.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  confirmation: Confirmation;

  @OneToOne(() => Recovery, (recovery) => recovery.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  recovery?: Recovery;

  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  profile: Profile;

  @OneToMany(() => Provider, (provider) => provider.user, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  @OneToMany(() => Device, (device) => device.user, {
    onDelete: 'CASCADE',
  })
  devices: Device[];

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  static create(data: { nickname: string; email: string; hash: string }) {
    const entity = new this();
    Object.assign(entity, data);

    entity.confirmation = Confirmation.create();
    entity.profile = Profile.create();

    return entity;
  }

  update(data: Partial<User>) {
    Object.assign(this, data);
  }
}
