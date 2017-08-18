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
 * Pipeline step to generate tslint configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const tsLintConfiguration_1 = require("../../configuration/models/tslint/tsLintConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.linter === "TSLint") {
                if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                    logger.error("You can only use TSLint when the source language is TypeScript");
                    return 1;
                }
                logger.info(`Initialising ${TsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, TsLint.FILENAME);
                    if (exists) {
                        this._configuration = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, TsLint.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${TsLint.FILENAME} failed`, err);
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
            engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");
            if (uniteConfiguration.linter === "TSLint") {
                try {
                    logger.info(`Generating ${TsLint.FILENAME}`);
                    this.configFinalise();
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TsLint.FILENAME, this._configuration);
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
    configDefaults(engineVariables) {
        const defaultConfiguration = new tsLintConfiguration_1.TsLintConfiguration();
        defaultConfiguration.extends = "tslint:recommended";
        defaultConfiguration.rulesDirectory = [];
        defaultConfiguration.rules = {};
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("TSLint", this._configuration);
    }
    configFinalise() {
        if (!this._configuration.rules["object-literal-sort-keys"]) {
            this._configuration.rules["object-literal-sort-keys"] = false;
        }
        if (!this._configuration.rules["trailing-comma"]) {
            this._configuration.rules["trailing-comma"] = [
                true,
                {
                    multiline: {
                        objects: "never"
                    }
                }
            ];
        }
        if (!this._configuration.rules["no-reference"]) {
            this._configuration.rules["no-reference"] = false;
        }
    }
}
TsLint.FILENAME = "tslint.json";
exports.TsLint = TsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDhFQUEyRTtBQUczRSwrRkFBNEY7QUFFNUYsZ0ZBQTZFO0FBRzdFLFlBQW9CLFNBQVEsK0NBQXNCO0lBS2pDLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOztZQUNwRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFFN0YsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDM0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBc0IsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzdILENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLE1BQU0sQ0FBQyxRQUFR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OztBQWxGYyxlQUFRLEdBQVcsYUFBYSxDQUFDO0FBRHBELHdCQW9GQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHRzbGludCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBUc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3RzbGludC90c0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgVHNMaW50IGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwidHNsaW50Lmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFRzTGludENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJlUHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJUU0xpbnRcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSAhPT0gXCJUeXBlU2NyaXB0XCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIFRTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEluaXRpYWxpc2luZyAke1RzTGludC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFRzTGludENvbmZpZ3VyYXRpb24+KGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke1RzTGludC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInRzbGludFwiXSwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJUU0xpbnRcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPT09IFwiVFNMaW50XCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtUc0xpbnQuRklMRU5BTUV9YCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0ZpbmFsaXNlKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUc0xpbnQuRklMRU5BTUUsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtUc0xpbnQuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUc0xpbnQuRklMRU5BTUUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBUc0xpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXh0ZW5kcyA9IFwidHNsaW50OnJlY29tbWVuZGVkXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJ1bGVzRGlyZWN0b3J5ID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJ1bGVzID0ge307XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJUU0xpbnRcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdGaW5hbGlzZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb25maWd1cmF0aW9uLnJ1bGVzW1wib2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXCJdKSB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLnJ1bGVzW1wib2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXCJdID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2NvbmZpZ3VyYXRpb24ucnVsZXNbXCJ0cmFpbGluZy1jb21tYVwiXSkge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5ydWxlc1tcInRyYWlsaW5nLWNvbW1hXCJdID0gW1xuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aWxpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdHM6IFwibmV2ZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fY29uZmlndXJhdGlvbi5ydWxlc1tcIm5vLXJlZmVyZW5jZVwiXSkge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5ydWxlc1tcIm5vLXJlZmVyZW5jZVwiXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
