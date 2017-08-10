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
const tsLintConfiguration_1 = require("../../configuration/models/tslint/tsLintConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    prerequisites(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.linter === "TSLint") {
                if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                    logger.error("You can only use TSLint when the source language is TypeScript");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");
            if (uniteConfiguration.linter === "TSLint") {
                try {
                    logger.info(`Generating ${TsLint.FILENAME}`);
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, TsLint.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, TsLint.FILENAME);
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${TsLint.FILENAME} failed`, err);
                        return 1;
                    }
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TsLint.FILENAME, config);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${TsLint.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, TsLint.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new tsLintConfiguration_1.TsLintConfiguration();
        config.extends = "tslint:recommended";
        config.rulesDirectory = [];
        config.rules = {};
        if (existing) {
            config.extends = existing.extends || config.extends;
            config.rulesDirectory = existing.rulesDirectory || config.rulesDirectory;
            config.rules = existing.rules || config.rules;
        }
        if (!config.rules["object-literal-sort-keys"]) {
            config.rules["object-literal-sort-keys"] = false;
        }
        if (!config.rules["trailing-comma"]) {
            config.rules["trailing-comma"] = [
                true,
                {
                    multiline: {
                        objects: "never"
                    }
                }
            ];
        }
        if (!config.rules["no-reference"]) {
            config.rules["no-reference"] = false;
        }
        return config;
    }
}
TsLint.FILENAME = "tslint.json";
exports.TsLint = TsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSwrRkFBNEY7QUFFNUYsZ0ZBQTZFO0FBRzdFLFlBQW9CLFNBQVEsK0NBQXNCO0lBR2pDLGFBQWEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOztZQUN2RCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7WUFFeEYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBRTdDLElBQUksUUFBUSxDQUFDO29CQUNiLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzNGLEVBQUUsQ0FBQyxDQUFDLE1B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IiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGludC90c0xpbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgdHNsaW50IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVHNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90c2xpbnQvdHNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFRzTGludCBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInRzbGludC5qc29uXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJlcmVxdWlzaXRlcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJUU0xpbnRcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSAhPT0gXCJUeXBlU2NyaXB0XCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIFRTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ0c2xpbnRcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPT09IFwiVFNMaW50XCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID09PSBcIlRTTGludFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7VHNMaW50LkZJTEVOQU1FfWApO1xuXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHNMaW50LkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxUc0xpbnRDb25maWd1cmF0aW9uPihlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHNMaW50LkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtUc0xpbnQuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGV4aXN0aW5nKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFRzTGludC5GSUxFTkFNRSwgY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7VHNMaW50LkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHNMaW50LkZJTEVOQU1FKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgZXhpc3Rpbmc6IFRzTGludENvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQpOiBUc0xpbnRDb25maWd1cmF0aW9uIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IFRzTGludENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBjb25maWcuZXh0ZW5kcyA9IFwidHNsaW50OnJlY29tbWVuZGVkXCI7XG4gICAgICAgIGNvbmZpZy5ydWxlc0RpcmVjdG9yeSA9IFtdO1xuICAgICAgICBjb25maWcucnVsZXMgPSB7fTtcblxuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5leHRlbmRzID0gZXhpc3RpbmcuZXh0ZW5kcyB8fCBjb25maWcuZXh0ZW5kcztcbiAgICAgICAgICAgIGNvbmZpZy5ydWxlc0RpcmVjdG9yeSA9IGV4aXN0aW5nLnJ1bGVzRGlyZWN0b3J5IHx8IGNvbmZpZy5ydWxlc0RpcmVjdG9yeTtcbiAgICAgICAgICAgIGNvbmZpZy5ydWxlcyA9IGV4aXN0aW5nLnJ1bGVzIHx8IGNvbmZpZy5ydWxlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29uZmlnLnJ1bGVzW1wib2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXCJdKSB7XG4gICAgICAgICAgICBjb25maWcucnVsZXNbXCJvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29uZmlnLnJ1bGVzW1widHJhaWxpbmctY29tbWFcIl0pIHtcbiAgICAgICAgICAgIGNvbmZpZy5ydWxlc1tcInRyYWlsaW5nLWNvbW1hXCJdID0gW1xuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aWxpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdHM6IFwibmV2ZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29uZmlnLnJ1bGVzW1wibm8tcmVmZXJlbmNlXCJdKSB7XG4gICAgICAgICAgICBjb25maWcucnVsZXNbXCJuby1yZWZlcmVuY2VcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufVxuIl19
