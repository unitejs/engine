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
const gulpTasksServe_1 = require("../pipelineSteps/gulp/gulpTasksServe");
const gulpTasksUnit_1 = require("../pipelineSteps/gulp/gulpTasksUnit");
const gulpTasksUtil_1 = require("../pipelineSteps/gulp/gulpTasksUtil");
const htmlTemplate_1 = require("../pipelineSteps/htmlTemplate");
const babel_1 = require("../pipelineSteps/language/babel");
const typeScript_1 = require("../pipelineSteps/language/typeScript");
const esLint_1 = require("../pipelineSteps/lint/esLint");
const tsLint_1 = require("../pipelineSteps/lint/tsLint");
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
    constructor(logger, display, fileSystem, packageManager) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
        this._packageManager = packageManager;
        this._coreRoot = fileSystem.pathCombine(__dirname, "../../");
    }
    init(packageName, title, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, linter, outputDirectory) {
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
            uniteConfiguration.linter = linter || uniteConfiguration.linter;
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "linter", uniteConfiguration.linter, ["None", "ESLint", "TSLint"])) {
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
            pipelineSteps.push(new gulpTasksServe_1.GulpTasksServe());
            pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
            pipelineSteps.push(new gulpTasksUnit_1.GulpTasksUnit());
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
            pipelineSteps.push(new babel_1.Babel());
            pipelineSteps.push(new typeScript_1.TypeScript());
            pipelineSteps.push(new esLint_1.EsLint());
            pipelineSteps.push(new tsLint_1.TsLint());
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
        engineVariables.assetsDirectory = this._fileSystem.pathCombine(this._coreRoot, "/assets/");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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WSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckcsZUFBZSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFL0IsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBRWEsV0FBVyxDQUFDLGFBQW9DLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3BJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDM0gsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQTdRRCx3QkE2UUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
