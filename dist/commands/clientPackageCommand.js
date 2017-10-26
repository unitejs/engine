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
            clientPackage.transpileAlias = args.transpileAlias || clientPackage.transpileAlias;
            clientPackage.transpileLanguage = args.transpileLanguage || clientPackage.transpileLanguage;
            clientPackage.transpileSrc = args.transpileSrc || clientPackage.transpileSrc;
            try {
                clientPackage.testingAdditions = this.mapParser(args.testingAdditions) || clientPackage.testingAdditions;
                clientPackage.map = this.mapParser(args.map) || clientPackage.map;
                clientPackage.loaders = this.mapParser(args.loaders) || clientPackage.loaders;
                clientPackage.transpileTransforms = this.mapFromArrayParser(args.transpileTransforms) || clientPackage.transpileTransforms;
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
            if (clientPackage.transpileAlias) {
                this._logger.info("transpileAlias", { transpileAlias: clientPackage.transpileAlias });
            }
            if (clientPackage.transpileLanguage) {
                this._logger.info("transpileLanguage", { transpileLanguage: clientPackage.transpileLanguage });
            }
            if (clientPackage.transpileSrc) {
                this._logger.info("transpileSrc", { transpileSrc: clientPackage.transpileSrc });
            }
            if (clientPackage.transpileTransforms) {
                this._logger.info("transpileTransforms", { transpileSrc: clientPackage.transpileTransforms });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFJekYseUZBQXNGO0FBRXRGLG1FQUFnRTtBQUNoRSwrREFBNEQ7QUFDNUQsdURBQW9EO0FBS3BELDBCQUFrQyxTQUFRLHFDQUFpQjtJQUMxQyxHQUFHLENBQUMsSUFBaUM7O1lBQzlDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTNHLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO2dCQUM1RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7WUFDakcsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUF5QixJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcs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RCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUE5TkQsb0RBOE5DIiwiZmlsZSI6ImNvbW1hbmRzL2NsaWVudFBhY2thZ2VDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQgUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9pbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgQ2xpZW50UGFja2FnZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2NsaWVudFBhY2thZ2VPcGVyYXRpb25cIjtcbmltcG9ydCB7IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50UGFja2FnZUNvbW1hbmQgZXh0ZW5kcyBFbmdpbmVDb21tYW5kQmFzZSBpbXBsZW1lbnRzIElFbmdpbmVDb21tYW5kPElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBhc3luYyBydW4oYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBhcmdzLnBhY2thZ2VNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPENsaWVudFBhY2thZ2VPcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgYXJncy5vcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Mub3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRQYWNrYWdlQWRkKGFyZ3MsIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRQYWNrYWdlUmVtb3ZlKGFyZ3MsIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VBZGQoYXJnczogSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBjbGllbnRQYWNrYWdlID0gYXdhaXQgdGhpcy5sb2FkUHJvZmlsZTxVbml0ZUNsaWVudFBhY2thZ2U+KFwiY2xpZW50UGFja2FnZVwiLCBhcmdzLnByb2ZpbGUpO1xuICAgICAgICBpZiAoY2xpZW50UGFja2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gYXJncy5wYWNrYWdlTmFtZSB8fCBjbGllbnRQYWNrYWdlLm5hbWU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGFyZ3MudmVyc2lvbiB8fCBjbGllbnRQYWNrYWdlLnZlcnNpb247XG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IGFyZ3MucHJlbG9hZCB8fCBjbGllbnRQYWNrYWdlLnByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBhcmdzLmluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBhcmdzLnNjcmlwdEluY2x1ZGVNb2RlIHx8IGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGFyZ3MubWFpbiB8fCBjbGllbnRQYWNrYWdlLm1haW47XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gYXJncy5tYWluTWluaWZpZWQgfHwgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gYXJncy5pc1BhY2thZ2UgfHwgY2xpZW50UGFja2FnZS5pc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uubm9TY3JpcHQgPSBhcmdzLm5vU2NyaXB0IHx8IGNsaWVudFBhY2thZ2Uubm9TY3JpcHQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuYXNzZXRzID0gYXJncy5hc3NldHMgfHwgY2xpZW50UGFja2FnZS5hc3NldHM7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlQWxpYXMgPSBhcmdzLnRyYW5zcGlsZUFsaWFzIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlQWxpYXM7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlTGFuZ3VhZ2UgPSBhcmdzLnRyYW5zcGlsZUxhbmd1YWdlIHx8IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlTGFuZ3VhZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlU3JjID0gYXJncy50cmFuc3BpbGVTcmMgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGVTcmM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucyA9IHRoaXMubWFwUGFyc2VyKGFyZ3MudGVzdGluZ0FkZGl0aW9ucykgfHwgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSB0aGlzLm1hcFBhcnNlcihhcmdzLm1hcCkgfHwgY2xpZW50UGFja2FnZS5tYXA7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmxvYWRlcnMgPSB0aGlzLm1hcFBhcnNlcihhcmdzLmxvYWRlcnMpIHx8IGNsaWVudFBhY2thZ2UubG9hZGVycztcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudHJhbnNwaWxlVHJhbnNmb3JtcyA9IHRoaXMubWFwRnJvbUFycmF5UGFyc2VyKGFyZ3MudHJhbnNwaWxlVHJhbnNmb3JtcykgfHwgY2xpZW50UGFja2FnZS50cmFuc3BpbGVUcmFuc2Zvcm1zO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIklucHV0IGZhaWx1cmVcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZS5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgXCJib3RoXCIgOiBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlO1xuXG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgIFwibm9uZVwiIDogY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZTtcblxuICAgICAgICBjbGllbnRQYWNrYWdlLnByZWxvYWQgPSBjbGllbnRQYWNrYWdlLnByZWxvYWQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogY2xpZW50UGFja2FnZS5wcmVsb2FkO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA9IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlO1xuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgY2xpZW50UGFja2FnZS5uYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByb2ZpbGVcIiwgeyBwcm9maWxlOiBhcmdzLnByb2ZpbGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInZlcnNpb25cIiwgeyB2ZXJzaW9uOiBjbGllbnRQYWNrYWdlLnZlcnNpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByZWxvYWRcIiwgeyBwcmVsb2FkOiBjbGllbnRQYWNrYWdlLnByZWxvYWQgfSk7XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJpbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlLCBbXCJhcHBcIiwgXCJ0ZXN0XCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8U2NyaXB0SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJzY3JpcHRJbmNsdWRlTW9kZVwiLCBjbGllbnRQYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlLCBbXCJub25lXCIsIFwiYnVuZGxlZFwiLCBcIm5vdEJ1bmRsZWRcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIllvdSBjYW5ub3QgY29tYmluZSB0aGUgbWFpbiBhbmQgbm9TY3JpcHQgYXJndW1lbnRzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5cIiwgeyBtYWluOiBjbGllbnRQYWNrYWdlLm1haW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiWW91IGNhbm5vdCBjb21iaW5lIHRoZSBtYWluTWluaWZpZWQgYW5kIG5vU2NyaXB0IGFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluTWluaWZpZWRcIiwgeyBtYWluTWluaWZpZWQ6IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0ZXN0aW5nQWRkaXRpb25zXCIsIHsgdGVzdGluZ0FkZGl0aW9uczogY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiaXNQYWNrYWdlXCIsIHsgaXNQYWNrYWdlOiBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSAgfSk7XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLmFzc2V0cykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJhc3NldHNcIiwgeyBhc3NldHM6IGNsaWVudFBhY2thZ2UuYXNzZXRzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1hcCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYXBcIiwgeyBtYXA6IGNsaWVudFBhY2thZ2UubWFwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLmxvYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibG9hZGVyc1wiLCB7IGxvYWRlcnM6IGNsaWVudFBhY2thZ2UubG9hZGVycyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJub1NjcmlwdFwiLCB7IG5vU2NyaXB0OiBjbGllbnRQYWNrYWdlLm5vU2NyaXB0IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLnRyYW5zcGlsZUFsaWFzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZUFsaWFzXCIsIHsgdHJhbnNwaWxlQWxpYXM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlQWxpYXMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UudHJhbnNwaWxlTGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlTGFuZ3VhZ2VcIiwgeyB0cmFuc3BpbGVMYW5ndWFnZTogY2xpZW50UGFja2FnZS50cmFuc3BpbGVMYW5ndWFnZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGVTcmMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidHJhbnNwaWxlU3JjXCIsIHsgdHJhbnNwaWxlU3JjOiBjbGllbnRQYWNrYWdlLnRyYW5zcGlsZVNyYyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50UGFja2FnZS50cmFuc3BpbGVUcmFuc2Zvcm1zKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRyYW5zcGlsZVRyYW5zZm9ybXNcIiwgeyB0cmFuc3BpbGVTcmM6IGNsaWVudFBhY2thZ2UudHJhbnNwaWxlVHJhbnNmb3JtcyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbY2xpZW50UGFja2FnZS5uYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGNvbnN0IG1pc3NpbmdWZXJzaW9uID0gY2xpZW50UGFja2FnZS52ZXJzaW9uID09PSBudWxsIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbiA9PT0gdW5kZWZpbmVkIHx8IGNsaWVudFBhY2thZ2UudmVyc2lvbi5sZW5ndGggPT09IDA7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gKGNsaWVudFBhY2thZ2UubWFpbiA9PT0gbnVsbCB8fCBjbGllbnRQYWNrYWdlLm1haW4gPT09IHVuZGVmaW5lZCB8fCBjbGllbnRQYWNrYWdlLm1haW4ubGVuZ3RoID09PSAwKSAmJiAhY2xpZW50UGFja2FnZS5ub1NjcmlwdDtcbiAgICAgICAgaWYgKG1pc3NpbmdWZXJzaW9uIHx8IG1pc3NpbmdNYWluKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmluZm8odGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBjbGllbnRQYWNrYWdlLm5hbWUsIGNsaWVudFBhY2thZ2UudmVyc2lvbik7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSBjbGllbnRQYWNrYWdlLnZlcnNpb24gfHwgYF4ke3BhY2thZ2VJbmZvLnZlcnNpb24gfHwgXCIwLjAuMVwifWA7XG4gICAgICAgICAgICAgICAgaWYgKCFjbGllbnRQYWNrYWdlLm5vU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbiB8fCBwYWNrYWdlSW5mby5tYWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgUGFja2FnZSBJbmZvcm1hdGlvbiBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xpZW50UGFja2FnZS5ub1NjcmlwdCkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbikge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4ucmVwbGFjZSgvXlxcLlxcLy8sIFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9eXFwuXFwvLywgXCIvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2NsaWVudFBhY2thZ2UubmFtZV0gPSBjbGllbnRQYWNrYWdlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGNsaWVudFBhY2thZ2UubmFtZSwgY2xpZW50UGFja2FnZS52ZXJzaW9uLCBmYWxzZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiQWRkaW5nIFBhY2thZ2UgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlUmVtb3ZlKGFyZ3M6IElDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtcywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIGFyZ3MucGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2FyZ3MucGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMoYXJncy5vdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgYXdhaXQgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLnJlbW92ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBhcmdzLnBhY2thZ2VOYW1lLCBmYWxzZSk7XG5cbiAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1thcmdzLnBhY2thZ2VOYW1lXTtcblxuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
