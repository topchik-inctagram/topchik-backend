import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/domain/base.entity';
import { User } from './user.entity';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export enum RecoveryStatus {
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
}

@Entity()
export class Recovery extends BaseEntity {
  @OneToOne(() => User, (user) => user.recovery)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  code: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  exp: Date | null;

  @Column({ type: 'enum', enum: RecoveryStatus })
  status: RecoveryStatus;

  static create(userId: number) {
    const entity = new this();
    entity.userId = userId;
    entity.code = randomUUID();
    entity.exp = add(new Date(), {
      minutes: 5,
    });
    entity.status = RecoveryStatus.IN_PROGRESS;

    return entity;
  }

  update() {
    this.code = randomUUID();
    this.exp = add(new Date(), {
      minutes: 5,
    });
    this.status = RecoveryStatus.IN_PROGRESS;
  }

  confirm() {
    this.exp = null;
    this.status = RecoveryStatus.DONE;
    this.code = null;
  }
}
