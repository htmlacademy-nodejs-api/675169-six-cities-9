#!/usr/bin/env node
import 'reflect-metadata';

import { CLIApplication } from './cli/index.js';
import { CommandsRegisterHelper } from './shared/commands-register-helper.js';

async function bootstrap() {
  const cliApplication = new CLIApplication();

  const helper = new CommandsRegisterHelper('./src/cli/commands');
  const commands = await helper.readFiles();

  cliApplication.registerCommands([
    ...commands
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
