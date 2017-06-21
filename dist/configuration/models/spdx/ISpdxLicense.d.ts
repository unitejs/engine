/**
 * Model of single spdx license file.
 */
export interface ISpdxLicense {
    name: string;
    url: string;
    osiApproved: boolean;
    licenseText: string;
}
