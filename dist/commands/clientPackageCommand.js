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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFLekYseUZBQXNGO0FBQ3RGLDJHQUF3RztBQUV4RyxtRUFBZ0U7QUFDaEUsK0RBQTREO0FBQzVELHVEQUFvRDtBQUtwRCwwQkFBa0MsU0FBUSxxQ0FBaUI7SUFDaEQsTUFBTSxDQUFPLHNCQUFzQixDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGVBQWdDLEVBQUUsYUFBaUM7O1lBQ3BKLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUNuSSxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUNwSixJQUFJLGNBQWMsSUFBSSxXQUFXLEVBQUU7Z0JBQy9CLElBQUk7b0JBQ0EsTUFBTSxXQUFXLEdBQUcsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUU3SCxhQUFhLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLElBQUksSUFBSSxXQUFXLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUN0RixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTt3QkFDekIsYUFBYSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxJQUFJLFdBQVcs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QUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzlFLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxDQUFDLENBQUM7YUFDWjtZQUVELE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVwSSxPQUFPLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFFdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUUxRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN6RDtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUF2UEQsb0RBdVBDIiwiZmlsZSI6ImNvbW1hbmRzL2NsaWVudFBhY2thZ2VDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQgUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvaW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlVHJhbnNwaWxlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IENsaWVudFBhY2thZ2VPcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9jbGllbnRQYWNrYWdlT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcblxuZXhwb3J0IGNsYXNzIENsaWVudFBhY2thZ2VDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHJldHJpZXZlUGFja2FnZURldGFpbHMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIGNsaWVudFBhY2thZ2U6IFVuaXRlQ2xpZW50UGFja2FnZSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdWZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uID09PSBudWxsIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gdW5kZWZpbmVkIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbi5sZW5ndGggPT09IDA7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gKGNsaWVudFBhY2thZ2UubWFpbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLm1haW4gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLm1haW4ubGVuZ3RoID09PSAwKSAmJiAhY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgaWYgKG1pc3NpbmdWZXJzaW9uIHx8IG1pc3NpbmdNYWluKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmluZm8obG9nZ2VyLCBmaWxlU3lzdGVtLCBjbGllbnRQYWNrYWdlLm5hbWUsIGNsaWVudFBhY2thZ2UudmVyc2lvbik7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSBjbGllbnRQYWNrYWdlLnZlcnNpb24gfHwgYF4ke3BhY2thZ2VJbmZvLnZlcnNpb24gfHwgXCIwLjAuMVwifWA7XG4gICAgICAgICAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbiB8fCBwYWNrYWdlSW5mby5tYWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlJlYWRpbmcgUGFja2FnZSBJbmZvcm1hdGlvbiBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXlxcLlxcLy8sIFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9eXFwuXFwvLywgXCIvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9IGFyZ3MucGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8Q2xpZW50UGFja2FnZU9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBhcmdzLm9wZXJhdGlvbiwgW1wiYWRkXCIsIFwicmVtb3ZlXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5vcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudFBhY2thZ2VBZGQoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudFBhY2thZ2VSZW1vdmUoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZUFkZChhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IGNsaWVudFBhY2thZ2UgPSBhd2FpdCB0aGlzLmxvYWRQcm9maWxlPFVuaXRlQ2xpZW50UGFja2FnZT4oXCJ1bml0ZWpzLXBhY2thZ2VzXCIsIFwiYXNzZXRzXCIsIFwiY2xpZW50UGFja2FnZS5qc29uXCIsIGFyZ3MucHJvZmlsZSk7XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gYXJncy5wYWNrYWdlTmFtZSB8fCBjbGllbnRQYWNrYWdlLm5hbWU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGFyZ3MudmVyc2lvbiB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb247XG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IGFyZ3MucHJlbG9hZCB8fCBjbGllbnRQYWNrYWdlLnByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBhcmdzLmluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBhcmdzLnNjcmlwdEluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGFyZ3MubWFpbiB8fCBjbGllbnRQYWNrYWdlLm1haW47XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gYXJncy5tYWluTWluaWZpZWQgfHwgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbkxpYiA9IGFyZ3MubWFpbkxpYiB8fCBjbGllbnRQYWNrYWdlLm1haW5MaWI7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gYXJncy5pc1BhY2thZ2UgfHwgY2xpZW50UGFja2FnZS5pc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgPSBhcmdzLm5vU2NyaXB0IHx8IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuYXNzZXRzID0gYXJncy5hc3NldHMgfHwgY2xpZW50UGFja2FnZS5hc3NldHM7XG4gICAgICAgIGlmIChhcmdzLnRyYW5zcGlsZUFsaWFzIHx8IChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSAmJiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcykpIHtcbiAgICAgICAgICAgIGlmICghY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSA9IG5ldyBVbml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzID0gYXJncy50cmFuc3BpbGVBbGlhcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlID0gYXJncy50cmFuc3BpbGVMYW5ndWFnZSB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5sYW5ndWFnZTtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnNvdXJjZXMgPSBhcmdzLnRyYW5zcGlsZVNvdXJjZXMgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLm1vZHVsZXMgPSBhcmdzLnRyYW5zcGlsZU1vZHVsZXMgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0ID0gYXJncy50cmFuc3BpbGVTdHJpcEV4dCB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zdHJpcEV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLnRlc3RpbmdBZGRpdGlvbnMpIHx8IGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFwID0gdGhpcy5tYXBQYXJzZXIoYXJncy5tYXApIHx8IGNsaWVudFBhY2thZ2UubWFwO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5sb2FkZXJzID0gdGhpcy5tYXBQYXJzZXIoYXJncy5sb2FkZXJzKSB8fCBjbGllbnRQYWNrYWdlLmxvYWRlcnM7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zID0gdGhpcy5tYXBGcm9tQXJyYXlQYXJzZXIoYXJncy50cmFuc3BpbGVUcmFuc2Zvcm1zKSB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS50cmFuc2Zvcm1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIklucHV0IGZhaWx1cmVcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBjbGllbnRQYWNrYWdlLm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwicHJvZmlsZVwiLCB7IHByb2ZpbGU6IGFyZ3MucHJvZmlsZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnZlcnNpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidmVyc2lvblwiLCB7IHZlcnNpb246IGNsaWVudFBhY2thZ2UudmVyc2lvbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnByZWxvYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcmVsb2FkXCIsIHsgcHJlbG9hZDogY2xpZW50UGFja2FnZS5wcmVsb2FkIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUpIHtcbiAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEluY2x1ZGVNb2RlPih0aGlzLl9sb2dnZXIsIFwiaW5jbHVkZU1vZGVcIiwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSwgW1wiYXBwXCIsIFwidGVzdFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkge1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8U2NyaXB0SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJzY3JpcHRJbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlLCBbXCJub25lXCIsIFwiYnVuZGxlZFwiLCBcIm5vdEJ1bmRsZWRcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJZb3UgY2Fubm90IGNvbWJpbmUgdGhlIG1haW4gYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluXCIsIHsgbWFpbjogY2xpZW50UGFja2FnZS5tYWluIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbk1pbmlmaWVkIGFuZCBub1NjcmlwdCBhcmd1bWVudHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbk1pbmlmaWVkXCIsIHsgbWFpbk1pbmlmaWVkOiBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5MaWIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbkxpYlwiLCB7IG1haW5MaWI6IGNsaWVudFBhY2thZ2UubWFpbkxpYiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRlc3RpbmdBZGRpdGlvbnNcIiwgeyB0ZXN0aW5nQWRkaXRpb25zOiBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJpc1BhY2thZ2VcIiwgeyBpc1BhY2thZ2U6IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlICB9KTtcbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UuYXNzZXRzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImFzc2V0c1wiLCB7IGFzc2V0czogY2xpZW50UGFja2FnZS5hc3NldHMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1hcFwiLCB7IG1hcDogY2xpZW50UGFja2FnZS5tYXAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubG9hZGVycykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJsb2FkZXJzXCIsIHsgbG9hZGVyczogY2xpZW50UGFja2FnZS5sb2FkZXJzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm5vU2NyaXB0XCIsIHsgbm9TY3JpcHQ6IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUuYWxpYXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZUFsaWFzXCIsIHsgdHJhbnNwaWxlQWxpYXM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVMYW5ndWFnZVwiLCB7IHRyYW5zcGlsZUxhbmd1YWdlOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5sYW5ndWFnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zb3VyY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVTb3VyY2VzXCIsIHsgdHJhbnNwaWxlU3JjOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zb3VyY2VzIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLm1vZHVsZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZU1vZHVsZXNcIiwgeyB0cmFuc3BpbGVTcmM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLm1vZHVsZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc3RyaXBFeHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlU3RyaXBFeHRcIiwgeyB0cmFuc3BpbGVTdHJpcEV4dDogY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc3RyaXBFeHQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUudHJhbnNmb3Jtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlVHJhbnNmb3Jtc1wiLCB7IHRyYW5zcGlsZVNyYzogY2xpZW50UGFja2FnZS50cmFuc3BpbGUudHJhbnNmb3JtcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbY2xpZW50UGFja2FnZS5uYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBDbGllbnRQYWNrYWdlQ29tbWFuZC5yZXRyaWV2ZVBhY2thZ2VEZXRhaWxzKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLCBjbGllbnRQYWNrYWdlKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbY2xpZW50UGFja2FnZS5uYW1lXSA9IGNsaWVudFBhY2thZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmFkZCh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBjbGllbnRQYWNrYWdlLm5hbWUsIGNsaWVudFBhY2thZ2UudmVyc2lvbiwgZmFsc2UpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiQWRkaW5nIFBhY2thZ2UgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUNvbXBsZXRpb25NZXNzYWdlKGVuZ2luZVZhcmlhYmxlcywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VSZW1vdmUoYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgYXJncy5wYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbYXJncy5wYWNrYWdlTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIucmVtb3ZlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGFyZ3MucGFja2FnZU5hbWUsIGZhbHNlKTtcblxuICAgICAgICBkZWxldGUgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2FyZ3MucGFja2FnZU5hbWVdO1xuXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUNvbXBsZXRpb25NZXNzYWdlKGVuZ2luZVZhcmlhYmxlcywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
