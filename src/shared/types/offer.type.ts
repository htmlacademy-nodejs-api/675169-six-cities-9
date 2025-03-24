import { CityEnum, ComfortsEnum, HousingEnum } from '../enums/index.js';
import { Coordinate, User } from './index.js';

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
  comforts: ComfortsEnum[];
  coordinates: Coordinate;
  author: User
}
