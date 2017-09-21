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
                return yield this.clientPackageAdd(args, uniteConfiguration);
            }
            else {
                return yield this.clientPackageRemove(args, uniteConfiguration);
            }
        });
    }
    clientPackageAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let clientPackage = yield this.loadProfile("clientPackage", args.profile);
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
                    clientPackage.main = clientPackage.main.replace(/\.\//, "/");
                }
                if (clientPackage.mainMinified) {
                    clientPackage.mainMinified = clientPackage.mainMinified.replace(/\\/g, "/");
                    clientPackage.mainMinified = clientPackage.mainMinified.replace(/\.\//, "/");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFJekYseUZBQXNGO0FBRXRGLG1FQUFnRTtBQUNoRSwrREFBNEQ7QUFDNUQsdURBQW9EO0FBS3BELDBCQUFrQyxTQUFRLHFDQUFpQjtJQUMxQyxHQUFHLENBQUMsSUFBaUM7O1lBQzlDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTNHLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO2dCQUM1RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7WUFDakcsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUF5QixJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcs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cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQgUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9pbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgQ2xpZW50UGFja2FnZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2NsaWVudFBhY2thZ2VPcGVyYXRpb25cIjtcbmltcG9ydCB7IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50UGFja2FnZUNvbW1hbmQgZXh0ZW5kcyBFbmdpbmVDb21tYW5kQmFzZSBpbXBsZW1lbnRzIElFbmdpbmVDb21tYW5kPElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBhc3luYyBydW4oYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBhcmdzLnBhY2thZ2VNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPENsaWVudFBhY2thZ2VPcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgYXJncy5vcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Mub3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnRQYWNrYWdlQWRkKGFyZ3MsIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnRQYWNrYWdlUmVtb3ZlKGFyZ3MsIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VBZGQoYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBjbGllbnRQYWNrYWdlID0gYXdhaXQgdGhpcy5sb2FkUHJvZmlsZTxVbml0ZUNsaWVudFBhY2thZ2U+KFwiY2xpZW50UGFja2FnZVwiLCBhcmdzLnByb2ZpbGUpO1xuICAgICAgICBpZiAoY2xpZW50UGFja2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gYXJncy5wYWNrYWdlTmFtZSB8fCBjbGllbnRQYWNrYWdlLm5hbWU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGFyZ3MudmVyc2lvbiB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb247XG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IGFyZ3MucHJlbG9hZCB8fCBjbGllbnRQYWNrYWdlLnByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBhcmdzLmluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBhcmdzLnNjcmlwdEluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGFyZ3MubWFpbiB8fCBjbGllbnRQYWNrYWdlLm1haW47XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gYXJncy5tYWluTWluaWZpZWQgfHwgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gYXJncy5pc1BhY2thZ2UgfHwgY2xpZW50UGFja2FnZS5pc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgPSBhcmdzLm5vU2NyaXB0IHx8IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuYXNzZXRzID0gYXJncy5hc3NldHMgfHwgY2xpZW50UGFja2FnZS5hc3NldHM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyA9IHRoaXMubWFwUGFyc2VyKGFyZ3MudGVzdGluZ0FkZGl0aW9ucykgfHwgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSB0aGlzLm1hcFBhcnNlcihhcmdzLm1hcCkgfHwgY2xpZW50UGFja2FnZS5tYXA7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmxvYWRlcnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLmxvYWRlcnMpIHx8IGNsaWVudFBhY2thZ2UubG9hZGVycztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJJbnB1dCBmYWlsdXJlXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgIFwiYm90aFwiIDogY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZTtcblxuICAgICAgICBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlID0gY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlID09PSBudWxsIHx8XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICBcIm5vbmVcIiA6IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGU7XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gY2xpZW50UGFja2FnZS5wcmVsb2FkID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGNsaWVudFBhY2thZ2UucHJlbG9hZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBjbGllbnRQYWNrYWdlLmlzUGFja2FnZTtcblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIGNsaWVudFBhY2thZ2UubmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcm9maWxlXCIsIHsgcHJvZmlsZTogYXJncy5wcm9maWxlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudmVyc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ2ZXJzaW9uXCIsIHsgdmVyc2lvbjogY2xpZW50UGFja2FnZS52ZXJzaW9uIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcmVsb2FkXCIsIHsgcHJlbG9hZDogY2xpZW50UGFja2FnZS5wcmVsb2FkIH0pO1xuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEluY2x1ZGVNb2RlPih0aGlzLl9sb2dnZXIsIFwiaW5jbHVkZU1vZGVcIiwgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSwgW1wiYXBwXCIsIFwidGVzdFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFNjcmlwdEluY2x1ZGVNb2RlPih0aGlzLl9sb2dnZXIsIFwic2NyaXB0SW5jbHVkZU1vZGVcIiwgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSwgW1wibm9uZVwiLCBcImJ1bmRsZWRcIiwgXCJub3RCdW5kbGVkXCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJZb3UgY2Fubm90IGNvbWJpbmUgdGhlIG1haW4gYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluXCIsIHsgbWFpbjogY2xpZW50UGFja2FnZS5tYWluIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbk1pbmlmaWVkIGFuZCBub1NjcmlwdCBhcmd1bWVudHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbk1pbmlmaWVkXCIsIHsgbWFpbk1pbmlmaWVkOiBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidGVzdGluZ0FkZGl0aW9uc1wiLCB7IHRlc3RpbmdBZGRpdGlvbnM6IGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImlzUGFja2FnZVwiLCB7IGlzUGFja2FnZTogY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgIH0pO1xuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5hc3NldHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXNzZXRzXCIsIHsgYXNzZXRzOiBjbGllbnRQYWNrYWdlLmFzc2V0cyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFwXCIsIHsgbWFwOiBjbGllbnRQYWNrYWdlLm1hcCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5sb2FkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImxvYWRlcnNcIiwgeyBsb2FkZXJzOiBjbGllbnRQYWNrYWdlIC5sb2FkZXJzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm5vU2NyaXB0XCIsIHsgbm9TY3JpcHQ6IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2NsaWVudFBhY2thZ2UubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIGFscmVhZHkgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMoYXJncy5vdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBjb25zdCBtaXNzaW5nVmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb24ubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBtaXNzaW5nTWFpbiA9IChjbGllbnRQYWNrYWdlLm1haW4gPT09IG51bGwgfHwgY2xpZW50UGFja2FnZS5tYWluID09PSB1bmRlZmluZWQgfHwgY2xpZW50UGFja2FnZS5tYWluLmxlbmd0aCA9PT0gMCkgJiYgIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGlmIChtaXNzaW5nVmVyc2lvbiB8fCBtaXNzaW5nTWFpbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgY2xpZW50UGFja2FnZS5uYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24pO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uIHx8IGBeJHtwYWNrYWdlSW5mby52ZXJzaW9uIHx8IFwiMC4wLjFcIn1gO1xuICAgICAgICAgICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIFBhY2thZ2UgSW5mb3JtYXRpb24gZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaWVudFBhY2thZ2Uubm9TY3JpcHQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW4pIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluLnJlcGxhY2UoL1xcLlxcLy8sIFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbY2xpZW50UGFja2FnZS5uYW1lXSA9IGNsaWVudFBhY2thZ2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5hZGQodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgY2xpZW50UGFja2FnZS5uYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24sIGZhbHNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJBZGRpbmcgUGFja2FnZSBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VSZW1vdmUoYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgYXJncy5wYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbYXJncy5wYWNrYWdlTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIucmVtb3ZlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGFyZ3MucGFja2FnZU5hbWUsIGZhbHNlKTtcblxuICAgICAgICBkZWxldGUgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2FyZ3MucGFja2FnZU5hbWVdO1xuXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
