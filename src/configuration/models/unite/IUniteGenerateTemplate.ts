/**
 * Model of Unite Generate template.
 */
export interface IUniteGenerateTemplate {
    defaultFolder?: string;
    isShared?: boolean;
    sourceFiles?: string[];
    viewFiles?: string[];
    styleFiles?: string[];
    unitTestFiles?: string[];
    e2eTestFiles?: string[];
}
