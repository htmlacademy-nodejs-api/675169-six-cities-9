import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';
import { OfferWithCommentsCountAndRating } from '../../types/index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferWithCommentsCountAndRating> | null>;
  updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(itemsNumber: number): Promise<DocumentType<OfferWithCommentsCountAndRating>[]>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
}
