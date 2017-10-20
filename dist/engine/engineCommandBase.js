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
        this._profilesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, "/profiles/");
        this._pipeline = new pipeline_1.Pipeline(this._logger, this._fileSystem, this._engineRootFolder);
    }
    loadConfiguration(outputDirectory, profileSource, profile, force) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration = yield this.loadProfile(profileSource, profile);
            if (!force && uniteConfiguration !== null) {
                try {
                    const exists = yield this._fileSystem.fileExists(outputDirectory, "unite.json");
                    if (exists) {
                        const existing = yield this._fileSystem.fileReadJson(outputDirectory, "unite.json");
                        uniteConfiguration = objectHelper_1.ObjectHelper.merge(uniteConfiguration, existing);
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
    loadProfile(profileSource, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (profileSource !== undefined && profileSource !== null && profile !== undefined && profile !== null) {
                const configFile = `${profileSource}.json`;
                try {
                    const exists = yield this._fileSystem.fileExists(this._profilesFolder, configFile);
                    if (exists) {
                        const profiles = yield this._fileSystem.fileReadJson(this._profilesFolder, configFile);
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
                    this._logger.error(`Reading profile file '${configFile}' failed`, err);
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
            const splitAdditions = input.split(",");
            splitAdditions.forEach(splitAddition => {
                const parts = splitAddition.split("=");
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
}
exports.EngineCommandBase = EngineCommandBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLHlDQUFzQztBQUN0QywrQ0FBNEM7QUFFNUM7SUFZVyxNQUFNLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsYUFBcUIsRUFBRSxrQkFBNEM7UUFDakosSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQztRQUU5QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRWUsaUJBQWlCLENBQUMsZUFBdUIsRUFBRSxhQUFxQixFQUFFLE9BQWtDLEVBQUUsS0FBYzs7WUFDaEksSUFBSSxrQkFBa0IsR0FBMEMsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFxQixhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFbkksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUVoRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNULE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXFCLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFFeEcsa0JBQWtCLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzFFLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLGtCQUFrQixDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUVlLFdBQVcsQ0FBSSxhQUFxQixFQUFFLE9BQWtDOztZQUNwRixFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckcsTUFBTSxVQUFVLEdBQUcsR0FBRyxhQUFhLE9BQU8sQ0FBQztnQkFDM0MsSUFBSSxDQUFDO29CQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDbkYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFzQixJQUFJLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUU1RyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQzNDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ25DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUNuQyxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDN0IsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNoQixDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsVUFBVSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO0tBQUE7SUFFUyxxQkFBcUIsQ0FBQyxlQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDO1FBQzdILGVBQWUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzlCLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDMUQsZUFBZSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUM5RCxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDcEQsZUFBZSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUM5RCxlQUFlLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNwRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdEUsZUFBZSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBa0IsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDbkosQ0FBQztJQUVTLFNBQVMsQ0FBQyxLQUFhO1FBQzdCLElBQUksU0FBbUMsQ0FBQztRQUV4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDZixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ25DLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUF6R0QsOENBeUdDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVDb21tYW5kQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lIH0gZnJvbSBcIi4vcGlwZWxpbmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVuZ2luZUNvbW1hbmRCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcm90ZWN0ZWQgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByb3RlY3RlZCBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwcm90ZWN0ZWQgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcHJvZmlsZXNGb2xkZXI6IHN0cmluZztcblxuICAgIHByb3RlY3RlZCBfcGlwZWxpbmU6IFBpcGVsaW5lO1xuXG4gICAgcHVibGljIGNyZWF0ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGVuZ2luZVZlcnNpb246IHN0cmluZywgZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IGVuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIHRoaXMuX2VuZ2luZVZlcnNpb24gPSBlbmdpbmVWZXJzaW9uO1xuICAgICAgICB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXMgPSBlbmdpbmVEZXBlbmRlbmNpZXM7XG5cbiAgICAgICAgdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcIi9hc3NldHMvXCIpO1xuICAgICAgICB0aGlzLl9wcm9maWxlc0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcIi9wcm9maWxlcy9cIik7XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDb25maWd1cmF0aW9uPihwcm9maWxlU291cmNlLCBwcm9maWxlKTtcblxuICAgICAgICBpZiAoIWZvcmNlICYmIHVuaXRlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248VW5pdGVDb25maWd1cmF0aW9uPihvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UodW5pdGVDb25maWd1cmF0aW9uLCBleGlzdGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBlKTtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZFByb2ZpbGU8VD4ocHJvZmlsZVNvdXJjZTogc3RyaW5nLCBwcm9maWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICBpZiAocHJvZmlsZVNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIHByb2ZpbGVTb3VyY2UgIT09IG51bGwgJiYgcHJvZmlsZSAhPT0gdW5kZWZpbmVkICYmIHByb2ZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSBgJHtwcm9maWxlU291cmNlfS5qc29uYDtcbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHModGhpcy5fcHJvZmlsZXNGb2xkZXIsIGNvbmZpZ0ZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZXMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nXTogVCB9Pih0aGlzLl9wcm9maWxlc0ZvbGRlciwgY29uZmlnRmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZUxvd2VyID0gcHJvZmlsZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvZmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlTG93ZXIgPT09IGtleXNbaV0udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9maWxlc1trZXlzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFByb2ZpbGUgZG9lcyBub3QgZXhpc3QgJyR7cHJvZmlsZX0nYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUmVhZGluZyBwcm9maWxlIGZpbGUgJyR7Y29uZmlnRmlsZX0nIGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UgPSBmYWxzZTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9lbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lVmVyc2lvbiA9IHRoaXMuX2VuZ2luZVZlcnNpb247XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVEZXBlbmRlbmNpZXMgPSB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXM7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXR1cERpcmVjdG9yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5pbml0aWFsaXNlUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIgPSB0aGlzLl9waXBlbGluZS5nZXRTdGVwPElQYWNrYWdlTWFuYWdlcj4obmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcFBhcnNlcihpbnB1dDogc3RyaW5nKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuICAgICAgICAgICAgY29uc3Qgc3BsaXRBZGRpdGlvbnMgPSBpbnB1dC5zcGxpdChcIixcIik7XG5cbiAgICAgICAgICAgIHNwbGl0QWRkaXRpb25zLmZvckVhY2goc3BsaXRBZGRpdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSBzcGxpdEFkZGl0aW9uLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZE1hcFtwYXJ0c1swXV0gPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cbn1cbiJdfQ==
