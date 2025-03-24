import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { CityEnum } from '../../enums/city.enum.js';
import { ComfortsEnum, HousingEnum } from '../../enums/index.js';
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, guestsNumberValidation, rentPriceValidation, roomsNumberValidation, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../constants/index.js';
import { UserEntity } from '../user/user.entity.js';
import { Coordinate } from '../../types/coordinate.type.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: TITLE_MIN_LENGTH, maxlength: TITLE_MAX_LENGTH })
  public title: string;

  @prop({ required: true, minlength: DESCRIPTION_MIN_LENGTH, maxlength: DESCRIPTION_MAX_LENGTH })
  public description: string;

  @prop({
    required: true,
    type: () => String,
    enum: CityEnum,
  })
  public city: CityEnum;

  @prop({
    required: true,
    type: () => String
  })
  public preview: string;

  @prop({
    required: true,
    type: () => [String],
  })
  public images: string[];

  @prop({ required: true, default: false })
  public premium: boolean;

  @prop({
    required: true,
    type: () => String,
    enum: HousingEnum,
  })
  public housingType: HousingEnum;

  @prop({ required: true, ...roomsNumberValidation })
  public roomsNumber: number;

  @prop({ required: true, ...guestsNumberValidation })
  public guestsNumber: number;

  @prop({ required: true, ...rentPriceValidation})
  public rentPrice: number;

  @prop({
    required: true,
    type: () => [String],
  })
  public comforts: ComfortsEnum[];

  @prop({ required: true })
  public coordinates: Coordinate;

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
