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
                else {
                    clientPackage.main = "*";
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
            try {
                clientPackage.testingAdditions = this.mapParser(args.testingAdditions) || clientPackage.testingAdditions;
                clientPackage.map = this.mapParser(args.map) || clientPackage.map;
                clientPackage.loaders = this.mapParser(args.loaders) || clientPackage.loaders;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFLekYseUZBQXNGO0FBRXRGLG1FQUFnRTtBQUNoRSwrREFBNEQ7QUFDNUQsdURBQW9EO0FBS3BELE1BQWEsb0JBQXFCLFNBQVEscUNBQWlCO0lBQ2hELE1BQU0sQ0FBTyxzQkFBc0IsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxlQUFnQyxFQUFFLGFBQWlDOztZQUNwSixNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxhQUFhLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFDbkksTUFBTSxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxhQUFhLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDcEosSUFBSSxjQUFjLElBQUksV0FBVyxFQUFFO2dCQUMvQixJQUFJO29CQUNBLE1BQU0sV0FBVyxHQUFHLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFN0gsYUFBYSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxJQUFJLElBQUksV0FBVyxDQUFDLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDdEYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7d0JBQ3pCLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsSUFB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QUNKO0FBeE5ELG9EQXdOQyIsImZpbGUiOiJjb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50IFBhY2thZ2UgQ29tbWFuZFxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL2luY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBTY3JpcHRJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9zY3JpcHRJbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lQ29tbWFuZEJhc2UgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBDbGllbnRQYWNrYWdlT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvY2xpZW50UGFja2FnZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kXCI7XG5cbmV4cG9ydCBjbGFzcyBDbGllbnRQYWNrYWdlQ29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIGltcGxlbWVudHMgSUVuZ2luZUNvbW1hbmQ8SUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zPiB7XG4gICAgcHVibGljIHN0YXRpYyBhc3luYyByZXRyaWV2ZVBhY2thZ2VEZXRhaWxzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBjbGllbnRQYWNrYWdlOiBVbml0ZUNsaWVudFBhY2thZ2UpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBtaXNzaW5nVmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24ubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBtaXNzaW5nTWFpbiA9IChjbGllbnRQYWNrYWdlLm1haW4gPT09IG51bGwgfHwgY2xpZW50UGFja2FnZS5tYWluID09PSB1bmRlZmluZWQgfHwgY2xpZW50UGFja2FnZS5tYWluLmxlbmd0aCA9PT0gMCkgJiYgIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGlmIChtaXNzaW5nVmVyc2lvbiB8fCBtaXNzaW5nTWFpbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKGxvZ2dlciwgZmlsZVN5c3RlbSwgY2xpZW50UGFja2FnZS5uYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24pO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uIHx8IGBeJHtwYWNrYWdlSW5mby52ZXJzaW9uIHx8IFwiMC4wLjFcIn1gO1xuICAgICAgICAgICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJSZWFkaW5nIFBhY2thZ2UgSW5mb3JtYXRpb24gZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW4pIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluLnJlcGxhY2UoL15cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IFwiKlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkLnJlcGxhY2UoL15cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gYXJncy5wYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxDbGllbnRQYWNrYWdlT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIGFyZ3Mub3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZUFkZChhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50UGFja2FnZVJlbW92ZShhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlQWRkKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgY2xpZW50UGFja2FnZSA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDbGllbnRQYWNrYWdlPihcInVuaXRlanMtcGFja2FnZXNcIiwgXCJhc3NldHNcIiwgXCJjbGllbnRQYWNrYWdlLmpzb25cIiwgYXJncy5wcm9maWxlKTtcbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UgPSBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnRQYWNrYWdlLm5hbWUgPSBhcmdzLnBhY2thZ2VOYW1lIHx8IGNsaWVudFBhY2thZ2UubmFtZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gYXJncy52ZXJzaW9uIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gYXJncy5wcmVsb2FkIHx8IGNsaWVudFBhY2thZ2UucHJlbG9hZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGFyZ3MuaW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IGFyZ3Muc2NyaXB0SW5jbHVkZU1vZGUgfHwgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gYXJncy5tYWluIHx8IGNsaWVudFBhY2thZ2UubWFpbjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBhcmdzLm1haW5NaW5pZmllZCB8fCBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTGliID0gYXJncy5tYWluTGliIHx8IGNsaWVudFBhY2thZ2UubWFpbkxpYjtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBhcmdzLmlzUGFja2FnZSB8fCBjbGllbnRQYWNrYWdlLmlzUGFja2FnZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5ub1NjcmlwdCA9IGFyZ3Mubm9TY3JpcHQgfHwgY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhcmdzLmFzc2V0cyB8fCBjbGllbnRQYWNrYWdlLmFzc2V0cztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zID0gdGhpcy5tYXBQYXJzZXIoYXJncy50ZXN0aW5nQWRkaXRpb25zKSB8fCBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnM7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1hcCA9IHRoaXMubWFwUGFyc2VyKGFyZ3MubWFwKSB8fCBjbGllbnRQYWNrYWdlLm1hcDtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubG9hZGVycyA9IHRoaXMubWFwUGFyc2VyKGFyZ3MubG9hZGVycykgfHwgY2xpZW50UGFja2FnZS5sb2FkZXJzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIklucHV0IGZhaWx1cmVcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBjbGllbnRQYWNrYWdlLm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwicHJvZmlsZVwiLCB7IHByb2ZpbGU6IGFyZ3MucHJvZmlsZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnZlcnNpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidmVyc2lvblwiLCB7IHZlcnNpb246IGNsaWVudFBhY2thZ2UudmVyc2lvbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnByZWxvYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcmVsb2FkXCIsIHsgcHJlbG9hZDogY2xpZW50UGFja2FnZS5wcmVsb2FkIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUpIHtcbiAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEluY2x1ZGVNb2RlPih0aGlzLl9sb2dnZXIsIFwiaW5jbHVkZU1vZGVcIiwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSwgW1wiYXBwXCIsIFwidGVzdFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkge1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8U2NyaXB0SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJzY3JpcHRJbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlLCBbXCJub25lXCIsIFwiYnVuZGxlZFwiLCBcIm5vdEJ1bmRsZWRcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJZb3UgY2Fubm90IGNvbWJpbmUgdGhlIG1haW4gYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluXCIsIHsgbWFpbjogY2xpZW50UGFja2FnZS5tYWluIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbk1pbmlmaWVkIGFuZCBub1NjcmlwdCBhcmd1bWVudHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbk1pbmlmaWVkXCIsIHsgbWFpbk1pbmlmaWVkOiBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5MaWIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbkxpYlwiLCB7IG1haW5MaWI6IGNsaWVudFBhY2thZ2UubWFpbkxpYiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRlc3RpbmdBZGRpdGlvbnNcIiwgeyB0ZXN0aW5nQWRkaXRpb25zOiBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJpc1BhY2thZ2VcIiwgeyBpc1BhY2thZ2U6IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlICB9KTtcbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UuYXNzZXRzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImFzc2V0c1wiLCB7IGFzc2V0czogY2xpZW50UGFja2FnZS5hc3NldHMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1hcFwiLCB7IG1hcDogY2xpZW50UGFja2FnZS5tYXAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubG9hZGVycykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJsb2FkZXJzXCIsIHsgbG9hZGVyczogY2xpZW50UGFja2FnZS5sb2FkZXJzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm5vU2NyaXB0XCIsIHsgbm9TY3JpcHQ6IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2NsaWVudFBhY2thZ2UubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIGFscmVhZHkgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMoYXJncy5vdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgQ2xpZW50UGFja2FnZUNvbW1hbmQucmV0cmlldmVQYWNrYWdlRGV0YWlscyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcywgY2xpZW50UGFja2FnZSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2NsaWVudFBhY2thZ2UubmFtZV0gPSBjbGllbnRQYWNrYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5hZGQodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgY2xpZW50UGFja2FnZS5uYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkFkZGluZyBQYWNrYWdlIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDb21wbGV0aW9uTWVzc2FnZShlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlUmVtb3ZlKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIGFyZ3MucGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2FyZ3MucGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMoYXJncy5vdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLnJlbW92ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBhcmdzLnBhY2thZ2VOYW1lLCBmYWxzZSk7XG5cbiAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1thcmdzLnBhY2thZ2VOYW1lXTtcblxuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDb21wbGV0aW9uTWVzc2FnZShlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
