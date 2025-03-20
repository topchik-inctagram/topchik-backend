import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UrlsType = {
  small: string;
  original: string;
  medium: string;
};

export enum ImageType {
  AVATAR = 'avatar',
  POST = 'post',
}

export class BaseImageEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  small: string;

  @Column()
  original: string;

  @Column()
  medium: string;

  @Column()
  smallMeta: string;

  @Column()
  originalMeta: string;

  @Column()
  mediumMeta: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  delete() {
    this.deletedAt = new Date();
  }
}
