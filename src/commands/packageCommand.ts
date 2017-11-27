/**
 * Package Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineKey } from "../engine/pipelineKey";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPackageCommandParams } from "../interfaces/IPackageCommandParams";

export class PackageCommand extends EngineCommandBase implements IEngineCommand<IPackageCommandParams> {
    public async run(args: IPackageCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        }

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }

        return this.packageAdd(args, uniteConfiguration);
    }

    private async packageAdd(args: IPackageCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
            return 1;
        }

        this._logger.info("");

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);

        const rootPackageFolder = this._fileSystem.pathCombine(engineVariables.engineRootFolder, "node_modules/unitejs-packages/assets/");

        const packageFolder = this._fileSystem.pathCombine(rootPackageFolder, args.packageName);

        const packageDirExists = await this._fileSystem.directoryExists(packageFolder);

        let ret = 0;
        if (packageDirExists) {
            this.displayCompletionMessage(engineVariables, true);
        } else {
            ret = 1;
            this._logger.error(`Package folder '${packageFolder}' does not exist`);
        }

        return ret;
    }
}
