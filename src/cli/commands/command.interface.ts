export interface Command {
  name: string;
  execute(...parameters: string[]): void;
}
