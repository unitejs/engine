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
const npmPackageManager_1 = require("../packageManagers/npmPackageManager");
const yarnPackageManager_1 = require("../packageManagers/yarnPackageManager");
const appScaffold_1 = require("../pipelineSteps/appScaffold");
const gitIgnore_1 = require("../pipelineSteps/content/gitIgnore");
const license_1 = require("../pipelineSteps/content/license");
const readMe_1 = require("../pipelineSteps/content/readMe");
const postCss_1 = require("../pipelineSteps/cssPostProcessor/postCss");
const css_1 = require("../pipelineSteps/cssPreProcessor/css");
const less_1 = require("../pipelineSteps/cssPreProcessor/less");
const sass_1 = require("../pipelineSteps/cssPreProcessor/sass");
const stylus_1 = require("../pipelineSteps/cssPreProcessor/stylus");
const e2eTestScaffold_1 = require("../pipelineSteps/e2eTest/e2eTestScaffold");
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
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
        this._coreRoot = fileSystem.pathCombine(__dirname, "../../");
        this._assetsFolder = fileSystem.pathCombine(this._coreRoot, "/assets/");
    }
    init(packageName, title, license, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, linter, cssPre, cssPost, packageManager, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            let uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            }
            uniteConfiguration.packageName = packageName || uniteConfiguration.packageName;
            uniteConfiguration.title = title || uniteConfiguration.title;
            uniteConfiguration.license = license || uniteConfiguration.license || "MIT";
            uniteConfiguration.sourceLanguage = sourceLanguage || uniteConfiguration.sourceLanguage;
            uniteConfiguration.moduleLoader = moduleLoader || uniteConfiguration.moduleLoader;
            uniteConfiguration.unitTestRunner = unitTestRunner || uniteConfiguration.unitTestRunner;
            uniteConfiguration.unitTestFramework = unitTestFramework || uniteConfiguration.unitTestFramework;
            uniteConfiguration.linter = linter || uniteConfiguration.linter;
            uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager || "Npm";
            uniteConfiguration.staticClientModules = [];
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.cssPre = cssPre || uniteConfiguration.cssPre;
            uniteConfiguration.cssPost = cssPost || uniteConfiguration.cssPost;
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", uniteConfiguration.packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "title", uniteConfiguration.title)) {
                return 1;
            }
            let spdxLicense;
            try {
                const licenseData = yield this._fileSystem.fileReadJson(this._assetsFolder, "spdx-full.json");
                if (!engineValidation_1.EngineValidation.checkLicense(licenseData, this._display, "license", uniteConfiguration.license)) {
                    return 1;
                }
                else {
                    spdxLicense = licenseData[uniteConfiguration.license];
                }
            }
            catch (e) {
                this._display.error("There was a problem reading the spdx-full.json file", e);
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "cssPre", uniteConfiguration.cssPre, ["Css", "Less", "Sass", "Stylus"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "cssPost", uniteConfiguration.cssPost, ["None", "PostCss"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
                return 1;
            }
            if (unitTestRunner !== "None") {
                if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestFramework", uniteConfiguration.unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            this._display.log("");
            return this.initRun(outputDirectory, uniteConfiguration, spdxLicense);
        });
    }
    clientPackage(operation, packageName, version, preload, includeMode, packageManager, outputDirectory) {
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
                uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager || "Npm";
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
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
    initRun(outputDirectory, uniteConfiguration, license) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Engine::init", { outputDirectory, uniteConfiguration });
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            engineVariables.license = license;
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
            pipelineSteps.push(new css_1.Css());
            pipelineSteps.push(new less_1.Less());
            pipelineSteps.push(new sass_1.Sass());
            pipelineSteps.push(new stylus_1.Stylus());
            pipelineSteps.push(new postCss_1.PostCss());
            pipelineSteps.push(new mochaChai_1.MochaChai());
            pipelineSteps.push(new jasmine_1.Jasmine());
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new readMe_1.ReadMe());
            pipelineSteps.push(new gitIgnore_1.GitIgnore());
            pipelineSteps.push(new license_1.License());
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
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            const packageInfo = yield engineVariables.packageManager.info(packageName);
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
            yield engineVariables.packageManager.add(outputDirectory, packageName, version, false);
            const pipelineSteps = [];
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
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
            const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
            yield engineVariables.packageManager.remove(outputDirectory, packageName, false);
            const pipelineSteps = [];
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new modulesConfig_1.ModulesConfig());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            return yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration) {
        const engineVariables = new engineVariables_1.EngineVariables();
        engineVariables.coreFolder = this._coreRoot;
        engineVariables.rootFolder = outputDirectory;
        engineVariables.srcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\src");
        engineVariables.distFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\dist");
        engineVariables.gulpBuildFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\build");
        engineVariables.reportsFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\reports");
        engineVariables.cssDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\css");
        engineVariables.e2eTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\src");
        engineVariables.e2eTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\dist");
        engineVariables.unitTestFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit");
        engineVariables.unitTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit\\src");
        engineVariables.unitTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\unit\\dist");
        engineVariables.requiredDependencies = [];
        engineVariables.requiredDevDependencies = [];
        engineVariables.packageFolder = "node_modules/";
        engineVariables.assetsDirectory = this._assetsFolder;
        engineVariables.sourceLanguageExt = uniteConfiguration.sourceLanguage === "JavaScript" ? "js" : "ts";
        engineVariables.gitIgnore = [];
        if (uniteConfiguration.packageManager === "Npm") {
            engineVariables.packageManager = new npmPackageManager_1.NpmPackageManager(this._logger, this._display, this._fileSystem);
        }
        else if (uniteConfiguration.packageManager === "Yarn") {
            engineVariables.packageManager = new yarnPackageManager_1.YarnPackageManager(this._logger, this._display, this._fileSystem);
        }
        engineVariables.html = {
            head: [],
            body: []
        };
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
