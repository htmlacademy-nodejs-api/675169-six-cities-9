import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public readonly name = '--help';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.underline.blue('Программа для подготовки данных для REST API сервера.')}

        ${chalk.green('Пример:')}
        ${chalk.italic.blue('cli.js --<command> [--arguments]')}

        ${chalk.bold.blue('Команды:')}

          ${chalk.magenta('--version:')}                   ${chalk.white('# выводит номер версии')}
          ${chalk.magenta('--help:')}                      ${chalk.white('# печатает этот текст')}
          ${chalk.magenta('--import <path>:')}             ${chalk.white('# импортирует данные из TSV')}
          ${chalk.magenta('--generate <n> <path> <url>')}  ${chalk.white('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
