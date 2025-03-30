import { Expose } from 'class-transformer';
import { CityEnum, HousingEnum } from '../../../enums/index.js';
import { ComfortList } from '../../../types/index.js';

export class OfferRdo {
  // TODO: do we need id (probably yes) how to make id not _id
  // @Expose()
  // public _id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public city: CityEnum;

  @Expose()
  public preview: string[];

  @Expose()
  public images: string[];

  @Expose()
  public premium: boolean;

  @Expose()
  public housingType: HousingEnum;

  @Expose()
  public roomsNumber: number;

  @Expose()
  public guestsNumber: number;

  @Expose()
  public rentPrice: number;

  @Expose()
  public comforts: ComfortList;

  @Expose()
  public coordinates: string[];

  @Expose()
  public userId: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public commentsNumber: number;

  @Expose()
  public rating: number;

  @Expose()
  public isFavorite: boolean;

}
