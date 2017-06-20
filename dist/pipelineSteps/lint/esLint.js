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
const esLintConfiguration_1 = require("../../configuration/models/eslint/esLintConfiguration");
const esLintParserOptions_1 = require("../../configuration/models/eslint/esLintParserOptions");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class EsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.linter === "ESLint") {
                try {
                    if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                        throw new Error("You can only use ESLint when the source language is JavaScript");
                    }
                    _super("log").call(this, logger, display, "Generating ESLint Configuration");
                    engineVariables.requiredDevDependencies.push("gulp-eslint");
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, ".eslintrc.json", config);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating ESLint Configuration failed", err);
                    return 1;
                }
            }
            else {
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, ".eslintrc.json");
                    if (exists) {
                        yield fileSystem.fileDelete(engineVariables.rootFolder, ".eslintrc.json");
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Deleting ESLint Configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables) {
        const config = new esLintConfiguration_1.EsLintConfiguration();
        config.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.extends = "eslint:recommended";
        config.env = {};
        config.env.browser = true;
        if (uniteConfiguration.unitTestFramework === "Jasmine") {
            config.env.jasmine = true;
        }
        else if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
        }
        config.globals = {};
        config.rules = {};
        return config;
    }
}
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvbGludC9lc0xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0ZBQTRGO0FBQzVGLCtGQUE0RjtBQUU1RixnRkFBNkU7QUFNN0UsWUFBb0IsU0FBUSwrQ0FBc0I7SUFDakMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUU7b0JBRTlELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRTVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO29CQUNwRixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFFckYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO29CQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3pGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDOUUsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO29CQUMxRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3BILE1BQU0sTUFBTSxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUV6QyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUNqRCxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUM7UUFDdEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDNUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBdkRELHdCQXVEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
