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
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
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
const assetsSource_1 = require("../pipelineSteps/content/assetsSource");
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
const uniteThemeConfigurationJson_1 = require("../pipelineSteps/scaffold/uniteThemeConfigurationJson");
const unitTestScaffold_1 = require("../pipelineSteps/scaffold/unitTestScaffold");
const browserSync_1 = require("../pipelineSteps/server/browserSync");
const gulp_1 = require("../pipelineSteps/taskManager/gulp");
const jasmine_1 = require("../pipelineSteps/testFramework/jasmine");
const mochaChai_1 = require("../pipelineSteps/testFramework/mochaChai");
const karma_1 = require("../pipelineSteps/unitTestRunner/karma");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
        this._coreRoot = fileSystem.pathCombine(__dirname, "../../");
        this._assetsFolder = fileSystem.pathCombine(this._coreRoot, "/assets/");
    }
    configure(packageName, title, license, sourceLanguage, moduleType, bundler, unitTestRunner, unitTestFramework, e2eTestRunner, e2eTestFramework, linter, cssPre, cssPost, packageManager, applicationFramework, outputDirectory) {
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
            if (!parameterValidation_1.ParameterValidation.checkPackageName(this._display, "packageName", uniteConfiguration.packageName)) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._display, "title", uniteConfiguration.title)) {
                return 1;
            }
            let spdxLicense;
            try {
                const licenseData = yield this._fileSystem.fileReadJson(this._assetsFolder, "spdx-full.json");
                if (!parameterValidation_1.ParameterValidation.contains(this._display, "license", Object.keys(licenseData), uniteConfiguration.license, "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
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
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "sourceLanguage", uniteConfiguration.sourceLanguage, ["JavaScript", "TypeScript"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "moduleType", uniteConfiguration.moduleType, ["AMD", "CommonJS", "SystemJS"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "bundler", uniteConfiguration.bundler, ["Browserify", "RequireJS", "SystemJSBuilder", "Webpack"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "unitTestRunner", uniteConfiguration.unitTestRunner, ["None", "Karma"])) {
                return 1;
            }
            if (unitTestRunner !== "None") {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "unitTestFramework", uniteConfiguration.unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "e2eTestRunner", uniteConfiguration.e2eTestRunner, ["None", "WebdriverIO", "Protractor"])) {
                return 1;
            }
            if (e2eTestRunner !== "None") {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "e2eTestFramework", uniteConfiguration.e2eTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "linter", uniteConfiguration.linter, ["None", "ESLint", "TSLint"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "cssPre", uniteConfiguration.cssPre, ["Css", "Less", "Sass", "Stylus"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "cssPost", uniteConfiguration.cssPost, ["None", "PostCss"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "applicationFramework", uniteConfiguration.applicationFramework, ["PlainApp", "Aurelia", "React"])) {
                return 1;
            }
            this._display.log("");
            return this.configureRun(outputDirectory, uniteConfiguration, spdxLicense);
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
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
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
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._display, "configurationName", configurationName)) {
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
            // no output directory specified so use current
            outputDirectory = "./";
        }
        else {
            outputDirectory = this._fileSystem.pathFormat(outputDirectory);
        }
        // if the user has specified the www folder then move one up
        outputDirectory = this._fileSystem.pathFormat(outputDirectory);
        if (outputDirectory.endsWith("www")) {
            outputDirectory = this._fileSystem.pathFormat(this._fileSystem.pathCombine(outputDirectory, "../"));
        }
        return outputDirectory;
    }
    loadConfiguration(outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration;
            // check if there is a unite.json we can load for default options
            try {
                const wwwFolder = this._fileSystem.pathCombine(outputDirectory, "www");
                const exists = yield this._fileSystem.fileExists(wwwFolder, "unite.json");
                if (exists) {
                    uniteConfiguration = yield this._fileSystem.fileReadJson(wwwFolder, "unite.json");
                }
            }
            catch (e) {
                // we can ignore any failures here
            }
            return uniteConfiguration;
        });
    }
    configureRun(outputDirectory, uniteConfiguration, license) {
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
                pipelineSteps.push(new assetsSource_1.AssetsSource());
                pipelineSteps.push(new packageJson_1.PackageJson());
                pipelineSteps.push(new uniteConfigurationDirectories_1.UniteConfigurationDirectories());
                pipelineSteps.push(new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._display.banner("You should probably run npm install / yarn install before running any gulp commands.");
                    this._display.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._display, "includeMode", includeMode, ["app", "test", "both"])) {
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
                clientPackage.version = fixPackageVersion ? version : `^${version}`;
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
                if (ret === 0) {
                    this._display.banner("Successfully Completed.");
                }
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
                if (ret === 0) {
                    this._display.banner("Successfully Completed.");
                }
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
                if (ret === 0) {
                    this._display.banner("Successfully Completed.");
                }
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
                if (ret === 0) {
                    this._display.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.coreFolder = this._coreRoot;
            engineVariables.rootFolder = outputDirectory;
            engineVariables.wwwFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "www");
            engineVariables.srcFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "src");
            engineVariables.distFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "dist");
            engineVariables.gulpBuildFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "build");
            engineVariables.reportsFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "reports");
            engineVariables.cssDistFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "css");
            engineVariables.e2eTestFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/e2e");
            engineVariables.e2eTestSrcFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/e2e/src");
            engineVariables.e2eTestDistFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/e2e/dist");
            engineVariables.unitTestFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/unit");
            engineVariables.unitTestSrcFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/unit/src");
            engineVariables.unitTestDistFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "test/unit/dist");
            engineVariables.assetsFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "assets");
            engineVariables.assetsSourceFolder = this._fileSystem.pathCombine(engineVariables.wwwFolder, "assetsSource");
            engineVariables.packageFolder = "node_modules/";
            engineVariables.packageAssetsDirectory = this._assetsFolder;
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
                const ret = yield pipelineStep.prerequisites(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
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
