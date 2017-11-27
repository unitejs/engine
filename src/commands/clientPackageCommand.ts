/**
 * Client Package Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { ScriptIncludeMode } from "../configuration/models/unite/scriptIncludeMode";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteClientPackageTranspile } from "../configuration/models/unite/uniteClientPackageTranspile";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineKey } from "../engine/pipelineKey";
import { ClientPackageOperation } from "../interfaces/clientPackageOperation";
import { IClientPackageCommandParams } from "../interfaces/IClientPackageCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";

export class ClientPackageCommand extends EngineCommandBase implements IEngineCommand<IClientPackageCommandParams> {
    public async run(args: IClientPackageCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.packageManager = args.packageManager || uniteConfiguration.packageManager;
        }

        if (!ParameterValidation.checkOneOf<ClientPackageOperation>(this._logger, "operation", args.operation, ["add", "remove"])) {
            return 1;
        }

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }

        if (args.operation === "add") {
            return this.clientPackageAdd(args, uniteConfiguration);
        } else {
            return this.clientPackageRemove(args, uniteConfiguration);
        }
    }

    private async clientPackageAdd(args: IClientPackageCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        let clientPackage = await this.loadProfile<UniteClientPackage>("unitejs-packages", "assets", "clientPackage.json", args.profile);
        if (clientPackage === null) {
            return 1;
        }
        if (clientPackage === undefined) {
            clientPackage = new UniteClientPackage();
        }

        clientPackage.name = args.packageName || clientPackage.name;
        clientPackage.version = args.version || clientPackage.version;
        clientPackage.preload = args.preload || clientPackage.preload;
        clientPackage.includeMode = args.includeMode || clientPackage.includeMode;
        clientPackage.scriptIncludeMode = args.scriptIncludeMode || clientPackage.scriptIncludeMode;
        clientPackage.main = args.main || clientPackage.main;
        clientPackage.mainMinified = args.mainMinified || clientPackage.mainMinified;
        clientPackage.mainLib = args.mainLib || clientPackage.mainLib;
        clientPackage.isPackage = args.isPackage || clientPackage.isPackage;
        clientPackage.noScript = args.noScript || clientPackage.noScript;
        clientPackage.assets = args.assets || clientPackage.assets;
        if (args.transpileAlias || (clientPackage.transpile && clientPackage.transpile.alias)) {
            if (!clientPackage.transpile) {
                clientPackage.transpile = new UniteClientPackageTranspile();
            }
            clientPackage.transpile.alias = args.transpileAlias || clientPackage.transpile.alias;
            clientPackage.transpile.language = args.transpileLanguage || clientPackage.transpile.language;
            clientPackage.transpile.sources = args.transpileSources || clientPackage.transpile.sources;
            clientPackage.transpile.modules = args.transpileModules || clientPackage.transpile.modules;
            clientPackage.transpile.stripExt = args.transpileStripExt || clientPackage.transpile.stripExt;
        }

        try {
            clientPackage.testingAdditions = this.mapParser(args.testingAdditions) || clientPackage.testingAdditions;
            clientPackage.map = this.mapParser(args.map) || clientPackage.map;
            clientPackage.loaders = this.mapParser(args.loaders) || clientPackage.loaders;
            if (clientPackage.transpile) {
                clientPackage.transpile.transforms = this.mapFromArrayParser(args.transpileTransforms) || clientPackage.transpile.transforms;
            }
        } catch (err) {
            this._logger.error("Input failure", err);
            return 1;
        }

        clientPackage.includeMode = clientPackage.includeMode === undefined ||
            clientPackage.includeMode === null ||
            clientPackage.includeMode.length === 0 ?
            "both" : clientPackage.includeMode;

        clientPackage.scriptIncludeMode = clientPackage.scriptIncludeMode === undefined ||
            clientPackage.scriptIncludeMode === null ||
            clientPackage.scriptIncludeMode.length === 0 ?
            "none" : clientPackage.scriptIncludeMode;

        clientPackage.preload = clientPackage.preload === undefined ? false : clientPackage.preload;
        clientPackage.isPackage = clientPackage.isPackage === undefined ? false : clientPackage.isPackage;

        if (!ParameterValidation.notEmpty(this._logger, "packageName", clientPackage.name)) {
            return 1;
        }

        if (args.profile) {
            this._logger.info("profile", { profile: args.profile });
        }

        if (clientPackage.version) {
            this._logger.info("version", { version: clientPackage.version });
        }

        this._logger.info("preload", { preload: clientPackage.preload });

        if (!ParameterValidation.checkOneOf<IncludeMode>(this._logger, "includeMode", clientPackage.includeMode, ["app", "test", "both"])) {
            return 1;
        }

        if (!ParameterValidation.checkOneOf<ScriptIncludeMode>(this._logger, "scriptIncludeMode", clientPackage.scriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
            return 1;
        }

        if (clientPackage.main) {
            if (clientPackage.noScript) {
                this._logger.error("You cannot combine the main and noScript arguments");
                return 1;
            } else {
                this._logger.info("main", { main: clientPackage.main });
            }
        }

        if (clientPackage.mainMinified) {
            if (clientPackage.noScript) {
                this._logger.error("You cannot combine the mainMinified and noScript arguments");
                return 1;
            } else {
                this._logger.info("mainMinified", { mainMinified: clientPackage.mainMinified });
            }
        }

        if (clientPackage.mainLib) {
            this._logger.info("mainLib", { mainLib: clientPackage.mainLib });
        }
        if (clientPackage.testingAdditions) {
            this._logger.info("testingAdditions", { testingAdditions: clientPackage.testingAdditions });
        }
        this._logger.info("isPackage", { isPackage: clientPackage.isPackage  });
        if (clientPackage.assets) {
            this._logger.info("assets", { assets: clientPackage.assets });
        }
        if (clientPackage.map) {
            this._logger.info("map", { map: clientPackage.map });
        }
        if (clientPackage.loaders) {
            this._logger.info("loaders", { loaders: clientPackage.loaders });
        }
        if (clientPackage.noScript) {
            this._logger.info("noScript", { noScript: clientPackage.noScript });
        }
        if (clientPackage.transpile) {
            if (clientPackage.transpile.alias) {
                this._logger.info("transpileAlias", { transpileAlias: clientPackage.transpile.alias });
            }
            if (clientPackage.transpile.language) {
                this._logger.info("transpileLanguage", { transpileLanguage: clientPackage.transpile.language });
            }
            if (clientPackage.transpile.sources) {
                this._logger.info("transpileSources", { transpileSrc: clientPackage.transpile.sources });
            }
            if (clientPackage.transpile.modules) {
                this._logger.info("transpileModules", { transpileSrc: clientPackage.transpile.modules });
            }
            if (clientPackage.transpile.stripExt !== undefined) {
                this._logger.info("transpileStripExt", { transpileStripExt: clientPackage.transpile.stripExt });
            }
            if (clientPackage.transpile.transforms) {
                this._logger.info("transpileTransforms", { transpileSrc: clientPackage.transpile.transforms });
            }
        }

        this._logger.info("");

        if (uniteConfiguration.clientPackages[clientPackage.name]) {
            this._logger.error("Package has already been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);

        const missingVersion = clientPackage.version === null || clientPackage.version === undefined || clientPackage.version.length === 0;
        const missingMain = (clientPackage.main === null || clientPackage.main === undefined || clientPackage.main.length === 0) && !clientPackage.noScript;
        if (missingVersion || missingMain) {
            try {
                const packageInfo = await engineVariables.packageManager.info(this._logger, this._fileSystem, clientPackage.name, clientPackage.version);

                clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                if (!clientPackage.noScript) {
                    clientPackage.main = clientPackage.main || packageInfo.main;
                }
            } catch (err) {
                this._logger.error("Reading Package Information failed", err);
                return 1;
            }
        }

        if (!clientPackage.noScript) {
            if (clientPackage.main) {
                clientPackage.main = clientPackage.main.replace(/\\/g, "/");
                clientPackage.main = clientPackage.main.replace(/^\.\//, "/");
            }
            if (clientPackage.mainMinified) {
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/\\/g, "/");
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/^\.\//, "/");
            }
        }

        uniteConfiguration.clientPackages[clientPackage.name] = clientPackage;

        try {
            await engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, clientPackage.name, clientPackage.version, false);
        } catch (err) {
            this._logger.error("Adding Package failed", err);
            return 1;
        }

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this.displayCompletionMessage(engineVariables, false);
        }

        return ret;
    }

    private async clientPackageRemove(args: IClientPackageCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
            return 1;
        }

        if (!uniteConfiguration.clientPackages[args.packageName]) {
            this._logger.error("Package has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
        await engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, args.packageName, false);

        delete uniteConfiguration.clientPackages[args.packageName];

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this.displayCompletionMessage(engineVariables, false);
        }

        return ret;
    }
}
