export interface UniqueProperty {
  emailExists(property: string): Promise<boolean>;
}
