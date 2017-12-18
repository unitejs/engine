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
 * Package Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const unitePackageClientConfiguration_1 = require("../configuration/models/unitePackages/unitePackageClientConfiguration");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
const pipelineKey_1 = require("../engine/pipelineKey");
const packageHelper_1 = require("../helpers/packageHelper");
const templateHelper_1 = require("../helpers/templateHelper");
const clientPackageCommand_1 = require("./clientPackageCommand");
class PackageCommand extends engineCommandBase_1.EngineCommandBase {
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, undefined, undefined, false);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType)))) {
                return 1;
            }
            return this.packageAdd(args, uniteConfiguration);
        });
    }
    packageAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
                return 1;
            }
            this._logger.info("");
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            try {
                const rootPackageFolder = yield packageHelper_1.PackageHelper.locate(this._fileSystem, this._logger, engineVariables.engineRootFolder, "unitejs-packages");
                let ret = 0;
                if (rootPackageFolder) {
                    const packageFolder = this._fileSystem.pathCombine(rootPackageFolder, `assets/${args.packageName}`);
                    const packageDirExists = yield this._fileSystem.directoryExists(packageFolder);
                    if (packageDirExists) {
                        const packageFileExists = yield this._fileSystem.fileExists(packageFolder, "unite-package.json");
                        if (packageFileExists) {
                            const unitePackageConfiguration = yield this._fileSystem.fileReadJson(packageFolder, "unite-package.json");
                            const moduleType = this._pipeline.getStep(new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType));
                            yield moduleType.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                            ret = yield this.processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration);
                        }
                        else {
                            ret = 1;
                            this._logger.error(`Package file '${this._fileSystem.pathCombine(packageFolder, "unite-package.json")}' does not exist`);
                        }
                    }
                    else {
                        ret = 1;
                        this._logger.error(`Package folder '${packageFolder}' does not exist`);
                    }
                }
                else {
                    ret = 1;
                }
                return ret;
            }
            catch (err) {
                this._logger.error(`There was an error loading unite-package.json for package '${args.packageName}'`, err);
                return 1;
            }
        });
    }
    processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            const matches = this.matchesConditions(this._logger, uniteConfiguration, unitePackageConfiguration.conditions);
            if (matches === null) {
                ret = 1;
            }
            else {
                if (matches) {
                    const appFrameworkFolder = this._fileSystem.pathCombine(packageFolder, uniteConfiguration.applicationFramework.toLowerCase());
                    const appFrameworkFolderExists = yield this._fileSystem.directoryExists(appFrameworkFolder);
                    if (appFrameworkFolderExists) {
                        const subFolders = yield this._fileSystem.directoryGetFolders(appFrameworkFolder);
                        const codeSubstitutions = templateHelper_1.TemplateHelper.createCodeSubstitutions(engineVariables);
                        for (let i = 0; i < subFolders.length && ret === 0; i++) {
                            const actualWwwFolder = engineVariables.www[subFolders[i]];
                            if (actualWwwFolder) {
                                const actualSource = this._fileSystem.pathCombine(appFrameworkFolder, subFolders[i]);
                                this._logger.info("Copying folder", { sourceFolder: actualSource, destFolder: actualWwwFolder });
                                ret = yield this.copyFolder(uniteConfiguration, actualSource, actualWwwFolder, codeSubstitutions);
                            }
                            else {
                                ret = 1;
                                this._logger.error(`There is no destination folder '${subFolders[i]}' to copy content to.`);
                            }
                        }
                    }
                    if (ret === 0) {
                        ret = yield this.addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration);
                    }
                    if (ret === 0) {
                        this._pipeline.add("content", "packageJson");
                        this._pipeline.add("unite", "uniteConfigurationJson");
                        ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
                    }
                    if (ret === 0) {
                        ret = yield this.addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration);
                    }
                    if (ret === 0) {
                        this.displayCompletionMessage(engineVariables, true);
                    }
                }
                else {
                    this._logger.error("This package can not be added to your current setup, the following conditions must be met:");
                    this.conditionsToText(unitePackageConfiguration.conditions).map(conditionText => this._logger.error(`   ${conditionText}`));
                    ret = 1;
                }
            }
            return ret;
        });
    }
    copyFolder(uniteConfiguration, sourceFolder, destFolder, substitutions) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            try {
                const destFolderExists = yield this._fileSystem.directoryExists(destFolder);
                if (!destFolderExists) {
                    yield this._fileSystem.directoryCreate(destFolder);
                }
            }
            catch (err) {
                this._logger.error(`There was an creating folder '${destFolder}'`, err);
                ret = 1;
            }
            if (ret === 0) {
                const usableExtensions = uniteConfiguration.sourceExtensions
                    .concat(uniteConfiguration.viewExtensions)
                    .concat(uniteConfiguration.styleExtension);
                const files = yield this._fileSystem.directoryGetFiles(sourceFolder);
                for (let i = 0; i < files.length && ret === 0; i++) {
                    try {
                        const ext = /\.(.*)$/.exec(files[i]);
                        if (ext && ext.length > 1 && usableExtensions.indexOf(ext[1]) >= 0) {
                            this._logger.info("Copying file", { sourceFolder, destFolder, file: files[i] });
                            let data = yield this._fileSystem.fileReadText(sourceFolder, files[i]);
                            data = templateHelper_1.TemplateHelper.replaceSubstitutions(substitutions, data);
                            yield this._fileSystem.fileWriteText(destFolder, files[i], data);
                        }
                    }
                    catch (err) {
                        this._logger.error(`There was an error copying file '${files[i]}'`, err);
                        ret = 1;
                    }
                }
            }
            if (ret === 0) {
                const folders = yield this._fileSystem.directoryGetFolders(sourceFolder);
                for (let i = 0; i < folders.length && ret === 0; i++) {
                    ret = yield this.copyFolder(uniteConfiguration, this._fileSystem.pathCombine(sourceFolder, folders[i]), this._fileSystem.pathCombine(destFolder, folders[i]), substitutions);
                }
            }
            return ret;
        });
    }
    addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            if (unitePackageConfiguration.routes && Object.keys(unitePackageConfiguration.routes).length > 0) {
                const appFramework = this._pipeline.getStep(new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework));
                ret = yield appFramework.insertRoutes(this._logger, this._fileSystem, uniteConfiguration, engineVariables, unitePackageConfiguration.routes);
            }
            return ret;
        });
    }
    addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            if (unitePackageConfiguration.clientPackages) {
                const keys = Object.keys(unitePackageConfiguration.clientPackages);
                for (let i = 0; i < keys.length && ret === 0; i++) {
                    const clientPackage = unitePackageConfiguration.clientPackages[keys[i]];
                    const matches = this.matchesConditions(this._logger, uniteConfiguration, clientPackage.conditions);
                    if (matches === null) {
                        ret = 1;
                    }
                    else {
                        if (matches) {
                            let finalClientPackage = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
                            if (clientPackage.profile) {
                                const profilePackage = yield this.loadProfile("unitejs-packages", "assets", "clientPackage.json", clientPackage.profile);
                                if (profilePackage === null) {
                                    ret = 1;
                                }
                                else {
                                    delete clientPackage.profile;
                                    finalClientPackage = Object.assign({}, finalClientPackage, profilePackage);
                                }
                            }
                            if (ret === 0) {
                                finalClientPackage = Object.assign({}, finalClientPackage, clientPackage);
                                ret = yield clientPackageCommand_1.ClientPackageCommand.retrievePackageDetails(this._logger, this._fileSystem, engineVariables, finalClientPackage);
                                if (ret === 0) {
                                    if (finalClientPackage.isDevDependency) {
                                        engineVariables.addVersionedDevDependency(finalClientPackage.name, finalClientPackage.version);
                                    }
                                    else {
                                        uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
                                        uniteConfiguration.clientPackages[finalClientPackage.name] = finalClientPackage;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        });
    }
    matchesConditions(logger, uniteConfiguration, conditions) {
        if (conditions && conditions.length > 0) {
            for (let i = 0; i < conditions.length; i++) {
                if (conditions[i].property !== undefined) {
                    if (conditions[i].value !== undefined) {
                        let matches = this.propertyMatches(uniteConfiguration, conditions[i].property, conditions[i].value);
                        if (conditions[i].negate) {
                            matches = !matches;
                        }
                        if (!matches) {
                            return false;
                        }
                    }
                    else {
                        logger.error(`Can not match condition when value is not set`);
                        return null;
                    }
                }
                else {
                    logger.error(`Can not match condition when property is not set`);
                    return null;
                }
            }
            return true;
        }
        else {
            return true;
        }
    }
    propertyMatches(uniteConfigurationObject, property, value) {
        const propertyLower = property.toLowerCase();
        const actualProperty = Object.keys(uniteConfigurationObject).find(key => key.toLowerCase() === propertyLower);
        if (actualProperty) {
            const configValue = uniteConfigurationObject[actualProperty];
            if (configValue !== undefined) {
                return configValue.toLowerCase() === value.toLowerCase();
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    conditionsToText(conditions) {
        const ret = [];
        conditions.forEach(condition => {
            if (condition.negate) {
                ret.push(`${condition.property} must not be ${condition.value}`);
            }
            else {
                ret.push(`${condition.property} must be ${condition.value}`);
            }
        });
        return ret;
    }
}
exports.PackageCommand = PackageCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFJekYsMkhBQXdIO0FBR3hILG1FQUFnRTtBQUNoRSwrREFBNEQ7QUFDNUQsdURBQW9EO0FBQ3BELDREQUF5RDtBQUN6RCw4REFBMkQ7QUFLM0QsaUVBQThEO0FBRTlELG9CQUE0QixTQUFRLHFDQUFpQjtJQUNwQyxHQUFHLENBQUMsSUFBMkI7O1lBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTNHLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxzQkFBc0IsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENB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R0FBRyxTQUFTLENBQUMsUUFBUSxZQUFZLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0o7QUE3VEQsd0NBNlRDIiwiZmlsZSI6ImNvbW1hbmRzL3BhY2thZ2VDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQYWNrYWdlIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVBhY2thZ2VzL3VuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZUNvbmRpdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVBhY2thZ2VzL3VuaXRlUGFja2FnZUNvbmRpdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVBhY2thZ2VzL3VuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgUGFja2FnZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlSGVscGVyIH0gZnJvbSBcIi4uL2hlbHBlcnMvdGVtcGxhdGVIZWxwZXJcIjtcbmltcG9ydCB7IElBcHBsaWNhdGlvbkZyYW1ld29yayB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lBcHBsaWNhdGlvbkZyYW1ld29ya1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSVBhY2thZ2VDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgQ2xpZW50UGFja2FnZUNvbW1hbmQgfSBmcm9tIFwiLi9jbGllbnRQYWNrYWdlQ29tbWFuZFwiO1xuXG5leHBvcnQgY2xhc3MgUGFja2FnZUNvbW1hbmQgZXh0ZW5kcyBFbmdpbmVDb21tYW5kQmFzZSBpbXBsZW1lbnRzIElFbmdpbmVDb21tYW5kPElQYWNrYWdlQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBhc3luYyBydW4oYXJnczogSVBhY2thZ2VDb21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmspKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGFja2FnZUFkZChhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGFja2FnZUFkZChhcmdzOiBJUGFja2FnZUNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBhcmdzLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RQYWNrYWdlRm9sZGVyID0gYXdhaXQgUGFja2FnZUhlbHBlci5sb2NhdGUodGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fbG9nZ2VyLCBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUm9vdEZvbGRlciwgXCJ1bml0ZWpzLXBhY2thZ2VzXCIpO1xuXG4gICAgICAgICAgICBsZXQgcmV0ID0gMDtcbiAgICAgICAgICAgIGlmIChyb290UGFja2FnZUZvbGRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHJvb3RQYWNrYWdlRm9sZGVyLCBgYXNzZXRzLyR7YXJncy5wYWNrYWdlTmFtZX1gKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VEaXJFeGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhwYWNrYWdlRm9sZGVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlRGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VGaWxlRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlRXhpc3RzKHBhY2thZ2VGb2xkZXIsIFwidW5pdGUtcGFja2FnZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlRmlsZUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24+KHBhY2thZ2VGb2xkZXIsIFwidW5pdGUtcGFja2FnZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVUeXBlID0gdGhpcy5fcGlwZWxpbmUuZ2V0U3RlcDxJUGlwZWxpbmVTdGVwPihuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG1vZHVsZVR5cGUuaW5pdGlhbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5wcm9jZXNzUGFja2FnZSh1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgcGFja2FnZUZvbGRlciwgdW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQYWNrYWdlIGZpbGUgJyR7dGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShwYWNrYWdlRm9sZGVyLCBcInVuaXRlLXBhY2thZ2UuanNvblwiKX0nIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBhY2thZ2UgZm9sZGVyICcke3BhY2thZ2VGb2xkZXJ9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFRoZXJlIHdhcyBhbiBlcnJvciBsb2FkaW5nIHVuaXRlLXBhY2thZ2UuanNvbiBmb3IgcGFja2FnZSAnJHthcmdzLnBhY2thZ2VOYW1lfSdgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHByb2Nlc3NQYWNrYWdlKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlRm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uOiBVbml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IDA7XG5cbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMubWF0Y2hlc0NvbmRpdGlvbnModGhpcy5fbG9nZ2VyLCB1bml0ZUNvbmZpZ3VyYXRpb24sIHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24uY29uZGl0aW9ucyk7XG5cbiAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFwcEZyYW1ld29ya0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocGFja2FnZUZvbGRlciwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYXBwRnJhbWV3b3JrRm9sZGVyRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMoYXBwRnJhbWV3b3JrRm9sZGVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChhcHBGcmFtZXdvcmtGb2xkZXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ViRm9sZGVycyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0Rm9sZGVycyhhcHBGcmFtZXdvcmtGb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGVTdWJzdGl0dXRpb25zID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlQ29kZVN1YnN0aXR1dGlvbnMoZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YkZvbGRlcnMubGVuZ3RoICYmIHJldCA9PT0gMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxXd3dGb2xkZXIgPSBlbmdpbmVWYXJpYWJsZXMud3d3W3N1YkZvbGRlcnNbaV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdHVhbFd3d0ZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbFNvdXJjZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoYXBwRnJhbWV3b3JrRm9sZGVyLCBzdWJGb2xkZXJzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiQ29weWluZyBmb2xkZXJcIiwgeyBzb3VyY2VGb2xkZXI6IGFjdHVhbFNvdXJjZSwgZGVzdEZvbGRlcjogYWN0dWFsV3d3Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5Rm9sZGVyKHVuaXRlQ29uZmlndXJhdGlvbiwgYWN0dWFsU291cmNlLCBhY3R1YWxXd3dGb2xkZXIsIGNvZGVTdWJzdGl0dXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFRoZXJlIGlzIG5vIGRlc3RpbmF0aW9uIGZvbGRlciAnJHtzdWJGb2xkZXJzW2ldfScgdG8gY29weSBjb250ZW50IHRvLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmFkZFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmFkZFJvdXRlKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUNvbXBsZXRpb25NZXNzYWdlKGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGlzIHBhY2thZ2UgY2FuIG5vdCBiZSBhZGRlZCB0byB5b3VyIGN1cnJlbnQgc2V0dXAsIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBtdXN0IGJlIG1ldDpcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25kaXRpb25zVG9UZXh0KHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24uY29uZGl0aW9ucykubWFwKGNvbmRpdGlvblRleHQgPT4gdGhpcy5fbG9nZ2VyLmVycm9yKGAgICAke2NvbmRpdGlvblRleHR9YCkpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY29weUZvbGRlcih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RGb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic3RpdHV0aW9uczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdIH0pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gMDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGVzdEZvbGRlckV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGRlc3RGb2xkZXIpO1xuICAgICAgICAgICAgaWYgKCFkZXN0Rm9sZGVyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZGVzdEZvbGRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBUaGVyZSB3YXMgYW4gY3JlYXRpbmcgZm9sZGVyICcke2Rlc3RGb2xkZXJ9J2AsIGVycik7XG4gICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgdXNhYmxlRXh0ZW5zaW9ucyA9IHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VFeHRlbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh1bml0ZUNvbmZpZ3VyYXRpb24udmlld0V4dGVuc2lvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh1bml0ZUNvbmZpZ3VyYXRpb24uc3R5bGVFeHRlbnNpb24pO1xuXG4gICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMoc291cmNlRm9sZGVyKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGggJiYgcmV0ID09PSAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHQgPSAvXFwuKC4qKSQvLmV4ZWMoZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChleHQgJiYgZXh0Lmxlbmd0aCA+IDEgJiYgdXNhYmxlRXh0ZW5zaW9ucy5pbmRleE9mKGV4dFsxXSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJDb3B5aW5nIGZpbGVcIiwgeyBzb3VyY2VGb2xkZXIsIGRlc3RGb2xkZXIsIGZpbGU6IGZpbGVzW2ldIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkVGV4dChzb3VyY2VGb2xkZXIsIGZpbGVzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IFRlbXBsYXRlSGVscGVyLnJlcGxhY2VTdWJzdGl0dXRpb25zKHN1YnN0aXR1dGlvbnMsIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVXcml0ZVRleHQoZGVzdEZvbGRlciwgZmlsZXNbaV0sIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGNvcHlpbmcgZmlsZSAnJHtmaWxlc1tpXX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBmb2xkZXJzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGb2xkZXJzKHNvdXJjZUZvbGRlcik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGRlcnMubGVuZ3RoICYmIHJldCA9PT0gMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5Rm9sZGVyKHVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShzb3VyY2VGb2xkZXIsIGZvbGRlcnNbaV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKGRlc3RGb2xkZXIsIGZvbGRlcnNbaV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzdGl0dXRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRSb3V0ZSh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbjogVW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG5cbiAgICAgICAgbGV0IHJldCA9IDA7XG5cbiAgICAgICAgaWYgKHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24ucm91dGVzICYmIE9iamVjdC5rZXlzKHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24ucm91dGVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhcHBGcmFtZXdvcmsgPSB0aGlzLl9waXBlbGluZS5nZXRTdGVwPElBcHBsaWNhdGlvbkZyYW1ld29yaz4obmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrKSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IGFwcEZyYW1ld29yay5pbnNlcnRSb3V0ZXModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbi5yb3V0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uOiBVbml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBsZXQgcmV0ID0gMDtcblxuICAgICAgICBpZiAodW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAmJiByZXQgPT09IDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudFBhY2thZ2UgPSB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2tleXNbaV1dO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMubWF0Y2hlc0NvbmRpdGlvbnModGhpcy5fbG9nZ2VyLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGNsaWVudFBhY2thZ2UuY29uZGl0aW9ucyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmFsQ2xpZW50UGFja2FnZTogVW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5wcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVBhY2thZ2UgPSBhd2FpdCB0aGlzLmxvYWRQcm9maWxlPFVuaXRlQ2xpZW50UGFja2FnZT4oXCJ1bml0ZWpzLXBhY2thZ2VzXCIsIFwiYXNzZXRzXCIsIFwiY2xpZW50UGFja2FnZS5qc29uXCIsIGNsaWVudFBhY2thZ2UucHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGVQYWNrYWdlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNsaWVudFBhY2thZ2UucHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxDbGllbnRQYWNrYWdlID0gey4uLmZpbmFsQ2xpZW50UGFja2FnZSwgLi4ucHJvZmlsZVBhY2thZ2V9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsQ2xpZW50UGFja2FnZSA9IHsuLi5maW5hbENsaWVudFBhY2thZ2UsIC4uLmNsaWVudFBhY2thZ2V9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgQ2xpZW50UGFja2FnZUNvbW1hbmQucmV0cmlldmVQYWNrYWdlRGV0YWlscyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcywgZmluYWxDbGllbnRQYWNrYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsQ2xpZW50UGFja2FnZS5pc0RldkRlcGVuZGVuY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5hZGRWZXJzaW9uZWREZXZEZXBlbmRlbmN5KGZpbmFsQ2xpZW50UGFja2FnZS5uYW1lLCBmaW5hbENsaWVudFBhY2thZ2UudmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbZmluYWxDbGllbnRQYWNrYWdlLm5hbWVdID0gZmluYWxDbGllbnRQYWNrYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hdGNoZXNDb25kaXRpb25zKGxvZ2dlcjogSUxvZ2dlciwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGNvbmRpdGlvbnM6IFVuaXRlUGFja2FnZUNvbmRpdGlvbltdKTogYm9vbGVhbiB8IG51bGwge1xuICAgICAgICBpZiAoY29uZGl0aW9ucyAmJiBjb25kaXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25zW2ldLnByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmRpdGlvbnNbaV0udmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSB0aGlzLnByb3BlcnR5TWF0Y2hlcyh1bml0ZUNvbmZpZ3VyYXRpb24sIGNvbmRpdGlvbnNbaV0ucHJvcGVydHksIGNvbmRpdGlvbnNbaV0udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uZGl0aW9uc1tpXS5uZWdhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gIW1hdGNoZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2FuIG5vdCBtYXRjaCBjb25kaXRpb24gd2hlbiB2YWx1ZSBpcyBub3Qgc2V0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2FuIG5vdCBtYXRjaCBjb25kaXRpb24gd2hlbiBwcm9wZXJ0eSBpcyBub3Qgc2V0YCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJvcGVydHlNYXRjaGVzKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdDogYW55LCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5TG93ZXIgPSBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbFByb3BlcnR5OiBzdHJpbmcgPSBPYmplY3Qua2V5cyh1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QpLmZpbmQoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpID09PSBwcm9wZXJ0eUxvd2VyKTtcblxuICAgICAgICBpZiAoYWN0dWFsUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0W2FjdHVhbFByb3BlcnR5XTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZ1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnVmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25kaXRpb25zVG9UZXh0KGNvbmRpdGlvbnM6IFVuaXRlUGFja2FnZUNvbmRpdGlvbltdKSA6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGNvbmRpdGlvbnMuZm9yRWFjaChjb25kaXRpb24gPT4ge1xuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbi5uZWdhdGUpIHtcbiAgICAgICAgICAgICAgICByZXQucHVzaChgJHtjb25kaXRpb24ucHJvcGVydHl9IG11c3Qgbm90IGJlICR7Y29uZGl0aW9uLnZhbHVlfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQucHVzaChgJHtjb25kaXRpb24ucHJvcGVydHl9IG11c3QgYmUgJHtjb25kaXRpb24udmFsdWV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
