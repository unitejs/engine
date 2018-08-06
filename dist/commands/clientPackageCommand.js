"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Client Package Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
const uniteClientPackageTranspile_1 = require("../configuration/models/unite/uniteClientPackageTranspile");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
const pipelineKey_1 = require("../engine/pipelineKey");
class ClientPackageCommand extends engineCommandBase_1.EngineCommandBase {
    static retrievePackageDetails(logger, fileSystem, engineVariables, clientPackage) {
        return __awaiter(this, void 0, void 0, function* () {
            const missingVersion = clientPackage.version === null || clientPackage.version === undefined || clientPackage.version.length === 0;
            const missingMain = (clientPackage.main === null || clientPackage.main === undefined || clientPackage.main.length === 0) && !clientPackage.noScript;
            if (missingVersion || missingMain) {
                try {
                    const packageInfo = yield engineVariables.packageManager.info(logger, fileSystem, clientPackage.name, clientPackage.version);
                    clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                    if (!clientPackage.noScript) {
                        clientPackage.main = clientPackage.main || packageInfo.main;
                    }
                }
                catch (err) {
                    logger.error("Reading Package Information failed", err);
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
            return 0;
        });
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, undefined, undefined, false);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
                uniteConfiguration.packageManager = args.packageManager || uniteConfiguration.packageManager;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "operation", args.operation, ["add", "remove"])) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            if (args.operation === "add") {
                return this.clientPackageAdd(args, uniteConfiguration);
            }
            else {
                return this.clientPackageRemove(args, uniteConfiguration);
            }
        });
    }
    clientPackageAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let clientPackage = yield this.loadProfile("unitejs-packages", "assets", "clientPackage.json", args.profile);
            if (clientPackage === null) {
                return 1;
            }
            if (clientPackage === undefined) {
                clientPackage = new uniteClientPackage_1.UniteClientPackage();
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
                    clientPackage.transpile = new uniteClientPackageTranspile_1.UniteClientPackageTranspile();
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
            }
            catch (err) {
                this._logger.error("Input failure", err);
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", clientPackage.name)) {
                return 1;
            }
            if (args.profile) {
                this._logger.info("profile", { profile: args.profile });
            }
            if (clientPackage.version) {
                this._logger.info("version", { version: clientPackage.version });
            }
            if (clientPackage.preload !== undefined) {
                this._logger.info("preload", { preload: clientPackage.preload });
            }
            if (clientPackage.includeMode) {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "includeMode", clientPackage.includeMode, ["app", "test", "both"])) {
                    return 1;
                }
            }
            if (clientPackage.scriptIncludeMode) {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "scriptIncludeMode", clientPackage.scriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
                    return 1;
                }
            }
            if (clientPackage.main) {
                if (clientPackage.noScript) {
                    this._logger.error("You cannot combine the main and noScript arguments");
                    return 1;
                }
                else {
                    this._logger.info("main", { main: clientPackage.main });
                }
            }
            if (clientPackage.mainMinified) {
                if (clientPackage.noScript) {
                    this._logger.error("You cannot combine the mainMinified and noScript arguments");
                    return 1;
                }
                else {
                    this._logger.info("mainMinified", { mainMinified: clientPackage.mainMinified });
                }
            }
            if (clientPackage.mainLib) {
                this._logger.info("mainLib", { mainLib: clientPackage.mainLib });
            }
            if (clientPackage.testingAdditions) {
                this._logger.info("testingAdditions", { testingAdditions: clientPackage.testingAdditions });
            }
            this._logger.info("isPackage", { isPackage: clientPackage.isPackage });
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
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            let ret = yield ClientPackageCommand.retrievePackageDetails(this._logger, this._fileSystem, engineVariables, clientPackage);
            if (ret === 0) {
                uniteConfiguration.clientPackages[clientPackage.name] = clientPackage;
                try {
                    yield engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, clientPackage.name, clientPackage.version, false);
                }
                catch (err) {
                    this._logger.error("Adding Package failed", err);
                    return 1;
                }
                this._pipeline.add("unite", "uniteConfigurationJson");
                ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            }
            if (ret === 0) {
                this.displayCompletionMessage(engineVariables, false);
            }
            return ret;
        });
    }
    clientPackageRemove(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
                return 1;
            }
            if (!uniteConfiguration.clientPackages[args.packageName]) {
                this._logger.error("Package has not been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            yield engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, args.packageName, false);
            delete uniteConfiguration.clientPackages[args.packageName];
            this._pipeline.add("unite", "uniteConfigurationJson");
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this.displayCompletionMessage(engineVariables, false);
            }
            return ret;
        });
    }
}
exports.ClientPackageCommand = ClientPackageCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFLekYseUZBQXNGO0FBQ3RGLDJHQUF3RztBQUV4RyxtRUFBZ0U7QUFDaEUsK0RBQTREO0FBQzVELHVEQUFvRDtBQUtwRCxNQUFhLG9CQUFxQixTQUFRLHFDQUFpQjtJQUNoRCxNQUFNLENBQU8sc0JBQXNCLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZUFBZ0MsRUFBRSxhQUFpQzs7WUFDcEosTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksYUFBYSxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQ25JLE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQ3BKLElBQUksY0FBYyxJQUFJLFdBQVcsRUFBRTtnQkFDL0IsSUFBSTtvQkFDQSxNQUFNLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRTdILGFBQWEsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sSUFBSSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7b0JBQ3RGLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO3dCQUN6QixhQUFhLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLElBQUks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QUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDOUUsT0FBTyxDQUFDLENBQUM7YUFDWjtZQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLENBQUMsQ0FBQzthQUNaO1lBRUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdEYsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXBJLE9BQU8sa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUzRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUV0RCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRTFFLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDWCxJQUFJLENBQUMsd0JBQXdCLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7Q0FDSjtBQXZQRCxvREF1UEMiLCJmaWxlIjoiY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsaWVudCBQYWNrYWdlIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9pbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZVRyYW5zcGlsZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGVcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgQ2xpZW50UGFja2FnZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2NsaWVudFBhY2thZ2VPcGVyYXRpb25cIjtcbmltcG9ydCB7IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50UGFja2FnZUNvbW1hbmQgZXh0ZW5kcyBFbmdpbmVDb21tYW5kQmFzZSBpbXBsZW1lbnRzIElFbmdpbmVDb21tYW5kPElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmV0cmlldmVQYWNrYWdlRGV0YWlscyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgY2xpZW50UGFja2FnZTogVW5pdGVDbGllbnRQYWNrYWdlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbWlzc2luZ1ZlcnNpb24gPSBjbGllbnRQYWNrYWdlLnZlcnNpb24gPT09IG51bGwgfHwgY2xpZW50UGFja2FnZS52ZXJzaW9uID09PSB1bmRlZmluZWQgfHwgY2xpZW50UGFja2FnZS52ZXJzaW9uLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgY29uc3QgbWlzc2luZ01haW4gPSAoY2xpZW50UGFja2FnZS5tYWluID09PSBudWxsIHx8IGNsaWVudFBhY2thZ2UubWFpbiA9PT0gdW5kZWZpbmVkIHx8IGNsaWVudFBhY2thZ2UubWFpbi5sZW5ndGggPT09IDApICYmICFjbGllbnRQYWNrYWdlLm5vU2NyaXB0O1xuICAgICAgICBpZiAobWlzc2luZ1ZlcnNpb24gfHwgbWlzc2luZ01haW4pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZUluZm8gPSBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuaW5mbyhsb2dnZXIsIGZpbGVTeXN0ZW0sIGNsaWVudFBhY2thZ2UubmFtZSwgY2xpZW50UGFja2FnZS52ZXJzaW9uKTtcblxuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiB8fCBgXiR7cGFja2FnZUluZm8udmVyc2lvbiB8fCBcIjAuMC4xXCJ9YDtcbiAgICAgICAgICAgICAgICBpZiAoIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluIHx8IHBhY2thZ2VJbmZvLm1haW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiUmVhZGluZyBQYWNrYWdlIEluZm9ybWF0aW9uIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9eXFwuXFwvLywgXCIvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkLnJlcGxhY2UoL15cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gYXJncy5wYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxDbGllbnRQYWNrYWdlT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIGFyZ3Mub3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZUFkZChhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZVJlbW92ZShhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlQWRkKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgY2xpZW50UGFja2FnZSA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDbGllbnRQYWNrYWdlPihcInVuaXRlanMtcGFja2FnZXNcIiwgXCJhc3NldHNcIiwgXCJjbGllbnRQYWNrYWdlLmpzb25cIiwgYXJncy5wcm9maWxlKTtcbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UgPSBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnRQYWNrYWdlLm5hbWUgPSBhcmdzLnBhY2thZ2VOYW1lIHx8IGNsaWVudFBhY2thZ2UubmFtZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gYXJncy52ZXJzaW9uIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gYXJncy5wcmVsb2FkIHx8IGNsaWVudFBhY2thZ2UucHJlbG9hZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGFyZ3MuaW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IGFyZ3Muc2NyaXB0SW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gYXJncy5tYWluIHx8IGNsaWVudFBhY2thZ2UubWFpbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBhcmdzLm1haW5NaW5pZmllZCB8fCBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTGliID0gYXJncy5tYWluTGliIHx8IGNsaWVudFBhY2thZ2UubWFpbkxpYjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBhcmdzLmlzUGFja2FnZSB8fCBjbGllbnRQYWNrYWdlLmlzUGFja2FnZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5ub1NjcmlwdCA9IGFyZ3Mubm9TY3JpcHQgfHwgY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhcmdzLmFzc2V0cyB8fCBjbGllbnRQYWNrYWdlLmFzc2V0cztcbiAgICAgICAgaWYgKGFyZ3MudHJhbnNwaWxlQWxpYXMgfHwgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlICYmIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzKSkge1xuICAgICAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZVRyYW5zcGlsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuYWxpYXMgPSBhcmdzLnRyYW5zcGlsZUFsaWFzIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubGFuZ3VhZ2UgPSBhcmdzLnRyYW5zcGlsZUxhbmd1YWdlIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcyA9IGFyZ3MudHJhbnNwaWxlU291cmNlcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zb3VyY2VzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcyA9IGFyZ3MudHJhbnNwaWxlTW9kdWxlcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5tb2R1bGVzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc3RyaXBFeHQgPSBhcmdzLnRyYW5zcGlsZVN0cmlwRXh0IHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyA9IHRoaXMubWFwUGFyc2VyKGFyZ3MudGVzdGluZ0FkZGl0aW9ucykgfHwgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSB0aGlzLm1hcFBhcnNlcihhcmdzLm1hcCkgfHwgY2xpZW50UGFja2FnZS5tYXA7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmxvYWRlcnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLmxvYWRlcnMpIHx8IGNsaWVudFBhY2thZ2UubG9hZGVycztcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXMgPSB0aGlzLm1hcEZyb21BcnJheVBhcnNlcihhcmdzLnRyYW5zcGlsZVRyYW5zZm9ybXMpIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiSW5wdXQgZmFpbHVyZVwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIGNsaWVudFBhY2thZ2UubmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcm9maWxlXCIsIHsgcHJvZmlsZTogYXJncy5wcm9maWxlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudmVyc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ2ZXJzaW9uXCIsIHsgdmVyc2lvbjogY2xpZW50UGFja2FnZS52ZXJzaW9uIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UucHJlbG9hZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByZWxvYWRcIiwgeyBwcmVsb2FkOiBjbGllbnRQYWNrYWdlLnByZWxvYWQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSkge1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJpbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlLCBbXCJhcHBcIiwgXCJ0ZXN0XCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKSB7XG4gICAgICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxTY3JpcHRJbmNsdWRlTW9kZT4odGhpcy5fbG9nZ2VyLCBcInNjcmlwdEluY2x1ZGVNb2RlXCIsIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUsIFtcIm5vbmVcIiwgXCJidW5kbGVkXCIsIFwibm90QnVuZGxlZFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbiBhbmQgbm9TY3JpcHQgYXJndW1lbnRzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5cIiwgeyBtYWluOiBjbGllbnRQYWNrYWdlLm1haW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiWW91IGNhbm5vdCBjb21iaW5lIHRoZSBtYWluTWluaWZpZWQgYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluTWluaWZpZWRcIiwgeyBtYWluTWluaWZpZWQ6IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbkxpYikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluTGliXCIsIHsgbWFpbkxpYjogY2xpZW50UGFja2FnZS5tYWluTGliIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidGVzdGluZ0FkZGl0aW9uc1wiLCB7IHRlc3RpbmdBZGRpdGlvbnM6IGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImlzUGFja2FnZVwiLCB7IGlzUGFja2FnZTogY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgIH0pO1xuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5hc3NldHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXNzZXRzXCIsIHsgYXNzZXRzOiBjbGllbnRQYWNrYWdlLmFzc2V0cyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFwXCIsIHsgbWFwOiBjbGllbnRQYWNrYWdlLm1hcCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5sb2FkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImxvYWRlcnNcIiwgeyBsb2FkZXJzOiBjbGllbnRQYWNrYWdlLmxvYWRlcnMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibm9TY3JpcHRcIiwgeyBub1NjcmlwdDogY2xpZW50UGFja2FnZS5ub1NjcmlwdCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlQWxpYXNcIiwgeyB0cmFuc3BpbGVBbGlhczogY2xpZW50UGFja2FnZS50cmFuc3BpbGUuYWxpYXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZUxhbmd1YWdlXCIsIHsgdHJhbnNwaWxlTGFuZ3VhZ2U6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZVNvdXJjZXNcIiwgeyB0cmFuc3BpbGVTcmM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlTW9kdWxlc1wiLCB7IHRyYW5zcGlsZVNyYzogY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVTdHJpcEV4dFwiLCB7IHRyYW5zcGlsZVN0cmlwRXh0OiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVUcmFuc2Zvcm1zXCIsIHsgdHJhbnNwaWxlU3JjOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tjbGllbnRQYWNrYWdlLm5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IENsaWVudFBhY2thZ2VDb21tYW5kLnJldHJpZXZlUGFja2FnZURldGFpbHModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMsIGNsaWVudFBhY2thZ2UpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tjbGllbnRQYWNrYWdlLm5hbWVdID0gY2xpZW50UGFja2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGNsaWVudFBhY2thZ2UubmFtZSwgY2xpZW50UGFja2FnZS52ZXJzaW9uLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJBZGRpbmcgUGFja2FnZSBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZVJlbW92ZShhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBhcmdzLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1thcmdzLnBhY2thZ2VOYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5yZW1vdmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgYXJncy5wYWNrYWdlTmFtZSwgZmFsc2UpO1xuXG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbYXJncy5wYWNrYWdlTmFtZV07XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
