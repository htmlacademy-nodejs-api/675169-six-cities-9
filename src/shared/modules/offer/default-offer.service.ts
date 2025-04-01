import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { FullOffer } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService, CreateOfferDto, EditOfferDto } from './index.js';
import { MAX_ITEMS_PER_PAGE, MAX_PREMIUM_NUMBER } from '../../constants/index.js';
import { Component, SortType } from '../../enums/index.js';
import { OfferEntity } from './offer.entity.js';
import mongoose, { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: offerId})) !== null;
  }

  public async isOfferAuthor(userId: string, offerId: string): Promise<boolean> {
    const offer = await this.offerModel.findById(offerId);

    if (!offer) {
      return false;
    }

    const populatedOffer = await offer.populate('userId');
    return populatedOffer.userId._id.toString() === userId;
  }

  private getAggregatedArray(userId: string | null) {
    const favAggregateArray = userId ? [
      {
        $lookup: {
          from: 'users',
          let: { userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { _id: 0, favoriteOfferIds: 1 } }
          ],
          as: 'userData'
        }
      },
      {
        $addFields: {
          isFavorite: {
            $in: [
              { $toString: '$_id' },
              { $ifNull: [{ $arrayElemAt: ['$userData.favoriteOfferIds', 0] }, []] }
            ]
          }
        }
      },
      { $unset: 'userData' }
    ] : [
      {
        $addFields: { isFavorite: false }
      }
    ];

    const aggregateArray = [
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id'},
          pipeline: [
            { $match: { $expr: { $in: ['$$offerId', '$offerId'] } } },
            { $project: { _id: 1, rating: 1}}
          ],
          as: 'comments'
        },
      },
      { $addFields: {
        commentsNumber: { $size: '$comments' },
        rating: { $avg: '$comments.rating' }
      },
      },
      { $unset: 'comments' },
      ...favAggregateArray,
      { $sort: { createdAt: SortType.Down } }
    ];

    return aggregateArray;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async find(userId: string | null, limit = MAX_ITEMS_PER_PAGE): Promise<DocumentType<FullOffer>[]> {
    const aggregateArray = this.getAggregatedArray(userId);
    return await this.offerModel.aggregate(aggregateArray).limit(limit).exec();
  }

  public async findAllByIds(userId: string | null, offerIds: string[]): Promise<DocumentType<FullOffer>[]> {
    const objectIds = offerIds.map((offerId) => new mongoose.Types.ObjectId(offerId));
    const aggregateArray = this.getAggregatedArray(userId);

    return await this.offerModel.aggregate([
      { $match: { _id: { $in: objectIds } } },
      ...aggregateArray,
    ]).exec();
  }

  public async findById(userId: string | null, offerId: string): Promise<DocumentType<FullOffer> | null> {
    const aggregateArray = this.getAggregatedArray(userId);

    return await this.offerModel.aggregate([
      { $match: { _id: new Types.ObjectId(offerId) } },
      ...aggregateArray
    ]).then((results) => results[0] || null);
  }

  public async updateById(offerId: string, dto: EditOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
    this.logger.info(`The offer was updated: ${dto.title}`);

    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const res = await this.offerModel.findByIdAndDelete(offerId).exec();
    this.logger.info(`The offer with id ${offerId} ${res ? 'was deleted' : 'was not found'}`);
    return res;
  }

  public async findPremiumByCity(userId: string | null, city: string): Promise<DocumentType<FullOffer>[]> {
    const aggregateArray = this.getAggregatedArray(userId);

    return this.offerModel.aggregate([
      { $match: { city, premium: true } },
      ...aggregateArray,
    ]).limit(MAX_PREMIUM_NUMBER).exec();
  }
}
