/**
 * Model of Stylint Configuration (.stylintrc) file.
 */

export type StylintConfigurationRule<T> = boolean | T | { expect?: T; error?: boolean };
