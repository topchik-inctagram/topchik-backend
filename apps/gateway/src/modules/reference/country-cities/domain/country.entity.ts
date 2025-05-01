import { BaseEntity } from '../../../../common/domain/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { City } from './city.entity';

@Entity()
export class Country extends BaseEntity {
  @Column()
  name_ru: string;

  @Column()
  name_en: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
