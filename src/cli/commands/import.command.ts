import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { Offer } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';

import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/index.js';

import { UserModel } from '../../shared/modules/user/index.js';
import { DefaultUserService, UserService } from '../../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { getMongoURI } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public readonly name = '--import';

  private salt: string;

  private logger: Logger = new ConsoleLogger();
  private offerService: OfferService = new DefaultOfferService(this.logger, OfferModel);
  private userService: UserService = new DefaultUserService(this.logger, UserModel, this.offerService);

  private databaseClient: DatabaseClient = new MongoDatabaseClient(this.logger);

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findByEmailOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({...offer, userId: user.id});
  }

  private onCompleteImport(count: number) {
    console.info(chalk.yellow(`${count} rows imported.`));
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }

}
