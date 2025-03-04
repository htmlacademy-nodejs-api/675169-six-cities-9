import { CityEnum, HousingEnum } from '../enums/index.js';
import { ComfortList, Coordinate, User } from './index.js';

export type Offer = {
  title: string;
  description: string;
  city: CityEnum;
  preview: string;
  images: string[];
  premium: boolean;
  housingType: HousingEnum,
  roomsNumber: number;
  guestsNumber: number;
  rentPrice: number;
  comforts: ComfortList;
  coordinates: Coordinate;
  author: User
}
