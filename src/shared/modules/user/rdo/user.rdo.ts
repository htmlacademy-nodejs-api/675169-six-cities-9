import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public id: string ;

  @Expose()
  public email: string ;

  @Expose()
  public image: string;

  @Expose()
  public name: string;

  @Expose()
  public isPro: boolean;

  @Expose()
  public favoriteOfferIds: string[];
}
