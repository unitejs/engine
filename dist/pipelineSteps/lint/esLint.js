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
            engineVariables.toggleDependencies(["eslint"], uniteConfiguration.linter === "ESLint", true);
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
                        return 0;
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
        config.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.extends = "eslint:recommended";
        config.env = {};
        config.globals = {};
        config.rules = {};
        config.plugins = [];
        if (existing) {
            config.globals = existing.globals || config.globals;
            config.rules = existing.rules || config.rules;
            config.env = existing.env || config.env;
            config.extends = existing.extends || config.extends;
            config.plugins = existing.plugins || config.plugins;
        }
        config.env.browser = true;
        config.globals.require = true;
        if (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine") {
            config.env.jasmine = true;
        }
        else {
            if (config.env.jasmine) {
                delete config.env.jasmine;
            }
        }
        if (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
        }
        else {
            if (config.env.mocha) {
                delete config.env.mocha;
            }
        }
        if (uniteConfiguration.e2eTestRunner === "Protractor") {
            config.env.protractor = true;
        }
        else {
            if (config.env.protractor) {
                delete config.env.protractor;
            }
        }
        engineVariables.toggleDependencies(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO", true);
        const idx = config.plugins.indexOf("webdriverio");
        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            if (idx < 0) {
                config.plugins.push("webdriverio");
            }
            config.env["webdriverio/wdio"] = true;
        }
        else {
            if (idx >= 0) {
                config.plugins.splice(idx, 1);
            }
            if (config.env["webdriverio/wdio"]) {
                delete config.env["webdriverio/wdio"];
            }
        }
        return config;
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILCtGQUE0RjtBQUM1RiwrRkFBNEY7QUFFNUYsZ0ZBQTZFO0FBTTdFLFlBQW9CLFNBQVEsK0NBQXNCO0lBSWpDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBRTVELElBQUksUUFBUSxDQUFDO29CQUNiLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBc0IsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9HLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxH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Q0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzFDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7O0FBL0hjLGVBQVEsR0FBVyxnQkFBZ0IsQ0FBQztBQUNwQyxnQkFBUyxHQUFXLGVBQWUsQ0FBQztBQUZ2RCx3QkFpSUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9saW50L2VzTGludC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
