export interface DocumentExists {
  exists(documentId: string): Promise<boolean>;
}

export interface IsAuthor {
  isOfferAuthor(userId: string, offerId: string): Promise<boolean>;
}
