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
 * Pipeline step to generate eslint configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const esLintConfiguration_1 = require("../../configuration/models/eslint/esLintConfiguration");
const esLintParserOptions_1 = require("../../configuration/models/eslint/esLintParserOptions");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class EsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.linter === "ESLint") {
                if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                    logger.error("You can only use ESLint when the source language is JavaScript");
                    return 1;
                }
                logger.info(`Initialising ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                if (!engineVariables.force) {
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, EsLint.FILENAME);
                        if (exists) {
                            this._configuration = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, EsLint.FILENAME);
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${EsLint.FILENAME} failed`, err);
                        return 1;
                    }
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, EsLint.FILENAME2);
                        if (exists) {
                            this._ignore = yield fileSystem.fileReadLines(engineVariables.wwwRootFolder, EsLint.FILENAME2);
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${EsLint.FILENAME} failed`, err);
                        return 1;
                    }
                }
                this.configDefaults(engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["eslint"], uniteConfiguration.linter === "ESLint");
            if (uniteConfiguration.linter === "ESLint") {
                try {
                    logger.info(`Generating ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, EsLint.FILENAME, this._configuration);
                }
                catch (err) {
                    logger.error(`Generating ${EsLint.FILENAME} failed`, err);
                    return 1;
                }
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2);
                    if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                        logger.info(`Generating ${EsLint.FILENAME2} Configuration`, { wwwFolder: engineVariables.wwwRootFolder });
                        this._ignore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, EsLint.FILENAME2, this._ignore);
                    }
                    else {
                        logger.info(`Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${EsLint.FILENAME2} failed`, err);
                    return 1;
                }
            }
            else {
                let ret = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME, engineVariables.force);
                if (ret === 0) {
                    ret = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2, engineVariables.force);
                }
                return ret;
            }
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new esLintConfiguration_1.EsLintConfiguration();
        defaultConfiguration.parser = "espree";
        defaultConfiguration.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        defaultConfiguration.parserOptions.ecmaVersion = 6;
        defaultConfiguration.parserOptions.sourceType = "module";
        defaultConfiguration.parserOptions.ecmaFeatures = {};
        defaultConfiguration.extends = ["eslint:recommended"];
        defaultConfiguration.env = {
            browser: true
        };
        defaultConfiguration.globals = {
            require: true
        };
        defaultConfiguration.rules = {};
        defaultConfiguration.plugins = [];
        const defaultIgnore = [
            "dist/*",
            "build/*",
            "test/unit/unit-bootstrap.js",
            "test/unit/unit-module-config.js"
        ];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._ignore = objectHelper_1.ObjectHelper.merge(defaultIgnore, this._ignore);
        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }
        for (let i = this._ignore.length - 1; i >= 0; i--) {
            if (this._ignore[i].trim().length === 0) {
                this._ignore.splice(i, 1);
            }
        }
        engineVariables.setConfiguration("ESLint", this._configuration);
        engineVariables.setConfiguration("ESLint.Ignore", this._ignore);
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDhFQUEyRTtBQUczRSwrRkFBNEY7QUFDNUYsK0ZBQTRGO0FBRTVGLGdGQUE2RTtBQUc3RSxZQUFvQixTQUFRLCtDQUFzQjtJQU9qQyxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDcEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRTdGLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzNGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXNCLGVBQWUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM3SCxDQUFDO29CQUNMLENBQUM7b0JBQUMsS0FBSyxDQUFDLENB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QUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFFRCxlQUFlLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDOztBQWhJYyxlQUFRLEdBQVcsZ0JBQWdCLENBQUM7QUFDcEMsZ0JBQVMsR0FBVyxlQUFlLENBQUM7QUFGdkQsd0JBa0lDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGludC9lc0xpbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgZXNsaW50IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVzTGludFBhcnNlck9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludFBhcnNlck9wdGlvbnNcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFc0xpbnQgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCIuZXNsaW50cmMuanNvblwiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FMjogc3RyaW5nID0gXCIuZXNsaW50aWdub3JlXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBFc0xpbnRDb25maWd1cmF0aW9uO1xuICAgIHByaXZhdGUgX2lnbm9yZTogc3RyaW5nW107XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSAhPT0gXCJKYXZhU2NyaXB0XCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIEVTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEluaXRpYWxpc2luZyAke0VzTGludC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGlmICghZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBFc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248RXNMaW50Q29uZmlndXJhdGlvbj4oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7RXNMaW50LkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRTIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZ25vcmUgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkTGluZXMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRTIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke0VzTGludC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiZXNsaW50XCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID09PSBcIkVTTGludFwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0VzTGludC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRSwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtFc0xpbnQuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgRXNMaW50LkZJTEVOQU1FMik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtFc0xpbnQuRklMRU5BTUUyfSBDb25maWd1cmF0aW9uYCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIjIFwiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgRXNMaW50LkZJTEVOQU1FMiwgdGhpcy5faWdub3JlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtFc0xpbnQuRklMRU5BTUUyfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7RXNMaW50LkZJTEVOQU1FMn0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRTIsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEVzTGludENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXIgPSBcImVzcHJlZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zID0gbmV3IEVzTGludFBhcnNlck9wdGlvbnMoKTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyT3B0aW9ucy5lY21hVmVyc2lvbiA9IDY7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuc291cmNlVHlwZSA9IFwibW9kdWxlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuZWNtYUZlYXR1cmVzID0ge307XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXh0ZW5kcyA9IFtcImVzbGludDpyZWNvbW1lbmRlZFwiXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZW52ID0ge1xuICAgICAgICAgICAgYnJvd3NlcjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5nbG9iYWxzID0ge1xuICAgICAgICAgICAgcmVxdWlyZTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5ydWxlcyA9IHt9O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW107XG5cbiAgICAgICAgY29uc3QgZGVmYXVsdElnbm9yZSA9IFtcbiAgICAgICAgICAgIFwiZGlzdC8qXCIsXG4gICAgICAgICAgICBcImJ1aWxkLypcIixcbiAgICAgICAgICAgIFwidGVzdC91bml0L3VuaXQtYm9vdHN0cmFwLmpzXCIsXG4gICAgICAgICAgICBcInRlc3QvdW5pdC91bml0LW1vZHVsZS1jb25maWcuanNcIlxuICAgICAgICBdO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB0aGlzLl9pZ25vcmUgPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdElnbm9yZSwgdGhpcy5faWdub3JlKTtcblxuICAgICAgICBjb25zdCBtYXJrZXJMaW5lID0gc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIiMgXCIsIFwiXCIpO1xuICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9pZ25vcmUuaW5kZXhPZihtYXJrZXJMaW5lKTtcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9pZ25vcmUuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2lnbm9yZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lnbm9yZVtpXS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faWdub3JlLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiRVNMaW50XCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkVTTGludC5JZ25vcmVcIiwgdGhpcy5faWdub3JlKTtcbiAgICB9XG59XG4iXX0=
