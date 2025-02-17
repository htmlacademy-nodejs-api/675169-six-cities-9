
import { readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { Command } from '../cli/commands/command.interface.js';

export class CommandsRegisterHelper {
  constructor(
    private readonly directory: string
  ) {}

  public async readFiles(): Promise<Command[]> {
    try {
      const files = await readdir(this.directory);
      const commands = [];

      const supportedExtensions = ['.ts', '.js'];

      for (const file of files) {

        if ((supportedExtensions.includes(extname(file))) && !file.split('.').includes('interface')) {
          const modulePath = resolve(this.directory, file);

          // eslint-disable-next-line no-restricted-syntax, node/no-unsupported-features/es-syntax
          const importedModule = await import(modulePath);

          const CommandClass = Object.values(importedModule)[0] as { new (): Command };

          if (typeof CommandClass === 'function') {
            commands.push(new CommandClass());
          }
        }
      }

      return commands;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`error: ${error.message}`);
      return [];
    }
  }
}

