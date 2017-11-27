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
                            Object.keys(existing.clientPackages).forEach(key => {
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
                    const moduleRoot = module !== undefined && module.length > 0 ?
                        this._fileSystem.pathCombine(this._engineRootFolder, `node_modules/${module}`) : this._engineRootFolder;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBQzNFLDhFQUEyRTtBQU0zRSx5Q0FBc0M7QUFDdEMsK0NBQTRDO0FBRTVDO0lBV1csTUFBTSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QixFQUFFLGFBQXFCLEVBQUUsa0JBQTRDO1FBQ2pKLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUM7UUFFOUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVlLGlCQUFpQixDQUFDLGVBQXVCLEVBQUUsYUFBcUIsRUFBRSxPQUFrQyxFQUFFLEtBQWM7O1lBQ2hJLElBQUksa0JBQXlELENBQUM7WUFFOUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFaEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3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LEVBQUUsQ0FBQyxDQUFDO1FBQzlGLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQTNKRCw4Q0EySkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9zdHJpbmdIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lIH0gZnJvbSBcIi4vcGlwZWxpbmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVuZ2luZUNvbW1hbmRCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcm90ZWN0ZWQgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByb3RlY3RlZCBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwcm90ZWN0ZWQgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuXG4gICAgcHJvdGVjdGVkIF9waXBlbGluZTogUGlwZWxpbmU7XG5cbiAgICBwdWJsaWMgY3JlYXRlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZywgZW5naW5lVmVyc2lvbjogc3RyaW5nLCBlbmdpbmVEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgdGhpcy5fZW5naW5lVmVyc2lvbiA9IGVuZ2luZVZlcnNpb247XG4gICAgICAgIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyA9IGVuZ2luZURlcGVuZGVuY2llcztcblxuICAgICAgICB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiL2Fzc2V0cy9cIik7XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZUNvbmZpZ3VyYXRpb24+KG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIG9sZCBjb21tYSBzZXBhcmF0ZWQgYXNzZXRzIGludG8gYW4gYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nLmNsaWVudFBhY2thZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhleGlzdGluZy5jbGllbnRQYWNrYWdlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBrZyA9IGV4aXN0aW5nLmNsaWVudFBhY2thZ2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBrZy5hc3NldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFN0cmluZ0hlbHBlci5pc1N0cmluZyhwa2cuYXNzZXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzZXRzU3RyaW5nID0gPHN0cmluZz48YW55PnBrZy5hc3NldHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwa2cuYXNzZXRzID0gYXNzZXRzU3RyaW5nLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBleGlzdGluZztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWRQcm9maWxlOiBVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsID0gYXdhaXQgdGhpcy5sb2FkUHJvZmlsZTxVbml0ZUNvbmZpZ3VyYXRpb24+KHVuZGVmaW5lZCwgXCJhc3NldHMvcHJvZmlsZXMvXCIsIFwiY29uZmlndXJlLmpzb25cIiwgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvYWRlZFByb2ZpbGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvYWRlZFByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKHVuaXRlQ29uZmlndXJhdGlvbiB8fCB7fSwgbG9hZGVkUHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBlKTtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZFByb2ZpbGU8VD4obW9kdWxlOiBzdHJpbmcsIGxvY2F0aW9uOiBzdHJpbmcsIHByb2ZpbGVGaWxlOiBzdHJpbmcsIHByb2ZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGlmIChsb2NhdGlvbiAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uICE9PSBudWxsICYmIHByb2ZpbGUgIT09IHVuZGVmaW5lZCAmJiBwcm9maWxlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZVJvb3QgPSBtb2R1bGUgIT09IHVuZGVmaW5lZCAmJiBtb2R1bGUubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgYG5vZGVfbW9kdWxlcy8ke21vZHVsZX1gKSA6IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXI7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlTG9jYXRpb24gPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG1vZHVsZVJvb3QsIGxvY2F0aW9uKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhwcm9maWxlTG9jYXRpb24sIHByb2ZpbGVGaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZ106IFQgfT4ocHJvZmlsZUxvY2F0aW9uLCBwcm9maWxlRmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZUxvd2VyID0gcHJvZmlsZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvZmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlTG93ZXIgPT09IGtleXNbaV0udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9maWxlc1trZXlzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFByb2ZpbGUgZG9lcyBub3QgZXhpc3QgJyR7cHJvZmlsZX0nYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUmVhZGluZyBwcm9maWxlIGZpbGUgJyR7bG9jYXRpb259JyBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZmFsc2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciA9IHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVZlcnNpb24gPSB0aGlzLl9lbmdpbmVWZXJzaW9uO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lRGVwZW5kZW5jaWVzID0gdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0dXBEaXJlY3Rvcmllcyh0aGlzLl9maWxlU3lzdGVtLCBvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaW5pdGlhbGlzZVBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gdGhpcy5fcGlwZWxpbmUuZ2V0U3RlcDxJUGFja2FnZU1hbmFnZXI+KG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBQYXJzZXIoaW5wdXQ6IHN0cmluZ1tdKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuXG4gICAgICAgICAgICBpbnB1dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRNYXBbcGFydHNbMF1dID0gcGFydHNbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgaW5wdXQgaXMgbm90IGZvcm1lZCBjb3JyZWN0bHkgJyR7aW5wdXR9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZE1hcDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwRnJvbUFycmF5UGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGxldCBwYXJzZWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJzZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWFwW2lucHV0W2ldXSA9IGlucHV0W2kgKyAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIHNob3dQYWNrYWdlVXBkYXRlOiBib29sZWFuKSA6IHZvaWQge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYWRkaXRpb25hbENvbXBsZXRpb25NZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm5pbmcobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2hvd1BhY2thZ2VVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKGBQYWNrYWdlcyBtYXkgaGF2ZSBjaGFuZ2VkLCB5b3Ugc2hvdWxkIHVwZGF0ZSB0aGVtIHVzaW5nIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBiZWZvcmUgcnVubmluZyBhbnkgdGFza3M6YCk7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhgICAgJHtlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuZ2V0SW5zdGFsbENvbW1hbmQoXCJcIiwgZmFsc2UpfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICB9XG59XG4iXX0=
