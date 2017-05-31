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
const createOutputDirectory_1 = require("../pipelineSteps/createOutputDirectory");
const generateAppScaffold_1 = require("../pipelineSteps/generateAppScaffold");
const generateBabelConfiguration_1 = require("../pipelineSteps/generateBabelConfiguration");
const generateGulpBuildConfiguration_1 = require("../pipelineSteps/generateGulpBuildConfiguration");
const generateGulpScaffold_1 = require("../pipelineSteps/generateGulpScaffold");
const generateGulpTasksBuild_1 = require("../pipelineSteps/generateGulpTasksBuild");
const generateGulpTasksUtil_1 = require("../pipelineSteps/generateGulpTasksUtil");
const generateHtmlTemplate_1 = require("../pipelineSteps/generateHtmlTemplate");
const generateModuleLoaderScaffold_1 = require("../pipelineSteps/generateModuleLoaderScaffold");
const generatePackageJson_1 = require("../pipelineSteps/generatePackageJson");
const generateTypeScriptConfiguration_1 = require("../pipelineSteps/generateTypeScriptConfiguration");
const generateUniteConfiguration_1 = require("../pipelineSteps/generateUniteConfiguration");
const engineValidation_1 = require("./engineValidation");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    init(packageName, title, sourceLanguage, moduleLoader, sourceMaps, outputDirectory) {
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
            outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory);
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
            uniteConfiguration.outputDirectory = outputDirectory;
            uniteConfiguration.staticClientModules = [];
            const engineVariables = new engineVariables_1.EngineVariables();
            engineVariables.uniteSourceLanguage = uniteConfiguration.sourceLanguage;
            engineVariables.uniteModuleLoader = uniteConfiguration.moduleLoader;
            engineVariables.requiredDependencies = [];
            engineVariables.requiredDevDependencies = [];
            engineVariables.assetsDirectory = "./node_modules/unitejs-core/dist/assets/";
            engineVariables.dependenciesFile = "unite-dependencies.json";
            const pipelineSteps = [];
            pipelineSteps.push(new createOutputDirectory_1.CreateOutputDirectory());
            pipelineSteps.push(new generateAppScaffold_1.GenerateAppScaffold());
            pipelineSteps.push(new generateGulpScaffold_1.GenerateGulpScaffold());
            pipelineSteps.push(new generateGulpBuildConfiguration_1.GenerateGulpBuildConfiguration());
            pipelineSteps.push(new generateGulpTasksBuild_1.GenerateGulpTasksBuild());
            pipelineSteps.push(new generateGulpTasksUtil_1.GenerateGulpTasksUtil());
            pipelineSteps.push(new generateModuleLoaderScaffold_1.GenerateModuleLoaderScaffold());
            pipelineSteps.push(new generateHtmlTemplate_1.GenerateHtmlTemplate());
            pipelineSteps.push(new generateBabelConfiguration_1.GenerateBabelConfiguration());
            pipelineSteps.push(new generateTypeScriptConfiguration_1.GenerateTypeScriptConfiguration());
            pipelineSteps.push(new generateUniteConfiguration_1.GenerateUniteConfiguration());
            pipelineSteps.push(new generatePackageJson_1.GeneratePackageJson());
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
