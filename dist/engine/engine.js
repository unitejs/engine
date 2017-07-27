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
const uniteBuildConfiguration_1 = require("../configuration/models/unite/uniteBuildConfiguration");
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const npmPackageManager_1 = require("../packageManagers/npmPackageManager");
const yarnPackageManager_1 = require("../packageManagers/yarnPackageManager");
const aurelia_1 = require("../pipelineSteps/applicationFramework/aurelia");
const plainApp_1 = require("../pipelineSteps/applicationFramework/plainApp");
const react_1 = require("../pipelineSteps/applicationFramework/react");
const browserify_1 = require("../pipelineSteps/bundler/browserify");
const requireJs_1 = require("../pipelineSteps/bundler/requireJs");
const systemJsBuilder_1 = require("../pipelineSteps/bundler/systemJsBuilder");
const webpack_1 = require("../pipelineSteps/bundler/webpack");
const gitIgnore_1 = require("../pipelineSteps/content/gitIgnore");
const htmlTemplate_1 = require("../pipelineSteps/content/htmlTemplate");
const license_1 = require("../pipelineSteps/content/license");
const packageJson_1 = require("../pipelineSteps/content/packageJson");
const readMe_1 = require("../pipelineSteps/content/readMe");
const postCss_1 = require("../pipelineSteps/cssPostProcessor/postCss");
const postCssNone_1 = require("../pipelineSteps/cssPostProcessor/postCssNone");
const css_1 = require("../pipelineSteps/cssPreProcessor/css");
const less_1 = require("../pipelineSteps/cssPreProcessor/less");
const sass_1 = require("../pipelineSteps/cssPreProcessor/sass");
const stylus_1 = require("../pipelineSteps/cssPreProcessor/stylus");
const protractor_1 = require("../pipelineSteps/e2eTestRunner/protractor");
const webdriverIo_1 = require("../pipelineSteps/e2eTestRunner/webdriverIo");
const babel_1 = require("../pipelineSteps/language/babel");
const typeScript_1 = require("../pipelineSteps/language/typeScript");
const esLint_1 = require("../pipelineSteps/lint/esLint");
const tsLint_1 = require("../pipelineSteps/lint/tsLint");
const amd_1 = require("../pipelineSteps/moduleType/amd");
const commonJs_1 = require("../pipelineSteps/moduleType/commonJs");
const systemJs_1 = require("../pipelineSteps/moduleType/systemJs");
const appScaffold_1 = require("../pipelineSteps/scaffold/appScaffold");
const e2eTestScaffold_1 = require("../pipelineSteps/scaffold/e2eTestScaffold");
const outputDirectory_1 = require("../pipelineSteps/scaffold/outputDirectory");
const uniteConfigurationDirectories_1 = require("../pipelineSteps/scaffold/uniteConfigurationDirectories");
const uniteConfigurationJson_1 = require("../pipelineSteps/scaffold/uniteConfigurationJson");
const unitTestScaffold_1 = require("../pipelineSteps/scaffold/unitTestScaffold");
const browserSync_1 = require("../pipelineSteps/server/browserSync");
const gulp_1 = require("../pipelineSteps/taskManager/gulp");
const jasmine_1 = require("../pipelineSteps/testFramework/jasmine");
const mochaChai_1 = require("../pipelineSteps/testFramework/mochaChai");
const karma_1 = require("../pipelineSteps/unitTestRunner/karma");
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
    init(packageName, title, license, sourceLanguage, moduleType, bundler, unitTestRunner, unitTestFramework, e2eTestRunner, e2eTestFramework, linter, cssPre, cssPost, packageManager, applicationFramework, outputDirectory) {
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
            uniteConfiguration.moduleType = moduleType || uniteConfiguration.moduleType;
            uniteConfiguration.bundler = bundler || uniteConfiguration.bundler;
            uniteConfiguration.unitTestRunner = unitTestRunner || uniteConfiguration.unitTestRunner;
            uniteConfiguration.unitTestFramework = unitTestFramework || uniteConfiguration.unitTestFramework;
            uniteConfiguration.e2eTestRunner = e2eTestRunner || uniteConfiguration.e2eTestRunner;
            uniteConfiguration.e2eTestFramework = e2eTestFramework || uniteConfiguration.e2eTestFramework;
            uniteConfiguration.linter = linter || uniteConfiguration.linter;
            uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager || "Npm";
            uniteConfiguration.taskManager = "Gulp";
            uniteConfiguration.server = "BrowserSync";
            uniteConfiguration.applicationFramework = applicationFramework || uniteConfiguration.applicationFramework;
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.cssPre = cssPre || uniteConfiguration.cssPre;
            uniteConfiguration.cssPost = cssPost || uniteConfiguration.cssPost;
            uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleType", uniteConfiguration.moduleType, ["AMD", "CommonJS", "SystemJS"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "bundler", uniteConfiguration.bundler, ["Browserify", "RequireJS", "SystemJSBuilder", "Webpack"])) {
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "e2eTestRunner", uniteConfiguration.e2eTestRunner, ["None", "WebdriverIO", "Protractor"])) {
                return 1;
            }
            if (e2eTestRunner !== "None") {
                if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "e2eTestFramework", uniteConfiguration.e2eTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
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
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "applicationFramework", uniteConfiguration.applicationFramework, ["PlainApp", "Aurelia", "React"])) {
                return 1;
            }
            this._display.log("");
            return this.initRun(outputDirectory, uniteConfiguration, spdxLicense);
        });
    }
    clientPackage(operation, packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, packageManager, outputDirectory) {
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
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
                return 1;
            }
            this._display.log("");
            if (operation === "add") {
                return yield this.clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, outputDirectory, uniteConfiguration);
            }
            else if (operation === "remove") {
                return yield this.clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
            }
            return 0;
        });
    }
    buildConfiguration(operation, configurationName, bundle, minify, sourcemaps, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                this._display.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "configurationName", configurationName)) {
                return 1;
            }
            this._display.log("");
            if (operation === "add") {
                return yield this.buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration);
            }
            else if (operation === "remove") {
                return yield this.buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration);
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
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                engineVariables.license = license;
                const pipelineSteps = [];
                pipelineSteps.push(new outputDirectory_1.OutputDirectory());
                pipelineSteps.push(new appScaffold_1.AppScaffold());
                pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
                pipelineSteps.push(new e2eTestScaffold_1.E2eTestScaffold());
                pipelineSteps.push(new gulp_1.Gulp());
                pipelineSteps.push(new amd_1.Amd());
                pipelineSteps.push(new commonJs_1.CommonJs());
                pipelineSteps.push(new systemJs_1.SystemJs());
                pipelineSteps.push(new browserify_1.Browserify());
                pipelineSteps.push(new requireJs_1.RequireJs());
                pipelineSteps.push(new systemJsBuilder_1.SystemJsBuilder());
                pipelineSteps.push(new webpack_1.Webpack());
                pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
                pipelineSteps.push(new css_1.Css());
                pipelineSteps.push(new less_1.Less());
                pipelineSteps.push(new sass_1.Sass());
                pipelineSteps.push(new stylus_1.Stylus());
                pipelineSteps.push(new postCss_1.PostCss());
                pipelineSteps.push(new postCssNone_1.PostCssNone());
                pipelineSteps.push(new mochaChai_1.MochaChai());
                pipelineSteps.push(new jasmine_1.Jasmine());
                pipelineSteps.push(new plainApp_1.PlainApp());
                pipelineSteps.push(new aurelia_1.Aurelia());
                pipelineSteps.push(new react_1.React());
                pipelineSteps.push(new babel_1.Babel());
                pipelineSteps.push(new typeScript_1.TypeScript());
                pipelineSteps.push(new webdriverIo_1.WebdriverIo());
                pipelineSteps.push(new protractor_1.Protractor());
                pipelineSteps.push(new esLint_1.EsLint());
                pipelineSteps.push(new tsLint_1.TsLint());
                pipelineSteps.push(new karma_1.Karma());
                pipelineSteps.push(new browserSync_1.BrowserSync());
                pipelineSteps.push(new readMe_1.ReadMe());
                pipelineSteps.push(new gitIgnore_1.GitIgnore());
                pipelineSteps.push(new license_1.License());
                pipelineSteps.push(new packageJson_1.PackageJson());
                pipelineSteps.push(new uniteConfigurationDirectories_1.UniteConfigurationDirectories());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._display.banner("You should probably run npm install / yarn install before running any gulp commands.");
                }
            }
            return ret;
        });
    }
    clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "includeMode", includeMode, ["app", "test", "both"])) {
                return 1;
            }
            if (uniteConfiguration.clientPackages[packageName]) {
                this._display.error("Package has already been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                const packageInfo = yield engineVariables.packageManager.info(packageName);
                let fixPackageVersion = false;
                if (version === null || version === undefined || version.length === 0) {
                    version = packageInfo.version;
                }
                else {
                    fixPackageVersion = true;
                }
                let finalMain = main ? main : packageInfo.main;
                let finalMainMinified = mainMinified ? mainMinified : undefined;
                if (finalMain) {
                    finalMain = finalMain.replace(/\\/g, "/");
                    finalMain = finalMain.replace(/\.\//, "/");
                }
                if (finalMainMinified) {
                    finalMainMinified = finalMainMinified.replace(/\\/g, "/");
                    finalMainMinified = finalMainMinified.replace(/\.\//, "/");
                }
                const clientPackage = new uniteClientPackage_1.UniteClientPackage();
                clientPackage.version = fixPackageVersion ? version : "^" + version;
                clientPackage.preload = preload;
                clientPackage.main = finalMain;
                clientPackage.mainMinified = finalMainMinified;
                clientPackage.isPackage = isPackage;
                clientPackage.includeMode = includeMode;
                clientPackage.wrapAssets = wrapAssets;
                uniteConfiguration.clientPackages[packageName] = clientPackage;
                yield engineVariables.packageManager.add(outputDirectory, packageName, version, false);
                const pipelineSteps = [];
                pipelineSteps.push(new amd_1.Amd());
                pipelineSteps.push(new commonJs_1.CommonJs());
                pipelineSteps.push(new systemJs_1.SystemJs());
                pipelineSteps.push(new browserify_1.Browserify());
                pipelineSteps.push(new requireJs_1.RequireJs());
                pipelineSteps.push(new systemJsBuilder_1.SystemJsBuilder());
                pipelineSteps.push(new webpack_1.Webpack());
                pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
                pipelineSteps.push(new karma_1.Karma());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
    clientPackageRemove(packageName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.clientPackages[packageName]) {
                this._display.error("Package has not been added.");
                return 1;
            }
            delete uniteConfiguration.clientPackages[packageName];
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                yield engineVariables.packageManager.remove(outputDirectory, packageName, false);
                const pipelineSteps = [];
                pipelineSteps.push(new amd_1.Amd());
                pipelineSteps.push(new commonJs_1.CommonJs());
                pipelineSteps.push(new systemJs_1.SystemJs());
                pipelineSteps.push(new browserify_1.Browserify());
                pipelineSteps.push(new requireJs_1.RequireJs());
                pipelineSteps.push(new systemJsBuilder_1.SystemJsBuilder());
                pipelineSteps.push(new webpack_1.Webpack());
                pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
                pipelineSteps.push(new karma_1.Karma());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
    buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new uniteBuildConfiguration_1.UniteBuildConfiguration();
                uniteConfiguration.buildConfigurations[configurationName].bundle = bundle;
                uniteConfiguration.buildConfigurations[configurationName].minify = minify;
                uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps;
                uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};
                const pipelineSteps = [];
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
    buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                if (uniteConfiguration.buildConfigurations[configurationName]) {
                    delete uniteConfiguration.buildConfigurations[configurationName];
                }
                const pipelineSteps = [];
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.coreFolder = this._coreRoot;
            engineVariables.rootFolder = outputDirectory;
            engineVariables.srcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "src");
            engineVariables.distFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "dist");
            engineVariables.gulpBuildFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "build");
            engineVariables.reportsFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "reports");
            engineVariables.cssDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "css");
            engineVariables.e2eTestFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/e2e");
            engineVariables.e2eTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/e2e/src");
            engineVariables.e2eTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/e2e/dist");
            engineVariables.unitTestFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/unit");
            engineVariables.unitTestSrcFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/unit/src");
            engineVariables.unitTestDistFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "test/unit/dist");
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
            uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
            uniteConfiguration.buildConfigurations.dev = uniteConfiguration.buildConfigurations.dev ||
                { bundle: false, minify: false, sourcemaps: true, variables: {} };
            uniteConfiguration.buildConfigurations.prod = uniteConfiguration.buildConfigurations.prod ||
                { bundle: true, minify: true, sourcemaps: false, variables: {} };
            engineVariables.htmlNoBundle = {
                head: [],
                body: [],
                separateCss: true,
                scriptIncludes: []
            };
            engineVariables.htmlBundle = {
                head: [],
                body: [],
                separateCss: true,
                scriptIncludes: []
            };
            engineVariables.protractorPlugins = {};
            engineVariables.transpilePresets = {};
            engineVariables.lintFeatures = {};
            engineVariables.lintExtends = {};
            engineVariables.lintPlugins = {};
            engineVariables.lintEnv = {};
            engineVariables.lintGlobals = {};
            engineVariables.transpileProperties = {};
            try {
                this._logger.log("Loading dependencies", { core: engineVariables.coreFolder, dependenciesFile: "package.json" });
                engineVariables.corePackageJson = yield this._fileSystem.fileReadJson(engineVariables.coreFolder, "package.json");
                uniteConfiguration.uniteVersion = engineVariables.corePackageJson.version;
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: engineVariables.coreFolder, dependenciesFile: "package.json" });
                return 1;
            }
            return 0;
        });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFFLENBQUM7WUFFdEMsZUFBZSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDbEMsZUFBZSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDakMsZUFBZSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDakMsZUFBZSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDN0IsZUFBZSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFFakMsZUFBZSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztZQUV6QyxJQUFJLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2dCQUVqSCxlQUFlLENBQUMsZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXVCLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3hJLGtCQUFrQixDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUM5RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2dCQUMvSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFYSxXQUFXLENBQUMsYUFBb0MsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDcEksR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUMzSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBMWhCRCx3QkEwaEJDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmUuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
