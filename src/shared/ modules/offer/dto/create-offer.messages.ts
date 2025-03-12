import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, GUESTS_NUMBER_MAX, GUESTS_NUMBER_MIN, IMAGES_LENGTH, RENT_PRICE_MAX, RENT_PRICE_MIN, ROOMS_NUMBER_MAX, ROOMS_NUMBER_MIN, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../../constants/index.js';
import { ComfortsEnum } from '../../../enums/index.js';

export const CreateOfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${TITLE_MIN_LENGTH}`,
    maxLength: `Maximum title length must be ${TITLE_MAX_LENGTH}`,
  },
  description: {
    minLength: `Minimum description length must be ${DESCRIPTION_MIN_LENGTH}`,
    maxLength: `Maximum description length must be ${DESCRIPTION_MAX_LENGTH}`,
  },
  roomsNumber: {
    invalidFormat: 'Rooms Number must be an integer',
    minValue: `Minimum Rooms Number is ${ROOMS_NUMBER_MIN}`,
    maxValue: `Maximum Rooms Number is ${ROOMS_NUMBER_MAX}`,
  },
  guestsNumber: {
    invalidFormat: 'Guests Number must be an integer',
    minValue: `Minimum Guests Number is ${GUESTS_NUMBER_MIN}`,
    maxValue: `Maximum Guests Number is ${GUESTS_NUMBER_MAX}`,
  },
  rentPrice: {
    invalidFormat: 'Rent Price must be an integer',
    minValue: `Minimum Rent Price is ${RENT_PRICE_MIN}`,
    maxValue: `Maximum Rent Price is ${RENT_PRICE_MAX}`,
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  city: {
    invalid: 'City must be one from this list: Paris, Cologne, Brussels, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  premium: {
    invalid: 'Premium must be boolean'
  },
  housingType: {
    invalid: 'Housing Type must be one from this list: Apartment, House, Room, Hotel'
  },
  preview: {
    invalid: 'Preview must ended to one to: .png, .jpg, .jpeg, .gif, .webp'
  },
  images: {
    invalidFormat: 'Images must me array of type string',
    invalidLength: `Images must have ${IMAGES_LENGTH}`,
    invalid: 'Preview must ended to one to: .png, .jpg, .jpeg, .gif, .webp'
  },
  comforts: {
    invalidFormat: 'Comforts must me array of type ComfortsEnum',
    invalidLength: `Comforts must have from 1 to ${Object.keys(ComfortsEnum).length} elements`,
    invalidItemFormat:  'Comforts item must be one from this list: Breakfast, Air Conditioning, Laptop Friendly Workspace, Baby Seat, Washer, Towels, Fridge'
  },
  coordinates: {
    invalidFormat: 'Coordinates must me array of type ComfortsEnum',
    invalidLength: 'Coordinates msut always have length 2',
    invalidItemFormat: 'Each coordinate must be a number',
    invalidLatitude: 'Latitude must be from -90 to 90',
    invalidLongitude: 'Longitude must be from -180 to 180'
  }
} as const;

