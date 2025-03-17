import { COMMENT_LENGTH_MAX, COMMENT_LENGTH_MIN, RATING_MAX, RATING_MIN } from '../../../constants/index.js';

export const CreateCommentValidationMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: `min length is ${COMMENT_LENGTH_MIN}, max is ${COMMENT_LENGTH_MAX}`,
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: `Minimum Rent Price is ${RATING_MIN}`,
    maxValue: `Maximum Rent Price is ${RATING_MAX}`,
  },
  offerId: {
    invalidId: 'userId field must be a valid id',
  },
  author: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
