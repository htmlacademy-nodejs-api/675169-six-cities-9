import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateUserDto, UserService, UserEntity } from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

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

  public async findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: offerId } },
      { new: true }
    ).exec();
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: offerId } },
      { new: true }
    ).exec();
  }

  // TODO: add return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAllFavorites(userId: string): Promise<DocumentType<any> | null> {
    return await this.userModel.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'offers',
          localField: 'favorites',
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
      }
    ]).exec();
  }
}
