import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './index.js';
import { FullOffer } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<FullOffer> | null>;
  updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<FullOffer>[]>;
  find(limit?: number): Promise<DocumentType<FullOffer>[]>;
  findAllByIds(offerIds: string[]): Promise<DocumentType<FullOffer>[]>;
}
