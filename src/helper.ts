
import { readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Command } from './cli/commands/command.interface.js';

export class Helper {
  constructor(
    private readonly directory: string
  ) {}

  public async readFiles(): Promise<Command[]> {
    try {
      const files = await readdir(this.directory);
      const commands = [];

      for (const file of files) {

        if ((extname(file) === '.js' || extname(file) === '.ts') && !file.split('.').includes('interface')) {
          const modulePath = resolve(this.directory, file);
          const moduleUrl = pathToFileURL(modulePath).href;

          // eslint-disable-next-line no-restricted-syntax, node/no-unsupported-features/es-syntax
          const importedModule = await import(moduleUrl);

          console.log(importedModule);
          const CommandClass = Object.values(importedModule)[0] as { new (): Command };

          if (typeof CommandClass === 'function') {
            commands.push(new CommandClass());
          }
        }
      }

      return commands;
    } catch (error) {
      console.error('error');
      return [];
    }
  }
}

