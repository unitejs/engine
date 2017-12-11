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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBQzNFLDhFQUEyRTtBQUkzRSw0REFBeUQ7QUFHekQseUNBQXNDO0FBQ3RDLCtDQUE0QztBQUU1QztJQVdXLE1BQU0sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQixFQUFFLGtCQUE0QztRQUNqSixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO1FBRTlDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFZSxpQkFBaUIsQ0FBQyxlQUF1QixFQUFFLGFBQXFCLEVBQUUsT0FBa0MsRUFBRSxLQUFjOztZQUNoSSxJQUFJLGtCQUF5RCxDQUFDO1lBRTlELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBRWhGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FB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TyxDQUFDLEVBQUU7WUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMseUdBQXlHLENBQUMsQ0FBQztZQUNoSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFwS0QsOENBb0tDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVDb21tYW5kQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvc3RyaW5nSGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFBhY2thZ2VIZWxwZXIgfSBmcm9tIFwiLi4vaGVscGVycy9wYWNrYWdlSGVscGVyXCI7XG5pbXBvcnQgeyBJUGFja2FnZU1hbmFnZXIgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGFja2FnZU1hbmFnZXJcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmUgfSBmcm9tIFwiLi9waXBlbGluZVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi9waXBlbGluZUtleVwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW5naW5lQ29tbWFuZEJhc2Uge1xuICAgIHByb3RlY3RlZCBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByb3RlY3RlZCBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJvdGVjdGVkIF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9lbmdpbmVWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9lbmdpbmVEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgIHByb3RlY3RlZCBfZW5naW5lQXNzZXRzRm9sZGVyOiBzdHJpbmc7XG5cbiAgICBwcm90ZWN0ZWQgX3BpcGVsaW5lOiBQaXBlbGluZTtcblxuICAgIHB1YmxpYyBjcmVhdGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBlbmdpbmVWZXJzaW9uOiBzdHJpbmcsIGVuZ2luZURlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIgPSBlbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICB0aGlzLl9lbmdpbmVWZXJzaW9uID0gZW5naW5lVmVyc2lvbjtcbiAgICAgICAgdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzID0gZW5naW5lRGVwZW5kZW5jaWVzO1xuXG4gICAgICAgIHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCIvYXNzZXRzL1wiKTtcblxuICAgICAgICB0aGlzLl9waXBlbGluZSA9IG5ldyBQaXBlbGluZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBsb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgcHJvZmlsZVNvdXJjZTogc3RyaW5nLCBwcm9maWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8VW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlRXhpc3RzKG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlQ29uZmlndXJhdGlvbj4ob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgb2xkIGNvbW1hIHNlcGFyYXRlZCBhc3NldHMgaW50byBhbiBhcnJheVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmcuY2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV4aXN0aW5nLmNsaWVudFBhY2thZ2VzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGtnID0gZXhpc3RpbmcuY2xpZW50UGFja2FnZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGtnLmFzc2V0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU3RyaW5nSGVscGVyLmlzU3RyaW5nKHBrZy5hc3NldHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3NldHNTdHJpbmcgPSA8c3RyaW5nPjxhbnk+cGtnLmFzc2V0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBrZy5hc3NldHMgPSBhc3NldHNTdHJpbmcuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IGV4aXN0aW5nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlZFByb2ZpbGU6IFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwgPSBhd2FpdCB0aGlzLmxvYWRQcm9maWxlPFVuaXRlQ29uZmlndXJhdGlvbj4odW5kZWZpbmVkLCBcImFzc2V0cy9wcm9maWxlcy9cIiwgXCJjb25maWd1cmUuanNvblwiLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICBpZiAobG9hZGVkUHJvZmlsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobG9hZGVkUHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UodW5pdGVDb25maWd1cmF0aW9uIHx8IHt9LCBsb2FkZWRQcm9maWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUmVhZGluZyBleGlzdGluZyB1bml0ZS5qc29uXCIsIGUpO1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBsb2FkUHJvZmlsZTxUPihtb2R1bGU6IHN0cmluZywgbG9jYXRpb246IHN0cmluZywgcHJvZmlsZUZpbGU6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8VCB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgaWYgKGxvY2F0aW9uICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb24gIT09IG51bGwgJiYgcHJvZmlsZSAhPT0gdW5kZWZpbmVkICYmIHByb2ZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZVJvb3Q7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAhPT0gdW5kZWZpbmVkICYmIG1vZHVsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVJvb3QgPSBhd2FpdCBQYWNrYWdlSGVscGVyLmxvY2F0ZSh0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9sb2dnZXIsIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIG1vZHVsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2R1bGVSb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYE1vZHVsZSBkb2VzIG5vdCBleGlzdCAnJHttb2R1bGV9J2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVSb290ID0gdGhpcy5fZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlTG9jYXRpb24gPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG1vZHVsZVJvb3QsIGxvY2F0aW9uKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhwcm9maWxlTG9jYXRpb24sIHByb2ZpbGVGaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZ106IFQgfT4ocHJvZmlsZUxvY2F0aW9uLCBwcm9maWxlRmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZUxvd2VyID0gcHJvZmlsZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvZmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlTG93ZXIgPT09IGtleXNbaV0udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9maWxlc1trZXlzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFByb2ZpbGUgZG9lcyBub3QgZXhpc3QgJyR7cHJvZmlsZX0nYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUmVhZGluZyBwcm9maWxlIGZpbGUgJyR7bG9jYXRpb259JyBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZmFsc2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciA9IHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVZlcnNpb24gPSB0aGlzLl9lbmdpbmVWZXJzaW9uO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lRGVwZW5kZW5jaWVzID0gdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0dXBEaXJlY3Rvcmllcyh0aGlzLl9maWxlU3lzdGVtLCBvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaW5pdGlhbGlzZVBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gdGhpcy5fcGlwZWxpbmUuZ2V0U3RlcDxJUGFja2FnZU1hbmFnZXI+KG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBQYXJzZXIoaW5wdXQ6IHN0cmluZ1tdKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuXG4gICAgICAgICAgICBpbnB1dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRNYXBbcGFydHNbMF1dID0gcGFydHNbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgaW5wdXQgaXMgbm90IGZvcm1lZCBjb3JyZWN0bHkgJyR7aW5wdXR9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZE1hcDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwRnJvbUFycmF5UGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGxldCBwYXJzZWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJzZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWFwW2lucHV0W2ldXSA9IGlucHV0W2kgKyAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIHNob3dQYWNrYWdlVXBkYXRlOiBib29sZWFuKSA6IHZvaWQge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYWRkaXRpb25hbENvbXBsZXRpb25NZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm5pbmcobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2hvd1BhY2thZ2VVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKGBQYWNrYWdlcyBtYXkgaGF2ZSBjaGFuZ2VkLCB5b3Ugc2hvdWxkIHVwZGF0ZSB0aGVtIHVzaW5nIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBiZWZvcmUgcnVubmluZyBhbnkgdGFza3M6YCk7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhgICAgJHtlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuZ2V0SW5zdGFsbENvbW1hbmQoXCJcIiwgZmFsc2UpfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICB9XG59XG4iXX0=
