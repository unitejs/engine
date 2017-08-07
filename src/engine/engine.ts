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
import { UniteApplicationFramework } from "../configuration/models/unite/uniteApplicationFramework";
import { UniteBuildConfiguration } from "../configuration/models/unite/uniteBuildConfiguration";
import { UniteBundler } from "../configuration/models/unite/uniteBundler";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteCssPostProcessor } from "../configuration/models/unite/uniteCssPostProcessor";
import { UniteCssPreProcessor } from "../configuration/models/unite/uniteCssPreProcessor";
import { UniteE2eTestFramework } from "../configuration/models/unite/uniteE2eTestFramework";
import { UniteE2eTestRunner } from "../configuration/models/unite/uniteE2eTestRunner";
import { UniteLinter } from "../configuration/models/unite/uniteLinter";
import { UniteModuleType } from "../configuration/models/unite/uniteModuleType";
import { UnitePackageManager } from "../configuration/models/unite/unitePackageManager";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { UniteUnitTestFramework } from "../configuration/models/unite/uniteUnitTestFramework";
import { UniteUnitTestRunner } from "../configuration/models/unite/uniteUnitTestRunner";
import { BuildConfigurationOperation } from "../interfaces/buildConfigurationOperation";
import { IEngine } from "../interfaces/IEngine";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { NpmPackageManager } from "../packageManagers/npmPackageManager";
import { YarnPackageManager } from "../packageManagers/yarnPackageManager";
import { Aurelia } from "../pipelineSteps/applicationFramework/aurelia";
import { PlainApp } from "../pipelineSteps/applicationFramework/plainApp";
import { React } from "../pipelineSteps/applicationFramework/react";
import { Browserify } from "../pipelineSteps/bundler/browserify";
import { RequireJs } from "../pipelineSteps/bundler/requireJs";
import { SystemJsBuilder } from "../pipelineSteps/bundler/systemJsBuilder";
import { Webpack } from "../pipelineSteps/bundler/webpack";
import { AssetsSource } from "../pipelineSteps/content/assetsSource";
import { GitIgnore } from "../pipelineSteps/content/gitIgnore";
import { HtmlTemplate } from "../pipelineSteps/content/htmlTemplate";
import { License } from "../pipelineSteps/content/license";
import { PackageJson } from "../pipelineSteps/content/packageJson";
import { ReadMe } from "../pipelineSteps/content/readMe";
import { PostCss } from "../pipelineSteps/cssPostProcessor/postCss";
import { PostCssNone } from "../pipelineSteps/cssPostProcessor/postCssNone";
import { Css } from "../pipelineSteps/cssPreProcessor/css";
import { Less } from "../pipelineSteps/cssPreProcessor/less";
import { Sass } from "../pipelineSteps/cssPreProcessor/sass";
import { Stylus } from "../pipelineSteps/cssPreProcessor/stylus";
import { Protractor } from "../pipelineSteps/e2eTestRunner/protractor";
import { WebdriverIo } from "../pipelineSteps/e2eTestRunner/webdriverIo";
import { Babel } from "../pipelineSteps/language/babel";
import { TypeScript } from "../pipelineSteps/language/typeScript";
import { EsLint } from "../pipelineSteps/lint/esLint";
import { TsLint } from "../pipelineSteps/lint/tsLint";
import { Amd } from "../pipelineSteps/moduleType/amd";
import { CommonJs } from "../pipelineSteps/moduleType/commonJs";
import { SystemJs } from "../pipelineSteps/moduleType/systemJs";
import { AppScaffold } from "../pipelineSteps/scaffold/appScaffold";
import { E2eTestScaffold } from "../pipelineSteps/scaffold/e2eTestScaffold";
import { OutputDirectory } from "../pipelineSteps/scaffold/outputDirectory";
import { UniteConfigurationDirectories } from "../pipelineSteps/scaffold/uniteConfigurationDirectories";
import { UniteConfigurationJson } from "../pipelineSteps/scaffold/uniteConfigurationJson";
import { UniteThemeConfigurationJson } from "../pipelineSteps/scaffold/uniteThemeConfigurationJson";
import { UnitTestScaffold } from "../pipelineSteps/scaffold/unitTestScaffold";
import { BrowserSync } from "../pipelineSteps/server/browserSync";
import { Gulp } from "../pipelineSteps/taskManager/gulp";
import { Jasmine } from "../pipelineSteps/testFramework/jasmine";
import { MochaChai } from "../pipelineSteps/testFramework/mochaChai";
import { Karma } from "../pipelineSteps/unitTestRunner/karma";
import { EngineVariables } from "./engineVariables";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _coreRoot: string;
    private _assetsFolder: string;

    constructor(logger: ILogger, fileSystem: IFileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._coreRoot = fileSystem.pathCombine(__dirname, "../../");
        this._assetsFolder = fileSystem.pathCombine(this._coreRoot, "/assets/");
    }

    public async configure(packageName: string | undefined | null,
                           title: string | undefined | null,
                           license: string | undefined | null,
                           sourceLanguage: UniteSourceLanguage | undefined | null,
                           moduleType: UniteModuleType | undefined | null,
                           bundler: UniteBundler | undefined | null,
                           unitTestRunner: UniteUnitTestRunner | undefined | null,
                           unitTestFramework: UniteUnitTestFramework | undefined | null,
                           e2eTestRunner: UniteE2eTestRunner | undefined | null,
                           e2eTestFramework: UniteE2eTestFramework | undefined | null,
                           linter: UniteLinter | undefined | null,
                           cssPre: UniteCssPreProcessor | undefined | null,
                           cssPost: UniteCssPostProcessor | undefined | null,
                           packageManager: UnitePackageManager | undefined | null,
                           applicationFramework: UniteApplicationFramework | undefined | null,
                           outputDirectory: string | undefined | null): Promise<number> {
        outputDirectory = this.cleanupOutputDirectory(outputDirectory);
        let uniteConfiguration = await this.loadConfiguration(outputDirectory);
        if (!uniteConfiguration) {
            uniteConfiguration = new UniteConfiguration();
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

        if (!ParameterValidation.checkPackageName(this._logger, "packageName", uniteConfiguration.packageName)) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "title", uniteConfiguration.title)) {
            return 1;
        }

        let spdxLicense: ISpdxLicense;
        try {
            const licenseData = await this._fileSystem.fileReadJson<ISpdx>(this._assetsFolder, "spdx-full.json");
            if (!ParameterValidation.contains(this._logger,
                                              "license",
                                              Object.keys(licenseData),
                                              uniteConfiguration.license,
                                              "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                return 1;
            } else {
                spdxLicense = licenseData[uniteConfiguration.license];
            }
        } catch (e) {
            this._logger.error("There was a problem reading the spdx-full.json file", e);
            return 1;
        }

        if (!ParameterValidation.checkOneOf<UniteSourceLanguage>(this._logger, "sourceLanguage", uniteConfiguration.sourceLanguage, ["JavaScript", "TypeScript"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteModuleType>(this._logger, "moduleType", uniteConfiguration.moduleType, ["AMD", "CommonJS", "SystemJS"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteBundler>(this._logger, "bundler", uniteConfiguration.bundler, ["Browserify", "RequireJS", "SystemJSBuilder", "Webpack"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteUnitTestRunner>(this._logger, "unitTestRunner", uniteConfiguration.unitTestRunner, ["None", "Karma"])) {
            return 1;
        }
        if (unitTestRunner !== "None") {
            if (!ParameterValidation.checkOneOf<UniteUnitTestFramework>(this._logger, "unitTestFramework", uniteConfiguration.unitTestFramework, ["Mocha-Chai", "Jasmine"])) {
                return 1;
            }
        }
        if (!ParameterValidation.checkOneOf<UniteE2eTestRunner>(this._logger, "e2eTestRunner", uniteConfiguration.e2eTestRunner, ["None", "WebdriverIO", "Protractor"])) {
            return 1;
        }
        if (e2eTestRunner !== "None") {
            if (!ParameterValidation.checkOneOf<UniteE2eTestFramework>(this._logger, "e2eTestFramework", uniteConfiguration.e2eTestFramework, ["Mocha-Chai", "Jasmine"])) {
                return 1;
            }
        }
        if (!ParameterValidation.checkOneOf<UniteLinter>(this._logger, "linter", uniteConfiguration.linter, ["None", "ESLint", "TSLint"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteCssPreProcessor>(this._logger, "cssPre", uniteConfiguration.cssPre, ["Css", "Less", "Sass", "Stylus"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteCssPostProcessor>(this._logger, "cssPost", uniteConfiguration.cssPost, ["None", "PostCss"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UnitePackageManager>(this._logger, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UniteApplicationFramework>(this._logger, "applicationFramework", uniteConfiguration.applicationFramework, ["PlainApp", "Aurelia", "React"])) {
            return 1;
        }

        this._logger.info("");

        return this.configureRun(outputDirectory, uniteConfiguration, spdxLicense);
    }

    public async clientPackage(operation: ModuleOperation | undefined | null,
                               packageName: string | undefined | null,
                               version: string | undefined | null,
                               preload: boolean,
                               includeMode: IncludeMode | undefined | null,
                               main: string | undefined | null,
                               mainMinified: string | undefined | null,
                               isPackage: boolean,
                               wrapAssets: string | undefined | null,
                               packageManager: UnitePackageManager | undefined | null,
                               outputDirectory: string | undefined | null): Promise<number> {
        outputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(outputDirectory);

        if (includeMode === undefined || includeMode === null || includeMode.length === 0) {
            includeMode = "both";
        }

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.packageManager = packageManager || uniteConfiguration.packageManager || "Npm";
        }

        if (!ParameterValidation.checkOneOf<ModuleOperation>(this._logger, "operation", operation, ["add", "remove"])) {
            return 1;
        }
        if (!ParameterValidation.notEmpty(this._logger, "packageName", packageName)) {
            return 1;
        }
        if (!ParameterValidation.checkOneOf<UnitePackageManager>(this._logger, "packageManager", uniteConfiguration.packageManager, ["Npm", "Yarn"])) {
            return 1;
        }

        this._logger.info("");

        if (operation === "add") {
            return await this.clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, outputDirectory, uniteConfiguration);
        } else if (operation === "remove") {
            return await this.clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
        }

        return 0;
    }

    public async buildConfiguration(operation: BuildConfigurationOperation | undefined | null,
                                    configurationName: string | undefined | null,
                                    bundle: boolean,
                                    minify: boolean,
                                    sourcemaps: boolean,
                                    outputDirectory: string | undefined | null): Promise<number> {
        outputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(outputDirectory);

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
            return await this.buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration);
        } else if (operation === "remove") {
            return await this.buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration);
        }

        return 0;
    }

    private cleanupOutputDirectory(outputDirectory: string | null | undefined): string {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            outputDirectory = "./";
        } else {
            outputDirectory = this._fileSystem.pathFormat(outputDirectory);
        }

        return outputDirectory;
    }

    private async loadConfiguration(outputDirectory: string): Promise<UniteConfiguration | undefined> {
        let uniteConfiguration: UniteConfiguration | undefined;

        // check if there is a unite.json we can load for default options
        try {
            const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");
            if (exists) {
                uniteConfiguration = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");
            }
        } catch (e) {
            this._logger.error("Reading existing unite.json", e);
        }

        return uniteConfiguration;
    }

    private async configureRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, license: ISpdxLicense): Promise<number> {
        const engineVariables = new EngineVariables();
        let ret = await this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        if (ret === 0) {
            engineVariables.license = license;

            const pipelineSteps: IEnginePipelineStep[] = [];
            pipelineSteps.push(new OutputDirectory());
            pipelineSteps.push(new AppScaffold());
            pipelineSteps.push(new UnitTestScaffold());
            pipelineSteps.push(new E2eTestScaffold());

            pipelineSteps.push(new Gulp());

            pipelineSteps.push(new Amd());
            pipelineSteps.push(new CommonJs());
            pipelineSteps.push(new SystemJs());

            pipelineSteps.push(new Browserify());
            pipelineSteps.push(new RequireJs());
            pipelineSteps.push(new SystemJsBuilder());
            pipelineSteps.push(new Webpack());

            pipelineSteps.push(new HtmlTemplate());

            pipelineSteps.push(new Css());
            pipelineSteps.push(new Less());
            pipelineSteps.push(new Sass());
            pipelineSteps.push(new Stylus());

            pipelineSteps.push(new PostCss());
            pipelineSteps.push(new PostCssNone());

            pipelineSteps.push(new MochaChai());
            pipelineSteps.push(new Jasmine());

            pipelineSteps.push(new PlainApp());
            pipelineSteps.push(new Aurelia());
            pipelineSteps.push(new React());

            pipelineSteps.push(new Babel());
            pipelineSteps.push(new TypeScript());

            pipelineSteps.push(new WebdriverIo());
            pipelineSteps.push(new Protractor());

            pipelineSteps.push(new EsLint());
            pipelineSteps.push(new TsLint());
            pipelineSteps.push(new Karma());

            pipelineSteps.push(new BrowserSync());

            pipelineSteps.push(new ReadMe());
            pipelineSteps.push(new GitIgnore());
            pipelineSteps.push(new License());

            pipelineSteps.push(new AssetsSource());
            pipelineSteps.push(new PackageJson());
            pipelineSteps.push(new UniteConfigurationDirectories());
            pipelineSteps.push(new UniteThemeConfigurationJson());
            pipelineSteps.push(new UniteConfigurationJson());

            ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

            if (ret === 0) {
                this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
                this._logger.banner("Successfully Completed.");
            }
        }

        return ret;
    }

    private async clientPackageAdd(packageName: string,
                                   version: string,
                                   preload: boolean,
                                   includeMode: IncludeMode,
                                   main: string | undefined | null,
                                   mainMinified: string | undefined | null,
                                   isPackage: boolean,
                                   wrapAssets: string | undefined | null,
                                   outputDirectory: string,
                                   uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!ParameterValidation.checkOneOf<IncludeMode>(this._logger, "includeMode", includeMode, ["app", "test", "both"])) {
            return 1;
        }

        if (uniteConfiguration.clientPackages[packageName]) {
            this._logger.error("Package has already been added.");
            return 1;
        }

        const engineVariables = new EngineVariables();
        let ret = await this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        if (ret === 0) {
            const packageInfo = await engineVariables.packageManager.info(packageName);

            let fixPackageVersion = false;
            if (version === null || version === undefined || version.length === 0) {
                version = packageInfo.version;
            } else {
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

            const clientPackage = new UniteClientPackage();
            clientPackage.version = fixPackageVersion ? version : `^${version}`;
            clientPackage.preload = preload;
            clientPackage.main = finalMain;
            clientPackage.mainMinified = finalMainMinified;
            clientPackage.isPackage = isPackage;
            clientPackage.includeMode = includeMode;
            clientPackage.wrapAssets = wrapAssets;

            uniteConfiguration.clientPackages[packageName] = clientPackage;

            await engineVariables.packageManager.add(outputDirectory, packageName, version, false);

            const pipelineSteps: IEnginePipelineStep[] = [];
            pipelineSteps.push(new Amd());
            pipelineSteps.push(new CommonJs());
            pipelineSteps.push(new SystemJs());

            pipelineSteps.push(new Browserify());
            pipelineSteps.push(new RequireJs());
            pipelineSteps.push(new SystemJsBuilder());
            pipelineSteps.push(new Webpack());

            pipelineSteps.push(new HtmlTemplate());

            pipelineSteps.push(new Karma());
            pipelineSteps.push(new UniteConfigurationJson());

            ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
        }

        return ret;
    }

    private async clientPackageRemove(packageName: string, outputDirectory: string, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.clientPackages[packageName]) {
            this._logger.error("Package has not been added.");
            return 1;
        }

        delete uniteConfiguration.clientPackages[packageName];

        const engineVariables = new EngineVariables();
        let ret = await this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        if (ret === 0) {
            await engineVariables.packageManager.remove(outputDirectory, packageName, false);

            const pipelineSteps: IEnginePipelineStep[] = [];
            pipelineSteps.push(new Amd());
            pipelineSteps.push(new CommonJs());
            pipelineSteps.push(new SystemJs());

            pipelineSteps.push(new Browserify());
            pipelineSteps.push(new RequireJs());
            pipelineSteps.push(new SystemJsBuilder());
            pipelineSteps.push(new Webpack());

            pipelineSteps.push(new HtmlTemplate());

            pipelineSteps.push(new Karma());
            pipelineSteps.push(new UniteConfigurationJson());

            ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
        }

        return ret;
    }

    private async buildConfigurationAdd(configurationName: string,
                                        bundle: boolean,
                                        minify: boolean,
                                        sourcemaps: boolean,
                                        outputDirectory: string,
                                        uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        let ret = await this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        if (ret === 0) {
            uniteConfiguration.buildConfigurations[configurationName] = uniteConfiguration.buildConfigurations[configurationName] || new UniteBuildConfiguration();

            uniteConfiguration.buildConfigurations[configurationName].bundle = bundle;
            uniteConfiguration.buildConfigurations[configurationName].minify = minify;
            uniteConfiguration.buildConfigurations[configurationName].sourcemaps = sourcemaps;
            uniteConfiguration.buildConfigurations[configurationName].variables = uniteConfiguration.buildConfigurations[configurationName].variables || {};

            const pipelineSteps: IEnginePipelineStep[] = [];
            pipelineSteps.push(new UniteConfigurationJson());
            ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
        }

        return ret;
    }

    private async buildConfigurationRemove(configurationName: string,
                                           outputDirectory: string,
                                           uniteConfiguration: UniteConfiguration): Promise<number> {
        const engineVariables = new EngineVariables();
        let ret = await this.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        if (ret === 0) {
            if (uniteConfiguration.buildConfigurations[configurationName]) {
                delete uniteConfiguration.buildConfigurations[configurationName];
            }

            const pipelineSteps: IEnginePipelineStep[] = [];
            pipelineSteps.push(new UniteConfigurationJson());
            ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
        }

        return ret;
    }

    private async createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            this._logger.info("Loading dependencies", { core: this._coreRoot, dependenciesFile: "package.json" });

            engineVariables.corePackageJson = await this._fileSystem.fileReadJson<PackageConfiguration>(this._coreRoot, "package.json");
            uniteConfiguration.uniteVersion = engineVariables.corePackageJson.version;
        } catch (err) {
            this._logger.error("Loading dependencies failed", err, { core: this._coreRoot, dependenciesFile: "package.json" });
            return 1;
        }

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
            engineVariables.packageManager = new NpmPackageManager(this._logger, this._fileSystem);
        } else if (uniteConfiguration.packageManager === "Yarn") {
            engineVariables.packageManager = new YarnPackageManager(this._logger, this._fileSystem);
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

        return 0;
    }

    private async runPipeline(pipelineSteps: IEnginePipelineStep[], uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        for (const pipelineStep of pipelineSteps) {
            const ret = await pipelineStep.prerequisites(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        for (const pipelineStep of pipelineSteps) {
            const ret = await pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }
}
