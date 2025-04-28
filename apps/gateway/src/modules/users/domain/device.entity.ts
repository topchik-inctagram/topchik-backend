import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Device {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  ip: string;

  @Column()
  exp: number;

  @Column()
  iat: number;

  @ManyToOne(() => User, (user) => user.devices)
  user: User;

  @Column()
  userId: number;

  static create(data: {
    id: string;
    title: string;
    ip: string;
    exp: number;
    iat: number;
    userId: number;
  }) {
    const entity = new this();
    Object.assign(entity, data);

    return entity;
  }

  update(data: Partial<Device>) {
    Object.assign(this, data);
  }
}
