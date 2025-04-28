import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { Country } from './country.entity';

@Entity()
export class City extends BaseEntity {
  @Column()
  name_ru: string;

  @Column()
  name_en: string;

  @ManyToOne(() => Country, (country) => country.cities)
  country: Country;

  @Column()
  countryId: number;
}
