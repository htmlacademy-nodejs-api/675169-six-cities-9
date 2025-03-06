import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { FullOffer } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity, OfferService, CreateOfferDto } from './index.js';
import { MAX_ITEMS_PER_PAGE, MAX_PREMIUM_NUMBER } from '../../constants/index.js';
import { Component, SortType } from '../../enums/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
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
        let: { email: '$_email' },
        pipeline: [
          { $match: { $expr: { $eq: ['$email', '$$email'] } } },
          { $project: { _id: 1, favorites: 1 } }
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
                { $ifNull: [{ $arrayElemAt: ['$user.favorites', 0] }, []] }
              ]
            },
            then: true,
            else: false
          }
        }
      }
    },

    { $unset: 'user' },
    { $sort: { offerCount: SortType.Down } }
  ];

  public async find(limit = MAX_ITEMS_PER_PAGE): Promise<DocumentType<FullOffer>[]> {
    return await this.offerModel.aggregate(this.aggregateArray).limit(limit).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<FullOffer> | null> {
    return await this.offerModel.findById(offerId).aggregate(this.aggregateArray).exec();
  }

  public async updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();

    this.logger.info(`The offer was updateded: ${dto.title}`);

    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndDelete(offerId).exec();

    return result;
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<FullOffer>[]> {
    return this.offerModel.aggregate([
      { $match: { city, premium: true } },
      ...this.aggregateArray,
    ]).limit(MAX_PREMIUM_NUMBER).exec();
  }
}
