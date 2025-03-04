import { CityEnum, HousingEnum } from '../../../enums/index.js';
import { ComfortList } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  city: CityEnum;
  preview: string;
  images: string[];
  premium: boolean;
  housingType: HousingEnum;
  roomsNumber: number;
  guestsNumber: number;
  rentPrice: number;
  comforts: ComfortList;
  coordinates: number[];
  userId: string;
}
