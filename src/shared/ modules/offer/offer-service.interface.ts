import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, EditOfferDto } from './index.js';
import { DocumentExists, FullOffer } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<FullOffer> | null>;
  updateById(offerId: string, dto: EditOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<FullOffer>[]>;
  find(limit?: number): Promise<DocumentType<FullOffer>[]>;
  findAllByIds(offerIds: string[]): Promise<DocumentType<FullOffer>[]>;
  exists(offerId: string): Promise<boolean>;
  isOfferAuthor(userId: string, offerId: string): Promise<boolean>
}
