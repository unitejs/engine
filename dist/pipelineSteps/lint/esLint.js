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
        engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILCtGQUE0RjtBQUM1RiwrRkFBNEY7QUFFNUYsZ0ZBQTZFO0FBTTdFLFlBQW9CLFNBQVEsK0NBQXNCO0lBSWpDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRXhGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDdEYsQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFNUQsSUFBSSxRQUFRLENBQUM7b0JBQ2IsSUFBSSxDQUFDO3dCQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFzQixlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0csQ0FBQztvQkFDTCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxD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Q0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMxQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztBQS9IYyxlQUFRLEdBQVcsZ0JBQWdCLENBQUM7QUFDcEMsZ0JBQVMsR0FBVyxlQUFlLENBQUM7QUFGdkQsd0JBaUlDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGludC9lc0xpbnQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
