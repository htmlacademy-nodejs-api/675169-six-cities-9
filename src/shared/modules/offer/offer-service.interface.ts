import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, EditOfferDto } from './index.js';
import { DocumentExists, FullOffer } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(userId: string | null, offerId: string): Promise<DocumentType<FullOffer> | null>;
  updateById(offerId: string, dto: EditOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(userId: string | null, city: string): Promise<DocumentType<FullOffer>[]>;
  find(userId: string | null, limit?: number): Promise<DocumentType<FullOffer>[]>;
  findAllByIds(userId: string | null, offerIds: string[]): Promise<DocumentType<FullOffer>[]>;
  exists(offerId: string): Promise<boolean>;
  isOfferAuthor(userId: string, offerId: string): Promise<boolean>
}
