#!/usr/bin/env node

import { CLIApplication } from './cli/index.js';
import { Helper } from './helper.js';

async function bootstrap() {
  const cliApplication = new CLIApplication();

  const helper = new Helper('./src/cli/commands');
  const commands = await helper.readFiles();

  cliApplication.registerCommands([
    ...commands
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
