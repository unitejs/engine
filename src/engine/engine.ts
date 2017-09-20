/**
 * Main engine
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
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
import { IPackageManager } from "../interfaces/IPackageManager";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { PlatformOperation } from "../interfaces/platformOperation";
import { EngineVariables } from "./engineVariables";
import { Pipeline } from "./pipeline";
import { PipelineKey } from "./pipelineKey";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _engineRootFolder: string;
    private _engineAssetsFolder: string;
    private _profilesFolder: string;
    private _pipelineStepFolder: string;
    private _enginePackageJson: PackageConfiguration;

    private _pipeline: Pipeline;

    public async initialise(logger: ILogger, fileSystem: IFileSystem): Promise<number> {
        try {
            this._logger = logger;
            this._fileSystem = fileSystem;
            this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");
            this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");
            this._profilesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, "/profiles/");

            this._enginePackageJson = await this._fileSystem.fileReadJson<PackageConfiguration>(this._engineRootFolder, "package.json");

            this._pipelineStepFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/pipelineSteps");

            this._pipeline = new Pipeline(this._logger, this._fileSystem, this._pipelineStepFolder);

            return 0;
        } catch (err) {
            this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
            return 1;
        }
    }

    public version(): string {
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
                           profile: string | undefined | null,
                           force: boolean | undefined,
                           outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const newForce = force === undefined || force === null ? false : force;

        let uniteConfiguration = await this.loadConfiguration(newOutputDirectory, "configure", profile, !!force);
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
        uniteConfiguration.sourceExtensions = [];
        uniteConfiguration.viewExtensions = [];

        if (Object.keys(uniteConfiguration.buildConfigurations).length === 0) {
            uniteConfiguration.buildConfigurations.dev = { bundle: false, minify: false, sourcemaps: true, variables: {} };
            uniteConfiguration.buildConfigurations.prod = { bundle: true, minify: true, sourcemaps: false, variables: {} };
        }

        uniteConfiguration.platforms = uniteConfiguration.platforms || { Web: {} };

        if (profile) {
            this._logger.info("profile", { profile });
        }

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

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("language", uniteConfiguration.sourceLanguage), "sourceLanguage")) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("moduleType", uniteConfiguration.moduleType))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("bundler", uniteConfiguration.bundler))) {
            return 1;
        }
        if (uniteConfiguration.unitTestRunner === "None") {
            if (unitTestFramework !== null && unitTestFramework !== undefined) {
                this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                return 1;
            }
            if (unitTestEngine !== null && unitTestEngine !== undefined) {
                this._logger.error("unitTestEngine is not valid if unitTestRunner is None");
                return 1;
            }
        } else {
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("unitTestRunner", uniteConfiguration.unitTestRunner))) {
                return 1;
            }
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("testFramework", uniteConfiguration.unitTestFramework), "unitTestFramework")) {
                return 1;
            }
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("unitTestEngine", uniteConfiguration.unitTestEngine))) {
                return 1;
            }
        }
        if (uniteConfiguration.e2eTestRunner === "None") {
            if (e2eTestFramework !== null && e2eTestFramework !== undefined) {
                this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                return 1;
            }
        } else {
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("e2eTestRunner", uniteConfiguration.e2eTestRunner))) {
                return 1;
            }
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("testFramework", uniteConfiguration.e2eTestFramework), "e2eTestFramework")) {
                return 1;
            }
        }
        if (uniteConfiguration.linter !== "None") {
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("linter", uniteConfiguration.linter))) {
                return 1;
            }
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("cssPre", uniteConfiguration.cssPre))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("cssPost", uniteConfiguration.cssPost))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("applicationFramework", uniteConfiguration.applicationFramework))) {
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
                               profile: string | undefined | null,
                               packageManager: string | undefined | null,
                               outputDirectory: string | undefined | null): Promise<number> {
        const newOutputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, undefined, undefined, false);

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

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }

        if (operation === "add") {
            return await this.clientPackageAdd(packageName, version, preload, includeMode, scriptIncludeMode,
                                               main, mainMinified, testingAdditions, isPackage, assets, map, loaders, noScript, profile,
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
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, undefined, undefined, false);

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
        const uniteConfiguration = await this.loadConfiguration(newOutputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.platforms = uniteConfiguration.platforms || {};
        }

        if (!ParameterValidation.checkOneOf<PlatformOperation>(this._logger, "operation", operation, ["add", "remove"])) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("platform", platformName), "platformName")) {
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
        let outputDir;
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            outputDir = this._fileSystem.pathAbsolute("./");
        } else {
            outputDir = this._fileSystem.pathAbsolute(outputDirectory);
        }

        // check to see if this folder is called www, if it is then we should traverse up one folder
        // to where the unite.json is
        const dirName = this._fileSystem.pathGetFilename(outputDir);
        if (dirName === "www") {
            outputDir = this._fileSystem.pathCombine(outputDir, "../");
        }

        return outputDir;
    }

    private async loadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null> {
        let uniteConfiguration: UniteConfiguration | undefined | null = await this.loadProfile<UniteConfiguration>(profileSource, profile);

        if (!force && uniteConfiguration !== null) {
            // check if there is a unite.json we can load for default options
            try {
                const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");

                if (exists) {
                    const existing = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");

                    uniteConfiguration = ObjectHelper.merge(uniteConfiguration, existing);
                }
            } catch (e) {
                this._logger.error("Reading existing unite.json", e);
                uniteConfiguration = null;
            }
        }

        return uniteConfiguration;
    }

    private async loadProfile<T>(profileSource: string, profile: string | undefined | null): Promise<T | undefined | null> {
        if (profileSource !== undefined && profileSource !== null && profile !== undefined && profile !== null) {
            const configFile = `${profileSource}.json`;
            try {

                const exists = await this._fileSystem.fileExists(this._profilesFolder, configFile);
                if (exists) {
                    const profiles = await this._fileSystem.fileReadJson<{ [id: string]: T }>(this._profilesFolder, configFile);

                    const profileLower = profile.toLowerCase();
                    const keys = Object.keys(profiles);
                    for (let i = 0; i < keys.length; i++) {
                        if (profileLower === keys[i].toLowerCase()) {
                            return profiles[keys[i]];
                        }
                    }
                    this._logger.error(`Profile does not exist '${profile}'`);
                    return null;
                }
            } catch (err) {
                this._logger.error(`Reading profile file '${configFile}' failed`, err);
                return null;
            }
        }

        return undefined;
    }

    private async configureRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, license: ISpdxLicense, force: boolean): Promise<number> {
        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        engineVariables.force = force;
        engineVariables.license = license;

        this.addPipelinePre();

        await this.addPipelineDynamic();

        this.addPipelinePost();

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

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
                                   scriptIncludeMode: ScriptIncludeMode | undefined | null,
                                   main: string | undefined | null,
                                   mainMinified: string | undefined | null,
                                   testingAdditions: string | undefined | null,
                                   isPackage: boolean | undefined,
                                   assets: string | undefined | null,
                                   map: string | undefined | null,
                                   loaders: string | undefined | null,
                                   noScript: boolean | undefined,
                                   profile: string | undefined | null,
                                   outputDirectory: string,
                                   uniteConfiguration: UniteConfiguration): Promise<number> {
        let clientPackage = await this.loadProfile<UniteClientPackage>("clientPackage", profile);
        if (clientPackage === undefined) {
            clientPackage = new UniteClientPackage();
        }

        clientPackage.name = packageName || clientPackage.name;
        clientPackage.version = version || clientPackage.version;
        clientPackage.preload = preload || clientPackage.preload;
        clientPackage.includeMode = includeMode || clientPackage.includeMode;
        clientPackage.scriptIncludeMode = scriptIncludeMode || clientPackage.scriptIncludeMode;
        clientPackage.main = main || clientPackage.main;
        clientPackage.mainMinified = mainMinified || clientPackage.mainMinified;
        clientPackage.isPackage = isPackage || clientPackage.isPackage;
        clientPackage.noScript = noScript || clientPackage.noScript;
        clientPackage.assets = assets || clientPackage.assets;

        try {
            clientPackage.testingAdditions = this.mapParser(testingAdditions) || clientPackage.testingAdditions;
            clientPackage.map = this.mapParser(map) || clientPackage.map;
            clientPackage.loaders = this.mapParser(loaders) || clientPackage.loaders;
        } catch (err) {
            this._logger.error("Input failure", err);
            return 1;
        }

        clientPackage.includeMode = clientPackage.includeMode === undefined ||
            clientPackage.includeMode === null ||
            clientPackage.includeMode.length === 0 ?
            "both" : clientPackage.includeMode;

        clientPackage.scriptIncludeMode = clientPackage.scriptIncludeMode === undefined ||
            clientPackage.scriptIncludeMode === null ||
            clientPackage.scriptIncludeMode.length === 0 ?
            "none" : clientPackage.scriptIncludeMode;

        clientPackage.preload = clientPackage.preload === undefined ? false : clientPackage.preload;
        clientPackage.isPackage = clientPackage.isPackage === undefined ? false : clientPackage.isPackage;

        if (!ParameterValidation.notEmpty(this._logger, "packageName", clientPackage.name)) {
            return 1;
        }

        if (profile) {
            this._logger.info("profile", { profile });
        }

        if (clientPackage.version) {
            this._logger.info("version", { version: clientPackage.version });
        }

        this._logger.info("preload", { preload: clientPackage.preload });

        if (!ParameterValidation.checkOneOf<IncludeMode>(this._logger, "includeMode", clientPackage.includeMode, ["app", "test", "both"])) {
            return 1;
        }

        if (!ParameterValidation.checkOneOf<ScriptIncludeMode>(this._logger, "scriptIncludeMode", clientPackage.scriptIncludeMode, ["none", "bundled", "notBundled", "both"])) {
            return 1;
        }

        if (clientPackage.main) {
            if (clientPackage.noScript) {
                this._logger.error("You cannot combine the main and noScript arguments");
                return 1;
            } else {
                this._logger.info("main", { main: clientPackage.main });
            }
        }

        if (clientPackage.mainMinified) {
            if (clientPackage.noScript) {
                this._logger.error("You cannot combine the mainMinified and noScript arguments");
                return 1;
            } else {
                this._logger.info("mainMinified", { mainMinified: clientPackage.mainMinified });
            }
        }

        if (clientPackage.testingAdditions) {
            this._logger.info("testingAdditions", { testingAdditions: clientPackage.testingAdditions });
        }
        this._logger.info("isPackage", { isPackage: clientPackage.isPackage  });
        if (clientPackage.assets) {
            this._logger.info("assets", { assets: clientPackage.assets });
        }
        if (clientPackage.map) {
            this._logger.info("map", { map: clientPackage.map });
        }
        if (clientPackage.loaders) {
            this._logger.info("loaders", { loaders: clientPackage .loaders });
        }
        if (clientPackage.noScript) {
            this._logger.info("noScript", { noScript: clientPackage.noScript });
        }

        this._logger.info("");

        if (uniteConfiguration.clientPackages[clientPackage.name]) {
            this._logger.error("Package has already been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);

        const missingVersion = clientPackage.version === null || clientPackage.version === undefined || clientPackage.version.length === 0;
        const missingMain = (clientPackage.main === null || clientPackage.main === undefined || clientPackage.main.length === 0) && !clientPackage.noScript;
        if (missingVersion || missingMain) {
            try {
                const packageInfo = await engineVariables.packageManager.info(this._logger, this._fileSystem, clientPackage.name, clientPackage.version);

                clientPackage.version = clientPackage.version || `^${packageInfo.version || "0.0.1"}`;
                if (!clientPackage.noScript) {
                    clientPackage.main = clientPackage.main || packageInfo.main;
                }
            } catch (err) {
                this._logger.error("Reading Package Information failed", err);
                return 1;
            }
        }

        if (!clientPackage.noScript) {
            if (clientPackage.main) {
                clientPackage.main = clientPackage.main.replace(/\\/g, "/");
                clientPackage.main = clientPackage.main.replace(/\.\//, "/");
            }
            if (clientPackage.mainMinified) {
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/\\/g, "/");
                clientPackage.mainMinified = clientPackage.mainMinified.replace(/\.\//, "/");
            }
        }

        uniteConfiguration.clientPackages[clientPackage.name] = clientPackage;

        try {
            await engineVariables.packageManager.add(this._logger, this._fileSystem, engineVariables.wwwRootFolder, clientPackage.name, clientPackage.version, false);
        } catch (err) {
            this._logger.error("Adding Package failed", err);
            return 1;
        }

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async clientPackageRemove(packageName: string, outputDirectory: string, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!ParameterValidation.notEmpty(this._logger, "packageName", packageName)) {
            return 1;
        }

        if (!uniteConfiguration.clientPackages[packageName]) {
            this._logger.error("Package has not been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        await engineVariables.packageManager.remove(this._logger, this._fileSystem, engineVariables.wwwRootFolder, packageName, false);

        delete uniteConfiguration.clientPackages[packageName];

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

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

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

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

        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

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

        this._pipeline.add("platform", platformName);
        this._pipeline.add("content", "packageJson");
        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

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

        this._pipeline.add("platform", platformName);
        this._pipeline.add("content", "packageJson");
        this._pipeline.add("unite", "uniteConfigurationJson");

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);
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

        engineVariables.packageManager = this._pipeline.getStep<IPackageManager>(new PipelineKey("packageManager", uniteConfiguration.packageManager));
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

    private addPipelinePre(): void {
        this._pipeline.add("scaffold", "outputDirectory");
        this._pipeline.add("scaffold", "appScaffold");
        this._pipeline.add("scaffold", "unitTestScaffold");
        this._pipeline.add("scaffold", "e2eTestScaffold");
    }

    private async addPipelineDynamic(): Promise<void> {
        const folders = await this._fileSystem.directoryGetFolders(this._pipelineStepFolder);

        for (let i = 0; i < folders.length; i++) {
            if (folders[i] !== "scaffold" && folders[i] !== "unite") {
                const fullFolder = this._fileSystem.pathCombine(this._pipelineStepFolder, folders[i]);
                const files = await this._fileSystem.directoryGetFiles(fullFolder);

                files.filter(file => file.endsWith(".js")).forEach(file => {
                    this._pipeline.add(folders[i], file.replace(".js", ""));
                });
            }
        }
    }

    private addPipelinePost(): void {
        this._pipeline.add("unite", "uniteConfigurationDirectories");
        this._pipeline.add("unite", "uniteThemeConfigurationJson");
        this._pipeline.add("unite", "uniteConfigurationJson");
    }
}
