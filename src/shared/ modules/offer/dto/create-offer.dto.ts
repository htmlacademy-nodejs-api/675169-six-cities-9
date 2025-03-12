import { CityEnum, ComfortsEnum, HousingEnum } from '../../../enums/index.js';
import { ComfortList } from '../../../types/index.js';
import { IsArray, IsBoolean, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, IsString, Matches, ArrayMinSize, ArrayMaxSize, IsNumber, IsLatitude, IsLongitude } from 'class-validator';
import { CreateOfferValidationMessage } from '../index.js';
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, IMAGES_LENGTH, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../../constants/index.js';


export class CreateOfferDto {
  @IsString()
  @MinLength(TITLE_MIN_LENGTH, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(TITLE_MAX_LENGTH, { message: CreateOfferValidationMessage.title.maxLength })
    title: string;

  @IsString()
  @MinLength(DESCRIPTION_MIN_LENGTH, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(DESCRIPTION_MAX_LENGTH, { message: CreateOfferValidationMessage.description.maxLength })
    description: string;

  @IsEnum(CityEnum, { message: CreateOfferValidationMessage.city.invalid })
    city: CityEnum;

  @IsString()
  @Matches(/\.(png|jpg|jpeg|gif|webp)$/, { message: CreateOfferValidationMessage.preview.invalid,})
    preview: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMinSize(IMAGES_LENGTH, { message: CreateOfferValidationMessage.images.invalidLength })
  @ArrayMaxSize(IMAGES_LENGTH, { message: CreateOfferValidationMessage.images.invalidLength })
  @Matches(/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|webp)$/, {
    each: true,
    message: CreateOfferValidationMessage.images.invalid,
  })
    images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.premium.invalid })
    premium: boolean;

  @IsEnum(HousingEnum, { message: CreateOfferValidationMessage.city.invalid })
    housingType: HousingEnum;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
    roomsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsNumber.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.guestsNumber.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.guestsNumber.maxValue })
    guestsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.rentPrice.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.rentPrice.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.rentPrice.maxValue })
    rentPrice: number;

  // TODO: валидация на уникальность
  @IsArray({ message: CreateOfferValidationMessage.comforts.invalidFormat})
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.comforts.invalidLength })
  @ArrayMaxSize(Object.keys(ComfortsEnum).length, { message: CreateOfferValidationMessage.comforts.invalidLength })
  @IsEnum(ComfortsEnum, { each: true, message: CreateOfferValidationMessage.comforts.invalidItemFormat })
    comforts: ComfortList;

  @IsArray({ message: CreateOfferValidationMessage.coordinates.invalidFormat })
  @ArrayMinSize(2, { message: CreateOfferValidationMessage.coordinates.invalidLength })
  @ArrayMaxSize(2, { message: CreateOfferValidationMessage.coordinates.invalidLength })
  @IsNumber({}, { each: true, message: CreateOfferValidationMessage.coordinates.invalidItemFormat })
  @IsLatitude({ message: CreateOfferValidationMessage.coordinates.invalidLatitude })
  @IsLongitude({ message: CreateOfferValidationMessage.coordinates.invalidLongitude })
    coordinates: [number, number];

  @IsMongoId({ message: CreateOfferValidationMessage.userId.invalidId })
    userId: string;
}
