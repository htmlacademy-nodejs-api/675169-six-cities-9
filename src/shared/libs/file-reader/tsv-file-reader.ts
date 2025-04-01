import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { CityEnum, ComfortsEnum, HousingEnum } from '../../enums/index.js';
import { Coordinate, User } from '../../types/index.js';
import { NEWLINE, SEMICOLON, TAB_SPACE } from '../../constants/index.js';
import { createReadStream } from 'node:fs';
import { Offer } from '../../types/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      city,
      preview,
      images,
      premium,
      housingType,
      roomsNumber,
      guestsNumber,
      rentPrice,
      comforts,
      coordinate,
      author,
    ] = line.split(TAB_SPACE);

    return {
      title,
      description,
      city: city as CityEnum,
      preview: preview,
      images: this.parseStringToArray(images),
      premium: this.parseBoolean(premium),
      housingType: housingType as HousingEnum,
      roomsNumber: Number(roomsNumber),
      guestsNumber: Number(guestsNumber),
      rentPrice: Number(rentPrice),
      comforts: this.parseComforts(comforts),
      coordinates: this.parseCoordinates(coordinate),
      author: this.parseUser(author)
    };
  }

  private parseStringToArray(imagesString: string): string[] {
    return imagesString.split(SEMICOLON);
  }

  private parseBoolean(booleanSting: string): boolean {
    return booleanSting.toLowerCase() === 'true';
  }

  private parseComforts(comfortsString: string): ComfortsEnum[] {
    const items = comfortsString.split(SEMICOLON).map((item) => item.trim());

    return items as unknown as ComfortsEnum[];
  }

  private parseCoordinates(coordinatesString: string): Coordinate {
    const [latitude, longitude] = coordinatesString.split(SEMICOLON);
    return {latitude: Number(latitude), longitude: Number(longitude)};
  }

  private parseUser(userString: string): User {
    const [name, email, image, pro] = userString.split(SEMICOLON);

    return {
      name,
      email,
      image,
      isPro: this.parseBoolean(pro)
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      nextLinePosition = remainingData.indexOf(NEWLINE);

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });

        nextLinePosition = remainingData.indexOf(NEWLINE);
      }
    }

    this.emit('end', importedRowCount);
  }
}
