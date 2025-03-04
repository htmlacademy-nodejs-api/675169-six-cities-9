import { Comment } from '../../types/index.js';
import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { ratingValidation } from '../../constants/index.js';

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

  @prop({ required: true, default: 1, ...ratingValidation })
  public rating: number;

  @prop({
    required: true,
    ref: UserEntity
  })
  public author: Ref<UserEntity>;

  constructor(commentData: Comment) {
    super();

    this.text = commentData.text;
    this.rating = commentData.rating;
  }
}

export const CommentModel = getModelForClass(CommentEntity);
