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
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const appScaffold_1 = require("../pipelineSteps/appScaffold");
const e2eTestScaffold_1 = require("../pipelineSteps/e2eTest/e2eTestScaffold");
const gitIgnore_1 = require("../pipelineSteps/gitIgnore");
const gulpScaffold_1 = require("../pipelineSteps/gulp/gulpScaffold");
const gulpTasksBuild_1 = require("../pipelineSteps/gulp/gulpTasksBuild");
const gulpTasksUnit_1 = require("../pipelineSteps/gulp/gulpTasksUnit");
const gulpTasksUtil_1 = require("../pipelineSteps/gulp/gulpTasksUtil");
const htmlTemplate_1 = require("../pipelineSteps/htmlTemplate");
const babel_1 = require("../pipelineSteps/language/babel");
const typeScript_1 = require("../pipelineSteps/language/typeScript");
const moduleLoader_1 = require("../pipelineSteps/moduleLoader");
const modulesConfig_1 = require("../pipelineSteps/modulesConfig");
const outputDirectory_1 = require("../pipelineSteps/outputDirectory");
const packageJson_1 = require("../pipelineSteps/packageJson");
const uniteConfigurationDirectories_1 = require("../pipelineSteps/uniteConfigurationDirectories");
const uniteConfigurationJson_1 = require("../pipelineSteps/uniteConfigurationJson");
const jasmine_1 = require("../pipelineSteps/unitTest/jasmine");
const karma_1 = require("../pipelineSteps/unitTest/karma");
const mochaChai_1 = require("../pipelineSteps/unitTest/mochaChai");
const unitTestScaffold_1 = require("../pipelineSteps/unitTest/unitTestScaffold");
const engineValidation_1 = require("./engineValidation");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem, packageManager, engineScriptLocation) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
        this._packageManager = packageManager;
        this._engineScriptLocation = engineScriptLocation;
    }
    init(packageName, title, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            let uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            }
            uniteConfiguration.packageName = packageName || uniteConfiguration.packageName;
            uniteConfiguration.title = title || uniteConfiguration.title;
            uniteConfiguration.sourceLanguage = sourceLanguage || uniteConfiguration.sourceLanguage;
            uniteConfiguration.moduleLoader = moduleLoader || uniteConfiguration.moduleLoader;
            uniteConfiguration.unitTestRunner = unitTestRunner || uniteConfiguration.unitTestRunner;
            uniteConfiguration.unitTestFramework = unitTestFramework || uniteConfiguration.unitTestFramework;
            uniteConfiguration.staticClientModules = [];
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", uniteConfiguration.packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "title", uniteConfiguration.title)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "sourceLanguage", uniteConfiguration.sourceLanguage, ["JavaScript", "TypeScript"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleLoader", uniteConfiguration.moduleLoader, ["Browserify", "RequireJS", "SystemJS", "Webpack"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestRunner", uniteConfiguration.unitTestRunner, ["None", "Karma"])) {
                return 1;
            }
            if (unitTestRunner !== "None") {
                if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestFramework", uniteConfiguration.unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            this._display.log("");
            return this.initRun(outputDirectory, uniteConfiguration);
        });
    }
    clientPackage(operation, packageName, version, preload, includeMode, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (includeMode === undefined || includeMode === null || includeMode.length === 0) {
                includeMode = "both";
            }
            if (!uniteConfiguration) {
                this._display.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "includeMode", includeMode, ["app", "test", "both"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "packageName", packageName)) {
                return 1;
            }
            this._display.log("");
            if (operation === "add") {
                return yield this.clientPackageAdd(packageName, version, preload, includeMode, outputDirectory, uniteConfiguration);
            }
            else if (operation === "remove") {
                return yield this.clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
            }
            return 0;
        });
    }
    cleanupOutputDirectory(outputDirectory) {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            /* no output directory specified so use current */
            outputDirectory = "./";
        }
        else {
            outputDirectory = this._fileSystem.pathFormat(outputDirectory);
        }
        return outputDirectory;
    }
    loadConfiguration(outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration;
            /* check if there is a unite.json we can load for default options */
            try {
                const exists = yield this._fileSystem.fileExists(outputDirectory, "unite.json");
                if (exists) {
                    uniteConfiguration = yield this._fileSystem.fileReadJson(outputDirectory, "unite.json");
                }
            }
            catch (e) {
                /* we can ignore any failures here */
            }
            return uniteConfiguration;
        });
    }
    initRun(outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Engine::init", { outputDirectory, uniteConfiguration });
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            const pipelineSteps = [];
            pipelineSteps.push(new outputDirectory_1.OutputDirectory());
            pipelineSteps.push(new appScaffold_1.AppScaffold());
            pipelineSteps.push(new e2eTestScaffold_1.E2eTestScaffold());
            pipelineSteps.push(new gulpScaffold_1.GulpScaffold());
            pipelineSteps.push(new gulpTasksBuild_1.GulpTasksBuild());
            pipelineSteps.push(new gulpTasksUtil_1.GulpTasksUtil());
            pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
            pipelineSteps.push(new gulpTasksUnit_1.GulpTasksUnit());
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
            pipelineSteps.push(new babel_1.Babel());
            pipelineSteps.push(new typeScript_1.TypeScript());
            pipelineSteps.push(new mochaChai_1.MochaChai());
            pipelineSteps.push(new jasmine_1.Jasmine());
            pipelineSteps.push(new gitIgnore_1.GitIgnore());
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new modulesConfig_1.ModulesConfig());
            pipelineSteps.push(new packageJson_1.PackageJson());
            pipelineSteps.push(new uniteConfigurationDirectories_1.UniteConfigurationDirectories());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._display.banner("You should probably run npm install / yarn install before running any gulp commands.");
            }
            return ret;
        });
    }
    clientPackageAdd(packageName, version, preload, includeMode, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.clientPackages[packageName]) {
                this._display.error("Package has already been added.");
                return 1;
            }
            const packageInfo = yield this._packageManager.info(packageName);
            let fixPackageVersion = false;
            if (version === null || version === undefined || version.length === 0) {
                version = packageInfo.version;
            }
            else {
                fixPackageVersion = true;
            }
            uniteConfiguration.clientPackages[packageName] = {
                version: fixPackageVersion ? version : "^" + version,
                preload,
                main: packageInfo.main,
                includeMode
            };
            yield this._packageManager.add(outputDirectory, packageName, version, false);
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            const pipelineSteps = [];
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new modulesConfig_1.ModulesConfig());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            return yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
        });
    }
    clientPackageRemove(packageName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.clientPackages[packageName]) {
                this._display.error("Package has not been added.");
                return 1;
            }
            delete uniteConfiguration.clientPackages[packageName];
            yield this._packageManager.remove(outputDirectory, packageName, false);
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            const pipelineSteps = [];
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new modulesConfig_1.ModulesConfig());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            return yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration) {
        const engineVariables = new engineVariables_1.EngineVariables();
        engineVariables.rootFolder = outputDirectory;
        engineVariables.sourceFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\src");
        engineVariables.distFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\dist");
        engineVariables.gulpBuildFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\build");
        engineVariables.reportsFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\reports");
        engineVariables.e2eTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\src");
        engineVariables.e2eTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\dist");
        engineVariables.unitTestFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit");
        engineVariables.unitTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit\\src");
        engineVariables.unitTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit\\dist");
        engineVariables.requiredDependencies = [];
        engineVariables.requiredDevDependencies = [];
        engineVariables.packageFolder = "node_modules/";
        engineVariables.assetsDirectory = this._fileSystem.pathCombine(this._engineScriptLocation, "./node_modules/unitejs-core/dist/assets/");
        engineVariables.dependenciesFile = "unite-dependencies.json";
        engineVariables.sourceLanguageExt = uniteConfiguration.sourceLanguage === "JavaScript" ? "js" : "ts";
        engineVariables.gitIgnore = [];
        return engineVariables;
    }
    runPipeline(pipelineSteps, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
