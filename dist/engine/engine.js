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
const electron_1 = require("../pipelineSteps/platform/electron");
const web_1 = require("../pipelineSteps/platform/web");
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
    constructor(logger, fileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = fileSystem.pathCombine(__dirname, "../../");
        this._engineAssetsFolder = fileSystem.pathCombine(this._engineRootFolder, "/assets/");
    }
    configure(packageName, title, license, sourceLanguage, moduleType, bundler, unitTestRunner, unitTestFramework, e2eTestRunner, e2eTestFramework, linter, cssPre, cssPost, packageManager, applicationFramework, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            let uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (uniteConfiguration === undefined) {
                uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            }
            else if (uniteConfiguration === null) {
                return 1;
            }
            uniteConfiguration.packageName = packageName || uniteConfiguration.packageName;
            uniteConfiguration.title = title || uniteConfiguration.title;
            uniteConfiguration.license = license || uniteConfiguration.license;
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
            if (Object.keys(uniteConfiguration.buildConfigurations).length === 0) {
                uniteConfiguration.buildConfigurations.dev = { bundle: false, minify: false, sourcemaps: true, variables: {} };
                uniteConfiguration.buildConfigurations.prod = { bundle: true, minify: true, sourcemaps: false, variables: {} };
            }
            uniteConfiguration.platforms = uniteConfiguration.platforms || { Web: {} };
            if (!parameterValidation_1.ParameterValidation.checkPackageName(this._logger, "packageName", uniteConfiguration.packageName)) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "title", uniteConfiguration.title)) {
                return 1;
            }
            let spdxLicense;
            try {
                const licenseData = yield this._fileSystem.fileReadJson(this._engineAssetsFolder, "spdx-full.json");
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "license", uniteConfiguration.license, Object.keys(licenseData), "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                    return 1;
                }
                else {
                    spdxLicense = licenseData[uniteConfiguration.license];
                }
            }
            catch (e) {
                this._logger.error("There was a problem reading the spdx-full.json file", e);
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "sourceLanguage", uniteConfiguration.sourceLanguage, ["JavaScript", "TypeScript"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "moduleType", uniteConfiguration.moduleType, ["AMD", "CommonJS", "SystemJS"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "bundler", uniteConfiguration.bundler, ["Browserify", "RequireJS", "SystemJSBuilder", "Webpack"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "unitTestRunner", uniteConfiguration.unitTestRunner, ["None", "Karma"])) {
                return 1;
            }
            if (unitTestRunner === "None") {
                if (unitTestFramework !== null && unitTestFramework !== undefined) {
                    this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                    return 1;
                }
            }
            else {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "unitTestFramework", uniteConfiguration.unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "e2eTestRunner", uniteConfiguration.e2eTestRunner, ["None", "WebdriverIO", "Protractor"])) {
                return 1;
            }
            if (e2eTestRunner === "None") {
                if (e2eTestFramework !== null && e2eTestFramework !== undefined) {
                    this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                    return 1;
                }
            }
            else {
                if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "e2eTestFramework", uniteConfiguration.e2eTestFramework, ["Mocha-Chai", "Jasmine"])) {
                    return 1;
                }
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "linter", uniteConfiguration.linter, ["None", "ESLint", "TSLint"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "cssPre", uniteConfiguration.cssPre, ["Css", "Less", "Sass", "Stylus"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "cssPost", uniteConfiguration.cssPost, ["None", "PostCss"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "applicationFramework", uniteConfiguration.applicationFramework, ["PlainApp", "Aurelia", "React"])) {
                return 1;
            }
            this._logger.info("");
            return this.configureRun(outputDirectory, uniteConfiguration, spdxLicense);
        });
    }
    clientPackage(operation, packageName, version, preload, includeMode, main, mainMinified, isPackage, assets, packageManager, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
                uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", packageName)) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
                return 1;
            }
            if (operation === "add") {
                return yield this.clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, assets, outputDirectory, uniteConfiguration);
            }
            else {
                return yield this.clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
            }
        });
    }
    buildConfiguration(operation, configurationName, bundle, minify, sourcemaps, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "configurationName", configurationName)) {
                return 1;
            }
            this._logger.info("");
            if (operation === "add") {
                return yield this.buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration);
            }
            else {
                return yield this.buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration);
            }
        });
    }
    platform(operation, platformName, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            outputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(outputDirectory);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.platforms = uniteConfiguration.platforms || {};
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "operation", operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "platformName", platformName, [web_1.Web.PLATFORM, electron_1.Electron.PLATFORM])) {
                return 1;
            }
            this._logger.info("");
            if (operation === "add") {
                return yield this.platformAdd(platformName, outputDirectory, uniteConfiguration);
            }
            else {
                return yield this.platformRemove(platformName, outputDirectory, uniteConfiguration);
            }
        });
    }
    cleanupOutputDirectory(outputDirectory) {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            outputDirectory = "./";
        }
        else {
            outputDirectory = this._fileSystem.pathAbsolute(outputDirectory);
        }
        return outputDirectory;
    }
    loadConfiguration(outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration;
            // check if there is a unite.json we can load for default options
            try {
                const exists = yield this._fileSystem.fileExists(outputDirectory, "unite.json");
                if (exists) {
                    uniteConfiguration = yield this._fileSystem.fileReadJson(outputDirectory, "unite.json");
                }
            }
            catch (e) {
                this._logger.error("Reading existing unite.json", e);
                uniteConfiguration = null;
            }
            return uniteConfiguration;
        });
    }
    configureRun(outputDirectory, uniteConfiguration, license) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                engineVariables.license = license;
                const pipelineSteps = [];
                pipelineSteps.push(new outputDirectory_1.OutputDirectory());
                pipelineSteps.push(new appScaffold_1.AppScaffold());
                pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
                pipelineSteps.push(new e2eTestScaffold_1.E2eTestScaffold());
                pipelineSteps.push(new gulp_1.Gulp());
                pipelineSteps.push(new web_1.Web());
                pipelineSteps.push(new electron_1.Electron());
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
                    this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, assets, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (includeMode === undefined || includeMode === null || includeMode.length === 0) {
                includeMode = "both";
            }
            if (preload === undefined) {
                preload = false;
            }
            if (isPackage === undefined) {
                isPackage = false;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "includeMode", includeMode, ["app", "test", "both"])) {
                return 1;
            }
            this._logger.info("");
            if (uniteConfiguration.clientPackages[packageName]) {
                this._logger.error("Package has already been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                const missingVersion = version === null || version === undefined || version.length === 0;
                const missingMain = main === null || main === undefined || main.length === 0;
                if (missingVersion || missingMain) {
                    try {
                        const packageInfo = yield engineVariables.packageManager.info(packageName);
                        version = version || `^${packageInfo.version || "0.0.1"}`;
                        main = main || packageInfo.main;
                    }
                    catch (err) {
                        this._logger.error("Reading Package Information", err);
                        return 1;
                    }
                }
                if (main) {
                    main = main.replace(/\\/g, "/");
                    main = main.replace(/\.\//, "/");
                }
                if (mainMinified) {
                    mainMinified = mainMinified.replace(/\\/g, "/");
                    mainMinified = mainMinified.replace(/\.\//, "/");
                }
                const clientPackage = new uniteClientPackage_1.UniteClientPackage();
                clientPackage.version = version;
                clientPackage.preload = preload;
                clientPackage.main = main;
                clientPackage.mainMinified = mainMinified;
                clientPackage.isPackage = isPackage;
                clientPackage.includeMode = includeMode;
                clientPackage.assets = assets;
                uniteConfiguration.clientPackages[packageName] = clientPackage;
                yield engineVariables.packageManager.add(engineVariables.wwwRootFolder, packageName, version, false);
                const pipelineSteps = [];
                pipelineSteps.push(new karma_1.Karma());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    clientPackageRemove(packageName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.clientPackages[packageName]) {
                this._logger.error("Package has not been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                yield engineVariables.packageManager.remove(engineVariables.wwwRootFolder, packageName, false);
                delete uniteConfiguration.clientPackages[packageName];
                const pipelineSteps = [];
                pipelineSteps.push(new karma_1.Karma());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                if (bundle === undefined) {
                    bundle = false;
                }
                if (minify === undefined) {
                    minify = false;
                }
                if (sourcemaps === undefined) {
                    sourcemaps = true;
                }
                uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new uniteBuildConfiguration_1.UniteBuildConfiguration();
                uniteConfiguration.buildConfigurations[configurationName].bundle = bundle;
                uniteConfiguration.buildConfigurations[configurationName].minify = minify;
                uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps;
                uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};
                const pipelineSteps = [];
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.buildConfigurations[configurationName]) {
                this._logger.error("Build configuration has not been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                delete uniteConfiguration.buildConfigurations[configurationName];
                const pipelineSteps = [];
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    platformAdd(platformName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                uniteConfiguration.platforms[platformName] = uniteConfiguration.platforms[platformName] || {};
                uniteConfiguration.platforms[platformName].options = uniteConfiguration.platforms[platformName].options || {};
                const pipelineSteps = [];
                if (platformName === web_1.Web.PLATFORM) {
                    pipelineSteps.push(new web_1.Web());
                }
                if (platformName === electron_1.Electron.PLATFORM) {
                    pipelineSteps.push(new electron_1.Electron());
                }
                pipelineSteps.push(new packageJson_1.PackageJson());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    platformRemove(platformName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.platforms[platformName]) {
                this._logger.error("Platform has not been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration.packageManager, engineVariables);
            if (ret === 0) {
                delete uniteConfiguration.platforms[platformName];
                const pipelineSteps = [];
                if (platformName === web_1.Web.PLATFORM) {
                    pipelineSteps.push(new web_1.Web());
                }
                if (platformName === electron_1.Electron.PLATFORM) {
                    pipelineSteps.push(new electron_1.Electron());
                }
                pipelineSteps.push(new packageJson_1.PackageJson());
                pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    createEngineVariables(outputDirectory, packageManager, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.info("Loading dependencies", { core: this._engineRootFolder, dependenciesFile: "package.json" });
                engineVariables.corePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
            engineVariables.engineRootFolder = this._engineRootFolder;
            engineVariables.engineAssetsFolder = this._engineAssetsFolder;
            engineVariables.createDirectories(this._fileSystem, outputDirectory);
            if (packageManager === "Yarn") {
                engineVariables.packageManager = new yarnPackageManager_1.YarnPackageManager(this._logger, this._fileSystem);
            }
            else {
                engineVariables.packageManager = new npmPackageManager_1.NpmPackageManager(this._logger, this._fileSystem);
            }
            return 0;
        });
    }
    runPipeline(pipelineSteps, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.prerequisites(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQVF6RixtR0FBZ0c7QUFFaEcseUZBQXNGO0FBQ3RGLHlGQUFzRjtBQWdCdEYsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQUMzRSwyRUFBd0U7QUFDeEUsNkVBQTBFO0FBQzFFLHVFQUFvRTtBQUNwRSxvRUFBaUU7QUFDakUsa0VBQStEO0FBQy9ELDhFQUEyRTtBQUMzRSw4REFBMkQ7QUFDM0Qsd0VBQXFFO0FBQ3JFLGtFQUErRDtBQUMvRCx3RUFBcUU7QUFDckUsOERBQTJEO0FBQzNELHNFQUFtRTtBQUNuRSw0REFBeUQ7QUFDekQsdUVBQW9FO0FBQ3BFLCtFQUE0RTtBQUM1RSw4REFBMkQ7QUFDM0QsZ0VBQTZEO0FBQzdELGdFQUE2RDtBQUM3RCxvRUFBaUU7QUFDakUsMEVBQXVFO0FBQ3ZFLDRFQUF5RTtBQUN6RSwyREFBd0Q7QUFDeEQscUVBQWtFO0FBQ2xFLHlEQUFzRDtBQUN0RCx5REFBc0Q7QUFDdEQseURBQXNEO0FBQ3RELG1FQUFnRTtBQUNoRSxtRUFBZ0U7QUFDaEUsaUVBQThEO0FBQzlELHVEQUFvRDtBQUNwRCx1RUFBb0U7QUFDcEUsK0VBQTRFO0FBQzVFLCtFQUE0RTtBQUM1RSwyR0FBd0c7QUFDeEcsNkZBQTBGO0FBQzFGLHVHQUFvRztBQUNwRyxpRkFBOEU7QUFDOUUscUVBQWtFO0FBQ2xFLDREQUF5RDtBQUN6RCxvRUFBaUU7QUFDakUsd0VBQXFFO0FBQ3JFLGlFQUE4RDtBQUM5RCx1REFBb0Q7QUFFcEQ7SUFNSSxZQUFZLE1BQWUsRUFBRSxVQUF1QjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFB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Q0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQzVHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFybkJELHdCQXFuQkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVNwZHggfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeFwiO1xuaW1wb3J0IHsgSVNwZHhMaWNlbnNlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhMaWNlbnNlXCI7XG5pbXBvcnQgeyBJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9pbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgVW5pdGVBcHBsaWNhdGlvbkZyYW1ld29yayB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUFwcGxpY2F0aW9uRnJhbWV3b3JrXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVCdW5kbGVyIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQnVuZGxlclwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDc3NQb3N0UHJvY2Vzc29yIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ3NzUG9zdFByb2Nlc3NvclwiO1xuaW1wb3J0IHsgVW5pdGVDc3NQcmVQcm9jZXNzb3IgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDc3NQcmVQcm9jZXNzb3JcIjtcbmltcG9ydCB7IFVuaXRlRTJlVGVzdEZyYW1ld29yayB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUUyZVRlc3RGcmFtZXdvcmtcIjtcbmltcG9ydCB7IFVuaXRlRTJlVGVzdFJ1bm5lciB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUUyZVRlc3RSdW5uZXJcIjtcbmltcG9ydCB7IFVuaXRlTGludGVyIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlTGludGVyXCI7XG5pbXBvcnQgeyBVbml0ZU1vZHVsZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVNb2R1bGVUeXBlXCI7XG5pbXBvcnQgeyBVbml0ZVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlUGFja2FnZU1hbmFnZXJcIjtcbmltcG9ydCB7IFVuaXRlU291cmNlTGFuZ3VhZ2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVTb3VyY2VMYW5ndWFnZVwiO1xuaW1wb3J0IHsgVW5pdGVVbml0VGVzdEZyYW1ld29yayB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZVVuaXRUZXN0RnJhbWV3b3JrXCI7XG5pbXBvcnQgeyBVbml0ZVVuaXRUZXN0UnVubmVyIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlVW5pdFRlc3RSdW5uZXJcIjtcbmltcG9ydCB7IEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2J1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUVuZ2luZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVcIjtcbmltcG9ydCB7IElFbmdpbmVQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBNb2R1bGVPcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9tb2R1bGVPcGVyYXRpb25cIjtcbmltcG9ydCB7IFBsYXRmb3JtT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvcGxhdGZvcm1PcGVyYXRpb25cIjtcbmltcG9ydCB7IE5wbVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL3BhY2thZ2VNYW5hZ2Vycy9ucG1QYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgWWFyblBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL3BhY2thZ2VNYW5hZ2Vycy95YXJuUGFja2FnZU1hbmFnZXJcIjtcbmltcG9ydCB7IEF1cmVsaWEgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9hdXJlbGlhXCI7XG5pbXBvcnQgeyBQbGFpbkFwcCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3BsYWluQXBwXCI7XG5pbXBvcnQgeyBSZWFjdCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0XCI7XG5pbXBvcnQgeyBCcm93c2VyaWZ5IH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvYnVuZGxlci9icm93c2VyaWZ5XCI7XG5pbXBvcnQgeyBSZXF1aXJlSnMgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9idW5kbGVyL3JlcXVpcmVKc1wiO1xuaW1wb3J0IHsgU3lzdGVtSnNCdWlsZGVyIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvYnVuZGxlci9zeXN0ZW1Kc0J1aWxkZXJcIjtcbmltcG9ydCB7IFdlYnBhY2sgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9idW5kbGVyL3dlYnBhY2tcIjtcbmltcG9ydCB7IEFzc2V0c1NvdXJjZSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlXCI7XG5pbXBvcnQgeyBHaXRJZ25vcmUgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jb250ZW50L2dpdElnbm9yZVwiO1xuaW1wb3J0IHsgSHRtbFRlbXBsYXRlIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY29udGVudC9odG1sVGVtcGxhdGVcIjtcbmltcG9ydCB7IExpY2Vuc2UgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jb250ZW50L2xpY2Vuc2VcIjtcbmltcG9ydCB7IFBhY2thZ2VKc29uIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY29udGVudC9wYWNrYWdlSnNvblwiO1xuaW1wb3J0IHsgUmVhZE1lIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY29udGVudC9yZWFkTWVcIjtcbmltcG9ydCB7IFBvc3RDc3MgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jc3NQb3N0UHJvY2Vzc29yL3Bvc3RDc3NcIjtcbmltcG9ydCB7IFBvc3RDc3NOb25lIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY3NzUG9zdFByb2Nlc3Nvci9wb3N0Q3NzTm9uZVwiO1xuaW1wb3J0IHsgQ3NzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL2Nzc1wiO1xuaW1wb3J0IHsgTGVzcyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9sZXNzXCI7XG5pbXBvcnQgeyBTYXNzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL3Nhc3NcIjtcbmltcG9ydCB7IFN0eWx1cyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9zdHlsdXNcIjtcbmltcG9ydCB7IFByb3RyYWN0b3IgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3Byb3RyYWN0b3JcIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci93ZWJkcml2ZXJJb1wiO1xuaW1wb3J0IHsgQmFiZWwgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9sYW5ndWFnZS9iYWJlbFwiO1xuaW1wb3J0IHsgVHlwZVNjcmlwdCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHRcIjtcbmltcG9ydCB7IEVzTGludCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2xpbnQvZXNMaW50XCI7XG5pbXBvcnQgeyBUc0xpbnQgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9saW50L3RzTGludFwiO1xuaW1wb3J0IHsgQW1kIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9hbWRcIjtcbmltcG9ydCB7IENvbW1vbkpzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9jb21tb25Kc1wiO1xuaW1wb3J0IHsgU3lzdGVtSnMgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL3N5c3RlbUpzXCI7XG5pbXBvcnQgeyBFbGVjdHJvbiB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2VsZWN0cm9uXCI7XG5pbXBvcnQgeyBXZWIgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9wbGF0Zm9ybS93ZWJcIjtcbmltcG9ydCB7IEFwcFNjYWZmb2xkIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvYXBwU2NhZmZvbGRcIjtcbmltcG9ydCB7IEUyZVRlc3RTY2FmZm9sZCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL2UyZVRlc3RTY2FmZm9sZFwiO1xuaW1wb3J0IHsgT3V0cHV0RGlyZWN0b3J5IH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvb3V0cHV0RGlyZWN0b3J5XCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb25EaXJlY3RvcmllcyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdGVDb25maWd1cmF0aW9uSnNvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uXCI7XG5pbXBvcnQgeyBVbml0VGVzdFNjYWZmb2xkIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdFRlc3RTY2FmZm9sZFwiO1xuaW1wb3J0IHsgQnJvd3NlclN5bmMgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zZXJ2ZXIvYnJvd3NlclN5bmNcIjtcbmltcG9ydCB7IEd1bHAgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy90YXNrTWFuYWdlci9ndWxwXCI7XG5pbXBvcnQgeyBKYXNtaW5lIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvdGVzdEZyYW1ld29yay9qYXNtaW5lXCI7XG5pbXBvcnQgeyBNb2NoYUNoYWkgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL21vY2hhQ2hhaVwiO1xuaW1wb3J0IHsgS2FybWEgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy91bml0VGVzdFJ1bm5lci9rYXJtYVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmUgaW1wbGVtZW50cyBJRW5naW5lIHtcbiAgICBwcml2YXRlIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJpdmF0ZSBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuICAgICAgICB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiL2Fzc2V0cy9cIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShwYWNrYWdlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbGljZW5zZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBVbml0ZVNvdXJjZUxhbmd1YWdlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFVuaXRlTW9kdWxlVHlwZSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVyOiBVbml0ZUJ1bmRsZXIgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFVuaXRlVW5pdFRlc3RSdW5uZXIgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFVuaXRlVW5pdFRlc3RGcmFtZXdvcmsgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogVW5pdGVFMmVUZXN0UnVubmVyIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFVuaXRlRTJlVGVzdEZyYW1ld29yayB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBsaW50ZXI6IFVuaXRlTGludGVyIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc1ByZTogVW5pdGVDc3NQcmVQcm9jZXNzb3IgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzUG9zdDogVW5pdGVDc3NQb3N0UHJvY2Vzc29yIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBVbml0ZVBhY2thZ2VNYW5hZ2VyIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBVbml0ZUFwcGxpY2F0aW9uRnJhbWV3b3JrIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIG91dHB1dERpcmVjdG9yeSA9IHRoaXMuY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lID0gcGFja2FnZU5hbWUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUgPSB0aXRsZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlID0gbGljZW5zZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID0gc291cmNlTGFuZ3VhZ2UgfHwgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9IG1vZHVsZVR5cGUgfHwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID0gYnVuZGxlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID0gdW5pdFRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPSB1bml0VGVzdEZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID0gZTJlVGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPSBlMmVUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID0gbGludGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciB8fCBcIk5wbVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIgPSBcIkd1bHBcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNlcnZlciA9IFwiQnJvd3NlclN5bmNcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gYXBwbGljYXRpb25GcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUgPSBjc3NQcmUgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QgPSBjc3NQb3N0IHx8IHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQb3N0O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zIHx8IHt9O1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucy5kZXYgPSB7IGJ1bmRsZTogZmFsc2UsIG1pbmlmeTogZmFsc2UsIHNvdXJjZW1hcHM6IHRydWUsIHZhcmlhYmxlczoge30gfTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLnByb2QgPSB7IGJ1bmRsZTogdHJ1ZSwgbWluaWZ5OiB0cnVlLCBzb3VyY2VtYXBzOiBmYWxzZSwgdmFyaWFibGVzOiB7fSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgfHwgeyBXZWI6IHt9IH07XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrUGFja2FnZU5hbWUodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwidGl0bGVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnRpdGxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3BkeExpY2Vuc2U6IElTcGR4TGljZW5zZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxpY2Vuc2VEYXRhID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248SVNwZHg+KHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlciwgXCJzcGR4LWZ1bGwuanNvblwiKTtcbiAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPHN0cmluZz4odGhpcy5fbG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxpY2Vuc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGxpY2Vuc2VEYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2VzIG5vdCBtYXRjaCBhbnkgb2YgdGhlIHBvc3NpYmxlIFNQRFggbGljZW5zZSB2YWx1ZXMgKHNlZSBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzLykuXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNwZHhMaWNlbnNlID0gbGljZW5zZURhdGFbdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2VdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSB3YXMgYSBwcm9ibGVtIHJlYWRpbmcgdGhlIHNwZHgtZnVsbC5qc29uIGZpbGVcIiwgZSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlU291cmNlTGFuZ3VhZ2U+KHRoaXMuX2xvZ2dlciwgXCJzb3VyY2VMYW5ndWFnZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFtcIkphdmFTY3JpcHRcIiwgXCJUeXBlU2NyaXB0XCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVNb2R1bGVUeXBlPih0aGlzLl9sb2dnZXIsIFwibW9kdWxlVHlwZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgW1wiQU1EXCIsIFwiQ29tbW9uSlNcIiwgXCJTeXN0ZW1KU1wiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlQnVuZGxlcj4odGhpcy5fbG9nZ2VyLCBcImJ1bmRsZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFtcIkJyb3dzZXJpZnlcIiwgXCJSZXF1aXJlSlNcIiwgXCJTeXN0ZW1KU0J1aWxkZXJcIiwgXCJXZWJwYWNrXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVVbml0VGVzdFJ1bm5lcj4odGhpcy5fbG9nZ2VyLCBcInVuaXRUZXN0UnVubmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgW1wiTm9uZVwiLCBcIkthcm1hXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRUZXN0UnVubmVyID09PSBcIk5vbmVcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRUZXN0RnJhbWV3b3JrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJ1bml0VGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgdW5pdFRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlVW5pdFRlc3RGcmFtZXdvcms+KHRoaXMuX2xvZ2dlciwgXCJ1bml0VGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmssIFtcIk1vY2hhLUNoYWlcIiwgXCJKYXNtaW5lXCJdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlRTJlVGVzdFJ1bm5lcj4odGhpcy5fbG9nZ2VyLCBcImUyZVRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFtcIk5vbmVcIiwgXCJXZWJkcml2ZXJJT1wiLCBcIlByb3RyYWN0b3JcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZTJlVGVzdFJ1bm5lciA9PT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGlmIChlMmVUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIGUyZVRlc3RGcmFtZXdvcmsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcImUyZVRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIGUyZVRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlRTJlVGVzdEZyYW1ld29yaz4odGhpcy5fbG9nZ2VyLCBcImUyZVRlc3RGcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmssIFtcIk1vY2hhLUNoYWlcIiwgXCJKYXNtaW5lXCJdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlTGludGVyPih0aGlzLl9sb2dnZXIsIFwibGludGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFtcIk5vbmVcIiwgXCJFU0xpbnRcIiwgXCJUU0xpbnRcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxVbml0ZUNzc1ByZVByb2Nlc3Nvcj4odGhpcy5fbG9nZ2VyLCBcImNzc1ByZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLCBbXCJDc3NcIiwgXCJMZXNzXCIsIFwiU2Fzc1wiLCBcIlN0eWx1c1wiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlQ3NzUG9zdFByb2Nlc3Nvcj4odGhpcy5fbG9nZ2VyLCBcImNzc1Bvc3RcIiwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QsIFtcIk5vbmVcIiwgXCJQb3N0Q3NzXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVQYWNrYWdlTWFuYWdlcj4odGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciwgW1wiTnBtXCIsIFwiWWFyblwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlQXBwbGljYXRpb25GcmFtZXdvcms+KHRoaXMuX2xvZ2dlciwgXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmssIFtcIlBsYWluQXBwXCIsIFwiQXVyZWxpYVwiLCBcIlJlYWN0XCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmVSdW4ob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIHNwZHhMaWNlbnNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY2xpZW50UGFja2FnZShvcGVyYXRpb246IE1vZHVsZU9wZXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBJbmNsdWRlTW9kZSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogVW5pdGVQYWNrYWdlTWFuYWdlciB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgb3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5KTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxNb2R1bGVPcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgb3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIHBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxVbml0ZVBhY2thZ2VNYW5hZ2VyPih0aGlzLl9sb2dnZXIsIFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBbXCJOcG1cIiwgXCJZYXJuXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnRQYWNrYWdlQWRkKHBhY2thZ2VOYW1lLCB2ZXJzaW9uLCBwcmVsb2FkLCBpbmNsdWRlTW9kZSwgbWFpbiwgbWFpbk1pbmlmaWVkLCBpc1BhY2thZ2UsIGFzc2V0cywgb3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50UGFja2FnZVJlbW92ZShwYWNrYWdlTmFtZSwgb3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbihvcGVyYXRpb246IEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmlmeTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZW1hcHM6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBvdXRwdXREaXJlY3RvcnkgPSB0aGlzLmNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3RvcnkpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxCdWlsZENvbmZpZ3VyYXRpb25PcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgb3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcImNvbmZpZ3VyYXRpb25OYW1lXCIsIGNvbmZpZ3VyYXRpb25OYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5idWlsZENvbmZpZ3VyYXRpb25BZGQoY29uZmlndXJhdGlvbk5hbWUsIGJ1bmRsZSwgbWluaWZ5LCBzb3VyY2VtYXBzLCBvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5idWlsZENvbmZpZ3VyYXRpb25SZW1vdmUoY29uZmlndXJhdGlvbk5hbWUsIG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwbGF0Zm9ybShvcGVyYXRpb246IFBsYXRmb3JtT3BlcmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBvdXRwdXREaXJlY3RvcnkgPSB0aGlzLmNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3RvcnkpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8UGxhdGZvcm1PcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgb3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxzdHJpbmc+KHRoaXMuX2xvZ2dlciwgXCJwbGF0Zm9ybU5hbWVcIiwgcGxhdGZvcm1OYW1lLCBbV2ViLlBMQVRGT1JNLCBFbGVjdHJvbi5QTEFURk9STV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsYXRmb3JtQWRkKHBsYXRmb3JtTmFtZSwgb3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGxhdGZvcm1SZW1vdmUocGxhdGZvcm1OYW1lLCBvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG91dHB1dERpcmVjdG9yeSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dERpcmVjdG9yeSA9PT0gbnVsbCB8fCBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBvdXRwdXQgZGlyZWN0b3J5IHNwZWNpZmllZCBzbyB1c2UgY3VycmVudFxuICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5ID0gXCIuL1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXREaXJlY3Rvcnk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyk6IFByb21pc2U8VW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgdW5pdGUuanNvbiB3ZSBjYW4gbG9hZCBmb3IgZGVmYXVsdCBvcHRpb25zXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZUNvbmZpZ3VyYXRpb24+KG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIGV4aXN0aW5nIHVuaXRlLmpzb25cIiwgZSk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNvbmZpZ3VyZVJ1bihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGxpY2Vuc2U6IElTcGR4TGljZW5zZSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubGljZW5zZSA9IGxpY2Vuc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBPdXRwdXREaXJlY3RvcnkoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEFwcFNjYWZmb2xkKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBVbml0VGVzdFNjYWZmb2xkKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBFMmVUZXN0U2NhZmZvbGQoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgR3VscCgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgV2ViKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBFbGVjdHJvbigpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBBbWQoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IENvbW1vbkpzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBTeXN0ZW1KcygpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBCcm93c2VyaWZ5KCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBSZXF1aXJlSnMoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFN5c3RlbUpzQnVpbGRlcigpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgV2VicGFjaygpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBIdG1sVGVtcGxhdGUoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQ3NzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBMZXNzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBTYXNzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBTdHlsdXMoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUG9zdENzcygpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUG9zdENzc05vbmUoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgTW9jaGFDaGFpKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBKYXNtaW5lKCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFBsYWluQXBwKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBBdXJlbGlhKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBSZWFjdCgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBCYWJlbCgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVHlwZVNjcmlwdCgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBXZWJkcml2ZXJJbygpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUHJvdHJhY3RvcigpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBFc0xpbnQoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFRzTGludCgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgS2FybWEoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQnJvd3NlclN5bmMoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUmVhZE1lKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBHaXRJZ25vcmUoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IExpY2Vuc2UoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQXNzZXRzU291cmNlKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBQYWNrYWdlSnNvbigpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXMoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbigpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhcIllvdSBzaG91bGQgcHJvYmFibHkgcnVuIG5wbSBpbnN0YWxsIC8geWFybiBpbnN0YWxsIGJlZm9yZSBydW5uaW5nIGFueSBndWxwIGNvbW1hbmRzLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZUFkZChwYWNrYWdlTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAoaW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fCBpbmNsdWRlTW9kZSA9PT0gbnVsbCB8fCBpbmNsdWRlTW9kZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGluY2x1ZGVNb2RlID0gXCJib3RoXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlbG9hZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcmVsb2FkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQYWNrYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlzUGFja2FnZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJpbmNsdWRlTW9kZVwiLCBpbmNsdWRlTW9kZSwgW1wiYXBwXCIsIFwidGVzdFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbWlzc2luZ1ZlcnNpb24gPSB2ZXJzaW9uID09PSBudWxsIHx8IHZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCB2ZXJzaW9uLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gbWFpbiA9PT0gbnVsbCB8fCBtYWluID09PSB1bmRlZmluZWQgfHwgbWFpbi5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBpZiAobWlzc2luZ1ZlcnNpb24gfHwgbWlzc2luZ01haW4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKHBhY2thZ2VOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uID0gdmVyc2lvbiB8fCBgXiR7cGFja2FnZUluZm8udmVyc2lvbiB8fCBcIjAuMC4xXCJ9YDtcbiAgICAgICAgICAgICAgICAgICAgbWFpbiA9IG1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUmVhZGluZyBQYWNrYWdlIEluZm9ybWF0aW9uXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1haW4pIHtcbiAgICAgICAgICAgICAgICBtYWluID0gbWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBtYWluID0gbWFpbi5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkID0gbWFpbk1pbmlmaWVkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZC5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFBhY2thZ2UgPSBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCk7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gcHJlbG9hZDtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IG1haW47XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZDtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gaXNQYWNrYWdlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGluY2x1ZGVNb2RlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhc3NldHM7XG5cbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV0gPSBjbGllbnRQYWNrYWdlO1xuXG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBwYWNrYWdlTmFtZSwgdmVyc2lvbiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBJRW5naW5lUGlwZWxpbmVTdGVwW10gPSBbXTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgS2FybWEoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VSZW1vdmUocGFja2FnZU5hbWU6IHN0cmluZywgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIucmVtb3ZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBwYWNrYWdlTmFtZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBkZWxldGUgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW3BhY2thZ2VOYW1lXTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgS2FybWEoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pZnk6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlbWFwczogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoYnVuZGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBidW5kbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1pbmlmeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWluaWZ5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzb3VyY2VtYXBzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VtYXBzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdIHx8IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0uYnVuZGxlID0gYnVuZGxlO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdLm1pbmlmeSA9IG1pbmlmeTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS5zb3VyY2VtYXBzID0gc291cmNlbWFwcztcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS52YXJpYWJsZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0udmFyaWFibGVzIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBJRW5naW5lUGlwZWxpbmVTdGVwW10gPSBbXTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpKTtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvblJlbW92ZShjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkJ1aWxkIGNvbmZpZ3VyYXRpb24gaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV07XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uKCkpO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGxhdGZvcm1BZGQocGxhdGZvcm1OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSB8fCB7fTtcblxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1twbGF0Zm9ybU5hbWVdLm9wdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV0ub3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG4gICAgICAgICAgICBpZiAocGxhdGZvcm1OYW1lID09PSBXZWIuUExBVEZPUk0pIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFdlYigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwbGF0Zm9ybU5hbWUgPT09IEVsZWN0cm9uLlBMQVRGT1JNKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBFbGVjdHJvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUGFja2FnZUpzb24oKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHMsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwbGF0Zm9ybVJlbW92ZShwbGF0Zm9ybU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGxhdGZvcm0gaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV07XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKHBsYXRmb3JtTmFtZSA9PT0gV2ViLlBMQVRGT1JNKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBXZWIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGxhdGZvcm1OYW1lID09PSBFbGVjdHJvbi5QTEFURk9STSkge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgRWxlY3Ryb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFBhY2thZ2VKc29uKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uKCkpO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU1hbmFnZXI6IFVuaXRlUGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9hZGluZyBkZXBlbmRlbmNpZXNcIiwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuXG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuY29yZVBhY2thZ2VKc29uID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkxvYWRpbmcgZGVwZW5kZW5jaWVzIGZhaWxlZFwiLCBlcnIsIHsgY29yZTogdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgZGVwZW5kZW5jaWVzRmlsZTogXCJwYWNrYWdlLmpzb25cIiB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9lbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuY3JlYXRlRGlyZWN0b3JpZXModGhpcy5fZmlsZVN5c3RlbSwgb3V0cHV0RGlyZWN0b3J5KTtcblxuICAgICAgICBpZiAocGFja2FnZU1hbmFnZXIgPT09IFwiWWFyblwiKSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIgPSBuZXcgWWFyblBhY2thZ2VNYW5hZ2VyKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIgPSBuZXcgTnBtUGFja2FnZU1hbmFnZXIodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVN0ZXBzKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAucHJlcmVxdWlzaXRlcyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVTdGVwcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLnByb2Nlc3ModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
