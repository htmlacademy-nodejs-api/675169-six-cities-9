import { Comment } from '../../types/index.js';
import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { ratingValidation } from '../../constants/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  @prop({ required: true, default: '' })
  public text: string;

  @prop({ required: true, ...ratingValidation })
  public rating: number;

  @prop({
    required: true,
    ref: UserEntity
  })
  public author: Ref<UserEntity>;

  @prop({
    required: true,
    ref: OfferEntity
  })
  public offerId: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
