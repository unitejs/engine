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
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", clientPackage.name)) {
                return 1;
            }
            if (args.profile) {
                this._logger.info("profile", { profile: args.profile });
            }
            if (clientPackage.version) {
                this._logger.info("version", { version: clientPackage.version });
            }
            this._logger.info("preload", { preload: clientPackage.preload });
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "includeMode", clientPackage.includeMode, ["app", "test", "both"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "scriptIncludeMode", clientPackage.scriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
                return 1;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFLekYseUZBQXNGO0FBQ3RGLDJHQUF3RztBQUV4RyxtRUFBZ0U7QUFDaEUsK0RBQTREO0FBQzVELHVEQUFvRDtBQUtwRCwwQkFBa0MsU0FBUSxxQ0FBaUI7SUFDaEQsTUFBTSxDQUFPLHNCQUFzQixDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGVBQWdDLEVBQUUsYUFBaUM7O1lBQ3BKLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUNuSSxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUNwSixFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDO29CQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFN0gsYUFBYSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxJQUFJLElBQUksV0FBVyxDQUFDLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDdEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDMUIs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Q0FBQztZQUNiLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVwSSxPQUFPLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFFdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUUxRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsd0JBQXdCLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUE5UEQsb0RBOFBDIiwiZmlsZSI6ImNvbW1hbmRzL2NsaWVudFBhY2thZ2VDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQgUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvaW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlVHJhbnNwaWxlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IENsaWVudFBhY2thZ2VPcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9jbGllbnRQYWNrYWdlT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcblxuZXhwb3J0IGNsYXNzIENsaWVudFBhY2thZ2VDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHJldHJpZXZlUGFja2FnZURldGFpbHMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIGNsaWVudFBhY2thZ2U6IFVuaXRlQ2xpZW50UGFja2FnZSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdWZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uID09PSBudWxsIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gdW5kZWZpbmVkIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbi5sZW5ndGggPT09IDA7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gKGNsaWVudFBhY2thZ2UubWFpbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLm1haW4gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLm1haW4ubGVuZ3RoID09PSAwKSAmJiAhY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgaWYgKG1pc3NpbmdWZXJzaW9uIHx8IG1pc3NpbmdNYWluKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmluZm8obG9nZ2VyLCBmaWxlU3lzdGVtLCBjbGllbnRQYWNrYWdlLm5hbWUsIGNsaWVudFBhY2thZ2UudmVyc2lvbik7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSBjbGllbnRQYWNrYWdlLnZlcnNpb24gfHwgYF4ke3BhY2thZ2VJbmZvLnZlcnNpb24gfHwgXCIwLjAuMVwifWA7XG4gICAgICAgICAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbiB8fCBwYWNrYWdlSW5mby5tYWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlJlYWRpbmcgUGFja2FnZSBJbmZvcm1hdGlvbiBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXlxcLlxcLy8sIFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9eXFwuXFwvLywgXCIvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9IGFyZ3MucGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8Q2xpZW50UGFja2FnZU9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBhcmdzLm9wZXJhdGlvbiwgW1wiYWRkXCIsIFwicmVtb3ZlXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5vcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudFBhY2thZ2VBZGQoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudFBhY2thZ2VSZW1vdmUoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZUFkZChhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IGNsaWVudFBhY2thZ2UgPSBhd2FpdCB0aGlzLmxvYWRQcm9maWxlPFVuaXRlQ2xpZW50UGFja2FnZT4oXCJ1bml0ZWpzLXBhY2thZ2VzXCIsIFwiYXNzZXRzXCIsIFwiY2xpZW50UGFja2FnZS5qc29uXCIsIGFyZ3MucHJvZmlsZSk7XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gYXJncy5wYWNrYWdlTmFtZSB8fCBjbGllbnRQYWNrYWdlLm5hbWU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGFyZ3MudmVyc2lvbiB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb247XG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IGFyZ3MucHJlbG9hZCB8fCBjbGllbnRQYWNrYWdlLnByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBhcmdzLmluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBhcmdzLnNjcmlwdEluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGFyZ3MubWFpbiB8fCBjbGllbnRQYWNrYWdlLm1haW47XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gYXJncy5tYWluTWluaWZpZWQgfHwgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbkxpYiA9IGFyZ3MubWFpbkxpYiB8fCBjbGllbnRQYWNrYWdlLm1haW5MaWI7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gYXJncy5pc1BhY2thZ2UgfHwgY2xpZW50UGFja2FnZS5pc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgPSBhcmdzLm5vU2NyaXB0IHx8IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuYXNzZXRzID0gYXJncy5hc3NldHMgfHwgY2xpZW50UGFja2FnZS5hc3NldHM7XG4gICAgICAgIGlmIChhcmdzLnRyYW5zcGlsZUFsaWFzIHx8IChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSAmJiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcykpIHtcbiAgICAgICAgICAgIGlmICghY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSA9IG5ldyBVbml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzID0gYXJncy50cmFuc3BpbGVBbGlhcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlID0gYXJncy50cmFuc3BpbGVMYW5ndWFnZSB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5sYW5ndWFnZTtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMgPSBhcmdzLnRyYW5zcGlsZVNvdXJjZXMgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLm1vZHVsZXMgPSBhcmdzLnRyYW5zcGlsZU1vZHVsZXMgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0ID0gYXJncy50cmFuc3BpbGVTdHJpcEV4dCB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLnRlc3RpbmdBZGRpdGlvbnMpIHx8IGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFwID0gdGhpcy5tYXBQYXJzZXIoYXJncy5tYXApIHx8IGNsaWVudFBhY2thZ2UubWFwO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5sb2FkZXJzID0gdGhpcy5tYXBQYXJzZXIoYXJncy5sb2FkZXJzKSB8fCBjbGllbnRQYWNrYWdlLmxvYWRlcnM7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zID0gdGhpcy5tYXBGcm9tQXJyYXlQYXJzZXIoYXJncy50cmFuc3BpbGVUcmFuc2Zvcm1zKSB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIklucHV0IGZhaWx1cmVcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZS5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgXCJib3RoXCIgOiBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlO1xuXG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgIFwibm9uZVwiIDogY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZTtcblxuICAgICAgICBjbGllbnRQYWNrYWdlLnByZWxvYWQgPSBjbGllbnRQYWNrYWdlLnByZWxvYWQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogY2xpZW50UGFja2FnZS5wcmVsb2FkO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA9IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlO1xuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgY2xpZW50UGFja2FnZS5uYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByb2ZpbGVcIiwgeyBwcm9maWxlOiBhcmdzLnByb2ZpbGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInZlcnNpb25cIiwgeyB2ZXJzaW9uOiBjbGllbnRQYWNrYWdlLnZlcnNpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByZWxvYWRcIiwgeyBwcmVsb2FkOiBjbGllbnRQYWNrYWdlLnByZWxvYWQgfSk7XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJpbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlLCBbXCJhcHBcIiwgXCJ0ZXN0XCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8U2NyaXB0SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJzY3JpcHRJbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlLCBbXCJub25lXCIsIFwiYnVuZGxlZFwiLCBcIm5vdEJ1bmRsZWRcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbiBhbmQgbm9TY3JpcHQgYXJndW1lbnRzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5cIiwgeyBtYWluOiBjbGllbnRQYWNrYWdlLm1haW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiWW91IGNhbm5vdCBjb21iaW5lIHRoZSBtYWluTWluaWZpZWQgYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluTWluaWZpZWRcIiwgeyBtYWluTWluaWZpZWQ6IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbkxpYikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluTGliXCIsIHsgbWFpbkxpYjogY2xpZW50UGFja2FnZS5tYWluTGliIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidGVzdGluZ0FkZGl0aW9uc1wiLCB7IHRlc3RpbmdBZGRpdGlvbnM6IGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImlzUGFja2FnZVwiLCB7IGlzUGFja2FnZTogY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgIH0pO1xuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5hc3NldHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXNzZXRzXCIsIHsgYXNzZXRzOiBjbGllbnRQYWNrYWdlLmFzc2V0cyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFwXCIsIHsgbWFwOiBjbGllbnRQYWNrYWdlLm1hcCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5sb2FkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImxvYWRlcnNcIiwgeyBsb2FkZXJzOiBjbGllbnRQYWNrYWdlLmxvYWRlcnMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibm9TY3JpcHRcIiwgeyBub1NjcmlwdDogY2xpZW50UGFja2FnZS5ub1NjcmlwdCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlQWxpYXNcIiwgeyB0cmFuc3BpbGVBbGlhczogY2xpZW50UGFja2FnZS50cmFuc3BpbGUuYWxpYXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZUxhbmd1YWdlXCIsIHsgdHJhbnNwaWxlTGFuZ3VhZ2U6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZVNvdXJjZXNcIiwgeyB0cmFuc3BpbGVTcmM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlTW9kdWxlc1wiLCB7IHRyYW5zcGlsZVNyYzogY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVTdHJpcEV4dFwiLCB7IHRyYW5zcGlsZVN0cmlwRXh0OiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVUcmFuc2Zvcm1zXCIsIHsgdHJhbnNwaWxlU3JjOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tjbGllbnRQYWNrYWdlLm5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IENsaWVudFBhY2thZ2VDb21tYW5kLnJldHJpZXZlUGFja2FnZURldGFpbHModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMsIGNsaWVudFBhY2thZ2UpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tjbGllbnRQYWNrYWdlLm5hbWVdID0gY2xpZW50UGFja2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGNsaWVudFBhY2thZ2UubmFtZSwgY2xpZW50UGFja2FnZS52ZXJzaW9uLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJBZGRpbmcgUGFja2FnZSBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZVJlbW92ZShhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBhcmdzLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1thcmdzLnBhY2thZ2VOYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5yZW1vdmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgYXJncy5wYWNrYWdlTmFtZSwgZmFsc2UpO1xuXG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbYXJncy5wYWNrYWdlTmFtZV07XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
