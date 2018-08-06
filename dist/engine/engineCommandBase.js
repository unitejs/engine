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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBQzNFLDhFQUEyRTtBQUkzRSw0REFBeUQ7QUFHekQseUNBQXNDO0FBQ3RDLCtDQUE0QztBQUU1QyxNQUFzQixpQkFBaUI7SUFXNUIsTUFBTSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QixFQUFFLGFBQXFCLEVBQUUsa0JBQTRDO1FBQ2pKLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUM7UUFFOUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVlLGlCQUFpQixDQUFDLGVBQXVCLEVBQUUsYUFBcUIsRUFBRSxPQUFrQyxFQUFFLEtBQWM7O1lBQ2hJLElBQUksa0JBQXlELENBQUM7WUFFOUQsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixJQUFJO29CQUNBLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUVoRixJQUFJLE1BQU0sRUFBRTt3QkFDUixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFxQixlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7d0JBRXhHLHVEQUF1RDt3QkFDdkQsSUFBSSxRQUFRLENBQUMsY0FBYyxFQUFFOzRCQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7aUNBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FDWCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUN6QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7b0NBQ1osSUFBSSwyQkFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7d0NBQ25DLE1BQU0sWUFBWSxHQUFnQixHQUFHLENBQUMsTUFBTSxDQUFDO3dDQUM3QyxHQUFHLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7cUNBQ3hDO2lDQUNKOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3lCQUNWO3dCQUVELGtCQUFrQixHQUFHLFFBQVEsQ0FBQztxQkFDakM7b0JBRUQsTUFBTSxhQUFhLEdBQTBDLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBcUIsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNsSyxJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7d0JBQ3hCLGtCQUFrQixHQUFHLElBQUksQ0FBQztxQkFDN0I7eUJBQU0sSUFBSSxhQUFhLEVBQUU7d0JBQ3RCLGtCQUFrQixHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLGtCQUFrQixJQUFJLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDcEY7aUJBQ0o7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELGtCQUFrQixHQUFHLElBQUksQ0FBQztpQkFDN0I7YUFDSjtZQUVELE9BQU8sa0JBQWtCLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRWUsV0FBVyxDQUFJLE1BQWMsRUFBRSxRQUFnQixFQUFFLFdBQW1CLEVBQUUsT0FBa0M7O1lBQ3BILElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtnQkFDMUYsSUFBSTtvQkFDQSxJQUFJLFVBQVUsQ0FBQztvQkFDZixJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQzNDLFVBQVUsR0FBRyxNQUFNLDZCQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBRXhHLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLE1BQU0sR0FBRyxDQUFDLENBQUM7NEJBQ3hELE9BQU8sSUFBSSxDQUFDO3lCQUNmO3FCQUNKO3lCQUFNO3dCQUNILFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7cUJBQ3ZDO29CQUVELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFM0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQy9FLElBQUksTUFBTSxFQUFFO3dCQUNSLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXNCLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQzt3QkFFeEcsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUMzQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDbEMsSUFBSSxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dDQUN4QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDNUI7eUJBQ0o7d0JBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQzFELE9BQU8sSUFBSSxDQUFDO3FCQUNmO2lCQUNKO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixRQUFRLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckUsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7YUFDSjtZQUVELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtJQUVTLHFCQUFxQixDQUFDLGVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDN0gsZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDOUIsZUFBZSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUMxRCxlQUFlLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQzlELGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNwRCxlQUFlLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQzlELGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3BFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV0RSxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFrQixJQUFJLHlCQUFXLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNuSixDQUFDO0lBRVMsU0FBUyxDQUFDLEtBQWU7UUFDL0IsSUFBSSxTQUFtQyxDQUFDO1FBRXhDLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNELFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFZixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNwQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQztxQkFBTTtvQkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUNuRTtZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRVMsa0JBQWtCLENBQUMsS0FBZTtRQUN4QyxJQUFJLFNBQW1DLENBQUM7UUFFeEMsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0QsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUVmLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ25FO2lCQUFNO2dCQUNILEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3RDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN0QzthQUNKO1NBQ0o7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRVMsd0JBQXdCLENBQUMsZUFBZ0MsRUFBRSxpQkFBMEI7UUFDM0YsZUFBZSxDQUFDLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksaUJBQWlCLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMseUdBQXlHLENBQUMsQ0FBQztZQUNoSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM3RjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBcEtELDhDQW9LQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haW4gZW5naW5lXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3N0cmluZ0hlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQYWNrYWdlSGVscGVyIH0gZnJvbSBcIi4uL2hlbHBlcnMvcGFja2FnZUhlbHBlclwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lIH0gZnJvbSBcIi4vcGlwZWxpbmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVuZ2luZUNvbW1hbmRCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcm90ZWN0ZWQgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByb3RlY3RlZCBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwcm90ZWN0ZWQgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuXG4gICAgcHJvdGVjdGVkIF9waXBlbGluZTogUGlwZWxpbmU7XG5cbiAgICBwdWJsaWMgY3JlYXRlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZywgZW5naW5lVmVyc2lvbjogc3RyaW5nLCBlbmdpbmVEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgdGhpcy5fZW5naW5lVmVyc2lvbiA9IGVuZ2luZVZlcnNpb247XG4gICAgICAgIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyA9IGVuZ2luZURlcGVuZGVuY2llcztcblxuICAgICAgICB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiL2Fzc2V0cy9cIik7XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZUNvbmZpZ3VyYXRpb24+KG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIG9sZCBjb21tYSBzZXBhcmF0ZWQgYXNzZXRzIGludG8gYW4gYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nLmNsaWVudFBhY2thZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhleGlzdGluZy5jbGllbnRQYWNrYWdlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwa2cgPSBleGlzdGluZy5jbGllbnRQYWNrYWdlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGtnLmFzc2V0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFN0cmluZ0hlbHBlci5pc1N0cmluZyhwa2cuYXNzZXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0c1N0cmluZyA9IDxzdHJpbmc+PGFueT5wa2cuYXNzZXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBrZy5hc3NldHMgPSBhc3NldHNTdHJpbmcuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBleGlzdGluZztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWRQcm9maWxlOiBVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsID0gYXdhaXQgdGhpcy5sb2FkUHJvZmlsZTxVbml0ZUNvbmZpZ3VyYXRpb24+KHVuZGVmaW5lZCwgXCJhc3NldHMvcHJvZmlsZXMvXCIsIFwiY29uZmlndXJlLmpzb25cIiwgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvYWRlZFByb2ZpbGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvYWRlZFByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKHVuaXRlQ29uZmlndXJhdGlvbiB8fCB7fSwgbG9hZGVkUHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBlKTtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZFByb2ZpbGU8VD4obW9kdWxlOiBzdHJpbmcsIGxvY2F0aW9uOiBzdHJpbmcsIHByb2ZpbGVGaWxlOiBzdHJpbmcsIHByb2ZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGlmIChsb2NhdGlvbiAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uICE9PSBudWxsICYmIHByb2ZpbGUgIT09IHVuZGVmaW5lZCAmJiBwcm9maWxlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVSb290O1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgIT09IHVuZGVmaW5lZCAmJiBtb2R1bGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVSb290ID0gYXdhaXQgUGFja2FnZUhlbHBlci5sb2NhdGUodGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fbG9nZ2VyLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbW9kdWxlUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBNb2R1bGUgZG9lcyBub3QgZXhpc3QgJyR7bW9kdWxlfSdgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUm9vdCA9IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZUxvY2F0aW9uID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShtb2R1bGVSb290LCBsb2NhdGlvbik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMocHJvZmlsZUxvY2F0aW9uLCBwcm9maWxlRmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmddOiBUIH0+KHByb2ZpbGVMb2NhdGlvbiwgcHJvZmlsZUZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVMb3dlciA9IHByb2ZpbGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb2ZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZmlsZUxvd2VyID09PSBrZXlzW2ldLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZmlsZXNba2V5c1tpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQcm9maWxlIGRvZXMgbm90IGV4aXN0ICcke3Byb2ZpbGV9J2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFJlYWRpbmcgcHJvZmlsZSBmaWxlICcke2xvY2F0aW9ufScgZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSA9IGZhbHNlO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIgPSB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVWZXJzaW9uID0gdGhpcy5fZW5naW5lVmVyc2lvbjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZURlcGVuZGVuY2llcyA9IHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcztcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldHVwRGlyZWN0b3JpZXModGhpcy5fZmlsZVN5c3RlbSwgb3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmluaXRpYWxpc2VQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlciA9IHRoaXMuX3BpcGVsaW5lLmdldFN0ZXA8SVBhY2thZ2VNYW5hZ2VyPihuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwUGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGxldCBwYXJzZWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJzZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgaW5wdXQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWFwW3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGlucHV0IGlzIG5vdCBmb3JtZWQgY29ycmVjdGx5ICcke2lucHV0fSdgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZWRNYXA7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcEZyb21BcnJheVBhcnNlcihpbnB1dDogc3RyaW5nW10pOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICBsZXQgcGFyc2VkTWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICAgICAgaWYgKGlucHV0ICE9PSB1bmRlZmluZWQgJiYgaW5wdXQgIT09IG51bGwgJiYgaW5wdXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFyc2VkTWFwID0ge307XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC5sZW5ndGggJSAyICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgaW5wdXQgaXMgbm90IGZvcm1lZCBjb3JyZWN0bHkgJyR7aW5wdXR9J2ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZE1hcFtpbnB1dFtpXV0gPSBpbnB1dFtpICsgMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZE1hcDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZGlzcGxheUNvbXBsZXRpb25NZXNzYWdlKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBzaG93UGFja2FnZVVwZGF0ZTogYm9vbGVhbikgOiB2b2lkIHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmFkZGl0aW9uYWxDb21wbGV0aW9uTWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNob3dQYWNrYWdlVXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhgUGFja2FnZXMgbWF5IGhhdmUgY2hhbmdlZCwgeW91IHNob3VsZCB1cGRhdGUgdGhlbSB1c2luZyB0aGUgZm9sbG93aW5nIGNvbW1hbmQgYmVmb3JlIHJ1bm5pbmcgYW55IHRhc2tzOmApO1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm5pbmcoYCAgICR7ZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyLmdldEluc3RhbGxDb21tYW5kKFwiXCIsIGZhbHNlKX1gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgfVxufVxuIl19
