import { ComfortList} from '../../types/index.js';
import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { CityEnum } from '../../enums/city.enum.js';
import { HousingEnum } from '../../enums/index.js';
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, GUESTS_NUMBER_MAX, GUESTS_NUMBER_MIN, LATITUDE, LONGITUDE, RENT_PRICE_MAX, RENT_PRICE_MIN, ROOMS_NUMBER_MAX, ROOMS_NUMBER_MIN, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../constants/index.js';
import { UserEntity } from '../user/index.js';

class CoordinateEntity {
  @prop({ min: -LATITUDE, max: LATITUDE })
    latitude: number;

  @prop({ min: -LONGITUDE, max: LONGITUDE })
    longitude: number;
}


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

  @prop({required: true })
  public postDate: Date;

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

  @prop({ required: true, min: 1, max: 5})
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingEnum,
  })
  public housingType: HousingEnum;

  @prop({ required: true, min: ROOMS_NUMBER_MIN, max: ROOMS_NUMBER_MAX})
  public roomsNumber: number;

  @prop({ required: true, min: GUESTS_NUMBER_MIN, max: GUESTS_NUMBER_MAX})
  public guestsNumber: number;

  @prop({ required: true, min: RENT_PRICE_MIN, max: RENT_PRICE_MAX})
  public rentPrice: number;

  @prop({
    required: true,
    type: () => [String],
  })
  public comforts: ComfortList;

  @prop({
    // required: true,
    type: () => CoordinateEntity
  })
  public coordinate: CoordinateEntity;

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
