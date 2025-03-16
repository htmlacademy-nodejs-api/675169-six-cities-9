import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { FullOffer } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService, CreateOfferDto } from './index.js';
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
    const populatedOffer = await offer?.populate('userId');

    return populatedOffer?.userId._id.toString() === userId;
  }

  private readonly aggregateArray = [
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

    // добавляем isFavorite
    {
      $lookup: {
        from: 'users',
        let: { email: '$email' },
        pipeline: [
          { $match: { $expr: { $eq: ['$email', '$$email'] } } },
          { $project: { _id: 1, favoriteOfferIds: 1 } }
        ],
        as: 'user'
      }
    },
    {
      $addFields: {
        isFavorite: {
          $cond: {
            if: {
              $in: [
                '$_id',
                { $ifNull: [{ $arrayElemAt: ['$user.favoriteOfferIds', 0] }, []] }
              ]
            },
            then: true,
            else: false
          }
        }
      }
    },

    { $unset: 'user' },
    { $sort: { createdAt: SortType.Down } }
  ];

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async find(limit = MAX_ITEMS_PER_PAGE): Promise<DocumentType<FullOffer>[]> {
    return await this.offerModel.aggregate(this.aggregateArray).limit(limit).exec();
  }

  public async findAllByIds(offerIds: string[]): Promise<DocumentType<FullOffer>[]> {
    const objectIds = offerIds.map((id) => new mongoose.Types.ObjectId(id));

    return await this.offerModel.aggregate([
      { $match: { _id: { $in: objectIds } } },
      ...this.aggregateArray,
    ]).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<FullOffer> | null> {
    return await this.offerModel.aggregate([
      { $match: { _id: new Types.ObjectId(offerId) } },
      ...this.aggregateArray
    ]).then((results) => results[0] || null);
  }

  public async updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();

    this.logger.info(`The offer was updateded: ${dto.title}`);

    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const res = await this.offerModel.findByIdAndDelete(offerId).exec();
    this.logger.info(`The offer with id ${offerId} ${res ? 'was deleted' : 'was not found'}`);
    return res;
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<FullOffer>[]> {
    return this.offerModel.aggregate([
      { $match: { city, premium: true } },
      ...this.aggregateArray,
    ]).limit(MAX_PREMIUM_NUMBER).exec();
  }
}
