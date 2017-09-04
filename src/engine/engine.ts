/**
 * Main engine
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdx } from "../configuration/models/spdx/ISpdx";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { ScriptIncludeMode } from "../configuration/models/unite/scriptIncludeMode";
import { UniteBuildConfiguration } from "../configuration/models/unite/uniteBuildConfiguration";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { BuildConfigurationOperation } from "../interfaces/buildConfigurationOperation";
import { IEngine } from "../interfaces/IEngine";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { PlatformOperation } from "../interfaces/platformOperation";
import { EngineVariables } from "./engineVariables";
import { PipelineKey } from "./pipelineKey";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _engineRootFolder: string;
    private _engineAssetsFolder: string;
    private _enginePackageJson: PackageConfiguration;
    private _moduleIdMap: { [id: string]: string};
    private _pipelineStepCache: { [id: string]: IEnginePipelineStep};

    constructor() {
        this._moduleIdMap = {};
        this._pipelineStepCache = {};
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem): Promise<number> {
        try {
            this._logger = logger;
            this._fileSystem = fileSystem;
            this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");
            this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");

            this._enginePackageJson = await this._fileSystem.fileReadJson<PackageConfiguration>(this._engineRootFolder, "package.json");

            return 0;
        } catch (err) {
            this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
            return 1;
        }
    }

    public version() : string {
        return this._enginePackageJson ? this._enginePackageJson.version : "unknown";
    }

    public async configure(packageName: string | undefined | null,
                           title: string | undefined | null,
                           license: string | undefined | null,
                           sourceLanguage: string | undefined | null,
                           moduleType: string | undefined | null,
                           bundler: string | undefined | null,
                           unitTestRunner: string | undefined | null,
                           unitTestFramework: string | undefined | null,
                           unitTestEngine: string | undefined | null,
                           e2eTestRunner: string | undefined | null,
                           e2eTestFramework: string | undefined | null,
                           linter: string | undefined | null,
                           cssPre: string | undefined | null,
                           cssPost: string | undefined | null,
                           packageManager: string | undefined | null,
                           applicationFramework: string | undefined | null,
                           force: boolean | undefined | null,
                           outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const newForce = force === undefined || force === null ? false : force;
        let uniteConfiguration = await this.loadConfiguration(newOutputDirectory, !!force);
        if (uniteConfiguration === undefined) {
            uniteConfiguration = new UniteConfiguration();
        } else if (uniteConfiguration === null) {
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

        if (!ParameterValidation.checkPackageName(this._logger, "packageName", uniteConfiguration.packageName)) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "title", uniteConfiguration.title)) {
            return 1;
        }

        let spdxLicense: ISpdxLicense;
        try {
            const licenseData = await this._fileSystem.fileReadJson<ISpdx>(this._engineAssetsFolder, "spdx-full.json");
            if (!ParameterValidation.checkOneOf<string>(this._logger,
                                                        "license",
                                                        uniteConfiguration.license,
                                                        Object.keys(licenseData),
                                                        "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                return 1;
            } else {
                spdxLicense = licenseData[uniteConfiguration.license];
            }
        } catch (e) {
            this._logger.error("There was a problem reading the spdx-full.json file", e);
            return 1;
        }

        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("language", uniteConfiguration.sourceLanguage), "sourceLanguage")) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("moduleType", uniteConfiguration.moduleType))) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("bundler", uniteConfiguration.bundler))) {
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
        } else {
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("unitTestRunner", uniteConfiguration.unitTestRunner))) {
                return 1;
            }
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("testFramework", uniteConfiguration.unitTestFramework), "unitTestFramework")) {
                return 1;
            }
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("unitTestEngine", uniteConfiguration.unitTestEngine))) {
                return 1;
            }
        }
        if (e2eTestRunner === "None") {
            if (e2eTestFramework !== null && e2eTestFramework !== undefined) {
                this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                return 1;
            }
        } else {
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("e2eTestRunner", uniteConfiguration.e2eTestRunner))) {
                return 1;
            }
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("testFramework", uniteConfiguration.e2eTestFramework), "e2eTestFramework")) {
                return 1;
            }
        }
        if (linter !== "None") {
            if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("linter", uniteConfiguration.linter))) {
                return 1;
            }
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("cssPre", uniteConfiguration.cssPre))) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("cssPost", uniteConfiguration.cssPost))) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("applicationFramework", uniteConfiguration.applicationFramework))) {
            return 1;
        }

        this._logger.info("force", { newForce });

        this._logger.info("");

        return this.configureRun(newOutputDirectory, uniteConfiguration, spdxLicense, newForce);
    }

    public async clientPackage(operation: ModuleOperation | undefined | null,
                               packageName: string | undefined | null,
                               version: string | undefined | null,
                               preload: boolean | undefined,
                               includeMode: IncludeMode | undefined | null,
                               scriptIncludeMode: ScriptIncludeMode | undefined | null,
                               main: string | undefined | null,
                               mainMinified: string | undefined | null,
                               testingAdditions: string | undefined | null,
                               isPackage: boolean | undefined,
                               assets: string | undefined | null,
                               map: string | undefined | null,
                               loaders: string | undefined | null,
                               noScript: boolean | undefined,
                               packageManager: string | undefined | null,
                               outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager;
        }

        if (!ParameterValidation.checkOneOf<ModuleOperation>(this._logger, "operation", operation, ["add", "remove"])) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "packageName", packageName)) {
            return 1;
        }

        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }

        if (operation === "add") {
            return await this.clientPackageAdd(packageName, version, preload, includeMode, scriptIncludeMode,
                                               main, mainMinified, testingAdditions, isPackage, assets, map, loaders, noScript,
                                               newOutputDirectory, uniteConfiguration);
        } else {
            return await this.clientPackageRemove(packageName, newOutputDirectory, uniteConfiguration);
        }
    }

    public async buildConfiguration(operation: BuildConfigurationOperation | undefined | null,
                                    configurationName: string | undefined | null,
                                    bundle: boolean | undefined,
                                    minify: boolean | undefined,
                                    sourcemaps: boolean | undefined,
                                    outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
        }

        if (!ParameterValidation.checkOneOf<BuildConfigurationOperation>(this._logger, "operation", operation, ["add", "remove"])) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "configurationName", configurationName)) {
            return 1;
        }

        this._logger.info("");

        if (operation === "add") {
            return await this.buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, newOutputDirectory, uniteConfiguration);
        } else {
            return await this.buildConfigurationRemove(configurationName, newOutputDirectory, uniteConfiguration);
        }
    }

    public async platform(operation: PlatformOperation | undefined | null,
                          platformName: string | undefined | null,
                          outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.platforms = uniteConfiguration.platforms || {};
        }

        if (!ParameterValidation.checkOneOf<PlatformOperation>(this._logger, "operation", operation, ["add", "remove"])) {
            return 1;
        }
        if (!await this.tryLoadPipelineStep(uniteConfiguration, new PipelineKey("platform", platformName), "platformName")) {
            return 1;
        }

        this._logger.info("");

        if (operation === "add") {
            return await this.platformAdd(platformName, newOutputDirectory, uniteConfiguration);
        } else {
            return await this.platformRemove(platformName, newOutputDirectory, uniteConfiguration);
        }
    }

    private cleanupOutputDirectory(outputDirectory: string | null | undefined): string {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            return "./";
        } else {
            return this._fileSystem.pathAbsolute(outputDirectory);
        }
    }

    private async loadConfiguration(outputDirectory: string, force: boolean): Promise<UniteConfiguration | undefined | null> {
        let uniteConfiguration: UniteConfiguration | undefined | null;

        if (!force) {
            // check if there is a unite.json we can load for default options
            try {
                const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");

                if (exists) {
                    uniteConfiguration = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");
                }
            } catch (e) {
                this._logger.error("Reading existing unite.json", e);
                uniteConfiguration = null;
            }
        }

        return uniteConfiguration;
    }

    private async configureRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, license: ISpdxLicense, force: boolean): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        engineVariables.force = force;
        engineVariables.license = license;

        const pipelineSteps: PipelineKey[] = [];

        pipelineSteps.push(new PipelineKey("scaffold", "outputDirectory"));
        pipelineSteps.push(new PipelineKey("scaffold", "appScaffold"));
        pipelineSteps.push(new PipelineKey("scaffold", "unitTestScaffold"));
        pipelineSteps.push(new PipelineKey("scaffold", "e2eTestScaffold"));

        pipelineSteps.push(new PipelineKey("applicationFramework", "plainApp"));
        pipelineSteps.push(new PipelineKey("applicationFramework", "angular"));
        pipelineSteps.push(new PipelineKey("applicationFramework", "aurelia"));
        pipelineSteps.push(new PipelineKey("applicationFramework", "react"));

        pipelineSteps.push(new PipelineKey("taskManager", "gulp"));

        pipelineSteps.push(new PipelineKey("platform", "web"));
        pipelineSteps.push(new PipelineKey("platform", "electron"));

        pipelineSteps.push(new PipelineKey("moduleType", "amd"));
        pipelineSteps.push(new PipelineKey("moduleType", "commonJs"));
        pipelineSteps.push(new PipelineKey("moduleType", "systemJs"));

        pipelineSteps.push(new PipelineKey("bundler", "browserify"));
        pipelineSteps.push(new PipelineKey("bundler", "requireJs"));
        pipelineSteps.push(new PipelineKey("bundler", "systemJsBuilder"));
        pipelineSteps.push(new PipelineKey("bundler", "webpack"));

        pipelineSteps.push(new PipelineKey("cssPre", "css"));
        pipelineSteps.push(new PipelineKey("cssPre", "less"));
        pipelineSteps.push(new PipelineKey("cssPre", "sass"));
        pipelineSteps.push(new PipelineKey("cssPre", "stylus"));

        pipelineSteps.push(new PipelineKey("cssPost", "postCss"));
        pipelineSteps.push(new PipelineKey("cssPost", "none"));

        pipelineSteps.push(new PipelineKey("testFramework", "mochaChai"));
        pipelineSteps.push(new PipelineKey("testFramework", "jasmine"));

        pipelineSteps.push(new PipelineKey("language", "javaScript"));
        pipelineSteps.push(new PipelineKey("language", "typeScript"));

        pipelineSteps.push(new PipelineKey("e2eTestRunner", "webdriverIo"));
        pipelineSteps.push(new PipelineKey("e2eTestRunner", "protractor"));

        pipelineSteps.push(new PipelineKey("unitTestEngine", "phantomJs"));
        pipelineSteps.push(new PipelineKey("unitTestEngine", "chromeHeadless"));

        pipelineSteps.push(new PipelineKey("linter", "esLint"));
        pipelineSteps.push(new PipelineKey("linter", "tsLint"));

        pipelineSteps.push(new PipelineKey("unitTestRunner", "karma"));

        pipelineSteps.push(new PipelineKey("packageManager", "npm"));
        pipelineSteps.push(new PipelineKey("packageManager", "yarn"));

        pipelineSteps.push(new PipelineKey("server", "browserSync"));

        pipelineSteps.push(new PipelineKey("content", "htmlTemplate"));
        pipelineSteps.push(new PipelineKey("content", "readMe"));
        pipelineSteps.push(new PipelineKey("content", "gitIgnore"));
        pipelineSteps.push(new PipelineKey("content", "license"));
        pipelineSteps.push(new PipelineKey("content", "assets"));
        pipelineSteps.push(new PipelineKey("content", "packageJson"));

        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationDirectories"));
        pipelineSteps.push(new PipelineKey("scaffold", "uniteThemeConfigurationJson"));
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async clientPackageAdd(packageName: string,
                                   version: string,
                                   preload: boolean | undefined,
                                   includeMode: IncludeMode,
                                   scriptIncludeMode: ScriptIncludeMode | undefined,
                                   main: string | undefined | null,
                                   mainMinified: string | undefined | null,
                                   testingAdditions: string | undefined | null,
                                   isPackage: boolean | undefined,
                                   assets: string | undefined | null,
                                   map: string | undefined | null,
                                   loaders: string | undefined | null,
                                   noScript: boolean | undefined,
                                   outputDirectory: string,
                                   uniteConfiguration: UniteConfiguration): Promise<number> {
        const newIncludeMode = includeMode === undefined || includeMode === null || includeMode.length === 0 ? "both" : includeMode;
        const newScriptIncludeMode = scriptIncludeMode === undefined || scriptIncludeMode === null || scriptIncludeMode.length === 0 ? "none" : scriptIncludeMode;

        if (version) {
            this._logger.info("version", { version });
        }

        this._logger.info("preload", { preload });

        if (!ParameterValidation.checkOneOf<IncludeMode>(this._logger, "includeMode", newIncludeMode, ["app", "test", "both"])) {
            return 1;
        }

        if (!ParameterValidation.checkOneOf<ScriptIncludeMode>(this._logger, "scriptIncludeMode", newScriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
            return 1;
        }

        if (main) {
            if (noScript) {
                this._logger.error("You cannot combine the main and noScript arguments");
                return 1;
            } else {
                this._logger.info("main", { main });
            }
        }

        if (mainMinified) {
            if (noScript) {
                this._logger.error("You cannot combine the mainMinified and noScript arguments");
                return 1;
            } else {
                this._logger.info("mainMinified", { mainMinified });
            }
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
        if (noScript) {
            this._logger.info("noScript", { noScript });
        }

        this._logger.info("");

        if (uniteConfiguration.clientPackages[packageName]) {
            this._logger.error("Package has already been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        const clientPackage = new UniteClientPackage();
        clientPackage.version = version;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;

        const missingVersion = version === null || version === undefined || version.length === 0;
        const missingMain = (main === null || main === undefined || main.length === 0) && !noScript;
        if (missingVersion || missingMain) {
            try {
                const packageInfo = await engineVariables.packageManager.info(this._logger, this._fileSystem, packageName, version);

                clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                if (!noScript) {
                    clientPackage.main = clientPackage.main || packageInfo.main;
                }
            } catch (err) {
                this._logger.error("Reading Package Information failed", err);
                return 1;
            }
        }

        if (!noScript) {
            if (clientPackage.main) {
                clientPackage.main = clientPackage.main.replace(/\\/g, "/");
                clientPackage.main = clientPackage.main.replace(/\.\//, "/");
            }
            if (clientPackage.mainMinified) {
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/\\/g, "/");
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/\.\//, "/");
            }
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
        } catch (err) {
            this._logger.error("Input failure", err);
            return 1;
        }

        uniteConfiguration.clientPackages[packageName] = clientPackage;

        try {
            await engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, clientPackage.version, false);
        } catch (err) {
            this._logger.error("Adding Package failed", err);
            return 1;
        }

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async clientPackageRemove(packageName: string, outputDirectory: string, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.clientPackages[packageName]) {
            this._logger.error("Package has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        await engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, false);

        delete uniteConfiguration.clientPackages[packageName];

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async buildConfigurationAdd(configurationName: string,
                                        bundle: boolean | undefined,
                                        minify: boolean | undefined,
                                        sourcemaps: boolean | undefined,
                                        outputDirectory: string,
                                        uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new UniteBuildConfiguration();

        uniteConfiguration.buildConfigurations[configurationName].bundle = bundle === undefined ? false : bundle;
        uniteConfiguration.buildConfigurations[configurationName].minify = minify === undefined ? false : minify;
        uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps === undefined ? true : sourcemaps;
        uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async buildConfigurationRemove(configurationName: string,
                                           outputDirectory: string,
                                           uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.buildConfigurations[configurationName]) {
            this._logger.error("Build configuration has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        delete uniteConfiguration.buildConfigurations[configurationName];

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async platformAdd(platformName: string,
                              outputDirectory: string,
                              uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        uniteConfiguration.platforms[platformName] = uniteConfiguration.platforms[platformName] || {};

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("platform", platformName));
        pipelineSteps.push(new PipelineKey("content", "packageJson"));
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.warning("You should probably run npm install / yarn install before running any gulp packaging commands.");
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async platformRemove(platformName: string,
                                 outputDirectory: string,
                                 uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.platforms[platformName]) {
            this._logger.error("Platform has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        delete uniteConfiguration.platforms[platformName];

        const pipelineSteps: PipelineKey[] = [];
        pipelineSteps.push(new PipelineKey("platform", platformName));
        pipelineSteps.push(new PipelineKey("content", "packageJson"));
        pipelineSteps.push(new PipelineKey("scaffold", "uniteConfigurationJson"));

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
        if (ret === 0) {
            this._logger.warning("You should probably run npm install / yarn install to remove any unnecessary packages.");
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.force = false;
        engineVariables.engineRootFolder = this._engineRootFolder;
        engineVariables.engineAssetsFolder = this._engineAssetsFolder;
        engineVariables.enginePackageJson = this._enginePackageJson;
        engineVariables.setupDirectories(this._fileSystem, outputDirectory);
        engineVariables.initialisePackages(uniteConfiguration.clientPackages);

        engineVariables.packageManager = this.getPipelineStep(new PipelineKey("packageManager", uniteConfiguration.packageManager));
    }

    private async runPipeline(pipelineSteps: PipelineKey[], uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const pipeline: IEnginePipelineStep[] = [];

        for (const pipelineStep of pipelineSteps) {
            const exists = await this.tryLoadPipelineStep(uniteConfiguration, pipelineStep, undefined, false);

            if (exists) {
                pipeline.push(this.getPipelineStep(pipelineStep));
            } else {
                return 1;
            }
        }

        for (const pipelineStep of pipeline) {
            const ret = await pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        for (const pipelineStep of pipeline) {
            const ret = await pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    private getPipelineStep<T extends IEnginePipelineStep>(pipelineKey: PipelineKey): T {
        const className = this._moduleIdMap[`${pipelineKey.category}/${pipelineKey.key}`];
        if (className !== undefined && this._pipelineStepCache[className] !== undefined) {
            return <T>this._pipelineStepCache[className];
        }

        return undefined;
    }

    private async tryLoadPipelineStep(uniteConfiguration: UniteConfiguration, pipelineKey: PipelineKey, configurationType?: string, defineProperty: boolean = true): Promise<boolean> {
        const moduleTypeId = `${pipelineKey.category}/${pipelineKey.key}`;
        let className = this._moduleIdMap[moduleTypeId];

        if (className === undefined) {
            const modulePath = this._fileSystem.pathCombine(this._engineRootFolder, `dist/pipelineSteps`);
            const moduleTypeFolder = this._fileSystem.pathCombine(modulePath, pipelineKey.category);
            const actualType = configurationType ? configurationType : pipelineKey.category;

            try {
                let files = await this._fileSystem.directoryGetFiles(moduleTypeFolder);
                files = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));

                if (pipelineKey.key !== undefined && module !== null && pipelineKey.key.length > 0) {
                    const moduleIdLower = pipelineKey.key.toLowerCase();
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

                            const moduleClassName = `${pipelineKey.category}/${className}`;
                            this._pipelineStepCache[moduleClassName] = new instance.constructor();
                            this._moduleIdMap[moduleTypeId] = moduleClassName;
                            return true;
                        }
                    }
                    this._logger.error(`Module ${pipelineKey.key} for arg ${actualType} could not be located, possible options could be [${files.join(", ")}]`);
                    return false;
                } else {
                    this._logger.error(`${actualType} should not be blank, possible options could be [${files.join(", ")}]`);
                    return false;
                }
            } catch (err) {
                this._logger.error(`Module ${pipelineKey.key} for arg ${actualType} failed to load`, err);
                return false;
            }
        } else {
            return true;
        }
    }

    private mapParser(input: string): { [id: string]: string } {
        let parsedMap: { [id: string]: string };

        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};
            const splitAdditions = input.split(";");

            splitAdditions.forEach(splitAddition => {
                const parts = splitAddition.split("=");
                if (parts.length === 2) {
                    parsedMap[parts[0]] = parts[1];
                } else {
                    throw new Error(`The input is not formed correctly '${input}'`);
                }
            });
        }

        return parsedMap;
    }
}
