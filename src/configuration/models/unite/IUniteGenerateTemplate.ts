/**
 * Model of Unite Generate template.
 */
export interface IUniteGenerateTemplate {
    defaultFolder?: string;
    isShared?: boolean;
    additionalExtension?: string;
    sourceFiles?: string[];
    viewFiles?: string[];
    styleFiles?: string[];
    unitTestFiles?: string[];
    e2eTestFiles?: string[];
}
