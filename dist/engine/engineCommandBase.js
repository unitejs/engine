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
 * Main engine
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const stringHelper_1 = require("unitejs-framework/dist/helpers/stringHelper");
const packageHelper_1 = require("../helpers/packageHelper");
const pipeline_1 = require("./pipeline");
const pipelineKey_1 = require("./pipelineKey");
class EngineCommandBase {
    create(logger, fileSystem, engineRootFolder, engineVersion, engineDependencies) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._engineVersion = engineVersion;
        this._engineDependencies = engineDependencies;
        this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");
        this._pipeline = new pipeline_1.Pipeline(this._logger, this._fileSystem, this._engineRootFolder);
    }
    loadConfiguration(outputDirectory, profileSource, profile, force) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration;
            if (!force) {
                try {
                    const exists = yield this._fileSystem.fileExists(outputDirectory, "unite.json");
                    if (exists) {
                        const existing = yield this._fileSystem.fileReadJson(outputDirectory, "unite.json");
                        // Convert the old comma separated assets into an array
                        if (existing.clientPackages) {
                            Object.keys(existing.clientPackages)
                                .forEach(key => {
                                const pkg = existing.clientPackages[key];
                                if (pkg.assets) {
                                    if (stringHelper_1.StringHelper.isString(pkg.assets)) {
                                        const assetsString = pkg.assets;
                                        pkg.assets = assetsString.split(",");
                                    }
                                }
                            });
                        }
                        uniteConfiguration = existing;
                    }
                    const loadedProfile = yield this.loadProfile(undefined, "assets/profiles/", "configure.json", profile);
                    if (loadedProfile === null) {
                        uniteConfiguration = null;
                    }
                    else if (loadedProfile) {
                        uniteConfiguration = objectHelper_1.ObjectHelper.merge(uniteConfiguration || {}, loadedProfile);
                    }
                }
                catch (e) {
                    this._logger.error("Reading existing unite.json", e);
                    uniteConfiguration = null;
                }
            }
            return uniteConfiguration;
        });
    }
    loadProfile(module, location, profileFile, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (location !== undefined && location !== null && profile !== undefined && profile !== null) {
                try {
                    let moduleRoot;
                    if (module !== undefined && module.length > 0) {
                        moduleRoot = yield packageHelper_1.PackageHelper.locate(this._fileSystem, this._logger, this._engineRootFolder, module);
                        if (!moduleRoot) {
                            this._logger.error(`Module does not exist '${module}'`);
                            return null;
                        }
                    }
                    else {
                        moduleRoot = this._engineRootFolder;
                    }
                    const profileLocation = this._fileSystem.pathCombine(moduleRoot, location);
                    const exists = yield this._fileSystem.fileExists(profileLocation, profileFile);
                    if (exists) {
                        const profiles = yield this._fileSystem.fileReadJson(profileLocation, profileFile);
                        const profileLower = profile.toLowerCase();
                        const keys = Object.keys(profiles);
                        for (let i = 0; i < keys.length; i++) {
                            if (profileLower === keys[i].toLowerCase()) {
                                return profiles[keys[i]];
                            }
                        }
                        this._logger.error(`Profile does not exist '${profile}'`);
                        return null;
                    }
                }
                catch (err) {
                    this._logger.error(`Reading profile file '${location}' failed`, err);
                    return null;
                }
            }
            return undefined;
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        engineVariables.force = false;
        engineVariables.engineRootFolder = this._engineRootFolder;
        engineVariables.engineAssetsFolder = this._engineAssetsFolder;
        engineVariables.engineVersion = this._engineVersion;
        engineVariables.engineDependencies = this._engineDependencies;
        engineVariables.setupDirectories(this._fileSystem, outputDirectory);
        engineVariables.initialisePackages(uniteConfiguration.clientPackages);
        engineVariables.packageManager = this._pipeline.getStep(new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager));
    }
    mapParser(input) {
        let parsedMap;
        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};
            input.forEach(item => {
                const parts = item.split("=");
                if (parts.length === 2) {
                    parsedMap[parts[0]] = parts[1];
                }
                else {
                    throw new Error(`The input is not formed correctly '${input}'`);
                }
            });
        }
        return parsedMap;
    }
    mapFromArrayParser(input) {
        let parsedMap;
        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};
            if (input.length % 2 !== 0) {
                throw new Error(`The input is not formed correctly '${input}'`);
            }
            else {
                for (let i = 0; i < input.length; i += 2) {
                    parsedMap[input[i]] = input[i + 1];
                }
            }
        }
        return parsedMap;
    }
    displayCompletionMessage(engineVariables, showPackageUpdate) {
        engineVariables.additionalCompletionMessages.forEach(message => {
            this._logger.warning(message);
        });
        if (showPackageUpdate) {
            this._logger.warning(`Packages may have changed, you should update them using the following command before running any tasks:`);
            this._logger.warning(`   ${engineVariables.packageManager.getInstallCommand("", false)}`);
        }
        this._logger.banner("Successfully Completed.");
    }
}
exports.EngineCommandBase = EngineCommandBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBQzNFLDhFQUEyRTtBQUkzRSw0REFBeUQ7QUFHekQseUNBQXNDO0FBQ3RDLCtDQUE0QztBQUU1QztJQVdXLE1BQU0sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQixFQUFFLGtCQUE0QztRQUNqSixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO1FBRTlDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFZSxpQkFBaUIsQ0FBQyxlQUF1QixFQUFFLGFBQXFCLEVBQUUsT0FBa0MsRUFBRSxLQUFjOztZQUNoSSxJQUFJLGtCQUF5RCxDQUFDO1lBRTlELElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSTtvQkFDQSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFaEYsSUFBSSxNQUFNLEVBQUU7d0JBQ1IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENB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QUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN0QyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7YUFDSjtTQUNKO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVTLHdCQUF3QixDQUFDLGVBQWdDLEVBQUUsaUJBQTBCO1FBQzNGLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLGlCQUFpQixFQUFFO1lBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHlHQUF5RyxDQUFDLENBQUM7WUFDaEksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0Y7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQXBLRCw4Q0FvS0MiLCJmaWxlIjoiZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9zdHJpbmdIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGFja2FnZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZSB9IGZyb20gXCIuL3BpcGVsaW5lXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuL3BpcGVsaW5lS2V5XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbmdpbmVDb21tYW5kQmFzZSB7XG4gICAgcHJvdGVjdGVkIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJvdGVjdGVkIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcm90ZWN0ZWQgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX2VuZ2luZVZlcnNpb246IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX2VuZ2luZURlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgcHJvdGVjdGVkIF9lbmdpbmVBc3NldHNGb2xkZXI6IHN0cmluZztcblxuICAgIHByb3RlY3RlZCBfcGlwZWxpbmU6IFBpcGVsaW5lO1xuXG4gICAgcHVibGljIGNyZWF0ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGVuZ2luZVZlcnNpb246IHN0cmluZywgZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IGVuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIHRoaXMuX2VuZ2luZVZlcnNpb24gPSBlbmdpbmVWZXJzaW9uO1xuICAgICAgICB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXMgPSBlbmdpbmVEZXBlbmRlbmNpZXM7XG5cbiAgICAgICAgdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcIi9hc3NldHMvXCIpO1xuXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lID0gbmV3IFBpcGVsaW5lKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlcik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCBwcm9maWxlU291cmNlOiBzdHJpbmcsIHByb2ZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw7XG5cbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248VW5pdGVDb25maWd1cmF0aW9uPihvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSBvbGQgY29tbWEgc2VwYXJhdGVkIGFzc2V0cyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZy5jbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXhpc3RpbmcuY2xpZW50UGFja2FnZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGtnID0gZXhpc3RpbmcuY2xpZW50UGFja2FnZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBrZy5hc3NldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmdIZWxwZXIuaXNTdHJpbmcocGtnLmFzc2V0cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3NldHNTdHJpbmcgPSA8c3RyaW5nPjxhbnk+cGtnLmFzc2V0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwa2cuYXNzZXRzID0gYXNzZXRzU3RyaW5nLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gZXhpc3Rpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZGVkUHJvZmlsZTogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDb25maWd1cmF0aW9uPih1bmRlZmluZWQsIFwiYXNzZXRzL3Byb2ZpbGVzL1wiLCBcImNvbmZpZ3VyZS5qc29uXCIsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChsb2FkZWRQcm9maWxlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsb2FkZWRQcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZSh1bml0ZUNvbmZpZ3VyYXRpb24gfHwge30sIGxvYWRlZFByb2ZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIGV4aXN0aW5nIHVuaXRlLmpzb25cIiwgZSk7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGxvYWRQcm9maWxlPFQ+KG1vZHVsZTogc3RyaW5nLCBsb2NhdGlvbjogc3RyaW5nLCBwcm9maWxlRmlsZTogc3RyaW5nLCBwcm9maWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICBpZiAobG9jYXRpb24gIT09IHVuZGVmaW5lZCAmJiBsb2NhdGlvbiAhPT0gbnVsbCAmJiBwcm9maWxlICE9PSB1bmRlZmluZWQgJiYgcHJvZmlsZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlUm9vdDtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICE9PSB1bmRlZmluZWQgJiYgbW9kdWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUm9vdCA9IGF3YWl0IFBhY2thZ2VIZWxwZXIubG9jYXRlKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2xvZ2dlciwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgbW9kdWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZHVsZVJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgTW9kdWxlIGRvZXMgbm90IGV4aXN0ICcke21vZHVsZX0nYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVJvb3QgPSB0aGlzLl9lbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVMb2NhdGlvbiA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUobW9kdWxlUm9vdCwgbG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlRXhpc3RzKHByb2ZpbGVMb2NhdGlvbiwgcHJvZmlsZUZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZXMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nXTogVCB9Pihwcm9maWxlTG9jYXRpb24sIHByb2ZpbGVGaWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlTG93ZXIgPSBwcm9maWxlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9maWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGVMb3dlciA9PT0ga2V5c1tpXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2ZpbGVzW2tleXNbaV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUHJvZmlsZSBkb2VzIG5vdCBleGlzdCAnJHtwcm9maWxlfSdgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBSZWFkaW5nIHByb2ZpbGUgZmlsZSAnJHtsb2NhdGlvbn0nIGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UgPSBmYWxzZTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9lbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lVmVyc2lvbiA9IHRoaXMuX2VuZ2luZVZlcnNpb247XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVEZXBlbmRlbmNpZXMgPSB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXM7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXR1cERpcmVjdG9yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5pbml0aWFsaXNlUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIgPSB0aGlzLl9waXBlbGluZS5nZXRTdGVwPElQYWNrYWdlTWFuYWdlcj4obmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcFBhcnNlcihpbnB1dDogc3RyaW5nW10pOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICBsZXQgcGFyc2VkTWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICAgICAgaWYgKGlucHV0ICE9PSB1bmRlZmluZWQgJiYgaW5wdXQgIT09IG51bGwgJiYgaW5wdXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFyc2VkTWFwID0ge307XG5cbiAgICAgICAgICAgIGlucHV0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZE1hcFtwYXJ0c1swXV0gPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBGcm9tQXJyYXlQYXJzZXIoaW5wdXQ6IHN0cmluZ1tdKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuXG4gICAgICAgICAgICBpZiAoaW5wdXQubGVuZ3RoICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGlucHV0IGlzIG5vdCBmb3JtZWQgY29ycmVjdGx5ICcke2lucHV0fSdgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRNYXBbaW5wdXRbaV1dID0gaW5wdXRbaSArIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZWRNYXA7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRpc3BsYXlDb21wbGV0aW9uTWVzc2FnZShlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgc2hvd1BhY2thZ2VVcGRhdGU6IGJvb2xlYW4pIDogdm9pZCB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5hZGRpdGlvbmFsQ29tcGxldGlvbk1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhtZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzaG93UGFja2FnZVVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm5pbmcoYFBhY2thZ2VzIG1heSBoYXZlIGNoYW5nZWQsIHlvdSBzaG91bGQgdXBkYXRlIHRoZW0gdXNpbmcgdGhlIGZvbGxvd2luZyBjb21tYW5kIGJlZm9yZSBydW5uaW5nIGFueSB0YXNrczpgKTtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKGAgICAke2VuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5nZXRJbnN0YWxsQ29tbWFuZChcIlwiLCBmYWxzZSl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgIH1cbn1cbiJdfQ==
