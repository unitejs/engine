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
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const appScaffold_1 = require("../pipelineSteps/appScaffold");
const babel_1 = require("../pipelineSteps/babel");
const e2eTestScaffold_1 = require("../pipelineSteps/e2eTestScaffold");
const gulpBuild_1 = require("../pipelineSteps/gulpBuild");
const gulpScaffold_1 = require("../pipelineSteps/gulpScaffold");
const gulpTasksBuild_1 = require("../pipelineSteps/gulpTasksBuild");
const gulpTasksUnit_1 = require("../pipelineSteps/gulpTasksUnit");
const gulpTasksUtil_1 = require("../pipelineSteps/gulpTasksUtil");
const htmlTemplate_1 = require("../pipelineSteps/htmlTemplate");
const jasmine_1 = require("../pipelineSteps/jasmine");
const karma_1 = require("../pipelineSteps/karma");
const mochaChai_1 = require("../pipelineSteps/mochaChai");
const moduleLoader_1 = require("../pipelineSteps/moduleLoader");
const outputDirectory_1 = require("../pipelineSteps/outputDirectory");
const packageJson_1 = require("../pipelineSteps/packageJson");
const typeScript_1 = require("../pipelineSteps/typeScript");
const uniteConfigurationJson_1 = require("../pipelineSteps/uniteConfigurationJson");
const unitTestScaffold_1 = require("../pipelineSteps/unitTestScaffold");
const engineValidation_1 = require("./engineValidation");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    init(packageName, title, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, sourceMaps, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "title", title)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "sourceLanguage", sourceLanguage, ["JavaScript", "TypeScript"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleLoader", moduleLoader, ["RequireJS", "Webpack", "Browserify", "JSPM"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestRunner", unitTestRunner, ["None", "Karma"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestFramework", unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                return 1;
            }
            outputDirectory = this._fileSystem.pathFormat(outputDirectory);
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
                return 1;
            }
            this._logger.info("Engine::init", { packageName, sourceLanguage, moduleLoader, outputDirectory });
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            uniteConfiguration.packageName = packageName;
            uniteConfiguration.title = title;
            uniteConfiguration.sourceLanguage = sourceLanguage;
            uniteConfiguration.moduleLoader = moduleLoader;
            uniteConfiguration.sourceMaps = sourceMaps;
            uniteConfiguration.unitTestRunner = unitTestRunner;
            uniteConfiguration.unitTestFramework = unitTestFramework;
            uniteConfiguration.outputDirectory = outputDirectory;
            uniteConfiguration.staticClientModules = [];
            const engineVariables = new engineVariables_1.EngineVariables();
            engineVariables.requiredDependencies = [];
            engineVariables.requiredDevDependencies = [];
            engineVariables.assetsDirectory = "./node_modules/unitejs-core/dist/assets/";
            engineVariables.dependenciesFile = "unite-dependencies.json";
            engineVariables.sourceLanguageExt = uniteConfiguration.sourceLanguage === "JavaScript" ? "js" : "ts";
            const pipelineSteps = [];
            pipelineSteps.push(new outputDirectory_1.OutputDirectory());
            pipelineSteps.push(new appScaffold_1.AppScaffold());
            pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
            pipelineSteps.push(new e2eTestScaffold_1.E2eTestScaffold());
            pipelineSteps.push(new gulpScaffold_1.GulpScaffold());
            pipelineSteps.push(new gulpBuild_1.GulpBuild());
            pipelineSteps.push(new gulpTasksBuild_1.GulpTasksBuild());
            pipelineSteps.push(new gulpTasksUtil_1.GulpTasksUtil());
            pipelineSteps.push(new gulpTasksUnit_1.GulpTasksUnit());
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
            pipelineSteps.push(new babel_1.Babel());
            pipelineSteps.push(new typeScript_1.TypeScript());
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new mochaChai_1.MochaChai());
            pipelineSteps.push(new jasmine_1.Jasmine());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            pipelineSteps.push(new packageJson_1.PackageJson());
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    module(operation, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "operation", operation, ["add"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "name", name)) {
                return 1;
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
