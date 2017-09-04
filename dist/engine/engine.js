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
    constructor() {
        this._moduleIdMap = {};
        this._pipelineStepCache = {};
    }
    initialise(logger, fileSystem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger = logger;
                this._fileSystem = fileSystem;
                this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");
                this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");
                this._enginePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
                return 0;
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
        });
    }
    version() {
        return this._enginePackageJson ? this._enginePackageJson.version : "unknown";
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
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
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
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
                this._logger.banner("Successfully Completed.");
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
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
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
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
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
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            yield engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, false);
            delete uniteConfiguration.clientPackages[packageName];
            const pipelineSteps = [];
            pipelineSteps.push(["unitTestRunner", "karma"]);
            pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
    buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new uniteBuildConfiguration_1.UniteBuildConfiguration();
            uniteConfiguration.buildConfigurations[configurationName].bundle = bundle === undefined ? false : bundle;
            uniteConfiguration.buildConfigurations[configurationName].minify = minify === undefined ? false : minify;
            uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps === undefined ? true : sourcemaps;
            uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};
            const pipelineSteps = [];
            pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
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
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            delete uniteConfiguration.buildConfigurations[configurationName];
            const pipelineSteps = [];
            pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
    platformAdd(platformName, outputDirectory, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            uniteConfiguration.platforms[platformName] = uniteConfiguration.platforms[platformName] || {};
            const pipelineSteps = [];
            pipelineSteps.push(["platform", platformName]);
            pipelineSteps.push(["content", "packageJson"]);
            pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.warning("You should probably run npm install / yarn install before running any gulp packaging commands.");
                this._logger.banner("Successfully Completed.");
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
            this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
            delete uniteConfiguration.platforms[platformName];
            const pipelineSteps = [];
            pipelineSteps.push(["platform", platformName]);
            pipelineSteps.push(["content", "packageJson"]);
            pipelineSteps.push(["scaffold", "uniteConfigurationJson"]);
            const ret = yield this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.warning("You should probably run npm install / yarn install to remove any unnecessary packages.");
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
    createEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        engineVariables.force = false;
        engineVariables.engineRootFolder = this._engineRootFolder;
        engineVariables.engineAssetsFolder = this._engineAssetsFolder;
        engineVariables.enginePackageJson = this._enginePackageJson;
        engineVariables.setupDirectories(this._fileSystem, outputDirectory);
        engineVariables.initialisePackages(uniteConfiguration.clientPackages);
        engineVariables.packageManager = this.getPipelineStep("packageManager", uniteConfiguration.packageManager);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQVF6RixtR0FBZ0c7QUFDaEcseUZBQXNGO0FBQ3RGLHlGQUFzRjtBQU10Rix1REFBb0Q7QUFFcEQ7SUFTSTtRQUNJLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUI7O1lBQzVELElBQUksQ0FBQztnQkFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRTVGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRTVILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFD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QUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDcEUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQztDQUNKO0FBL3ZCRCx3QkErdkJDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haW4gZW5naW5lXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElTcGR4IH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhcIjtcbmltcG9ydCB7IElTcGR4TGljZW5zZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9zcGR4L0lTcGR4TGljZW5zZVwiO1xuaW1wb3J0IHsgSW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvaW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgQnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IE1vZHVsZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL21vZHVsZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgUGxhdGZvcm1PcGVyYXRpb24gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9wbGF0Zm9ybU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmUgaW1wbGVtZW50cyBJRW5naW5lIHtcbiAgICBwcml2YXRlIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJpdmF0ZSBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZUFzc2V0c0ZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZVBhY2thZ2VKc29uOiBQYWNrYWdlQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9tb2R1bGVJZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZ307XG4gICAgcHJpdmF0ZSBfcGlwZWxpbmVTdGVwQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBJRW5naW5lUGlwZWxpbmVTdGVwfTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tb2R1bGVJZE1hcCA9IHt9O1xuICAgICAgICB0aGlzLl9waXBlbGluZVN0ZXBDYWNoZSA9IHt9O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcIi9hc3NldHMvXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPih0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcInBhY2thZ2UuanNvblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyc2lvbigpIDogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uID8gdGhpcy5fZW5naW5lUGFja2FnZUpzb24udmVyc2lvbiA6IFwidW5rbm93blwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUocGFja2FnZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVyOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBsaW50ZXI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NQcmU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NQb3N0OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG5ld091dHB1dERpcmVjdG9yeSA9IHRoaXMuY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBjb25zdCBuZXdGb3JjZSA9IGZvcmNlID09PSB1bmRlZmluZWQgfHwgZm9yY2UgPT09IG51bGwgPyBmYWxzZSA6IGZvcmNlO1xuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihuZXdPdXRwdXREaXJlY3RvcnksICEhZm9yY2UpO1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lID0gcGFja2FnZU5hbWUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUgPSB0aXRsZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlID0gbGljZW5zZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID0gc291cmNlTGFuZ3VhZ2UgfHwgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9IG1vZHVsZVR5cGUgfHwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID0gYnVuZGxlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID0gdW5pdFRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPSB1bml0VGVzdEZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSA9IHVuaXRUZXN0RW5naW5lIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPSBlMmVUZXN0UnVubmVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9IGUyZVRlc3RGcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPSBsaW50ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gcGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyIHx8IFwiTnBtXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciA9IFwiR3VscFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc2VydmVyID0gXCJCcm93c2VyU3luY1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPSBhcHBsaWNhdGlvbkZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSA9IGNzc1ByZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCA9IGNzc1Bvc3QgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3Q7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLmRldiA9IHsgYnVuZGxlOiBmYWxzZSwgbWluaWZ5OiBmYWxzZSwgc291cmNlbWFwczogdHJ1ZSwgdmFyaWFibGVzOiB7fSB9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMucHJvZCA9IHsgYnVuZGxlOiB0cnVlLCBtaW5pZnk6IHRydWUsIHNvdXJjZW1hcHM6IGZhbHNlLCB2YXJpYWJsZXM6IHt9IH07XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyB8fCB7IFdlYjoge30gfTtcblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tQYWNrYWdlTmFtZSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJ0aXRsZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGR4TGljZW5zZTogSVNwZHhMaWNlbnNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGljZW5zZURhdGEgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxJU3BkeD4odGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcInNwZHgtZnVsbC5qc29uXCIpO1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8c3RyaW5nPih0aGlzLl9sb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobGljZW5zZURhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgcG9zc2libGUgU1BEWCBsaWNlbnNlIHZhbHVlcyAoc2VlIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvKS5cIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3BkeExpY2Vuc2UgPSBsaWNlbnNlRGF0YVt1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIHdhcyBhIHByb2JsZW0gcmVhZGluZyB0aGUgc3BkeC1mdWxsLmpzb24gZmlsZVwiLCBlKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcImxhbmd1YWdlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJzb3VyY2VMYW5ndWFnZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcIm1vZHVsZVR5cGVcIiwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwiYnVuZGxlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0VGVzdFJ1bm5lciA9PT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGlmICh1bml0VGVzdEZyYW1ld29yayAhPT0gbnVsbCAmJiB1bml0VGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5pdFRlc3RFbmdpbmUgIT09IG51bGwgJiYgdW5pdFRlc3RFbmdpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcInVuaXRUZXN0RW5naW5lIGlzIG5vdCB2YWxpZCBpZiB1bml0VGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcInVuaXRUZXN0UnVubmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJ0ZXN0RnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgXCJ1bml0VGVzdEZyYW1ld29ya1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcInVuaXRUZXN0RW5naW5lXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZTJlVGVzdFJ1bm5lciA9PT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGlmIChlMmVUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIGUyZVRlc3RGcmFtZXdvcmsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcImUyZVRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIGUyZVRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgXCJlMmVUZXN0UnVubmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcInRlc3RGcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmssIFwiZTJlVGVzdEZyYW1ld29ya1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW50ZXIgIT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwibGludGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcImNzc1ByZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcImNzc1Bvc3RcIiwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yaykpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJmb3JjZVwiLCB7IG5ld0ZvcmNlIH0pO1xuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyZVJ1bihuZXdPdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgc3BkeExpY2Vuc2UsIG5ld0ZvcmNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY2xpZW50UGFja2FnZShvcGVyYXRpb246IE1vZHVsZU9wZXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBJbmNsdWRlTW9kZSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFNjcmlwdEluY2x1ZGVNb2RlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlcnM6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24obmV3T3V0cHV0RGlyZWN0b3J5LCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gcGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8TW9kdWxlT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIG9wZXJhdGlvbiwgW1wiYWRkXCIsIFwicmVtb3ZlXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCBwYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLnRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uLCBcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50UGFja2FnZUFkZChwYWNrYWdlTmFtZSwgdmVyc2lvbiwgcHJlbG9hZCwgaW5jbHVkZU1vZGUsIHNjcmlwdEluY2x1ZGVNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluLCBtYWluTWluaWZpZWQsIHRlc3RpbmdBZGRpdGlvbnMsIGlzUGFja2FnZSwgYXNzZXRzLCBtYXAsIGxvYWRlcnMsIG5ld091dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNsaWVudFBhY2thZ2VSZW1vdmUocGFja2FnZU5hbWUsIG5ld091dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBidWlsZENvbmZpZ3VyYXRpb24ob3BlcmF0aW9uOiBCdWlsZENvbmZpZ3VyYXRpb25PcGVyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGU6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pZnk6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VtYXBzOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24obmV3T3V0cHV0RGlyZWN0b3J5LCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbj4odGhpcy5fbG9nZ2VyLCBcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwiY29uZmlndXJhdGlvbk5hbWVcIiwgY29uZmlndXJhdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZSwgYnVuZGxlLCBtaW5pZnksIHNvdXJjZW1hcHMsIG5ld091dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJ1aWxkQ29uZmlndXJhdGlvblJlbW92ZShjb25maWd1cmF0aW9uTmFtZSwgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHBsYXRmb3JtKG9wZXJhdGlvbjogUGxhdGZvcm1PcGVyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG5ld091dHB1dERpcmVjdG9yeSA9IHRoaXMuY2xlYW51cE91dHB1dERpcmVjdG9yeShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKG5ld091dHB1dERpcmVjdG9yeSwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8UGxhdGZvcm1PcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgb3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMudHJ5TG9hZFBpcGVsaW5lU3RlcCh1bml0ZUNvbmZpZ3VyYXRpb24sIFwicGxhdGZvcm1cIiwgcGxhdGZvcm1OYW1lLCBcInBsYXRmb3JtTmFtZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlwiKTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wbGF0Zm9ybUFkZChwbGF0Zm9ybU5hbWUsIG5ld091dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsYXRmb3JtUmVtb3ZlKHBsYXRmb3JtTmFtZSwgbmV3T3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChvdXRwdXREaXJlY3RvcnkgPT09IHVuZGVmaW5lZCB8fCBvdXRwdXREaXJlY3RvcnkgPT09IG51bGwgfHwgb3V0cHV0RGlyZWN0b3J5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gbm8gb3V0cHV0IGRpcmVjdG9yeSBzcGVjaWZpZWQgc28gdXNlIGN1cnJlbnRcbiAgICAgICAgICAgIHJldHVybiBcIi4vXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw7XG5cbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYSB1bml0ZS5qc29uIHdlIGNhbiBsb2FkIGZvciBkZWZhdWx0IG9wdGlvbnNcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlRXhpc3RzKG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZUNvbmZpZ3VyYXRpb24+KG91dHB1dERpcmVjdG9yeSwgXCJ1bml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJSZWFkaW5nIGV4aXN0aW5nIHVuaXRlLmpzb25cIiwgZSk7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjb25maWd1cmVSdW4ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBsaWNlbnNlOiBJU3BkeExpY2Vuc2UsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZm9yY2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5saWNlbnNlID0gbGljZW5zZTtcblxuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBzdHJpbmdbXVtdID0gW107XG5cbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwib3V0cHV0RGlyZWN0b3J5XCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwiYXBwU2NhZmZvbGRcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0VGVzdFNjYWZmb2xkXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwiZTJlVGVzdFNjYWZmb2xkXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgXCJwbGFpbkFwcFwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBcImFuZ3VsYXJcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgXCJhdXJlbGlhXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwicmVhY3RcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJ0YXNrTWFuYWdlclwiLCBcImd1bHBcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJwbGF0Zm9ybVwiLCBcIndlYlwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJwbGF0Zm9ybVwiLCBcImVsZWN0cm9uXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wibW9kdWxlVHlwZVwiLCBcImFtZFwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJtb2R1bGVUeXBlXCIsIFwiY29tbW9uSnNcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wibW9kdWxlVHlwZVwiLCBcInN5c3RlbUpzXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYnVuZGxlclwiLCBcImJyb3dzZXJpZnlcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiYnVuZGxlclwiLCBcInJlcXVpcmVKc1wiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJidW5kbGVyXCIsIFwic3lzdGVtSnNCdWlsZGVyXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImJ1bmRsZXJcIiwgXCJ3ZWJwYWNrXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY3NzUHJlXCIsIFwiY3NzXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNzc1ByZVwiLCBcImxlc3NcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY3NzUHJlXCIsIFwic2Fzc1wiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQcmVcIiwgXCJzdHlsdXNcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQb3N0XCIsIFwicG9zdENzc1wiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjc3NQb3N0XCIsIFwibm9uZVwiXSk7XG5cbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInRlc3RGcmFtZXdvcmtcIiwgXCJtb2NoYUNoYWlcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widGVzdEZyYW1ld29ya1wiLCBcImphc21pbmVcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJsYW5ndWFnZVwiLCBcImphdmFTY3JpcHRcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wibGFuZ3VhZ2VcIiwgXCJ0eXBlU2NyaXB0XCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiZTJlVGVzdFJ1bm5lclwiLCBcIndlYmRyaXZlcklvXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImUyZVRlc3RSdW5uZXJcIiwgXCJwcm90cmFjdG9yXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RFbmdpbmVcIiwgXCJwaGFudG9tSnNcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RFbmdpbmVcIiwgXCJjaHJvbWVIZWFkbGVzc1wiXSk7XG5cbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImxpbnRlclwiLCBcImVzTGludFwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJsaW50ZXJcIiwgXCJ0c0xpbnRcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJ1bml0VGVzdFJ1bm5lclwiLCBcImthcm1hXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGFja2FnZU1hbmFnZXJcIiwgXCJucG1cIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGFja2FnZU1hbmFnZXJcIiwgXCJ5YXJuXCJdKTtcblxuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2VydmVyXCIsIFwiYnJvd3NlclN5bmNcIl0pO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwiaHRtbFRlbXBsYXRlXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJyZWFkTWVcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wiY29udGVudFwiLCBcImdpdElnbm9yZVwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwibGljZW5zZVwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwiYXNzZXRzXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiXSk7XG5cbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXNcIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCJdKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHMsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhcIllvdSBzaG91bGQgcHJvYmFibHkgcnVuIG5wbSBpbnN0YWxsIC8geWFybiBpbnN0YWxsIGJlZm9yZSBydW5uaW5nIGFueSBndWxwIGNvbW1hbmRzLlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlQWRkKHBhY2thZ2VOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IEluY2x1ZGVNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogU2NyaXB0SW5jbHVkZU1vZGUgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyczogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbmV3SW5jbHVkZU1vZGUgPSBpbmNsdWRlTW9kZSA9PT0gdW5kZWZpbmVkIHx8IGluY2x1ZGVNb2RlID09PSBudWxsIHx8IGluY2x1ZGVNb2RlLmxlbmd0aCA9PT0gMCA/IFwiYm90aFwiIDogaW5jbHVkZU1vZGU7XG4gICAgICAgIGNvbnN0IG5ld1NjcmlwdEluY2x1ZGVNb2RlID0gc2NyaXB0SW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fCBzY3JpcHRJbmNsdWRlTW9kZSA9PT0gbnVsbCB8fCBzY3JpcHRJbmNsdWRlTW9kZS5sZW5ndGggPT09IDAgPyBcIm5vbmVcIiA6IHNjcmlwdEluY2x1ZGVNb2RlO1xuXG4gICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInZlcnNpb25cIiwgeyB2ZXJzaW9uIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJwcmVsb2FkXCIsIHsgcHJlbG9hZCB9KTtcblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxJbmNsdWRlTW9kZT4odGhpcy5fbG9nZ2VyLCBcImluY2x1ZGVNb2RlXCIsIG5ld0luY2x1ZGVNb2RlLCBbXCJhcHBcIiwgXCJ0ZXN0XCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8U2NyaXB0SW5jbHVkZU1vZGU+KHRoaXMuX2xvZ2dlciwgXCJzY3JpcHRJbmNsdWRlTW9kZVwiLCBuZXdTY3JpcHRJbmNsdWRlTW9kZSwgW1wibm9uZVwiLCBcImJ1bmRsZWRcIiwgXCJub3RCdW5kbGVkXCIsIFwiYm90aFwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1haW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibWFpblwiLCB7IG1haW4gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1haW5NaW5pZmllZFwiLCB7IG1haW5NaW5pZmllZCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXN0aW5nQWRkaXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRlc3RpbmdBZGRpdGlvbnNcIiwgeyB0ZXN0aW5nQWRkaXRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiaXNQYWNrYWdlXCIsIHsgaXNQYWNrYWdlIH0pO1xuICAgICAgICBpZiAoYXNzZXRzKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImFzc2V0c1wiLCB7IGFzc2V0cyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm1hcFwiLCB7IG1hcCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9hZGVycykge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJsb2FkZXJzXCIsIHsgbG9hZGVycyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNbcGFja2FnZU5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJQYWNrYWdlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBjb25zdCBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBtYWluO1xuICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZDtcblxuICAgICAgICBjb25zdCBtaXNzaW5nVmVyc2lvbiA9IHZlcnNpb24gPT09IG51bGwgfHwgdmVyc2lvbiA9PT0gdW5kZWZpbmVkIHx8IHZlcnNpb24ubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBtaXNzaW5nTWFpbiA9IG1haW4gPT09IG51bGwgfHwgbWFpbiA9PT0gdW5kZWZpbmVkIHx8IG1haW4ubGVuZ3RoID09PSAwO1xuICAgICAgICBpZiAobWlzc2luZ1ZlcnNpb24gfHwgbWlzc2luZ01haW4pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZUluZm8gPSBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuaW5mbyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHBhY2thZ2VOYW1lLCB2ZXJzaW9uKTtcblxuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IGNsaWVudFBhY2thZ2UudmVyc2lvbiB8fCBgXiR7cGFja2FnZUluZm8udmVyc2lvbiB8fCBcIjAuMC4xXCJ9YDtcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBjbGllbnRQYWNrYWdlLm1haW4gfHwgcGFja2FnZUluZm8ubWFpbjtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlJlYWRpbmcgUGFja2FnZSBJbmZvcm1hdGlvbiBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGllbnRQYWNrYWdlLm1haW4pIHtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IGNsaWVudFBhY2thZ2UubWFpbi5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5tYWluTWluaWZpZWQgPSBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZC5yZXBsYWNlKC9cXC5cXC8vLCBcIi9cIik7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50UGFja2FnZS5wcmVsb2FkID0gcHJlbG9hZCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBwcmVsb2FkO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA9IGlzUGFja2FnZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuaW5jbHVkZU1vZGUgPSBuZXdJbmNsdWRlTW9kZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IG5ld1NjcmlwdEluY2x1ZGVNb2RlO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmFzc2V0cyA9IGFzc2V0cztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zID0gdGhpcy5tYXBQYXJzZXIodGVzdGluZ0FkZGl0aW9ucyk7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLm1hcCA9IHRoaXMubWFwUGFyc2VyKG1hcCk7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLmxvYWRlcnMgPSB0aGlzLm1hcFBhcnNlcihsb2FkZXJzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJJbnB1dCBmYWlsdXJlXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV0gPSBjbGllbnRQYWNrYWdlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuYWRkKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIHBhY2thZ2VOYW1lLCBjbGllbnRQYWNrYWdlLnZlcnNpb24sIGZhbHNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJBZGRpbmcgUGFja2FnZSBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1widW5pdFRlc3RSdW5uZXJcIiwgXCJrYXJtYVwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGllbnRQYWNrYWdlUmVtb3ZlKHBhY2thZ2VOYW1lOiBzdHJpbmcsIG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW3BhY2thZ2VOYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiUGFja2FnZSBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBhd2FpdCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIucmVtb3ZlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIHBhY2thZ2VOYW1lLCBmYWxzZSk7XG5cbiAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twYWNrYWdlTmFtZV07XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuXG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJ1bml0VGVzdFJ1bm5lclwiLCBcImthcm1hXCJdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiXSk7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJ1aWxkQ29uZmlndXJhdGlvbkFkZChjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pZnk6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlbWFwczogYm9vbGVhbiB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXSA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXSB8fCBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0uYnVuZGxlID0gYnVuZGxlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGJ1bmRsZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdLm1pbmlmeSA9IG1pbmlmeSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBtaW5pZnk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS5zb3VyY2VtYXBzID0gc291cmNlbWFwcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNvdXJjZW1hcHM7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2NvbmZpZ3VyYXRpb25OYW1lXS52YXJpYWJsZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV0udmFyaWFibGVzIHx8IHt9O1xuXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcHM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcInNjYWZmb2xkXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiXSk7XG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMucnVuUGlwZWxpbmUocGlwZWxpbmVTdGVwcywgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZENvbmZpZ3VyYXRpb25SZW1vdmUoY29uZmlndXJhdGlvbk5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbY29uZmlndXJhdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJCdWlsZCBjb25maWd1cmF0aW9uIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1tjb25maWd1cmF0aW9uTmFtZV07XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCJdKTtcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBsYXRmb3JtQWRkKHBsYXRmb3JtTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSA9IHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbcGxhdGZvcm1OYW1lXSB8fCB7fTtcblxuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJwbGF0Zm9ybVwiLCBwbGF0Zm9ybU5hbWVdKTtcbiAgICAgICAgcGlwZWxpbmVTdGVwcy5wdXNoKFtcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJzY2FmZm9sZFwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIl0pO1xuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lKHBpcGVsaW5lU3RlcHMsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybmluZyhcIllvdSBzaG91bGQgcHJvYmFibHkgcnVuIG5wbSBpbnN0YWxsIC8geWFybiBpbnN0YWxsIGJlZm9yZSBydW5uaW5nIGFueSBndWxwIHBhY2thZ2luZyBjb21tYW5kcy5cIik7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcGxhdGZvcm1SZW1vdmUocGxhdGZvcm1OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlBsYXRmb3JtIGhhcyBub3QgYmVlbiBhZGRlZC5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW3BsYXRmb3JtTmFtZV07XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wicGxhdGZvcm1cIiwgcGxhdGZvcm1OYW1lXSk7XG4gICAgICAgIHBpcGVsaW5lU3RlcHMucHVzaChbXCJjb250ZW50XCIsIFwicGFja2FnZUpzb25cIl0pO1xuICAgICAgICBwaXBlbGluZVN0ZXBzLnB1c2goW1wic2NhZmZvbGRcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCJdKTtcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5ydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKFwiWW91IHNob3VsZCBwcm9iYWJseSBydW4gbnBtIGluc3RhbGwgLyB5YXJuIGluc3RhbGwgdG8gcmVtb3ZlIGFueSB1bm5lY2Vzc2FyeSBwYWNrYWdlcy5cIik7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZmFsc2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciA9IHRoaXMuX2VuZ2luZUFzc2V0c0ZvbGRlcjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmVuZ2luZVBhY2thZ2VKc29uID0gdGhpcy5fZW5naW5lUGFja2FnZUpzb247XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXR1cERpcmVjdG9yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIG91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5pbml0aWFsaXNlUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIgPSB0aGlzLmdldFBpcGVsaW5lU3RlcChcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBydW5QaXBlbGluZShwaXBlbGluZVN0ZXBzOiBzdHJpbmdbXVtdLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZTogSUVuZ2luZVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVTdGVwcykge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy50cnlMb2FkUGlwZWxpbmVTdGVwKHVuaXRlQ29uZmlndXJhdGlvbiwgcGlwZWxpbmVTdGVwWzBdLCBwaXBlbGluZVN0ZXBbMV0sIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmUucHVzaCh0aGlzLmdldFBpcGVsaW5lU3RlcChwaXBlbGluZVN0ZXBbMF0sIHBpcGVsaW5lU3RlcFsxXSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuaW5pdGlhbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5wcm9jZXNzKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBpcGVsaW5lU3RlcDxUIGV4dGVuZHMgSUVuZ2luZVBpcGVsaW5lU3RlcD4obW9kdWxlVHlwZTogc3RyaW5nLCBtb2R1bGVJZDogc3RyaW5nKTogVCB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW2Ake21vZHVsZVR5cGV9LyR7bW9kdWxlSWR9YF07XG4gICAgICAgIGlmIChjbGFzc05hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9waXBlbGluZVN0ZXBDYWNoZVtjbGFzc05hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9waXBlbGluZVN0ZXBDYWNoZVtjbGFzc05hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHRyeUxvYWRQaXBlbGluZVN0ZXAodW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIG1vZHVsZVR5cGU6IHN0cmluZywgbW9kdWxlSWQ6IHN0cmluZywgY29uZmlndXJhdGlvblR5cGU/OiBzdHJpbmcsIGRlZmluZVByb3BlcnR5OiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBjb25zdCBtb2R1bGVUeXBlSWQgPSBgJHttb2R1bGVUeXBlfS8ke21vZHVsZUlkfWA7XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFttb2R1bGVUeXBlSWRdO1xuXG4gICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlUGF0aCA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgYGRpc3QvcGlwZWxpbmVTdGVwc2ApO1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlVHlwZUZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUobW9kdWxlUGF0aCwgbW9kdWxlVHlwZSk7XG4gICAgICAgICAgICBjb25zdCBhY3R1YWxUeXBlID0gY29uZmlndXJhdGlvblR5cGUgPyBjb25maWd1cmF0aW9uVHlwZSA6IG1vZHVsZVR5cGU7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhtb2R1bGVUeXBlRm9sZGVyKTtcbiAgICAgICAgICAgICAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuZW5kc1dpdGgoXCIuanNcIikpLm1hcChmaWxlID0+IGZpbGUucmVwbGFjZShcIi5qc1wiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlSWQgIT09IHVuZGVmaW5lZCAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlSWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVJZExvd2VyID0gbW9kdWxlSWQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzW2ldLnRvTG93ZXJDYXNlKCkgPT09IG1vZHVsZUlkTG93ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZSh0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG1vZHVsZVR5cGVGb2xkZXIsIGZpbGVzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IE9iamVjdC5rZXlzKG1vZHVsZSlbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlW2NsYXNzTmFtZV0ucHJvdG90eXBlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhhY3R1YWxUeXBlLCB7IGNsYXNzTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHVuaXRlQ29uZmlndXJhdGlvbiwgYWN0dWFsVHlwZSwgeyB2YWx1ZTogY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZUNsYXNzTmFtZSA9IGAke21vZHVsZVR5cGV9LyR7Y2xhc3NOYW1lfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmVTdGVwQ2FjaGVbbW9kdWxlQ2xhc3NOYW1lXSA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF0gPSBtb2R1bGVDbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBNb2R1bGUgJHttb2R1bGVJZH0gZm9yIGFyZyAke2FjdHVhbFR5cGV9IGNvdWxkIG5vdCBiZSBsb2NhdGVkLCBwb3NzaWJsZSBvcHRpb25zIGNvdWxkIGJlIFske2ZpbGVzLmpvaW4oXCIsIFwiKX1dYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYCR7YWN0dWFsVHlwZX0gc2hvdWxkIG5vdCBiZSBibGFuaywgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtmaWxlcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBNb2R1bGUgJHttb2R1bGVJZH0gZm9yIGFyZyAke2FjdHVhbFR5cGV9IGZhaWxlZCB0byBsb2FkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWFwUGFyc2VyKGlucHV0OiBzdHJpbmcpOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICBsZXQgcGFyc2VkTWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICAgICAgaWYgKGlucHV0ICE9PSB1bmRlZmluZWQgJiYgaW5wdXQgIT09IG51bGwgJiYgaW5wdXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFyc2VkTWFwID0ge307XG4gICAgICAgICAgICBjb25zdCBzcGxpdEFkZGl0aW9ucyA9IGlucHV0LnNwbGl0KFwiO1wiKTtcblxuICAgICAgICAgICAgc3BsaXRBZGRpdGlvbnMuZm9yRWFjaChzcGxpdEFkZGl0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHNwbGl0QWRkaXRpb24uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWFwW3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGlucHV0IGlzIG5vdCBmb3JtZWQgY29ycmVjdGx5ICcke2lucHV0fSdgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZWRNYXA7XG4gICAgfVxufVxuIl19
