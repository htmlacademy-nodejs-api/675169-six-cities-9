import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  public offerId: string;

  @Expose()
  public author: string;
}
