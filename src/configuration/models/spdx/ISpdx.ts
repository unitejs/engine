/**
 * Model of spdx.json file.
 */
import { ISpdxLicense } from "./ISpdxLicense";

export interface ISpdx {
    [id: string]: ISpdxLicense;
}
