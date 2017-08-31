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
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, fileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = fileSystem.pathCombine(__dirname, "../../");
        this._engineAssetsFolder = fileSystem.pathCombine(this._engineRootFolder, "/assets/");
        this._moduleIdMap = {};
        this._pipelineStepCache = {};
    }
    configure(packageName, title, license, sourceLanguage, moduleType, bundler, unitTestRunner, unitTestFramework, unitTestEngine, e2eTestRunner, e2eTestFramework, linter, cssPre, cssPost, packageManager, applicationFramework, force, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const newForce = force === undefined || force === null ? false : force;
            let uniteConfiguration = yield this.loadConfiguration(newOutputDirectory, !!force);
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
            uniteConfiguration.unitTestEngine = unitTestEngine || uniteConfiguration.unitTestEngine;
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
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "language", uniteConfiguration.sourceLanguage, "sourceLanguage"))) {
                return 1;
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "moduleType", uniteConfiguration.moduleType))) {
                return 1;
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "bundler", uniteConfiguration.bundler))) {
                return 1;
            }
            if (unitTestRunner === "None") {
                if (unitTestFramework !== null && unitTestFramework !== undefined) {
                    this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                    return 1;
                }
                if (unitTestEngine !== null && unitTestEngine !== undefined) {
                    this._logger.error("unitTestEngine is not valid if unitTestRunner is None");
                    return 1;
                }
            }
            else {
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "unitTestRunner", uniteConfiguration.unitTestRunner))) {
                    return 1;
                }
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "testFramework", uniteConfiguration.unitTestFramework, "unitTestFramework"))) {
                    return 1;
                }
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "unitTestEngine", uniteConfiguration.unitTestEngine))) {
                    return 1;
                }
            }
            if (e2eTestRunner === "None") {
                if (e2eTestFramework !== null && e2eTestFramework !== undefined) {
                    this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                    return 1;
                }
            }
            else {
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "e2eTestRunner", uniteConfiguration.e2eTestRunner))) {
                    return 1;
                }
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "testFramework", uniteConfiguration.e2eTestFramework, "e2eTestFramework"))) {
                    return 1;
                }
            }
            if (linter !== "None") {
                if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "linter", uniteConfiguration.linter))) {
                    return 1;
                }
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "cssPre", uniteConfiguration.cssPre))) {
                return 1;
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "cssPost", uniteConfiguration.cssPost))) {
                return 1;
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "packageManager", uniteConfiguration.packageManager))) {
                return 1;
            }
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "applicationFramework", uniteConfiguration.applicationFramework))) {
                return 1;
            }
            this._logger.info("force", { newForce });
            this._logger.info("");
            return this.configureRun(newOutputDirectory, uniteConfiguration, spdxLicense, newForce);
        });
    }
    clientPackage(operation, packageName, version, preload, includeMode, scriptIncludeMode, main, mainMinified, testingAdditions, isPackage, assets, map, loaders, packageManager, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(newOutputDirectory, false);
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
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "packageManager", uniteConfiguration.packageManager))) {
                return 1;
            }
            if (operation === "add") {
                return yield this.clientPackageAdd(packageName, version, preload, includeMode, scriptIncludeMode, main, mainMinified, testingAdditions, isPackage, assets, map, loaders, newOutputDirectory, uniteConfiguration);
            }
            else {
                return yield this.clientPackageRemove(packageName, newOutputDirectory, uniteConfiguration);
            }
        });
    }
    buildConfiguration(operation, configurationName, bundle, minify, sourcemaps, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(newOutputDirectory, false);
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
                return yield this.buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, newOutputDirectory, uniteConfiguration);
            }
            else {
                return yield this.buildConfigurationRemove(configurationName, newOutputDirectory, uniteConfiguration);
            }
        });
    }
    platform(operation, platformName, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
            const uniteConfiguration = yield this.loadConfiguration(newOutputDirectory, false);
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
            if (!(yield this.tryLoadPipelineStep(uniteConfiguration, "platform", platformName, "platformName"))) {
                return 1;
            }
            this._logger.info("");
            if (operation === "add") {
                return yield this.platformAdd(platformName, newOutputDirectory, uniteConfiguration);
            }
            else {
                return yield this.platformRemove(platformName, newOutputDirectory, uniteConfiguration);
            }
        });
    }
    cleanupOutputDirectory(outputDirectory) {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            return "./";
        }
        else {
            return this._fileSystem.pathAbsolute(outputDirectory);
        }
    }
    loadConfiguration(outputDirectory, force) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniteConfiguration;
            if (!force) {
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
            }
            return uniteConfiguration;
        });
    }
    configureRun(outputDirectory, uniteConfiguration, license, force) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                engineVariables.force = force;
                engineVariables.license = license;
                const pipelineSteps = [];
                pipelineSteps.push(["scaffold", "outputDirectory"]);
                pipelineSteps.push(["scaffold", "appScaffold"]);
                pipelineSteps.push(["scaffold", "unitTestScaffold"]);
                pipelineSteps.push(["scaffold", "e2eTestScaffold"]);
                pipelineSteps.push(["applicationFramework", "plainApp"]);
                pipelineSteps.push(["applicationFramework", "angular"]);
                pipelineSteps.push(["applicationFramework", "aurelia"]);
                pipelineSteps.push(["applicationFramework", "react"]);
                pipelineSteps.push(["taskManager", "gulp"]);
                pipelineSteps.push(["platform", "web"]);
                pipelineSteps.push(["platform", "electron"]);
                pipelineSteps.push(["moduleType", "amd"]);
                pipelineSteps.push(["moduleType", "commonJs"]);
                pipelineSteps.push(["moduleType", "systemJs"]);
                pipelineSteps.push(["bundler", "browserify"]);
                pipelineSteps.push(["bundler", "requireJs"]);
                pipelineSteps.push(["bundler", "systemJsBuilder"]);
                pipelineSteps.push(["bundler", "webpack"]);
                pipelineSteps.push(["cssPre", "css"]);
                pipelineSteps.push(["cssPre", "less"]);
                pipelineSteps.push(["cssPre", "sass"]);
                pipelineSteps.push(["cssPre", "stylus"]);
                pipelineSteps.push(["cssPost", "postCss"]);
                pipelineSteps.push(["cssPost", "none"]);
                pipelineSteps.push(["testFramework", "mochaChai"]);
                pipelineSteps.push(["testFramework", "jasmine"]);
                pipelineSteps.push(["language", "javaScript"]);
                pipelineSteps.push(["language", "typeScript"]);
                pipelineSteps.push(["e2eTestRunner", "webdriverIo"]);
                pipelineSteps.push(["e2eTestRunner", "protractor"]);
                pipelineSteps.push(["unitTestEngine", "phantomJs"]);
                pipelineSteps.push(["unitTestEngine", "chromeHeadless"]);
                pipelineSteps.push(["linter", "esLint"]);
                pipelineSteps.push(["linter", "tsLint"]);
                pipelineSteps.push(["unitTestRunner", "karma"]);
                pipelineSteps.push(["packageManager", "npm"]);
                pipelineSteps.push(["packageManager", "yarn"]);
                pipelineSteps.push(["server", "browserSync"]);
                pipelineSteps.push(["content", "htmlTemplate"]);
                pipelineSteps.push(["content", "readMe"]);
                pipelineSteps.push(["content", "gitIgnore"]);
                pipelineSteps.push(["content", "license"]);
                pipelineSteps.push(["content", "assets"]);
                pipelineSteps.push(["content", "packageJson"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationDirectories"]);
                pipelineSteps.push(["scaffold", "uniteThemeConfigurationJson"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    clientPackageAdd(packageName, version, preload, includeMode, scriptIncludeMode, main, mainMinified, testingAdditions, isPackage, assets, map, loaders, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const newIncludeMode = includeMode === undefined || includeMode === null || includeMode.length === 0 ? "both" : includeMode;
            const newScriptIncludeMode = scriptIncludeMode === undefined || scriptIncludeMode === null || scriptIncludeMode.length === 0 ? "none" : scriptIncludeMode;
            if (version) {
                this._logger.info("version", { version });
            }
            this._logger.info("preload", { preload });
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "includeMode", newIncludeMode, ["app", "test", "both"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "scriptIncludeMode", newScriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
                return 1;
            }
            if (main) {
                this._logger.info("main", { main });
            }
            if (mainMinified) {
                this._logger.info("mainMinified", { mainMinified });
            }
            if (testingAdditions) {
                this._logger.info("testingAdditions", { testingAdditions });
            }
            this._logger.info("isPackage", { isPackage });
            if (assets) {
                this._logger.info("assets", { assets });
            }
            if (map) {
                this._logger.info("map", { map });
            }
            if (loaders) {
                this._logger.info("loaders", { loaders });
            }
            this._logger.info("");
            if (uniteConfiguration.clientPackages[packageName]) {
                this._logger.error("Package has already been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                const clientPackage = new uniteClientPackage_1.UniteClientPackage();
                clientPackage.version = version;
                clientPackage.main = main;
                clientPackage.mainMinified = mainMinified;
                const missingVersion = version === null || version === undefined || version.length === 0;
                const missingMain = main === null || main === undefined || main.length === 0;
                if (missingVersion || missingMain) {
                    try {
                        const packageInfo = yield engineVariables.packageManager.info(this._logger, this._fileSystem, packageName, version);
                        clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                        clientPackage.main = clientPackage.main || packageInfo.main;
                    }
                    catch (err) {
                        this._logger.error("Reading Package Information failed", err);
                        return 1;
                    }
                }
                if (clientPackage.main) {
                    clientPackage.main = clientPackage.main.replace(/\\/g, "/");
                    clientPackage.main = clientPackage.main.replace(/\.\//, "/");
                }
                if (clientPackage.mainMinified) {
                    clientPackage.mainMinified = clientPackage.mainMinified.replace(/\\/g, "/");
                    clientPackage.mainMinified = clientPackage.mainMinified.replace(/\.\//, "/");
                }
                clientPackage.preload = preload === undefined ? false : preload;
                clientPackage.isPackage = isPackage === undefined ? false : isPackage;
                clientPackage.includeMode = newIncludeMode;
                clientPackage.scriptIncludeMode = newScriptIncludeMode;
                clientPackage.assets = assets;
                try {
                    clientPackage.testingAdditions = this.mapParser(testingAdditions);
                    clientPackage.map = this.mapParser(map);
                    clientPackage.loaders = this.mapParser(loaders);
                }
                catch (err) {
                    this._logger.error("Input failure", err);
                    return 1;
                }
                uniteConfiguration.clientPackages[packageName] = clientPackage;
                try {
                    yield engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, clientPackage.version, false);
                }
                catch (err) {
                    this._logger.error("Adding Package failed", err);
                    return 1;
                }
                const pipelineSteps = [];
                pipelineSteps.push(["unitTestRunner", "karma"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
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
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                yield engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, false);
                delete uniteConfiguration.clientPackages[packageName];
                const pipelineSteps = [];
                pipelineSteps.push(["unitTestRunner", "karma"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
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
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new uniteBuildConfiguration_1.UniteBuildConfiguration();
                uniteConfiguration.buildConfigurations[configurationName].bundle = bundle === undefined ? false : bundle;
                uniteConfiguration.buildConfigurations[configurationName].minify = minify === undefined ? false : minify;
                uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps === undefined ? true : sourcemaps;
                uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};
                const pipelineSteps = [];
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
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
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                delete uniteConfiguration.buildConfigurations[configurationName];
                const pipelineSteps = [];
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
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
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                uniteConfiguration.platforms[platformName] = uniteConfiguration.platforms[platformName] || {};
                const pipelineSteps = [];
                pipelineSteps.push(["platform", platformName]);
                pipelineSteps.push(["content", "packageJson"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.warning("You should probably run npm install / yarn install before running any gulp packaging commands.");
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
            let ret = yield this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            if (ret === 0) {
                delete uniteConfiguration.platforms[platformName];
                const pipelineSteps = [];
                pipelineSteps.push(["platform", platformName]);
                pipelineSteps.push(["content", "packageJson"]);
                pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
                ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    this._logger.warning("You should probably run npm install / yarn install to remove any unnecessary packages.");
                    this._logger.banner("Successfully Completed.");
                }
            }
            return ret;
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.info("Loading dependencies", { core: this._engineRootFolder, dependenciesFile: "package.json" });
                engineVariables.enginePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
            engineVariables.force = false;
            engineVariables.engineRootFolder = this._engineRootFolder;
            engineVariables.engineAssetsFolder = this._engineAssetsFolder;
            engineVariables.setupDirectories(this._fileSystem, outputDirectory);
            engineVariables.initialisePackages(uniteConfiguration.clientPackages);
            engineVariables.packageManager = this.getPipelineStep("packageManager", uniteConfiguration.packageManager);
            return 0;
        });
    }
    runPipeline(pipelineSteps, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            for (const pipelineStep of pipelineSteps) {
                const exists = yield this.tryLoadPipelineStep(uniteConfiguration, pipelineStep[0], pipelineStep[1], undefined, false);
                if (exists) {
                    pipeline.push(this.getPipelineStep(pipelineStep[0], pipelineStep[1]));
                }
                else {
                    return 1;
                }
            }
            for (const pipelineStep of pipeline) {
                const ret = yield pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            for (const pipelineStep of pipeline) {
                const ret = yield pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    getPipelineStep(moduleType, moduleId) {
        const className = this._moduleIdMap[`${moduleType}/${moduleId}`];
        if (className !== undefined && this._pipelineStepCache[className] !== undefined) {
            return this._pipelineStepCache[className];
        }
        return undefined;
    }
    tryLoadPipelineStep(uniteConfiguration, moduleType, moduleId, configurationType, defineProperty = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleTypeId = `${moduleType}/${moduleId}`;
            let className = this._moduleIdMap[moduleTypeId];
            if (className === undefined) {
                const modulePath = this._fileSystem.pathCombine(this._engineRootFolder, `dist/pipelineSteps`);
                const moduleTypeFolder = this._fileSystem.pathCombine(modulePath, moduleType);
                const actualType = configurationType ? configurationType : moduleType;
                try {
                    let files = yield this._fileSystem.directoryGetFiles(moduleTypeFolder);
                    files = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
                    if (moduleId !== undefined && module !== null && moduleId.length > 0) {
                        const moduleIdLower = moduleId.toLowerCase();
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].toLowerCase() === moduleIdLower) {
                                // tslint:disable:no-require-imports
                                // tslint:disable:non-literal-require
                                const module = require(this._fileSystem.pathCombine(moduleTypeFolder, files[i]));
                                // tslint:enable:no-require-imports
                                // tslint:enable:non-literal-require
                                className = Object.keys(module)[0];
                                const instance = Object.create(module[className].prototype);
                                if (defineProperty) {
                                    this._logger.info(actualType, { className });
                                    Object.defineProperty(uniteConfiguration, actualType, { value: className });
                                }
                                const moduleClassName = `${moduleType}/${className}`;
                                this._pipelineStepCache[moduleClassName] = new instance.constructor();
                                this._moduleIdMap[moduleTypeId] = moduleClassName;
                                return true;
                            }
                        }
                        this._logger.error(`Module ${moduleId} for arg ${actualType} could not be located, possible options could be [${files.join(", ")}]`);
                        return false;
                    }
                    else {
                        this._logger.error(`${actualType} should not be blank, possible options could be [${files.join(", ")}]`);
                        return false;
                    }
                }
                catch (err) {
                    this._logger.error(`Module ${moduleId} for arg ${actualType} failed to load`, err);
                    return false;
                }
            }
            else {
                return true;
            }
        });
    }
    mapParser(input) {
        let parsedMap;
        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};
            const splitAdditions = input.split(";");
            splitAdditions.forEach(splitAddition => {
                const parts = splitAddition.split("=");
                if (parts.length === 2) {
                    parsedMap[parts[0]] = parts[1];
                }
                else {
                    throw new Error(`The input is not formed correctly '${input}'`);
                }
            });
        }
        return parsedMap;
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQVF6RixtR0FBZ0c7QUFDaEcseUZBQXNGO0FBQ3RGLHlGQUFzRjtBQU10Rix1REFBb0Q7QUFFcEQ7SUFRSSxZQUFZLE1BQWUsRUFBRSxVQUF1QjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVZLFNBQVMsQ0FBQyxXQUFzQyxFQUN0QyxLQUFnQyxFQUNoQyxPQUFrQyxFQUNsQyxjQUF5QyxFQUN6QyxVQUFxQyxFQUNyQyxPQUFrQyxFQUNsQyxjQUF5QyxFQUN6QyxpQkFBNEMsRUFDNUMsY0FBeUMsRUFDekMsYUFBd0MsRUFDeEMsZ0JBQTJDLEVBQzNDLE1BQWlDLEVBQ2pDLE1BQWlDLEVBQ2pDLE9BQWtDLEVBQ2xDLGNBQXlDLEVBQ3pDLG9CQUErQyxFQUMvQyxLQUFpQyxFQUNqQyxlQUEwQzs7WUFDN0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEUsTUFBTSxRQUFRLEdBQUcsS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDdkUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1lBQ2xELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsV0FBVyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUMvRSxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQztZQUM3RCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUNuRSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztZQUN4RixrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztZQUM1RSxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUNuRSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztZQUN4RixrQkFBa0IsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsSUFBSSxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztZQUNqRyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztZQUN4RixrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsYUFBYSxJQUFJLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztZQUNyRixrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztZQUM5RixrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztZQUNoRSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUM7WUFDakcsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUN4QyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO1lBQzFDLGtCQUFrQixDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixJQUFJLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDO1lBQzFHLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO1lBQzVFLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQ2hFLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ25FLGtCQUFrQixDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQztZQUV0RixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQztnQkFDL0csa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ25ILENBQUM7WUFFRCxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRTNFLEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLFdBQXlCLENBQUM7WUFDOUIsSUFBSSxDQUFDO2dCQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQVEsSUFBSSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzNHLEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUFTLElBQUksQ0FBQyxPQUFPLEVBQ1osU0FBUyxFQUNULGtCQUFrQixDQUFDLE9BQU8sRUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFDeEIsMEZBQTBGLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixXQUFXLEdBQUcsV0FBVyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxRCxDQUFDO1lBQ0wsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMscURBQXFELEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDdkgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO2dCQUNuRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzdGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixLQUFLLElBQUksSUFBSSxpQkFBaUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO29CQUMvRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztvQkFDM0csTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztvQkFDbEksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztvQkFDM0csTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztvQkFDN0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7b0JBQ3pHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztvQkFDM0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDN0YsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUV6QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV0QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUYsQ0FBQztLQUFBO0lBRVksYUFBYSxDQUFDLFNBQTZDLEVBQzdDLFdBQXNDLEVBQ3RDLE9BQWtDLEVBQ2xDLE9BQTRCLEVBQzVCLFdBQTJDLEVBQzNDLGlCQUF1RCxFQUN2RCxJQUErQixFQUMvQixZQUF1QyxFQUN2QyxnQkFBMkMsRUFDM0MsU0FBOEIsRUFDOUIsTUFBaUMsRUFDakMsR0FBOEIsRUFDOUIsT0FBa0MsRUFDbEMsY0FBeUMsRUFDekMsZUFBMEM7O1lBQ2pFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Z0JBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osa0JBQWtCLENBQUMsY0FBYyxHQUFHLGtCQUFrQixDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7Z0JBQzVFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxjQUFjLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDO1lBQzVGLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUFtQixDQUFDLFVBQVUsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQzdELElBQUksRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDdEosQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUMvRixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRVksa0JBQWtCLENBQUMsU0FBeUQsRUFDekQsaUJBQTRDLEVBQzVDLE1BQTJCLEVBQzNCLE1BQTJCLEVBQzNCLFVBQStCLEVBQy9CLGVBQTBDOztZQUN0RSxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRW5GLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGtCQUFrQixDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQztZQUMxRixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBbUIsQ0FBQyxVQUFVLENBQThCLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXRCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNuSSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDMUcsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxTQUErQyxFQUMvQyxZQUF1QyxFQUN2QyxlQUEwQzs7WUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEUsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVuRixFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztZQUN0RSxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBbUIsQ0FBQyxVQUFVLENBQW9CLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDaEcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV0QixFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUN4RixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUMzRixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sc0JBQXNCLENBQUMsZUFBMEM7UUFDckUsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLEtBQUssSUFBSSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RiwrQ0FBK0M7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUQsQ0FBQztJQUNMLENBQUM7SUFFYSxpQkFBaUIsQ0FBQyxlQUF1QixFQUFFLEtBQWM7O1lBQ25FLElBQUksa0JBQXlELENBQUM7WUFFOUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULGlFQUFpRTtnQkFDakUsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUVoRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNULGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXFCLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDaEgsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELGtCQUFrQixHQUFHLElBQUksQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRWEsWUFBWSxDQUFDLGVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsT0FBcUIsRUFBRSxLQUFjOztZQUM3SCxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDakcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQzlCLGVBQWUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUVsQyxNQUFNLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0JBRXJDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFFcEQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLHNCQUFzQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsc0JBQXNCLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRXRELGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFFNUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRTdDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRS9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDbkQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUUzQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUV4QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFakQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBRS9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFFekQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUVoRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRS9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFFOUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFFL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDLENBQUMsQ0FBQztnQkFFM0QsR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRWpGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHNGQUFzRixDQUFDLENBQUM7b0JBQzdHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBQ25ELENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVhLGdCQUFnQixDQUFDLFdBQW1CLEVBQ25CLE9BQWUsRUFDZixPQUE0QixFQUM1QixXQUF3QixFQUN4QixpQkFBZ0QsRUFDaEQsSUFBK0IsRUFDL0IsWUFBdUMsRUFDdkMsZ0JBQTJDLEVBQzNDLFNBQThCLEVBQzlCLE1BQWlDLEVBQ2pDLEdBQThCLEVBQzlCLE9BQWtDLEVBQ2xDLGVBQXVCLEVBQ3ZCLGtCQUFzQzs7WUFDakUsTUFBTSxjQUFjLEdBQUcsV0FBVyxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDNUgsTUFBTSxvQkFBb0IsR0FBRyxpQkFBaUIsS0FBSyxTQUFTLElBQUksaUJBQWlCLEtBQUssSUFBSSxJQUFJLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLGlCQUFpQixDQUFDO1lBRTFKLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUUxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUFtQixDQUFDLFVBQVUsQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNySCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUFvQixJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDaEUsQ0FBQztZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdEIsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDakcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxhQUFhLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO2dCQUMvQyxhQUFhLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztnQkFDaEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzFCLGFBQWEsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO2dCQUUxQyxNQUFNLGNBQWMsR0FBRyxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sV0FBVyxHQUFHLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFDN0UsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLElBQUksQ0FBQzt3QkFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBRXBILGFBQWEsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sSUFBSSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7d0JBQ3RGLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDO29CQUNoRSxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQixhQUFhLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUQsYUFBYSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2pFLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLGFBQWEsQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1RSxhQUFhLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakYsQ0FBQztnQkFDRCxhQUFhLENBQUMsT0FBTyxHQUFHLE9BQU8sS0FBSyxTQUFTLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDaEUsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUM7Z0JBQ3RFLGFBQWEsQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDO2dCQUMzQyxhQUFhLENBQUMsaUJBQWlCLEdBQUcsb0JBQW9CLENBQUM7Z0JBQ3ZELGFBQWEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUU5QixJQUFJLENBQUM7b0JBQ0QsYUFBYSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDbEUsYUFBYSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUUvRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdkosQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNqRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsTUFBTSxhQUFhLEdBQWUsRUFBRSxDQUFDO2dCQUNyQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7Z0JBRTNELEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUVqRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFYSxtQkFBbUIsQ0FBQyxXQUFtQixFQUFFLGVBQXVCLEVBQUUsa0JBQXNDOztZQUNsSCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDOUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2pHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUUvSCxPQUFPLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFdEQsTUFBTSxhQUFhLEdBQWUsRUFBRSxDQUFDO2dCQUVyQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7Z0JBRTNELEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUVqRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFYSxxQkFBcUIsQ0FBQyxpQkFBeUIsRUFDekIsTUFBMkIsRUFDM0IsTUFBMkIsRUFDM0IsVUFBK0IsRUFDL0IsZUFBdUIsRUFDdkIsa0JBQXNDOztZQUN0RSxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDakcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksaURBQXVCLEVBQUUsQ0FBQztnQkFFdkosa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUN6RyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7Z0JBQ3pHLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsS0FBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQztnQkFDcEgsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUVoSixNQUFNLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0JBQ3JDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFakYsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRWEsd0JBQXdCLENBQUMsaUJBQXlCLEVBQ3pCLGVBQXVCLEVBQ3ZCLGtCQUFzQzs7WUFDekUsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDakcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osT0FBTyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVqRSxNQUFNLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0JBQ3JDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFakYsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRWEsV0FBVyxDQUFDLFlBQW9CLEVBQ3BCLGVBQXVCLEVBQ3ZCLGtCQUFzQzs7WUFDNUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDOUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2pHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUU5RixNQUFNLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0JBQ3JDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDLENBQUMsQ0FBQztnQkFDM0QsR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRWpGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdHQUFnRyxDQUFDLENBQUM7b0JBQ3ZILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBQ25ELENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVhLGNBQWMsQ0FBQyxZQUFvQixFQUNwQixlQUF1QixFQUN2QixrQkFBc0M7O1lBQy9ELEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDakcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osT0FBTyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRWxELE1BQU0sYUFBYSxHQUFlLEVBQUUsQ0FBQztnQkFDckMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDakYsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsd0ZBQXdGLENBQUMsQ0FBQztvQkFDL0csSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRWEscUJBQXFCLENBQUMsZUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDakksSUFBSSxDQUFDO2dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2dCQUU5RyxlQUFlLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBdUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzFJLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDM0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxlQUFlLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUM5QixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQzFELGVBQWUsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDOUQsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDcEUsZUFBZSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXRFLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUUzRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsV0FBVyxDQUFDLGFBQXlCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3pILE1BQU0sUUFBUSxHQUEwQixFQUFFLENBQUM7WUFFM0MsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXRILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1QsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRSxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxHQUFHLENBQUMsQ0FBQyxNQUFNLFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUMvRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7WUFDTCxDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDNUcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTyxlQUFlLENBQWdDLFVBQWtCLEVBQUUsUUFBZ0I7UUFDdkYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLFVBQVUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsTUFBTSxDQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRWEsbUJBQW1CLENBQUMsa0JBQXNDLEVBQUUsVUFBa0IsRUFBRSxRQUFnQixFQUFFLGlCQUEwQixFQUFFLGlCQUEwQixJQUFJOztZQUN0SyxNQUFNLFlBQVksR0FBRyxHQUFHLFVBQVUsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNqRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWhELEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFHLGlCQUFpQixHQUFHLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztnQkFFdEUsSUFBSSxDQUFDO29CQUNELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN2RSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFeEYsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0NBQzNDLG9DQUFvQztnQ0FDcEMscUNBQXFDO2dDQUNyQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDakYsbUNBQW1DO2dDQUNuQyxvQ0FBb0M7Z0NBRXBDLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUVuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FFNUQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQ0FDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztvQ0FDN0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztnQ0FDaEYsQ0FBQztnQ0FFRCxNQUFNLGVBQWUsR0FBRyxHQUFHLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQ0FDckQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dDQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLGVBQWUsQ0FBQztnQ0FDbEQsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDaEIsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsUUFBUSxZQUFZLFVBQVUscURBQXFELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNySSxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNqQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxvREFBb0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3pHLE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsUUFBUSxZQUFZLFVBQVUsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ25GLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sU0FBUyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxTQUFtQyxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUQsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNmLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhO2dCQUNoQyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDcEUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQztDQUNKO0FBdHdCRCx3QkFzd0JDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haW4gZW5naW5lXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElTcGR4IH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhcIjtcbmltcG9ydCB7IElTcGR4TGljZW5zZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9zcGR4L0lTcGR4TGljZW5zZVwiO1xuaW1wb3J0IHsgSW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvaW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgQnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IE1vZHVsZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL21vZHVsZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgUGxhdGZvcm1PcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9wbGF0Zm9ybU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmUgaW1wbGVtZW50cyBJRW5naW5lIHtcbiAgICBwcml2YXRlIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJpdmF0ZSBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX21vZHVsZUlkTWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfTtcbiAgICBwcml2YXRlIF9waXBlbGluZVN0ZXBDYWNoZTogeyBbaWQ6IHN0cmluZ106IElFbmdpbmVQaXBlbGluZVN0ZXB9O1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuICAgICAgICB0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiL2Fzc2V0cy9cIik7XG4gICAgICAgIHRoaXMuX21vZHVsZUlkTWFwID0ge307XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lU3RlcENhY2hlID0ge307XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShwYWNrYWdlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbGljZW5zZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbnRlcjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc1ByZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGNvbnN0IG5ld0ZvcmNlID0gZm9yY2UgPT09IHVuZGVmaW5lZCB8fCBmb3JjZSA9PT0gbnVsbCA/IGZhbHNlIDogZm9yY2U7XG4gICAgICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKG5ld091dHB1dERpcmVjdG9yeSwgISFmb3JjZSk7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUgPSBwYWNrYWdlTmFtZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZSA9IHRpdGxlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UgPSBsaWNlbnNlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPSBzb3VyY2VMYW5ndWFnZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2U7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID0gbW9kdWxlVHlwZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIgPSBidW5kbGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPSB1bml0VGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9IHVuaXRUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lID0gdW5pdFRlc3RFbmdpbmUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9IGUyZVRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrID0gZTJlVGVzdEZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9IGxpbnRlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgfHwgXCJOcG1cIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyID0gXCJHdWxwXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zZXJ2ZXIgPSBcIkJyb3dzZXJTeW5jXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9IGFwcGxpY2F0aW9uRnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlID0gY3NzUHJlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQb3N0ID0gY3NzUG9zdCB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdDtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMuZGV2ID0geyBidW5kbGU6IGZhbHNlLCBtaW5pZnk6IGZhbHNlLCBzb3VyY2VtYXBzOiB0cnVlLCB2YXJpYWJsZXM6IHt9IH07XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucy5wcm9kID0geyBidW5kbGU6IHRydWUsIG1pbmlmeTogdHJ1ZSwgc291cmNlbWFwczogZmFsc2UsIHZhcmlhYmxlczoge30gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zIHx8IHsgV2ViOiB7fSB9O1xuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja1BhY2thZ2VOYW1lKHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInRpdGxlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNwZHhMaWNlbnNlOiBJU3BkeExpY2Vuc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsaWNlbnNlRGF0YSA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPElTcGR4Pih0aGlzLl9lbmdpbmVBc3NldHNGb2xkZXIsIFwic3BkeC1mdWxsLmpzb25cIik7XG4gICAgICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxzdHJpbmc+KHRoaXMuX2xvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsaWNlbnNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhsaWNlbnNlRGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9lcyBub3QgbWF0Y2ggYW55IG9mIHRoZSBwb3NzaWJsZSBTUERYIGxpY2Vuc2UgdmFsdWVzIChzZWUgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy8pLlwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcGR4TGljZW5zZSA9IGxpY2Vuc2VEYXRhW3VuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgd2FzIGEgcHJvYmxlbSByZWFkaW5nIHRoZSBzcGR4LWZ1bGwuanNvbiBmaWxlXCIsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwibGFuZ3VhZ2VcIiwgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcInNvdXJjZUxhbmd1YWdlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwibW9kdWxlVHlwZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJidW5kbGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRUZXN0UnVubmVyID09PSBcIk5vbmVcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRUZXN0RnJhbWV3b3JrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJ1bml0VGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgdW5pdFRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1bml0VGVzdEVuZ2luZSAhPT0gbnVsbCAmJiB1bml0VGVzdEVuZ2luZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RFbmdpbmUgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwidW5pdFRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcInRlc3RGcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrLCBcInVuaXRUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwidW5pdFRlc3RFbmdpbmVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlMmVUZXN0UnVubmVyID09PSBcIk5vbmVcIikge1xuICAgICAgICAgICAgaWYgKGUyZVRlc3RGcmFtZXdvcmsgIT09IG51bGwgJiYgZTJlVGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiZTJlVGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgZTJlVGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcImUyZVRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwidGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yaywgXCJlMmVUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbnRlciAhPT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJsaW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwiY3NzUHJlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwiY3NzUG9zdFwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImZvcmNlXCIsIHsgbmV3Rm9yY2UgfSk7XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlUnVuKG5ld091dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBzcGR4TGljZW5zZSwgbmV3Rm9yY2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjbGllbnRQYWNrYWdlKG9wZXJhdGlvbjogTW9kdWxlT3BlcmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IEluY2x1ZGVNb2RlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogU2NyaXB0SW5jbHVkZU1vZGUgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXA6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyczogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBuZXdPdXRwdXREaXJlY3RvcnkgPSB0aGlzLmNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihuZXdPdXRwdXREaXJlY3RvcnksIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxNb2R1bGVPcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgb3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcInBhY2thZ2VOYW1lXCIsIHBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnRQYWNrYWdlQWRkKHBhY2thZ2VOYW1lLCB2ZXJzaW9uLCBwcmVsb2FkLCBpbmNsdWRlTW9kZSwgc2NyaXB0SW5jbHVkZU1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW4sIG1haW5NaW5pZmllZCwgdGVzdGluZ0FkZGl0aW9ucywgaXNQYWNrYWdlLCBhc3NldHMsIG1hcCwgbG9hZGVycywgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50UGFja2FnZVJlbW92ZShwYWNrYWdlTmFtZSwgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbihvcGVyYXRpb246IEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmlmeTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZW1hcHM6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBuZXdPdXRwdXREaXJlY3RvcnkgPSB0aGlzLmNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihuZXdPdXRwdXREaXJlY3RvcnksIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8QnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIG9wZXJhdGlvbiwgW1wiYWRkXCIsIFwicmVtb3ZlXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJjb25maWd1cmF0aW9uTmFtZVwiLCBjb25maWd1cmF0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYnVpbGRDb25maWd1cmF0aW9uQWRkKGNvbmZpZ3VyYXRpb25OYW1lLCBidW5kbGUsIG1pbmlmeSwgc291cmNlbWFwcywgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYnVpbGRDb25maWd1cmF0aW9uUmVtb3ZlKGNvbmZpZ3VyYXRpb25OYW1lLCBuZXdPdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcGxhdGZvcm0ob3BlcmF0aW9uOiBQbGF0Zm9ybU9wZXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24obmV3T3V0cHV0RGlyZWN0b3J5LCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxQbGF0Zm9ybU9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJwbGF0Zm9ybVwiLCBwbGF0Zm9ybU5hbWUsIFwicGxhdGZvcm1OYW1lXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsYXRmb3JtQWRkKHBsYXRmb3JtTmFtZSwgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGxhdGZvcm1SZW1vdmUocGxhdGZvcm1OYW1lLCBuZXdPdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFudXBPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG91dHB1dERpcmVjdG9yeSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dERpcmVjdG9yeSA9PT0gbnVsbCB8fCBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBvdXRwdXQgZGlyZWN0b3J5IHNwZWNpZmllZCBzbyB1c2UgY3VycmVudFxuICAgICAgICAgICAgcmV0dXJuIFwiLi9cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHVuaXRlLmpzb24gd2UgY2FuIGxvYWQgZm9yIGRlZmF1bHQgb3B0aW9uc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlQ29uZmlndXJhdGlvbj4ob3V0cHV0RGlyZWN0b3J5LCBcInVuaXRlLmpzb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBlKTtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNvbmZpZ3VyZVJ1bihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGxpY2Vuc2U6IElTcGR4TGljZW5zZSwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZm9yY2U7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubGljZW5zZSA9IGxpY2Vuc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IHN0cmluZ1tdW10gPSBbXTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwib3V0cHV0RGlyZWN0b3J5XCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcImFwcFNjYWZmb2xkXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcInVuaXRUZXN0U2NhZmZvbGRcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwiZTJlVGVzdFNjYWZmb2xkXCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwicGxhaW5BcHBcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwiYW5ndWxhclwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgXCJhdXJlbGlhXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBcInJlYWN0XCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInRhc2tNYW5hZ2VyXCIsIFwiZ3VscFwiXSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJwbGF0Zm9ybVwiLCBcIndlYlwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGxhdGZvcm1cIiwgXCJlbGVjdHJvblwiXSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJtb2R1bGVUeXBlXCIsIFwiYW1kXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJtb2R1bGVUeXBlXCIsIFwiY29tbW9uSnNcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcIm1vZHVsZVR5cGVcIiwgXCJzeXN0ZW1Kc1wiXSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJidW5kbGVyXCIsIFwiYnJvd3NlcmlmeVwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYnVuZGxlclwiLCBcInJlcXVpcmVKc1wiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYnVuZGxlclwiLCBcInN5c3RlbUpzQnVpbGRlclwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYnVuZGxlclwiLCBcIndlYnBhY2tcIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY3NzUHJlXCIsIFwiY3NzXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQcmVcIiwgXCJsZXNzXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQcmVcIiwgXCJzYXNzXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQcmVcIiwgXCJzdHlsdXNcIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY3NzUG9zdFwiLCBcInBvc3RDc3NcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNzc1Bvc3RcIiwgXCJub25lXCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInRlc3RGcmFtZXdvcmtcIiwgXCJtb2NoYUNoYWlcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInRlc3RGcmFtZXdvcmtcIiwgXCJqYXNtaW5lXCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImxhbmd1YWdlXCIsIFwiamF2YVNjcmlwdFwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wibGFuZ3VhZ2VcIiwgXCJ0eXBlU2NyaXB0XCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImUyZVRlc3RSdW5uZXJcIiwgXCJ3ZWJkcml2ZXJJb1wiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiZTJlVGVzdFJ1bm5lclwiLCBcInByb3RyYWN0b3JcIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RFbmdpbmVcIiwgXCJwaGFudG9tSnNcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInVuaXRUZXN0RW5naW5lXCIsIFwiY2hyb21lSGVhZGxlc3NcIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wibGludGVyXCIsIFwiZXNMaW50XCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJsaW50ZXJcIiwgXCJ0c0xpbnRcIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RSdW5uZXJcIiwgXCJrYXJtYVwiXSk7XG5cbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJwYWNrYWdlTWFuYWdlclwiLCBcIm5wbVwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGFja2FnZU1hbmFnZXJcIiwgXCJ5YXJuXCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNlcnZlclwiLCBcImJyb3dzZXJTeW5jXCJdKTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJodG1sVGVtcGxhdGVcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJyZWFkTWVcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJnaXRJZ25vcmVcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJsaWNlbnNlXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwiYXNzZXRzXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwicGFja2FnZUpzb25cIl0pO1xuXG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25EaXJlY3Rvcmllc1wiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiXSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm5pbmcoXCJZb3Ugc2hvdWxkIHByb2JhYmx5IHJ1biBucG0gaW5zdGFsbCAvIHlhcm4gaW5zdGFsbCBiZWZvcmUgcnVubmluZyBhbnkgZ3VscCBjb21tYW5kcy5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFBhY2thZ2VBZGQocGFja2FnZU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogSW5jbHVkZU1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBTY3JpcHRJbmNsdWRlTW9kZSB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXJzOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBuZXdJbmNsdWRlTW9kZSA9IGluY2x1ZGVNb2RlID09PSB1bmRlZmluZWQgfHwgaW5jbHVkZU1vZGUgPT09IG51bGwgfHwgaW5jbHVkZU1vZGUubGVuZ3RoID09PSAwID8gXCJib3RoXCIgOiBpbmNsdWRlTW9kZTtcbiAgICAgICAgY29uc3QgbmV3U2NyaXB0SW5jbHVkZU1vZGUgPSBzY3JpcHRJbmNsdWRlTW9kZSA9PT0gdW5kZWZpbmVkIHx8IHNjcmlwdEluY2x1ZGVNb2RlID09PSBudWxsIHx8IHNjcmlwdEluY2x1ZGVNb2RlLmxlbmd0aCA9PT0gMCA/IFwibm9uZVwiIDogc2NyaXB0SW5jbHVkZU1vZGU7XG5cbiAgICAgICAgaWYgKHZlcnNpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidmVyc2lvblwiLCB7IHZlcnNpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByZWxvYWRcIiwgeyBwcmVsb2FkIH0pO1xuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEluY2x1ZGVNb2RlPih0aGlzLl9sb2dnZXIsIFwiaW5jbHVkZU1vZGVcIiwgbmV3SW5jbHVkZU1vZGUsIFtcImFwcFwiLCBcInRlc3RcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxTY3JpcHRJbmNsdWRlTW9kZT4odGhpcy5fbG9nZ2VyLCBcInNjcmlwdEluY2x1ZGVNb2RlXCIsIG5ld1NjcmlwdEluY2x1ZGVNb2RlLCBbXCJub25lXCIsIFwiYnVuZGxlZFwiLCBcIm5vdEJ1bmRsZWRcIiwgXCJib3RoXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWFpbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJtYWluXCIsIHsgbWFpbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpbk1pbmlmaWVkXCIsIHsgbWFpbk1pbmlmaWVkIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlc3RpbmdBZGRpdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidGVzdGluZ0FkZGl0aW9uc1wiLCB7IHRlc3RpbmdBZGRpdGlvbnMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJpc1BhY2thZ2VcIiwgeyBpc1BhY2thZ2UgfSk7XG4gICAgICAgIGlmIChhc3NldHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXNzZXRzXCIsIHsgYXNzZXRzIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFwXCIsIHsgbWFwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2FkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImxvYWRlcnNcIiwgeyBsb2FkZXJzIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIGFscmVhZHkgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IG1haW47XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZDtcblxuICAgICAgICAgICAgY29uc3QgbWlzc2luZ1ZlcnNpb24gPSB2ZXJzaW9uID09PSBudWxsIHx8IHZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCB2ZXJzaW9uLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIGNvbnN0IG1pc3NpbmdNYWluID0gbWFpbiA9PT0gbnVsbCB8fCBtYWluID09PSB1bmRlZmluZWQgfHwgbWFpbi5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBpZiAobWlzc2luZ1ZlcnNpb24gfHwgbWlzc2luZ01haW4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5pbmZvKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgcGFja2FnZU5hbWUsIHZlcnNpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiB8fCBgXiR7cGFja2FnZUluZm8udmVyc2lvbiB8fCBcIjAuMC4xXCJ9YDtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluIHx8IHBhY2thZ2VJbmZvLm1haW47XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgUGFja2FnZSBJbmZvcm1hdGlvbiBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluID0gY2xpZW50UGFja2FnZS5tYWluLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQucmVwbGFjZSgvXFwuXFwvLywgXCIvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gcHJlbG9hZCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBwcmVsb2FkO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBpc1BhY2thZ2UgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogaXNQYWNrYWdlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IG5ld0luY2x1ZGVNb2RlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IG5ld1NjcmlwdEluY2x1ZGVNb2RlO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5hc3NldHMgPSBhc3NldHM7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zID0gdGhpcy5tYXBQYXJzZXIodGVzdGluZ0FkZGl0aW9ucyk7XG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSB0aGlzLm1hcFBhcnNlcihtYXApO1xuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubG9hZGVycyA9IHRoaXMubWFwUGFyc2VyKGxvYWRlcnMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiSW5wdXQgZmFpbHVyZVwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdID0gY2xpZW50UGFja2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIHBhY2thZ2VOYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkFkZGluZyBQYWNrYWdlIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RSdW5uZXJcIiwgXCJrYXJtYVwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCJdKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xpZW50UGFja2FnZVJlbW92ZShwYWNrYWdlTmFtZTogc3RyaW5nLCBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBhY2thZ2UgaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGF3YWl0IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlTWFuYWdlci5yZW1vdmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgcGFja2FnZU5hbWUsIGZhbHNlKTtcblxuICAgICAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV07XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IHN0cmluZ1tdW10gPSBbXTtcblxuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInVuaXRUZXN0UnVubmVyXCIsIFwia2FybWFcIl0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiXSk7XG5cbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pZnk6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlbWFwczogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0gPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0gfHwgbmV3IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS5idW5kbGUgPSBidW5kbGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYnVuZGxlO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdLm1pbmlmeSA9IG1pbmlmeSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBtaW5pZnk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0uc291cmNlbWFwcyA9IHNvdXJjZW1hcHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBzb3VyY2VtYXBzO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdLnZhcmlhYmxlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS52YXJpYWJsZXMgfHwge307XG5cbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYnVpbGRDb25maWd1cmF0aW9uUmVtb3ZlKGNvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiQnVpbGQgY29uZmlndXJhdGlvbiBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiXSk7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHMsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwbGF0Zm9ybUFkZChwbGF0Zm9ybU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1twbGF0Zm9ybU5hbWVdID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1twbGF0Zm9ybU5hbWVdIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGxhdGZvcm1cIiwgcGxhdGZvcm1OYW1lXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCJdKTtcbiAgICAgICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhcIllvdSBzaG91bGQgcHJvYmFibHkgcnVuIG5wbSBpbnN0YWxsIC8geWFybiBpbnN0YWxsIGJlZm9yZSBydW5uaW5nIGFueSBndWxwIHBhY2thZ2luZyBjb21tYW5kcy5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBsYXRmb3JtUmVtb3ZlKHBsYXRmb3JtTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1twbGF0Zm9ybU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQbGF0Zm9ybSBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXTtcblxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInBsYXRmb3JtXCIsIHBsYXRmb3JtTmFtZV0pO1xuICAgICAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiXSk7XG4gICAgICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCJdKTtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKFwiWW91IHNob3VsZCBwcm9iYWJseSBydW4gbnBtIGluc3RhbGwgLyB5YXJuIGluc3RhbGwgdG8gcmVtb3ZlIGFueSB1bm5lY2Vzc2FyeSBwYWNrYWdlcy5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9hZGluZyBkZXBlbmRlbmNpZXNcIiwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuXG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lUGFja2FnZUpzb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4odGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UgPSBmYWxzZTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9lbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0dXBEaXJlY3Rvcmllcyh0aGlzLl9maWxlU3lzdGVtLCBvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaW5pdGlhbGlzZVBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnBhY2thZ2VNYW5hZ2VyID0gdGhpcy5nZXRQaXBlbGluZVN0ZXAoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmU6IElFbmdpbmVQaXBlbGluZVN0ZXBbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lU3RlcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIHBpcGVsaW5lU3RlcFswXSwgcGlwZWxpbmVTdGVwWzFdLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lLnB1c2godGhpcy5nZXRQaXBlbGluZVN0ZXAocGlwZWxpbmVTdGVwWzBdLCBwaXBlbGluZVN0ZXBbMV0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZSkge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmluaXRpYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAucHJvY2Vzcyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQaXBlbGluZVN0ZXA8VCBleHRlbmRzIElFbmdpbmVQaXBlbGluZVN0ZXA+KG1vZHVsZVR5cGU6IHN0cmluZywgbW9kdWxlSWQ6IHN0cmluZyk6IFQge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFtgJHttb2R1bGVUeXBlfS8ke21vZHVsZUlkfWBdO1xuICAgICAgICBpZiAoY2xhc3NOYW1lICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fcGlwZWxpbmVTdGVwQ2FjaGVbY2xhc3NOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fcGlwZWxpbmVTdGVwQ2FjaGVbY2xhc3NOYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB0cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBtb2R1bGVUeXBlOiBzdHJpbmcsIG1vZHVsZUlkOiBzdHJpbmcsIGNvbmZpZ3VyYXRpb25UeXBlPzogc3RyaW5nLCBkZWZpbmVQcm9wZXJ0eTogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgY29uc3QgbW9kdWxlVHlwZUlkID0gYCR7bW9kdWxlVHlwZX0vJHttb2R1bGVJZH1gO1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXTtcblxuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZVBhdGggPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIGBkaXN0L3BpcGVsaW5lU3RlcHNgKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZVR5cGVGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG1vZHVsZVBhdGgsIG1vZHVsZVR5cGUpO1xuICAgICAgICAgICAgY29uc3QgYWN0dWFsVHlwZSA9IGNvbmZpZ3VyYXRpb25UeXBlID8gY29uZmlndXJhdGlvblR5cGUgOiBtb2R1bGVUeXBlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMobW9kdWxlVHlwZUZvbGRlcik7XG4gICAgICAgICAgICAgICAgZmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmVuZHNXaXRoKFwiLmpzXCIpKS5tYXAoZmlsZSA9PiBmaWxlLnJlcGxhY2UoXCIuanNcIiwgXCJcIikpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZUlkICE9PSB1bmRlZmluZWQgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZUlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlSWRMb3dlciA9IG1vZHVsZUlkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlc1tpXS50b0xvd2VyQ2FzZSgpID09PSBtb2R1bGVJZExvd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm9uLWxpdGVyYWwtcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUodGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShtb2R1bGVUeXBlRm9sZGVyLCBmaWxlc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oYWN0dWFsVHlwZSwgeyBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh1bml0ZUNvbmZpZ3VyYXRpb24sIGFjdHVhbFR5cGUsIHsgdmFsdWU6IGNsYXNzTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVDbGFzc05hbWUgPSBgJHttb2R1bGVUeXBlfS8ke2NsYXNzTmFtZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lU3RlcENhY2hlW21vZHVsZUNsYXNzTmFtZV0gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2R1bGVJZE1hcFttb2R1bGVUeXBlSWRdID0gbW9kdWxlQ2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgTW9kdWxlICR7bW9kdWxlSWR9IGZvciBhcmcgJHthY3R1YWxUeXBlfSBjb3VsZCBub3QgYmUgbG9jYXRlZCwgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtmaWxlcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGAke2FjdHVhbFR5cGV9IHNob3VsZCBub3QgYmUgYmxhbmssIHBvc3NpYmxlIG9wdGlvbnMgY291bGQgYmUgWyR7ZmlsZXMuam9pbihcIiwgXCIpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgTW9kdWxlICR7bW9kdWxlSWR9IGZvciBhcmcgJHthY3R1YWxUeXBlfSBmYWlsZWQgdG8gbG9hZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1hcFBhcnNlcihpbnB1dDogc3RyaW5nKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgbGV0IHBhcnNlZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSBudWxsICYmIGlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnNlZE1hcCA9IHt9O1xuICAgICAgICAgICAgY29uc3Qgc3BsaXRBZGRpdGlvbnMgPSBpbnB1dC5zcGxpdChcIjtcIik7XG5cbiAgICAgICAgICAgIHNwbGl0QWRkaXRpb25zLmZvckVhY2goc3BsaXRBZGRpdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSBzcGxpdEFkZGl0aW9uLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZE1hcFtwYXJ0c1swXV0gPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBpbnB1dCBpcyBub3QgZm9ybWVkIGNvcnJlY3RseSAnJHtpbnB1dH0nYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkTWFwO1xuICAgIH1cbn1cbiJdfQ==
