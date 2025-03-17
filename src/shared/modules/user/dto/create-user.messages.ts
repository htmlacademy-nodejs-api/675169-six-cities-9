import { PASSWORD_MAX_NUMBER, PASSWORD_MIN_NUMBER, USER_NAME_MAX, USER_NAME_MIN } from '../../../constants/index.js';

export const CreateUserMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: `min length is ${USER_NAME_MIN}, max is ${USER_NAME_MAX}`,
  },
  email: {
    invalidFormat: 'email must be a valid address'
  },
  isPro: {
    invalid: 'isPro must be boolean'
  },
  image: {
    invalidFormat: 'image must be a string',
    invalidFormatExtended: 'image must be in format .jpg или .png',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: `min length for password is ${PASSWORD_MIN_NUMBER}, max is ${PASSWORD_MAX_NUMBER}`
  },
} as const;
