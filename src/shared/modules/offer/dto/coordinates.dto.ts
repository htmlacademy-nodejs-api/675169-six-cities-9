import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinatesDto {
  @IsLatitude({ message: 'wrong latitude' })
    latitude: number;

  @IsLongitude({ message: 'wrong longitude' })
    longitude: number;
}
