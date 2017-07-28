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
const esLintConfiguration_1 = require("../../configuration/models/eslint/esLintConfiguration");
const esLintParserOptions_1 = require("../../configuration/models/eslint/esLintParserOptions");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class EsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["eslint"], uniteConfiguration.linter === "ESLint");
            if (uniteConfiguration.linter === "ESLint") {
                try {
                    if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                        throw new Error("You can only use ESLint when the source language is JavaScript");
                    }
                    _super("log").call(this, logger, display, `Generating ${EsLint.FILENAME}`);
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.rootFolder, EsLint.FILENAME);
                        }
                    }
                    catch (err) {
                        _super("error").call(this, logger, display, `Reading existing ${EsLint.FILENAME} failed`, err);
                        return 1;
                    }
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, EsLint.FILENAME, config);
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${EsLint.FILENAME} failed`, err);
                    return 1;
                }
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, EsLint.FILENAME2);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${EsLint.FILENAME2} Configuration`);
                        const lines = [];
                        lines.push("dist/*");
                        lines.push("build/*");
                        lines.push("test/unit/unit-bootstrap.js");
                        lines.push("test/unit/unit-module-config.js");
                        lines.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, EsLint.FILENAME2, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${EsLint.FILENAME2} failed`, err);
                    return 1;
                }
            }
            else {
                let ret = yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, EsLint.FILENAME);
                if (ret === 0) {
                    ret = yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, EsLint.FILENAME2);
                }
                return ret;
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new esLintConfiguration_1.EsLintConfiguration();
        engineVariables.lintExtends["eslint:recommended"] = true;
        engineVariables.lintEnv.browser = true;
        engineVariables.lintGlobals.require = true;
        config.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        config.extends = [];
        config.env = {};
        config.globals = {};
        config.rules = {};
        config.plugins = [];
        if (existing) {
            Object.assign(config, existing);
        }
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.parserOptions.ecmaFeatures = {};
        for (const key in engineVariables.lintFeatures) {
            if (engineVariables.lintFeatures[key].required) {
                config.parserOptions.ecmaFeatures[key] = engineVariables.lintFeatures[key].object;
            }
            else {
                if (config.parserOptions.ecmaFeatures[key]) {
                    delete config.parserOptions.ecmaFeatures[key];
                }
            }
        }
        for (const key in engineVariables.lintPlugins) {
            const idx = config.plugins.indexOf(key);
            if (engineVariables.lintPlugins[key]) {
                if (idx < 0) {
                    config.plugins.push(key);
                }
            }
            else {
                if (idx >= 0) {
                    config.plugins.splice(idx, 1);
                }
            }
        }
        for (const key in engineVariables.lintExtends) {
            const idx = config.extends.indexOf(key);
            if (engineVariables.lintExtends[key]) {
                if (idx < 0) {
                    config.extends.push(key);
                }
            }
            else {
                if (idx >= 0) {
                    config.extends.splice(idx, 1);
                }
            }
        }
        for (const key in engineVariables.lintEnv) {
            if (engineVariables.lintEnv[key]) {
                config.env[key] = true;
            }
            else {
                if (config.env[key]) {
                    delete config.env[key];
                }
            }
        }
        for (const key in engineVariables.lintGlobals) {
            if (engineVariables.lintGlobals[key]) {
                config.globals[key] = true;
            }
            else {
                if (config.globals[key]) {
                    delete config.globals[key];
                }
            }
        }
        return config;
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSwrRkFBNEY7QUFDNUYsK0ZBQTRGO0FBRTVGLGdGQUE2RTtBQUc3RSxZQUFvQixTQUFRLCtDQUFzQjtJQUlqQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUV4RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBRTVELElBQUksUUFBUSxDQUFDO29CQUNiLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBc0IsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9HLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFD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Q0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7QUFoSmMsZUFBUSxHQUFXLGdCQUFnQixDQUFDO0FBQ3BDLGdCQUFTLEdBQVcsZUFBZSxDQUFDO0FBRnZELHdCQWtKQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
