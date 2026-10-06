import { EnquiryStorageUnavailableError, type EnquiryRepository } from '../repository';

/** Used when no DATABASE_URL exists. Every insert fails loudly; nothing pretends to succeed. */
export function createUnconfiguredRepository(): EnquiryRepository {
  return {
    name: 'unconfigured',
    isTestAdapter: false,
    async insert() {
      throw new EnquiryStorageUnavailableError(
        'DATABASE_URL is not set. Set it (Neon) or, for local development only, HUSKY_ENQUIRY_STORE=memory.',
      );
    },
    async markNotified() {
      /* nothing was stored */
    },
    async findByReferenceAndEmail() {
      throw new EnquiryStorageUnavailableError();
    },
  };
}
