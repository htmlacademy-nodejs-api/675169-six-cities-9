import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component, OfferWithCommentsCountAndRating, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity, OfferService, CreateOfferDto } from './index.js';
import { MAX_ITEMS_PER_PAGE, MAX_PREMIUM_NUMBER } from '../../constants/index.js';

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

  public async find(itemsNumber: number): Promise<DocumentType<OfferWithCommentsCountAndRating>[]> {
    const limit = itemsNumber && MAX_ITEMS_PER_PAGE;

    return await this.offerModel.aggregate([
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
    ]).limit(limit).exec();
  }


  public async findById(offerId: string): Promise<DocumentType<OfferWithCommentsCountAndRating> | null> {
    return await this.offerModel.findById(offerId).aggregate([
      // add raiting and commentsCount
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
      // add isFavorite
      {
        $lookup: {
          from: 'users',
          let: { email: '$email', offerId: '$_id' },
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
                $in: ['$_id', { $ifNull: [{ $arrayElemAt: ['$user.favorites', 0] }, []] }]
              },
              then: true,
              else: false
            }
          }
        }
      },
      { $unset: 'user' }
    ]).exec();
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

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    //TODO: add isFavorite, commentCount and raiting
    return await this.offerModel.find({ city, premium: true }).sort({ createdAt: SortType.Down}).limit(MAX_PREMIUM_NUMBER).exec();
  }
}
