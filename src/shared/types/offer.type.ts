import { CityEnum, HousingEnum } from '../enums/index.js';
import { Image, ComfortList, Coordinate, User } from './index.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: CityEnum;
  preview: Image;
  images: Image[];
  premium: boolean;
  rating: number;
  housingType: HousingEnum,
  roomsNumber: number;
  guestsNumber: number;
  rentPrice: number;
  comforts: ComfortList;
  coordinate: Coordinate;
  author: User
}
