import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public isPro: boolean;

  @Expose()
  public image: string;

  @Expose()
  public favoriteOfferIds: string[];
}
