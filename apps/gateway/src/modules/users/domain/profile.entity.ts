import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/domain/base.entity';
import { Avatar } from './avatar.entity';
import { User } from './user.entity';
import { Country } from '../../reference/country-cities/domain/country.entity';
import { City } from '../../reference/country-cities/domain/city.entity';

@Entity()
export class Profile extends BaseEntity {
  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: null, nullable: true })
  dateOfBirth: string | null;

  @Column({ default: '' })
  aboutMe: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Avatar, (ava) => ava.profile, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  avatar: Avatar;

  @OneToOne(() => Country)
  @JoinColumn()
  country?: Country;

  @Column({ default: null, nullable: true })
  countryId: number | null;

  @OneToOne(() => City)
  @JoinColumn()
  city?: City;

  @Column({ default: null, nullable: true })
  cityId: number | null;

  static create() {
    return new Profile();
  }

  update(data: Partial<Profile>) {
    Object.assign(this, data);
  }

  createAvatar(imageId: number) {
    this.avatar = Avatar.create({ imageId, profileId: this.id });
  }

  updateAvatar(imageId: number) {
    this.avatar.update(imageId);
  }
}
