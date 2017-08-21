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
const assets_1 = require("../pipelineSteps/content/assets");
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
const npm_1 = require("../pipelineSteps/packageManager/npm");
const yarn_1 = require("../pipelineSteps/packageManager/yarn");
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
                pipelineSteps.push(new npm_1.Npm());
                pipelineSteps.push(new yarn_1.Yarn());
                pipelineSteps.push(new browserSync_1.BrowserSync());
                pipelineSteps.push(new readMe_1.ReadMe());
                pipelineSteps.push(new gitIgnore_1.GitIgnore());
                pipelineSteps.push(new license_1.License());
                pipelineSteps.push(new assets_1.Assets());
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
                engineVariables.enginePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
            engineVariables.engineRootFolder = this._engineRootFolder;
            engineVariables.engineAssetsFolder = this._engineAssetsFolder;
            engineVariables.setupDirectories(this._fileSystem, outputDirectory);
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
                const ret = yield pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQVF6RixtR0FBZ0c7QUFFaEcseUZBQXNGO0FBQ3RGLHlGQUFzRjtBQWdCdEYsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQUMzRSwyRUFBd0U7QUFDeEUsNkVBQTBFO0FBQzFFLHVFQUFvRTtBQUNwRSxvRUFBaUU7QUFDakUsa0VBQStEO0FBQy9ELDhFQUEyRTtBQUMzRSw4REFBMkQ7QUFDM0QsNERBQXlEO0FBQ3pELGtFQUErRDtBQUMvRCx3RUFBcUU7QUFDckUsOERBQTJEO0FBQzNELHNFQUFtRTtBQUNuRSw0REFBeUQ7QUFDekQsdUVBQW9FO0FBQ3BFLCtFQUE0RTtBQUM1RSw4REFBMkQ7QUFDM0QsZ0VBQTZEO0FBQzdELGdFQUE2RDtBQUM3RCxvRUFBaUU7QUFDakUsMEVBQXVFO0FBQ3ZFLDRFQUF5RTtBQUN6RSwyREFBd0Q7QUFDeEQscUVBQWtFO0FBQ2xFLHlEQUFzRDtBQUN0RCx5REFBc0Q7QUFDdEQseURBQXNEO0FBQ3RELG1FQUFnRTtBQUNoRSxtRUFBZ0U7QUFDaEUsNkRBQTBEO0FBQzFELCtEQUE0RDtBQUM1RCxpRUFBOEQ7QUFDOUQsdURBQW9EO0FBQ3BELHVFQUFvRTtBQUNwRSwrRUFBNEU7QUFDNUUsK0VBQTRFO0FBQzVFLDJHQUF3RztBQUN4Ryw2RkFBMEY7QUFDMUYsdUdBQW9HO0FBQ3BHLGlGQUE4RTtBQUM5RSxxRUFBa0U7QUFDbEUsNERBQXlEO0FBQ3pELG9FQUFpRTtBQUNqRSx3RUFBcUU7QUFDckUsaUVBQThEO0FBQzlELHVEQUFvRDtBQUVwRDtJQU1JLFlBQVksTUFBZSxFQUFFLFVBQXVCO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENB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QUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7WUFDTCxDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDNUcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXhuQkQsd0JBd25CQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJU3BkeCB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9zcGR4L0lTcGR4XCI7XG5pbXBvcnQgeyBJU3BkeExpY2Vuc2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeExpY2Vuc2VcIjtcbmltcG9ydCB7IEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL2luY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUFwcGxpY2F0aW9uRnJhbWV3b3JrIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQXBwbGljYXRpb25GcmFtZXdvcmtcIjtcbmltcG9ydCB7IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQnVpbGRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUJ1bmRsZXIgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdW5kbGVyXCI7XG5pbXBvcnQgeyBVbml0ZUNsaWVudFBhY2thZ2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNzc1Bvc3RQcm9jZXNzb3IgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDc3NQb3N0UHJvY2Vzc29yXCI7XG5pbXBvcnQgeyBVbml0ZUNzc1ByZVByb2Nlc3NvciB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNzc1ByZVByb2Nlc3NvclwiO1xuaW1wb3J0IHsgVW5pdGVFMmVUZXN0RnJhbWV3b3JrIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlRTJlVGVzdEZyYW1ld29ya1wiO1xuaW1wb3J0IHsgVW5pdGVFMmVUZXN0UnVubmVyIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlRTJlVGVzdFJ1bm5lclwiO1xuaW1wb3J0IHsgVW5pdGVMaW50ZXIgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVMaW50ZXJcIjtcbmltcG9ydCB7IFVuaXRlTW9kdWxlVHlwZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZU1vZHVsZVR5cGVcIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZU1hbmFnZXIgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVW5pdGVTb3VyY2VMYW5ndWFnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZVNvdXJjZUxhbmd1YWdlXCI7XG5pbXBvcnQgeyBVbml0ZVVuaXRUZXN0RnJhbWV3b3JrIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlVW5pdFRlc3RGcmFtZXdvcmtcIjtcbmltcG9ydCB7IFVuaXRlVW5pdFRlc3RSdW5uZXIgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVVbml0VGVzdFJ1bm5lclwiO1xuaW1wb3J0IHsgQnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IE1vZHVsZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL21vZHVsZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgUGxhdGZvcm1PcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9wbGF0Zm9ybU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgTnBtUGFja2FnZU1hbmFnZXIgfSBmcm9tIFwiLi4vcGFja2FnZU1hbmFnZXJzL25wbVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBZYXJuUGFja2FnZU1hbmFnZXIgfSBmcm9tIFwiLi4vcGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgQXVyZWxpYSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWFcIjtcbmltcG9ydCB7IFBsYWluQXBwIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcGxhaW5BcHBcIjtcbmltcG9ydCB7IFJlYWN0IH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcmVhY3RcIjtcbmltcG9ydCB7IEJyb3dzZXJpZnkgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9idW5kbGVyL2Jyb3dzZXJpZnlcIjtcbmltcG9ydCB7IFJlcXVpcmVKcyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2J1bmRsZXIvcmVxdWlyZUpzXCI7XG5pbXBvcnQgeyBTeXN0ZW1Kc0J1aWxkZXIgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9idW5kbGVyL3N5c3RlbUpzQnVpbGRlclwiO1xuaW1wb3J0IHsgV2VicGFjayB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2J1bmRsZXIvd2VicGFja1wiO1xuaW1wb3J0IHsgQXNzZXRzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY29udGVudC9hc3NldHNcIjtcbmltcG9ydCB7IEdpdElnbm9yZSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGUgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jb250ZW50L2h0bWxUZW1wbGF0ZVwiO1xuaW1wb3J0IHsgTGljZW5zZSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZVwiO1xuaW1wb3J0IHsgUGFja2FnZUpzb24gfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uXCI7XG5pbXBvcnQgeyBSZWFkTWUgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jb250ZW50L3JlYWRNZVwiO1xuaW1wb3J0IHsgUG9zdENzcyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzc1wiO1xuaW1wb3J0IHsgUG9zdENzc05vbmUgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jc3NQb3N0UHJvY2Vzc29yL3Bvc3RDc3NOb25lXCI7XG5pbXBvcnQgeyBDc3MgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jc3NQcmVQcm9jZXNzb3IvY3NzXCI7XG5pbXBvcnQgeyBMZXNzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL2xlc3NcIjtcbmltcG9ydCB7IFNhc3MgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9jc3NQcmVQcm9jZXNzb3Ivc2Fzc1wiO1xuaW1wb3J0IHsgU3R5bHVzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL3N0eWx1c1wiO1xuaW1wb3J0IHsgUHJvdHJhY3RvciB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3RvclwiO1xuaW1wb3J0IHsgV2ViZHJpdmVySW8gfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3dlYmRyaXZlcklvXCI7XG5pbXBvcnQgeyBCYWJlbCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0IH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvdHlwZVNjcmlwdFwiO1xuaW1wb3J0IHsgRXNMaW50IH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvbGludC9lc0xpbnRcIjtcbmltcG9ydCB7IFRzTGludCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50XCI7XG5pbXBvcnQgeyBBbWQgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2FtZFwiO1xuaW1wb3J0IHsgQ29tbW9uSnMgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2NvbW1vbkpzXCI7XG5pbXBvcnQgeyBTeXN0ZW1KcyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvc3lzdGVtSnNcIjtcbmltcG9ydCB7IE5wbSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL25wbVwiO1xuaW1wb3J0IHsgWWFybiB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL3lhcm5cIjtcbmltcG9ydCB7IEVsZWN0cm9uIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvcGxhdGZvcm0vZWxlY3Ryb25cIjtcbmltcG9ydCB7IFdlYiB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL3dlYlwiO1xuaW1wb3J0IHsgQXBwU2NhZmZvbGQgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC9hcHBTY2FmZm9sZFwiO1xuaW1wb3J0IHsgRTJlVGVzdFNjYWZmb2xkIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvZTJlVGVzdFNjYWZmb2xkXCI7XG5pbXBvcnQgeyBPdXRwdXREaXJlY3RvcnkgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC9vdXRwdXREaXJlY3RvcnlcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzIH0gZnJvbSBcIi4uL3BpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXNcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbkpzb24gfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCI7XG5pbXBvcnQgeyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24gfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIjtcbmltcG9ydCB7IFVuaXRUZXN0U2NhZmZvbGQgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0VGVzdFNjYWZmb2xkXCI7XG5pbXBvcnQgeyBCcm93c2VyU3luYyB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3NlcnZlci9icm93c2VyU3luY1wiO1xuaW1wb3J0IHsgR3VscCB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHBcIjtcbmltcG9ydCB7IEphc21pbmUgfSBmcm9tIFwiLi4vcGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL2phc21pbmVcIjtcbmltcG9ydCB7IE1vY2hhQ2hhaSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpXCI7XG5pbXBvcnQgeyBLYXJtYSB9IGZyb20gXCIuLi9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEVuZ2luZSBpbXBsZW1lbnRzIElFbmdpbmUge1xuICAgIHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lQXNzZXRzRm9sZGVyOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi9cIik7XG4gICAgICAgIHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCIvYXNzZXRzL1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKHBhY2thZ2VOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBsaWNlbnNlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFVuaXRlU291cmNlTGFuZ3VhZ2UgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogVW5pdGVNb2R1bGVUeXBlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFVuaXRlQnVuZGxlciB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogVW5pdGVVbml0VGVzdFJ1bm5lciB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogVW5pdGVVbml0VGVzdEZyYW1ld29yayB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBVbml0ZUUyZVRlc3RSdW5uZXIgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogVW5pdGVFMmVUZXN0RnJhbWV3b3JrIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbnRlcjogVW5pdGVMaW50ZXIgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzUHJlOiBVbml0ZUNzc1ByZVByb2Nlc3NvciB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NQb3N0OiBVbml0ZUNzc1Bvc3RQcm9jZXNzb3IgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFVuaXRlUGFja2FnZU1hbmFnZXIgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFVuaXRlQXBwbGljYXRpb25GcmFtZXdvcmsgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgb3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUgPSBwYWNrYWdlTmFtZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZSA9IHRpdGxlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UgPSBsaWNlbnNlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPSBzb3VyY2VMYW5ndWFnZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2U7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID0gbW9kdWxlVHlwZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIgPSBidW5kbGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPSB1bml0VGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9IHVuaXRUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPSBlMmVUZXN0UnVubmVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9IGUyZVRlc3RGcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPSBsaW50ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gcGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyIHx8IFwiTnBtXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciA9IFwiR3VscFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc2VydmVyID0gXCJCcm93c2VyU3luY1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPSBhcHBsaWNhdGlvbkZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSA9IGNzc1ByZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCA9IGNzc1Bvc3QgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3Q7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLmRldiA9IHsgYnVuZGxlOiBmYWxzZSwgbWluaWZ5OiBmYWxzZSwgc291cmNlbWFwczogdHJ1ZSwgdmFyaWFibGVzOiB7fSB9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMucHJvZCA9IHsgYnVuZGxlOiB0cnVlLCBtaW5pZnk6IHRydWUsIHNvdXJjZW1hcHM6IGZhbHNlLCB2YXJpYWJsZXM6IHt9IH07XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyB8fCB7IFdlYjoge30gfTtcblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tQYWNrYWdlTmFtZSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJ0aXRsZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGR4TGljZW5zZTogSVNwZHhMaWNlbnNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGljZW5zZURhdGEgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxJU3BkeD4odGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcInNwZHgtZnVsbC5qc29uXCIpO1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8c3RyaW5nPih0aGlzLl9sb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobGljZW5zZURhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgcG9zc2libGUgU1BEWCBsaWNlbnNlIHZhbHVlcyAoc2VlIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvKS5cIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3BkeExpY2Vuc2UgPSBsaWNlbnNlRGF0YVt1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIHdhcyBhIHByb2JsZW0gcmVhZGluZyB0aGUgc3BkeC1mdWxsLmpzb24gZmlsZVwiLCBlKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVTb3VyY2VMYW5ndWFnZT4odGhpcy5fbG9nZ2VyLCBcInNvdXJjZUxhbmd1YWdlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgW1wiSmF2YVNjcmlwdFwiLCBcIlR5cGVTY3JpcHRcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxVbml0ZU1vZHVsZVR5cGU+KHRoaXMuX2xvZ2dlciwgXCJtb2R1bGVUeXBlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBbXCJBTURcIiwgXCJDb21tb25KU1wiLCBcIlN5c3RlbUpTXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVCdW5kbGVyPih0aGlzLl9sb2dnZXIsIFwiYnVuZGxlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgW1wiQnJvd3NlcmlmeVwiLCBcIlJlcXVpcmVKU1wiLCBcIlN5c3RlbUpTQnVpbGRlclwiLCBcIldlYnBhY2tcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxVbml0ZVVuaXRUZXN0UnVubmVyPih0aGlzLl9sb2dnZXIsIFwidW5pdFRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBbXCJOb25lXCIsIFwiS2FybWFcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdFRlc3RSdW5uZXIgPT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAodW5pdFRlc3RGcmFtZXdvcmsgIT09IG51bGwgJiYgdW5pdFRlc3RGcmFtZXdvcmsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcInVuaXRUZXN0RnJhbWV3b3JrIGlzIG5vdCB2YWxpZCBpZiB1bml0VGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVVbml0VGVzdEZyYW1ld29yaz4odGhpcy5fbG9nZ2VyLCBcInVuaXRUZXN0RnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgW1wiTW9jaGEtQ2hhaVwiLCBcIkphc21pbmVcIl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVFMmVUZXN0UnVubmVyPih0aGlzLl9sb2dnZXIsIFwiZTJlVGVzdFJ1bm5lclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgW1wiTm9uZVwiLCBcIldlYmRyaXZlcklPXCIsIFwiUHJvdHJhY3RvclwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlMmVUZXN0UnVubmVyID09PSBcIk5vbmVcIikge1xuICAgICAgICAgICAgaWYgKGUyZVRlc3RGcmFtZXdvcmsgIT09IG51bGwgJiYgZTJlVGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiZTJlVGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgZTJlVGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVFMmVUZXN0RnJhbWV3b3JrPih0aGlzLl9sb2dnZXIsIFwiZTJlVGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yaywgW1wiTW9jaGEtQ2hhaVwiLCBcIkphc21pbmVcIl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVMaW50ZXI+KHRoaXMuX2xvZ2dlciwgXCJsaW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciwgW1wiTm9uZVwiLCBcIkVTTGludFwiLCBcIlRTTGludFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlQ3NzUHJlUHJvY2Vzc29yPih0aGlzLl9sb2dnZXIsIFwiY3NzUHJlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFtcIkNzc1wiLCBcIkxlc3NcIiwgXCJTYXNzXCIsIFwiU3R5bHVzXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVDc3NQb3N0UHJvY2Vzc29yPih0aGlzLl9sb2dnZXIsIFwiY3NzUG9zdFwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCwgW1wiTm9uZVwiLCBcIlBvc3RDc3NcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxVbml0ZVBhY2thZ2VNYW5hZ2VyPih0aGlzLl9sb2dnZXIsIFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBbXCJOcG1cIiwgXCJZYXJuXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8VW5pdGVBcHBsaWNhdGlvbkZyYW1ld29yaz4odGhpcy5fbG9nZ2VyLCBcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yaywgW1wiUGxhaW5BcHBcIiwgXCJBdXJlbGlhXCIsIFwiUmVhY3RcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyZVJ1bihvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgc3BkeExpY2Vuc2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjbGllbnRQYWNrYWdlKG9wZXJhdGlvbjogTW9kdWxlT3BlcmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IEluY2x1ZGVNb2RlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBVbml0ZVBhY2thZ2VNYW5hZ2VyIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBvdXRwdXREaXJlY3RvcnkgPSB0aGlzLmNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3RvcnkpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPE1vZHVsZU9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgcGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPFVuaXRlUGFja2FnZU1hbmFnZXI+KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIFtcIk5wbVwiLCBcIllhcm5cIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNsaWVudFBhY2thZ2VBZGQocGFja2FnZU5hbWUsIHZlcnNpb24sIHByZWxvYWQsIGluY2x1ZGVNb2RlLCBtYWluLCBtYWluTWluaWZpZWQsIGlzUGFja2FnZSwgYXNzZXRzLCBvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnRQYWNrYWdlUmVtb3ZlKHBhY2thZ2VOYW1lLCBvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYnVpbGRDb25maWd1cmF0aW9uKG9wZXJhdGlvbjogQnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaWZ5OiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlbWFwczogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIG91dHB1dERpcmVjdG9yeSA9IHRoaXMuY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwiY29uZmlndXJhdGlvbk5hbWVcIiwgY29uZmlndXJhdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZSwgYnVuZGxlLCBtaW5pZnksIHNvdXJjZW1hcHMsIG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJ1aWxkQ29uZmlndXJhdGlvblJlbW92ZShjb25maWd1cmF0aW9uTmFtZSwgb3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHBsYXRmb3JtKG9wZXJhdGlvbjogUGxhdGZvcm1PcGVyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIG91dHB1dERpcmVjdG9yeSA9IHRoaXMuY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxQbGF0Zm9ybU9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPHN0cmluZz4odGhpcy5fbG9nZ2VyLCBcInBsYXRmb3JtTmFtZVwiLCBwbGF0Zm9ybU5hbWUsIFtXZWIuUExBVEZPUk0sIEVsZWN0cm9uLlBMQVRGT1JNXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGxhdGZvcm1BZGQocGxhdGZvcm1OYW1lLCBvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wbGF0Zm9ybVJlbW92ZShwbGF0Zm9ybU5hbWUsIG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgICAgICBpZiAob3V0cHV0RGlyZWN0b3J5ID09PSB1bmRlZmluZWQgfHwgb3V0cHV0RGlyZWN0b3J5ID09PSBudWxsIHx8IG91dHB1dERpcmVjdG9yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIG5vIG91dHB1dCBkaXJlY3Rvcnkgc3BlY2lmaWVkIHNvIHVzZSBjdXJyZW50XG4gICAgICAgICAgICBvdXRwdXREaXJlY3RvcnkgPSBcIi4vXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXREaXJlY3RvcnkgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dERpcmVjdG9yeTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYSB1bml0ZS5qc29uIHdlIGNhbiBsb2FkIGZvciBkZWZhdWx0IG9wdGlvbnNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXJlY3RvcnksIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlQ29uZmlndXJhdGlvbj4ob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBlKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY29uZmlndXJlUnVuKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgbGljZW5zZTogSVNwZHhMaWNlbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5saWNlbnNlID0gbGljZW5zZTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IE91dHB1dERpcmVjdG9yeSgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQXBwU2NhZmZvbGQoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRUZXN0U2NhZmZvbGQoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEUyZVRlc3RTY2FmZm9sZCgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBHdWxwKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBXZWIoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEVsZWN0cm9uKCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEFtZCgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQ29tbW9uSnMoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFN5c3RlbUpzKCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEJyb3dzZXJpZnkoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFJlcXVpcmVKcygpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgU3lzdGVtSnNCdWlsZGVyKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBXZWJwYWNrKCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEh0bWxUZW1wbGF0ZSgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBDc3MoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IExlc3MoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFNhc3MoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFN0eWx1cygpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBQb3N0Q3NzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBQb3N0Q3NzTm9uZSgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBNb2NoYUNoYWkoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEphc21pbmUoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUGxhaW5BcHAoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEF1cmVsaWEoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFJlYWN0KCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEJhYmVsKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBUeXBlU2NyaXB0KCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFdlYmRyaXZlcklvKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBQcm90cmFjdG9yKCkpO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IEVzTGludCgpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVHNMaW50KCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBLYXJtYSgpKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBOcG0oKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFlhcm4oKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQnJvd3NlclN5bmMoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUmVhZE1lKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBHaXRJZ25vcmUoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IExpY2Vuc2UoKSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgQXNzZXRzKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBQYWNrYWdlSnNvbigpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXMoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbigpKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhcIllvdSBzaG91bGQgcHJvYmFibHkgcnVuIG5wbSBpbnN0YWxsIC8geWFybiBpbnN0YWxsIGJlZm9yZSBydW5uaW5nIGFueSBndWxwIGNvbW1hbmRzLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZUFkZChwYWNrYWdlTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAoaW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fCBpbmNsdWRlTW9kZSA9PT0gbnVsbCB8fCBpbmNsdWRlTW9kZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGluY2x1ZGVNb2RlID0gXCJib3RoXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlbG9hZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcmVsb2FkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQYWNrYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlzUGFja2FnZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJpbmNsdWRlTW9kZVwiLCBpbmNsdWRlTW9kZSwgW1wiYXBwXCIsIFwidGVzdFwiLCBcImJvdGhcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbWlzc2luZ1ZlcnNpb24gPSB2ZXJzaW9uID09PSBudWxsIHx8IHZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCB2ZXJzaW9uLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gbWFpbiA9PT0gbnVsbCB8fCBtYWluID09PSB1bmRlZmluZWQgfHwgbWFpbi5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBpZiAobWlzc2luZ1ZlcnNpb24gfHwgbWlzc2luZ01haW4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKHBhY2thZ2VOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uID0gdmVyc2lvbiB8fCBgXiR7cGFja2FnZUluZm8udmVyc2lvbiB8fCBcIjAuMC4xXCJ9YDtcbiAgICAgICAgICAgICAgICAgICAgbWFpbiA9IG1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUmVhZGluZyBQYWNrYWdlIEluZm9ybWF0aW9uXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1haW4pIHtcbiAgICAgICAgICAgICAgICBtYWluID0gbWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBtYWluID0gbWFpbi5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkID0gbWFpbk1pbmlmaWVkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZC5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFBhY2thZ2UgPSBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCk7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gcHJlbG9hZDtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IG1haW47XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZDtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID0gaXNQYWNrYWdlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGluY2x1ZGVNb2RlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhc3NldHM7XG5cbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV0gPSBjbGllbnRQYWNrYWdlO1xuXG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBwYWNrYWdlTmFtZSwgdmVyc2lvbiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBJRW5naW5lUGlwZWxpbmVTdGVwW10gPSBbXTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgS2FybWEoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VSZW1vdmUocGFja2FnZU5hbWU6IHN0cmluZywgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIucmVtb3ZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBwYWNrYWdlTmFtZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBkZWxldGUgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW3BhY2thZ2VOYW1lXTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgS2FybWEoKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pZnk6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlbWFwczogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoYnVuZGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBidW5kbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1pbmlmeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWluaWZ5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzb3VyY2VtYXBzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VtYXBzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdIHx8IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0uYnVuZGxlID0gYnVuZGxlO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdLm1pbmlmeSA9IG1pbmlmeTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS5zb3VyY2VtYXBzID0gc291cmNlbWFwcztcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS52YXJpYWJsZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0udmFyaWFibGVzIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBJRW5naW5lUGlwZWxpbmVTdGVwW10gPSBbXTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpKTtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvblJlbW92ZShjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkJ1aWxkIGNvbmZpZ3VyYXRpb24gaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV07XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uKCkpO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGxhdGZvcm1BZGQocGxhdGZvcm1OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSB8fCB7fTtcblxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1twbGF0Zm9ybU5hbWVdLm9wdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV0ub3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG4gICAgICAgICAgICBpZiAocGxhdGZvcm1OYW1lID09PSBXZWIuUExBVEZPUk0pIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFdlYigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwbGF0Zm9ybU5hbWUgPT09IEVsZWN0cm9uLlBMQVRGT1JNKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBFbGVjdHJvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgUGFja2FnZUpzb24oKSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFVuaXRlQ29uZmlndXJhdGlvbkpzb24oKSk7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHMsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwbGF0Zm9ybVJlbW92ZShwbGF0Zm9ybU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGxhdGZvcm0gaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV07XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKHBsYXRmb3JtTmFtZSA9PT0gV2ViLlBMQVRGT1JNKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBXZWIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGxhdGZvcm1OYW1lID09PSBFbGVjdHJvbi5QTEFURk9STSkge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChuZXcgRWxlY3Ryb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2gobmV3IFBhY2thZ2VKc29uKCkpO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKG5ldyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uKCkpO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU1hbmFnZXI6IFVuaXRlUGFja2FnZU1hbmFnZXIsIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9hZGluZyBkZXBlbmRlbmNpZXNcIiwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuXG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUGFja2FnZUpzb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4odGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIgPSB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXR1cERpcmVjdG9yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIG91dHB1dERpcmVjdG9yeSk7XG5cbiAgICAgICAgaWYgKHBhY2thZ2VNYW5hZ2VyID09PSBcIllhcm5cIikge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gbmV3IFlhcm5QYWNrYWdlTWFuYWdlcih0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gbmV3IE5wbVBhY2thZ2VNYW5hZ2VyKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHM6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVTdGVwcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmluaXRpYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lU3RlcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5wcm9jZXNzKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
