import { BaseEntity } from '../../../common/domain/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum ProviderType {
  GOOGLE = 'GOOGLE',
  GIT_HUB = 'GIT_HUB',
}

@Entity()
export class Provider extends BaseEntity {
  @Column()
  providerId: string;

  @Column({ type: 'enum', enum: ProviderType })
  type: ProviderType;

  @ManyToOne(() => User, (user) => user.providers)
  user: User;

  @Column()
  userId: number;

  static create(data: {
    userId: number;
    providerId: string;
    type: ProviderType;
  }) {
    const entity = new this();
    Object.assign(entity, data);

    return entity;
  }
}
