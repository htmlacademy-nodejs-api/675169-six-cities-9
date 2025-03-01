import { CityEnum, HousingEnum } from '../../../enums/index.js';
import { ComfortList, Coordinate, User } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  postDate: Date;
  city: CityEnum;
  preview: string;
  images: string[];
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
