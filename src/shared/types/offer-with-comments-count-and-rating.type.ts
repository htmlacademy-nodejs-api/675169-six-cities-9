import { CityEnum, HousingEnum } from '../enums/index.js';
import { ComfortList, Coordinate } from './index.js';

export type OfferWithCommentsCountAndRating = {
  commentsCount: number,
  rating: number,
  isFavorite: boolean,
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
}
