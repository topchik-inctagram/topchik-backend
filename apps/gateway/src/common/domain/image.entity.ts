import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  key: string;

  @Column()
  originUrl: string;

  @Column()
  smallUrl: string;

  @Column()
  mediumUrl: string;

  @Column()
  index: number;

  static create(data: {
    key: string;
    originUrl: string;
    smallUrl: string;
    mediumUrl: string;
    index: number;
  }) {
    const entity = new this();
    Object.assign(entity, data);

    return entity;
  }
}
