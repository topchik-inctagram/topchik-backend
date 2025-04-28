import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/domain/base.entity';
import { User } from './user.entity';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export enum ConfirmationStatus {
  CONFIRM = 'CONFIRM',
  NOT_CONFIRM = 'NOT_CONFIRM',
}
@Entity()
export class Confirmation extends BaseEntity {
  @OneToOne(() => User, (user) => user.confirmation)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  code: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  exp: Date | null;

  @Column({ type: 'enum', enum: ConfirmationStatus })
  status: ConfirmationStatus;

  static create() {
    const entity = new this();
    entity.code = randomUUID();
    entity.exp = add(new Date(), {
      minutes: 5,
    });
    entity.status = ConfirmationStatus.NOT_CONFIRM;

    return entity;
  }

  update() {
    this.code = randomUUID();
    this.exp = add(new Date(), {
      minutes: 5,
    });
    this.status = ConfirmationStatus.NOT_CONFIRM;
  }

  confirm() {
    this.exp = null;
    this.status = ConfirmationStatus.CONFIRM;
    this.code = null;
  }
}
