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
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.linter === "ESLint") {
                if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                    logger.error("You can only use ESLint when the source language is JavaScript");
                    return 1;
                }
                logger.info(`Initialising ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
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
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${EsLint.FILENAME2} Configuration`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        lines.push("dist/*");
                        lines.push("build/*");
                        lines.push("test/unit/unit-bootstrap.js");
                        lines.push("test/unit/unit-module-config.js");
                        lines.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, EsLint.FILENAME2, lines);
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
                let ret = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME);
                if (ret === 0) {
                    ret = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2);
                }
                return ret;
            }
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new esLintConfiguration_1.EsLintConfiguration();
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
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("ESLint", this._configuration);
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDhFQUEyRTtBQUczRSwrRkFBNEY7QUFDNUYsK0ZBQTRGO0FBRTVGLGdGQUE2RTtBQUc3RSxZQUFvQixTQUFRLCtDQUFzQjtJQU1qQyxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDcEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRTdGLElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzNGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXNCLGVBQWUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM3SCxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixN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QyxnQkFBUyxHQUFXLGVBQWUsQ0FBQztBQUZ2RCx3QkFzR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9saW50L2VzTGludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBlc2xpbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRXNMaW50UGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50UGFyc2VyT3B0aW9uc1wiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEVzTGludCBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5lc2xpbnRyYy5qc29uXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUUyOiBzdHJpbmcgPSBcIi5lc2xpbnRpZ25vcmVcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEVzTGludENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJlUHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSAhPT0gXCJKYXZhU2NyaXB0XCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIEVTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEluaXRpYWxpc2luZyAke0VzTGludC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBFc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPEVzTGludENvbmZpZ3VyYXRpb24+KGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBFc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke0VzTGludC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImVzbGludFwiXSwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPT09IFwiRVNMaW50XCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtFc0xpbnQuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBFc0xpbnQuRklMRU5BTUUsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7RXNMaW50LkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHN1cGVyLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRTIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0VzTGludC5GSUxFTkFNRTJ9IENvbmZpZ3VyYXRpb25gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChcImRpc3QvKlwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChcImJ1aWxkLypcIik7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ0ZXN0L3VuaXQvdW5pdC1ib290c3RyYXAuanNcIik7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ0ZXN0L3VuaXQvdW5pdC1tb2R1bGUtY29uZmlnLmpzXCIpO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIjIFwiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgRXNMaW50LkZJTEVOQU1FMiwgbGluZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke0VzTGludC5GSUxFTkFNRTJ9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtFc0xpbnQuRklMRU5BTUUyfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgRXNMaW50LkZJTEVOQU1FKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEVzTGludC5GSUxFTkFNRTIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBFc0xpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyT3B0aW9ucyA9IG5ldyBFc0xpbnRQYXJzZXJPcHRpb25zKCk7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuZWNtYVZlcnNpb24gPSA2O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLnNvdXJjZVR5cGUgPSBcIm1vZHVsZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLmVjbWFGZWF0dXJlcyA9IHt9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmV4dGVuZHMgPSBbXCJlc2xpbnQ6cmVjb21tZW5kZWRcIl07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVudiA9IHtcbiAgICAgICAgICAgIGJyb3dzZXI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZ2xvYmFscyA9IHtcbiAgICAgICAgICAgIHJlcXVpcmU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGx1Z2lucyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiRVNMaW50XCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
