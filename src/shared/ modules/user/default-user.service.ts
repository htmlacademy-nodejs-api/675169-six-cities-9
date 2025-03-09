import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateUserDto, UserService, UserEntity } from './index.js';
import { Component } from '../../enums/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FullOffer } from '../../types/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({email}).exec();
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findById(userId).exec();
  }

  public async find(): Promise<DocumentType<UserEntity>[]> {
    return await this.userModel.find().exec();
  }

  public async findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async addToOrRemoveFromFavoritesById(userId: string, offerId: string, isAdding: boolean = true): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      isAdding ? { $addToSet: { favoriteOfferIds: offerId } } : { $pull: { favoriteOfferIds: offerId } },
      { new: true }
    ).exec();
  }

  // TODO: сложно. скорее всего не работает можено ли легче сделать
  public async getAllFavorites(userId: string): Promise<DocumentType<FullOffer>[]> {
    return await this.userModel.aggregate([{ $match: { _id: userId } },
      {
        $addFields: {
          favoriteOfferIds: {
            $map: {
              input: '$favoriteOfferIds',
              as: 'id',
              in: { $toObjectId: '$$id' } // Преобразуем строки в ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: 'offers',
          localField: 'favoriteOfferIds',
          foreignField: '_id',
          as: 'favoriteOffers'
        }
      },
      {
        $addFields: {
          favoriteOffers: {
            $map: {
              input: '$favoriteOffers',
              as: 'offer',
              in: {
                $mergeObjects: [
                  '$$offer',
                  { isFav: true }
                ]
              }
            }
          }
        }
      },
      { $unwind: '$favoriteOffers' },
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$favoriteOffers._id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$offerId', '$offerId'] } } },
            { $project: { _id: 1, rating: 1 } }
          ],
          as: 'comments'
        }
      },
      {
        $addFields: {
          'favoriteOffers.commentsNumber': { $size: '$comments' },
          'favoriteOffers.rating': { $avg: '$comments.rating' }
        }
      },
      { $unset: 'comments' },
      {
        $group: {
          _id: '$_id',
          favoriteOffers: { $push: '$favoriteOffers' }
        }
      },
      { $project: { favoriteOffers: 1, _id: 0 } }
    ]).exec();

  }
}
