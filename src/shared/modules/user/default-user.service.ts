import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateUserDto, UserService, UserEntity, DEFAULT_AVATAR_FILE_NAME, UpdateUserDto } from './index.js';
import { Component } from '../../enums/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FullOffer } from '../../types/index.js';
import { OfferService } from '../offer/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async exists(userId: string): Promise<boolean> {
    const user = this.userModel.exists({_id: userId});
    return Boolean(user);
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return Boolean(user);
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, image: DEFAULT_AVATAR_FILE_NAME });
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

  public async addOrRemoveFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findById(userId);

    const hasNoOfferId = !user?.favoriteOfferIds?.includes(offerId);

    const operator = hasNoOfferId ? '$addToSet' : '$pull';

    this.logger.info(`User with id ${userId} ${hasNoOfferId ? 'added' : 'removed'} offer with id ${offerId} from favorites`);
    return await this.userModel.findByIdAndUpdate(
      userId,
      {[operator]: { favoriteOfferIds: offerId } },
      { new: true }
    ).exec();
  }

  public async getAllFavorites(userId: string): Promise<DocumentType<FullOffer>[]> {
    const user = await this.userModel.findById(userId).exec();

    return user && user.favoriteOfferIds ? await this.offerService.findAllByIds(userId, user.favoriteOfferIds) : [];
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }
}
