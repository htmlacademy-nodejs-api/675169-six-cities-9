import { IsInt, IsString, Length, Max, Min } from 'class-validator';
import { COMMENT_LENGTH_MAX, COMMENT_LENGTH_MIN, RATING_MAX, RATING_MIN } from '../../../constants/index.js';
import { CreateCommentValidationMessages } from './create-comment.messages.js';


export class CreateCommentDto {
  @IsString({ message: CreateCommentValidationMessages.text.invalidFormat })
  @Length(COMMENT_LENGTH_MIN, COMMENT_LENGTH_MAX, { message: CreateCommentValidationMessages.text.lengthField })
    text: string;

  @IsInt({ message: CreateCommentValidationMessages.rating.invalidFormat })
  @Min(RATING_MIN, { message: CreateCommentValidationMessages.rating.minValue })
  @Max(RATING_MAX, { message: CreateCommentValidationMessages.rating.maxValue })
    rating: number;

  author: string;

  offerId: string;
}
