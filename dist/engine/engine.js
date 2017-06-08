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
    init(packageName, title, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, outputDirectory) {
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleLoader", moduleLoader, ["RequireJS", "SystemJS", "Webpack"])) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQzNILEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLFNBQTZDLEVBQzdDLElBQStCOztZQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG1DQUFnQixDQUFDLFVBQVUsQ0FBa0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQ0FBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXhHRCx3QkF3R0MiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
