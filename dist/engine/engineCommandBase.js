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
}
exports.EngineCommandBase = EngineCommandBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBQzNFLDhFQUEyRTtBQU0zRSx5Q0FBc0M7QUFDdEMsK0NBQTRDO0FBRTVDO0lBWVcsTUFBTSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QixFQUFFLGFBQXFCLEVBQUUsa0JBQTRDO1FBQ2pKLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUM7UUFFOUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVlLGlCQUFpQixDQUFDLGVBQXVCLEVBQUUsYUFBcUIsRUFBRSxPQUFrQyxFQUFFLEtBQWM7O1lBQ2hJLElBQUksa0JBQWtCLEdBQTBDLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBcUIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRW5JLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLGtCQUFr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QUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3ZDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FDSjtBQXhJRCw4Q0F3SUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9zdHJpbmdIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lIH0gZnJvbSBcIi4vcGlwZWxpbmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVuZ2luZUNvbW1hbmRCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcm90ZWN0ZWQgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByb3RlY3RlZCBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwcm90ZWN0ZWQgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcHJvZmlsZXNGb2xkZXI6IHN0cmluZztcblxuICAgIHByb3RlY3RlZCBfcGlwZWxpbmU6IFBpcGVsaW5lO1xuXG4gICAgcHVibGljIGNyZWF0ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGVuZ2luZVZlcnNpb246IHN0cmluZywgZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IGVuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIHRoaXMuX2VuZ2luZVZlcnNpb24gPSBlbmdpbmVWZXJzaW9uO1xuICAgICAgICB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXMgPSBlbmdpbmVEZXBlbmRlbmNpZXM7XG5cbiAgICAgICAgdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcIi9hc3NldHMvXCIpO1xuICAgICAgICB0aGlzLl9wcm9maWxlc0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcIi9wcm9maWxlcy9cIik7XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCA9IGF3YWl0IHRoaXMubG9hZFByb2ZpbGU8VW5pdGVDb25maWd1cmF0aW9uPihwcm9maWxlU291cmNlLCBwcm9maWxlKTtcblxuICAgICAgICBpZiAoIWZvcmNlICYmIHVuaXRlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248VW5pdGVDb25maWd1cmF0aW9uPihvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSBvbGQgY29tbWEgc2VwYXJhdGVkIGFzc2V0cyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZy5jbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXhpc3RpbmcuY2xpZW50UGFja2FnZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwa2cgPSBleGlzdGluZy5jbGllbnRQYWNrYWdlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwa2cuYXNzZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmdIZWxwZXIuaXNTdHJpbmcocGtnLmFzc2V0cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0c1N0cmluZyA9IDxzdHJpbmc+PGFueT5wa2cuYXNzZXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGtnLmFzc2V0cyA9IGFzc2V0c1N0cmluZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKHVuaXRlQ29uZmlndXJhdGlvbiwgZXhpc3RpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIGV4aXN0aW5nIHVuaXRlLmpzb25cIiwgZSk7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGxvYWRQcm9maWxlPFQ+KHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8VCB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgaWYgKHByb2ZpbGVTb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBwcm9maWxlU291cmNlICE9PSBudWxsICYmIHByb2ZpbGUgIT09IHVuZGVmaW5lZCAmJiBwcm9maWxlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBjb25maWdGaWxlID0gYCR7cHJvZmlsZVNvdXJjZX0uanNvbmA7XG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlRXhpc3RzKHRoaXMuX3Byb2ZpbGVzRm9sZGVyLCBjb25maWdGaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZ106IFQgfT4odGhpcy5fcHJvZmlsZXNGb2xkZXIsIGNvbmZpZ0ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVMb3dlciA9IHByb2ZpbGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb2ZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZmlsZUxvd2VyID09PSBrZXlzW2ldLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZmlsZXNba2V5c1tpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQcm9maWxlIGRvZXMgbm90IGV4aXN0ICcke3Byb2ZpbGV9J2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFJlYWRpbmcgcHJvZmlsZSBmaWxlICcke2NvbmZpZ0ZpbGV9JyBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZmFsc2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciA9IHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVZlcnNpb24gPSB0aGlzLl9lbmdpbmVWZXJzaW9uO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lRGVwZW5kZW5jaWVzID0gdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0dXBEaXJlY3Rvcmllcyh0aGlzLl9maWxlU3lzdGVtLCBvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaW5pdGlhbGlzZVBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gdGhpcy5fcGlwZWxpbmUuZ2V0U3RlcDxJUGFja2FnZU1hbmFnZXI+KG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBQYXJzZXIoaW5wdXQ6IHN0cmluZ1tdKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuXG4gICAgICAgICAgICBpbnB1dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRNYXBbcGFydHNbMF1dID0gcGFydHNbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgaW5wdXQgaXMgbm90IGZvcm1lZCBjb3JyZWN0bHkgJyR7aW5wdXR9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZE1hcDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwRnJvbUFycmF5UGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGxldCBwYXJzZWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJzZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWFwW2lucHV0W2ldXSA9IGlucHV0W2kgKyAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cbn1cbiJdfQ==
