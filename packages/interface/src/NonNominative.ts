import { Nominative } from '@jamashita/publikum-interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NonNominative extends Nominative<NonNominative> {
}
