import { CityEnum, HousingEnum } from '../../../enums/index.js';
import { ComfortList, Coordinate, Image, User } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  postDate: Date;
  city: CityEnum;
  preview: Image;
  images: Image[];
  premium: boolean;
  rating: number;
  housingType: HousingEnum;
  roomsNumber: number;
  guestsNumber: number;
  rentPrice: number;
  comforts: ComfortList;
  coordinate: Coordinate;
  userId: User;
}
