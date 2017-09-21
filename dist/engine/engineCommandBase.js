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
    create(logger, fileSystem, engineRootFolder, enginePackageJson) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._enginePackageJson = enginePackageJson;
        this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");
        this._profilesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, "/profiles/");
        this._pipelineStepFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/pipelineSteps");
        this._pipeline = new pipeline_1.Pipeline(this._logger, this._fileSystem, this._pipelineStepFolder);
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
        engineVariables.enginePackageJson = this._enginePackageJson;
        engineVariables.setupDirectories(this._fileSystem, outputDirectory);
        engineVariables.initialisePackages(uniteConfiguration.clientPackages);
        engineVariables.packageManager = this._pipeline.getStep(new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager));
    }
    mapParser(input) {
        let parsedMap;
        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};
            const splitAdditions = input.split(";");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTzNFLHlDQUFzQztBQUN0QywrQ0FBNEM7QUFFNUM7SUFZVyxNQUFNLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsaUJBQXVDO1FBQ3JILElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFFNUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFFdEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFZSxpQkFBaUIsQ0FBQyxlQUF1QixFQUFFLGFBQXFCLEVBQUUsT0FBa0MsRUFBRSxLQUFjOztZQUNoSSxJQUFJLGtCQUFrQixHQUEwQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQXFCLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVu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QUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUF4R0QsOENBd0dDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVDb21tYW5kQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZSB9IGZyb20gXCIuL3BpcGVsaW5lXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuL3BpcGVsaW5lS2V5XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbmdpbmVDb21tYW5kQmFzZSB7XG4gICAgcHJvdGVjdGVkIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJvdGVjdGVkIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcm90ZWN0ZWQgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX2VuZ2luZVBhY2thZ2VKc29uOiBQYWNrYWdlQ29uZmlndXJhdGlvbjtcblxuICAgIHByb3RlY3RlZCBfZW5naW5lQXNzZXRzRm9sZGVyOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wcm9maWxlc0ZvbGRlcjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcGlwZWxpbmVTdGVwRm9sZGVyOiBzdHJpbmc7XG5cbiAgICBwcm90ZWN0ZWQgX3BpcGVsaW5lOiBQaXBlbGluZTtcblxuICAgIHB1YmxpYyBjcmVhdGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBlbmdpbmVQYWNrYWdlSnNvbjogUGFja2FnZUNvbmZpZ3VyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IGVuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uID0gZW5naW5lUGFja2FnZUpzb247XG5cbiAgICAgICAgdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcIi9hc3NldHMvXCIpO1xuICAgICAgICB0aGlzLl9wcm9maWxlc0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcIi9wcm9maWxlcy9cIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lU3RlcEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L3BpcGVsaW5lU3RlcHNcIik7XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9waXBlbGluZVN0ZXBGb2xkZXIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBsb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgcHJvZmlsZVNvdXJjZTogc3RyaW5nLCBwcm9maWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8VW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsID0gYXdhaXQgdGhpcy5sb2FkUHJvZmlsZTxVbml0ZUNvbmZpZ3VyYXRpb24+KHByb2ZpbGVTb3VyY2UsIHByb2ZpbGUpO1xuXG4gICAgICAgIGlmICghZm9yY2UgJiYgdW5pdGVDb25maWd1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZUNvbmZpZ3VyYXRpb24+KG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZSh1bml0ZUNvbmZpZ3VyYXRpb24sIGV4aXN0aW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUmVhZGluZyBleGlzdGluZyB1bml0ZS5qc29uXCIsIGUpO1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBsb2FkUHJvZmlsZTxUPihwcm9maWxlU291cmNlOiBzdHJpbmcsIHByb2ZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGlmIChwcm9maWxlU291cmNlICE9PSB1bmRlZmluZWQgJiYgcHJvZmlsZVNvdXJjZSAhPT0gbnVsbCAmJiBwcm9maWxlICE9PSB1bmRlZmluZWQgJiYgcHJvZmlsZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnRmlsZSA9IGAke3Byb2ZpbGVTb3VyY2V9Lmpzb25gO1xuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyh0aGlzLl9wcm9maWxlc0ZvbGRlciwgY29uZmlnRmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmddOiBUIH0+KHRoaXMuX3Byb2ZpbGVzRm9sZGVyLCBjb25maWdGaWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlTG93ZXIgPSBwcm9maWxlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9maWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGVMb3dlciA9PT0ga2V5c1tpXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2ZpbGVzW2tleXNbaV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUHJvZmlsZSBkb2VzIG5vdCBleGlzdCAnJHtwcm9maWxlfSdgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBSZWFkaW5nIHByb2ZpbGUgZmlsZSAnJHtjb25maWdGaWxlfScgZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSA9IGZhbHNlO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIgPSB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVQYWNrYWdlSnNvbiA9IHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0dXBEaXJlY3Rvcmllcyh0aGlzLl9maWxlU3lzdGVtLCBvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaW5pdGlhbGlzZVBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gdGhpcy5fcGlwZWxpbmUuZ2V0U3RlcDxJUGFja2FnZU1hbmFnZXI+KG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBQYXJzZXIoaW5wdXQ6IHN0cmluZyk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGxldCBwYXJzZWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJzZWRNYXAgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHNwbGl0QWRkaXRpb25zID0gaW5wdXQuc3BsaXQoXCI7XCIpO1xuXG4gICAgICAgICAgICBzcGxpdEFkZGl0aW9ucy5mb3JFYWNoKHNwbGl0QWRkaXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gc3BsaXRBZGRpdGlvbi5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRNYXBbcGFydHNbMF1dID0gcGFydHNbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgaW5wdXQgaXMgbm90IGZvcm1lZCBjb3JyZWN0bHkgJyR7aW5wdXR9J2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZE1hcDtcbiAgICB9XG59XG4iXX0=
