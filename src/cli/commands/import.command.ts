import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { Offer } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';


export class ImportCommand implements Command {
  public readonly name = '--import';

  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(chalk.yellow(`${count} rows imported.`));
  }

  public execute(...parameters: string[]) {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }

}
