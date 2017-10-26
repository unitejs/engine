/**
 * Platform Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineKey } from "../engine/pipelineKey";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPlatformCommandParams } from "../interfaces/IPlatformCommandParams";
import { PlatformOperation } from "../interfaces/platformOperation";

export class PlatformCommand extends EngineCommandBase implements IEngineCommand<IPlatformCommandParams> {
    public async run(args: IPlatformCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.platforms = uniteConfiguration.platforms || {};
        }

        if (!ParameterValidation.checkOneOf<PlatformOperation>(this._logger, "operation", args.operation, ["add", "remove"])) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("platform", args.platformName), "platformName")) {
            return 1;
        }

        this._logger.info("");

        if (args.operation === "add") {
            return this.platformAdd(args, uniteConfiguration);
        } else {
            return this.platformRemove(args, uniteConfiguration);
        }
    }

    private async platformAdd(args: IPlatformCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
        uniteConfiguration.platforms[args.platformName] = uniteConfiguration.platforms[args.platformName] || {};

        this._pipeline.add("platform", args.platformName);
        this._pipeline.add("content", "packageJson");
        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.warning(`Packages updated, you should probably run ${uniteConfiguration.packageManager.toLowerCase()} install before running any gulp commands.`);
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async platformRemove(args: IPlatformCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.platforms[args.platformName]) {
            this._logger.error("Platform has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
        delete uniteConfiguration.platforms[args.platformName];

        this._pipeline.add("platform", args.platformName);
        this._pipeline.add("content", "packageJson");
        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);
        if (ret === 0) {
            this._logger.warning(`Packages updated, you should probably run ${uniteConfiguration.packageManager.toLowerCase()} install to remove any unnecessary packages.`);
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }
}
