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
            let clientPackage = yield this.loadProfile("clientPackage", args.profile);
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
            const missingVersion = clientPackage.version === null || clientPackage.version === undefined || clientPackage.version.length === 0;
            const missingMain = (clientPackage.main === null || clientPackage.main === undefined || clientPackage.main.length === 0) && !clientPackage.noScript;
            if (missingVersion || missingMain) {
                try {
                    const packageInfo = yield engineVariables.packageManager.info(this._logger, this._fileSystem, clientPackage.name, clientPackage.version);
                    clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                    if (!clientPackage.noScript) {
                        clientPackage.main = clientPackage.main || packageInfo.main;
                    }
                }
                catch (err) {
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
                yield engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, clientPackage.name, clientPackage.version, false);
            }
            catch (err) {
                this._logger.error("Adding Package failed", err);
                return 1;
            }
            this._pipeline.add("unite", "uniteConfigurationJson");
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
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
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
}
exports.ClientPackageCommand = ClientPackageCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFJekYseUZBQXNGO0FBQ3RGLDJHQUF3RztBQUV4RyxtRUFBZ0U7QUFDaEUsK0RBQTREO0FBQzVELHVEQUFvRDtBQUtwRCwwQkFBa0MsU0FBUSxxQ0FBaUI7SUFDMUMsR0FBRyxDQUFDLElBQWlDOztZQUM5QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztnQkFDNUUsa0JBQWtCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDO1lBQ2pHLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUFtQixDQUFDLFVBQVUsQ0FBeUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFB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QkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN0RixNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFcEksT0FBTyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBRXRELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFMUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBdFBELG9EQXNQQyIsImZpbGUiOiJjb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50IFBhY2thZ2UgQ29tbWFuZFxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvaW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2VUcmFuc3BpbGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlVHJhbnNwaWxlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IENsaWVudFBhY2thZ2VPcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9jbGllbnRQYWNrYWdlT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcblxuZXhwb3J0IGNsYXNzIENsaWVudFBhY2thZ2VDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gYXJncy5wYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxDbGllbnRQYWNrYWdlT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIGFyZ3Mub3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZUFkZChhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZVJlbW92ZShhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlQWRkKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgY2xpZW50UGFja2FnZSA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDbGllbnRQYWNrYWdlPihcImNsaWVudFBhY2thZ2VcIiwgYXJncy5wcm9maWxlKTtcbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UgPSBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnRQYWNrYWdlLm5hbWUgPSBhcmdzLnBhY2thZ2VOYW1lIHx8IGNsaWVudFBhY2thZ2UubmFtZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gYXJncy52ZXJzaW9uIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gYXJncy5wcmVsb2FkIHx8IGNsaWVudFBhY2thZ2UucHJlbG9hZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGFyZ3MuaW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IGFyZ3Muc2NyaXB0SW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gYXJncy5tYWluIHx8IGNsaWVudFBhY2thZ2UubWFpbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBhcmdzLm1haW5NaW5pZmllZCB8fCBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTGliID0gYXJncy5tYWluTGliIHx8IGNsaWVudFBhY2thZ2UubWFpbkxpYjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBhcmdzLmlzUGFja2FnZSB8fCBjbGllbnRQYWNrYWdlLmlzUGFja2FnZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5ub1NjcmlwdCA9IGFyZ3Mubm9TY3JpcHQgfHwgY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhcmdzLmFzc2V0cyB8fCBjbGllbnRQYWNrYWdlLmFzc2V0cztcbiAgICAgICAgaWYgKGFyZ3MudHJhbnNwaWxlQWxpYXMgfHwgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlICYmIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzKSkge1xuICAgICAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZVRyYW5zcGlsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuYWxpYXMgPSBhcmdzLnRyYW5zcGlsZUFsaWFzIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubGFuZ3VhZ2UgPSBhcmdzLnRyYW5zcGlsZUxhbmd1YWdlIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmxhbmd1YWdlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcyA9IGFyZ3MudHJhbnNwaWxlU291cmNlcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5zb3VyY2VzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUubW9kdWxlcyA9IGFyZ3MudHJhbnNwaWxlTW9kdWxlcyB8fCBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5tb2R1bGVzO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc3RyaXBFeHQgPSBhcmdzLnRyYW5zcGlsZVN0cmlwRXh0IHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyA9IHRoaXMubWFwUGFyc2VyKGFyZ3MudGVzdGluZ0FkZGl0aW9ucykgfHwgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSB0aGlzLm1hcFBhcnNlcihhcmdzLm1hcCkgfHwgY2xpZW50UGFja2FnZS5tYXA7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmxvYWRlcnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLmxvYWRlcnMpIHx8IGNsaWVudFBhY2thZ2UubG9hZGVycztcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXMgPSB0aGlzLm1hcEZyb21BcnJheVBhcnNlcihhcmdzLnRyYW5zcGlsZVRyYW5zZm9ybXMpIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiSW5wdXQgZmFpbHVyZVwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlID0gY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlID09PSBudWxsIHx8XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICBcImJvdGhcIiA6IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGU7XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZS5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgXCJub25lXCIgOiBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlO1xuXG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IGNsaWVudFBhY2thZ2UucHJlbG9hZCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBjbGllbnRQYWNrYWdlLnByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogY2xpZW50UGFja2FnZS5pc1BhY2thZ2U7XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBjbGllbnRQYWNrYWdlLm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwicHJvZmlsZVwiLCB7IHByb2ZpbGU6IGFyZ3MucHJvZmlsZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnZlcnNpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidmVyc2lvblwiLCB7IHZlcnNpb246IGNsaWVudFBhY2thZ2UudmVyc2lvbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwicHJlbG9hZFwiLCB7IHByZWxvYWQ6IGNsaWVudFBhY2thZ2UucHJlbG9hZCB9KTtcblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxJbmNsdWRlTW9kZT4odGhpcy5fbG9nZ2VyLCBcImluY2x1ZGVNb2RlXCIsIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUsIFtcImFwcFwiLCBcInRlc3RcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxTY3JpcHRJbmNsdWRlTW9kZT4odGhpcy5fbG9nZ2VyLCBcInNjcmlwdEluY2x1ZGVNb2RlXCIsIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUsIFtcIm5vbmVcIiwgXCJidW5kbGVkXCIsIFwibm90QnVuZGxlZFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW4pIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiWW91IGNhbm5vdCBjb21iaW5lIHRoZSBtYWluIGFuZCBub1NjcmlwdCBhcmd1bWVudHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpblwiLCB7IG1haW46IGNsaWVudFBhY2thZ2UubWFpbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJZb3UgY2Fubm90IGNvbWJpbmUgdGhlIG1haW5NaW5pZmllZCBhbmQgbm9TY3JpcHQgYXJndW1lbnRzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5NaW5pZmllZFwiLCB7IG1haW5NaW5pZmllZDogY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTGliKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5MaWJcIiwgeyBtYWluTGliOiBjbGllbnRQYWNrYWdlLm1haW5MaWIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0ZXN0aW5nQWRkaXRpb25zXCIsIHsgdGVzdGluZ0FkZGl0aW9uczogY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiaXNQYWNrYWdlXCIsIHsgaXNQYWNrYWdlOiBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSAgfSk7XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLmFzc2V0cykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJhc3NldHNcIiwgeyBhc3NldHM6IGNsaWVudFBhY2thZ2UuYXNzZXRzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1hcCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYXBcIiwgeyBtYXA6IGNsaWVudFBhY2thZ2UubWFwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLmxvYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibG9hZGVyc1wiLCB7IGxvYWRlcnM6IGNsaWVudFBhY2thZ2UubG9hZGVycyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJub1NjcmlwdFwiLCB7IG5vU2NyaXB0OiBjbGllbnRQYWNrYWdlLm5vU2NyaXB0IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZSkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLmFsaWFzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVBbGlhc1wiLCB7IHRyYW5zcGlsZUFsaWFzOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5hbGlhcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlTGFuZ3VhZ2VcIiwgeyB0cmFuc3BpbGVMYW5ndWFnZTogY2xpZW50UGFja2FnZS50cmFuc3BpbGUubGFuZ3VhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlU291cmNlc1wiLCB7IHRyYW5zcGlsZVNyYzogY2xpZW50UGFja2FnZS50cmFuc3BpbGUuc291cmNlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5tb2R1bGVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0cmFuc3BpbGVNb2R1bGVzXCIsIHsgdHJhbnNwaWxlU3JjOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZS5tb2R1bGVzIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZVN0cmlwRXh0XCIsIHsgdHJhbnNwaWxlU3RyaXBFeHQ6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnN0cmlwRXh0IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZVRyYW5zZm9ybXNcIiwgeyB0cmFuc3BpbGVTcmM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlLnRyYW5zZm9ybXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2NsaWVudFBhY2thZ2UubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIGFscmVhZHkgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMoYXJncy5vdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBjb25zdCBtaXNzaW5nVmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24ubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBtaXNzaW5nTWFpbiA9IChjbGllbnRQYWNrYWdlLm1haW4gPT09IG51bGwgfHwgY2xpZW50UGFja2FnZS5tYWluID09PSB1bmRlZmluZWQgfHwgY2xpZW50UGFja2FnZS5tYWluLmxlbmd0aCA9PT0gMCkgJiYgIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGlmIChtaXNzaW5nVmVyc2lvbiB8fCBtaXNzaW5nTWFpbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgY2xpZW50UGFja2FnZS5uYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24pO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uIHx8IGBeJHtwYWNrYWdlSW5mby52ZXJzaW9uIHx8IFwiMC4wLjFcIn1gO1xuICAgICAgICAgICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIFBhY2thZ2UgSW5mb3JtYXRpb24gZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW4pIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluLnJlcGxhY2UoL15cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXlxcLlxcLy8sIFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tjbGllbnRQYWNrYWdlLm5hbWVdID0gY2xpZW50UGFja2FnZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmFkZCh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBjbGllbnRQYWNrYWdlLm5hbWUsIGNsaWVudFBhY2thZ2UudmVyc2lvbiwgZmFsc2UpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkFkZGluZyBQYWNrYWdlIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZVJlbW92ZShhcmdzOiBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBhcmdzLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1thcmdzLnBhY2thZ2VOYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5yZW1vdmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgYXJncy5wYWNrYWdlTmFtZSwgZmFsc2UpO1xuXG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbYXJncy5wYWNrYWdlTmFtZV07XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
