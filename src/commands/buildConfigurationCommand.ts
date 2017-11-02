/**
 * Build Configuration Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { UniteBuildConfiguration } from "../configuration/models/unite/uniteBuildConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { BuildConfigurationOperation } from "../interfaces/buildConfigurationOperation";
import { IBuildConfigurationCommandParams } from "../interfaces/IBuildConfigurationCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";

export class BuildConfigurationCommand extends EngineCommandBase implements IEngineCommand<IBuildConfigurationCommandParams> {
    public async run(args: IBuildConfigurationCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
        }

        if (!ParameterValidation.checkOneOf<BuildConfigurationOperation>(this._logger, "operation", args.operation, ["add", "remove"])) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "configurationName", args.configurationName)) {
            return 1;
        }

        this._logger.info("");

        if (args.operation === "add") {
            return this.buildConfigurationAdd(args, uniteConfiguration);
        } else {
            return this.buildConfigurationRemove(args, uniteConfiguration);
        }
    }

    private async buildConfigurationAdd(args: IBuildConfigurationCommandParams,
                                        uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
        uniteConfiguration.buildConfigurations[args.configurationName] = uniteConfiguration.buildConfigurations[args.configurationName] || new UniteBuildConfiguration();

        uniteConfiguration.buildConfigurations[args.configurationName].bundle = args.bundle === undefined ? false : args.bundle;
        uniteConfiguration.buildConfigurations[args.configurationName].minify = args.minify === undefined ? false : args.minify;
        uniteConfiguration.buildConfigurations[args.configurationName].sourcemaps = args.sourcemaps === undefined ? true : args.sourcemaps;
        uniteConfiguration.buildConfigurations[args.configurationName].pwa = args.pwa === undefined ? false : args.pwa;

        this._pipeline.add("content", "buildConfiguration");
        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async buildConfigurationRemove(args: IBuildConfigurationCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.buildConfigurations[args.configurationName]) {
            this._logger.error("Build configuration has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
        delete uniteConfiguration.buildConfigurations[args.configurationName];

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }
}
