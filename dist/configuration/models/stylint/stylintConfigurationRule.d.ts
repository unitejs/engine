/**
 * Model of Stylint Configuration (.stylintrc) file.
 */
export declare type StylintConfigurationRule<T> = boolean | T | {
    expect?: T;
    error?: boolean;
};
