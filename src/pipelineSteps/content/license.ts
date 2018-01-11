/**
 * Pipeline step to generate LICENSE.
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ISpdx } from "../../configuration/models/spdx/ISpdx";
import { ISpdxLicense } from "../../configuration/models/spdx/ISpdxLicense";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class License extends PipelineStepBase {
    private static readonly FILENAME: string = "LICENSE";
    private static readonly FILENAME_SPDX: string = "spdx-full.json";

    private _spdxLicense: ISpdxLicense;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return !super.condition(uniteConfiguration.license, "None");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            try {
                const licenseData = await fileSystem.fileReadJson<ISpdx>(engineVariables.engineAssetsFolder, License.FILENAME_SPDX);
                if (!ParameterValidation.checkOneOf<string>(logger,
                                                            "license",
                                                            uniteConfiguration.license,
                                                            Object.keys(licenseData),
                                                            "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                    return 1;
                } else {
                    this._spdxLicense = licenseData[uniteConfiguration.license];
                }
            } catch (e) {
                logger.error(`There was a problem reading the ${License.FILENAME_SPDX} file`, e);
                return 1;
            }
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleText(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    License.FILENAME,
                                    true,
                                    mainCondition,
                                    async() => {
            const yearString = new Date().getFullYear()
                                         .toString();
            return this._spdxLicense.licenseText.replace(/<year>/gi, yearString);
        });
    }
}
