import { CityEnum, ComfortsEnum, HousingEnum } from '../enums/index.js';
import { Coordinate } from './index.js';

export type FullOffer = {
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
  comforts: ComfortsEnum[];
  coordinates: Coordinate;
}
