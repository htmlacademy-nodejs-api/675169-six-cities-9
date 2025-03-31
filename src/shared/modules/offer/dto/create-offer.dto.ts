import { CityEnum, ComfortsEnum, HousingEnum } from '../../../enums/index.js';
import { IsArray, IsBoolean, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsString, Matches, ArrayMinSize, ArrayMaxSize, ValidateNested } from 'class-validator';
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, GUESTS_NUMBER_MAX, GUESTS_NUMBER_MIN, IMAGES_LENGTH, RENT_PRICE_MAX, RENT_PRICE_MIN, ROOMS_NUMBER_MAX, ROOMS_NUMBER_MIN, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../../constants/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { Coordinate } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { CoordinatesDto } from '../index.js';

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

  @IsEnum(HousingEnum, { message: CreateOfferValidationMessage.housingType.invalid })
    housingType: HousingEnum;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(ROOMS_NUMBER_MIN, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(ROOMS_NUMBER_MAX, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
    roomsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsNumber.invalidFormat })
  @Min(GUESTS_NUMBER_MIN, { message: CreateOfferValidationMessage.guestsNumber.minValue })
  @Max(GUESTS_NUMBER_MAX, { message: CreateOfferValidationMessage.guestsNumber.maxValue })
    guestsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.rentPrice.invalidFormat })
  @Min(RENT_PRICE_MIN, { message: CreateOfferValidationMessage.rentPrice.minValue })
  @Max(RENT_PRICE_MAX, { message: CreateOfferValidationMessage.rentPrice.maxValue })
    rentPrice: number;

  @IsArray({ message: CreateOfferValidationMessage.comforts.invalidFormat})
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.comforts.invalidLength })
  @ArrayMaxSize(Object.keys(ComfortsEnum).length, { message: CreateOfferValidationMessage.comforts.invalidLength })
  @IsEnum(ComfortsEnum, { each: true, message: CreateOfferValidationMessage.comforts.invalidItemFormat })
    comforts: ComfortsEnum[];

  @ValidateNested({ message: CreateOfferValidationMessage.coordinates.invalidItemFormat})
  @Type(() => CoordinatesDto)
    coordinates: Coordinate;

  userId: string;
}
