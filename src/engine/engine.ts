/**
 * Main engine
 */
import { ISpdx } from "../configuration/models/spdx/ISpdx";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteLinter } from "../configuration/models/unite/uniteLinter";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UnitePackageManager } from "../configuration/models/unite/unitePackageManager";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { UniteUnitTestFramework } from "../configuration/models/unite/uniteUnitTestFramework";
import { UniteUnitTestRunner } from "../configuration/models/unite/uniteUnitTestRunner";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { NpmPackageManager } from "../packageManagers/npmPackageManager";
import { YarnPackageManager } from "../packageManagers/yarnPackageManager";
import { AppScaffold } from "../pipelineSteps/appScaffold";
import { GitIgnore } from "../pipelineSteps/content/gitIgnore";
import { License } from "../pipelineSteps/content/license";
import { ReadMe } from "../pipelineSteps/content/readMe";
import { E2eTestScaffold } from "../pipelineSteps/e2eTest/e2eTestScaffold";
import { GulpScaffold } from "../pipelineSteps/gulp/gulpScaffold";
import { GulpTasksBuild } from "../pipelineSteps/gulp/gulpTasksBuild";
import { GulpTasksServe } from "../pipelineSteps/gulp/gulpTasksServe";
import { GulpTasksUnit } from "../pipelineSteps/gulp/gulpTasksUnit";
import { GulpTasksUtil } from "../pipelineSteps/gulp/gulpTasksUtil";
import { HtmlTemplate } from "../pipelineSteps/htmlTemplate";
import { Babel } from "../pipelineSteps/language/babel";
import { TypeScript } from "../pipelineSteps/language/typeScript";
import { EsLint } from "../pipelineSteps/lint/esLint";
import { TsLint } from "../pipelineSteps/lint/tsLint";
import { ModuleLoader } from "../pipelineSteps/moduleLoader";
import { ModulesConfig } from "../pipelineSteps/modulesConfig";
import { OutputDirectory } from "../pipelineSteps/outputDirectory";
import { PackageJson } from "../pipelineSteps/packageJson";
import { UniteConfigurationDirectories } from "../pipelineSteps/uniteConfigurationDirectories";
import { UniteConfigurationJson } from "../pipelineSteps/uniteConfigurationJson";
import { Jasmine } from "../pipelineSteps/unitTest/jasmine";
import { Karma } from "../pipelineSteps/unitTest/karma";
import { MochaChai } from "../pipelineSteps/unitTest/mochaChai";
import { UnitTestScaffold } from "../pipelineSteps/unitTest/unitTestScaffold";
import { EngineValidation } from "./engineValidation";
import { EngineVariables } from "./engineVariables";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;
    private _fileSystem: IFileSystem;
    private _coreRoot: string;
    private _assetsFolder: string;

    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
        this._coreRoot = fileSystem.pathCombine(__dirname, "../../");
        this._assetsFolder = fileSystem.pathCombine(this._coreRoot, "/assets/");
    }

    public async init(packageName: string | undefined | null,
                      title: string | undefined | null,
                      license: string | undefined | null,
                      sourceLanguage: UniteSourceLanguage | undefined | null,
                      moduleLoader: UniteModuleLoader | undefined | null,
                      unitTestRunner: UniteUnitTestRunner | undefined | null,
                      unitTestFramework: UniteUnitTestFramework | undefined | null,
                      linter: UniteLinter | undefined | null,
                      packageManager: UnitePackageManager | undefined | null,
                      outputDirectory: string | undefined | null): Promise<number> {
        outputDirectory = this.cleanupOutputDirectory(outputDirectory);
        let uniteConfiguration = await this.loadConfiguration(outputDirectory);
        if (!uniteConfiguration) {
            uniteConfiguration = new UniteConfiguration();
        }

        uniteConfiguration.packageName = packageName! || uniteConfiguration.packageName;
        uniteConfiguration.title = title! || uniteConfiguration.title;
        uniteConfiguration.license = license! || uniteConfiguration.license || "MIT";
        uniteConfiguration.sourceLanguage = sourceLanguage! || uniteConfiguration.sourceLanguage;
        uniteConfiguration.moduleLoader = moduleLoader! || uniteConfiguration.moduleLoader;
        uniteConfiguration.unitTestRunner = unitTestRunner! || uniteConfiguration.unitTestRunner;
        uniteConfiguration.unitTestFramework = unitTestFramework! || uniteConfiguration.unitTestFramework;
        uniteConfiguration.linter = linter! || uniteConfiguration.linter;
        uniteConfiguration.packageManager = packageManager! || uniteConfiguration.packageManager || "Npm";
        uniteConfiguration.staticClientModules = [];
        uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};

        if (!EngineValidation.checkPackageName(this._display, "packageName", uniteConfiguration.packageName)) {
            return 1;
        }
        if (!EngineValidation.notEmpty(this._display, "title", uniteConfiguration.title)) {
            return 1;
        }

        let spdxLicense: ISpdxLicense;
        try {
            const licenseData = await this._fileSystem.fileReadJson<ISpdx>(this._assetsFolder, "spdx-full.json");
            if (!EngineValidation.checkLicense(licenseData, this._display, "license", uniteConfiguration.license)) {
                return 1;
            } else {
                spdxLicense = licenseData[uniteConfiguration.license!];
            }
        } catch (e) {
            this._display.error("There was a problem reading the spdx-full.json file", e);
            return 1;
        }

        if (!EngineValidation.checkOneOf<UniteSourceLanguage>(this._display, "sourceLanguage", uniteConfiguration.sourceLanguage, [ "JavaScript", "TypeScript"])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteModuleLoader>(this._display, "moduleLoader", uniteConfiguration.moduleLoader, [ "Browserify", "RequireJS", "SystemJS", "Webpack" ])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteUnitTestRunner>(this._display, "unitTestRunner", uniteConfiguration.unitTestRunner, [ "None", "Karma" ])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteLinter>(this._display, "linter", uniteConfiguration.linter, [ "None", "ESLint", "TSLint" ])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UnitePackageManager>(this._display, "packageManager", uniteConfiguration.packageManager, [ "Npm", "Yarn" ])) {
            return 1;
        }
        if (unitTestRunner !== "None") {
            if (!EngineValidation.checkOneOf<UniteUnitTestFramework>(this._display, "unitTestFramework", uniteConfiguration.unitTestFramework, [ "Mocha-Chai", "Jasmine" ])) {
                return 1;
            }
        }

        this._display.log("");

        return this.initRun(outputDirectory!, uniteConfiguration, spdxLicense);
    }

    public async clientPackage(operation: ModuleOperation | undefined | null,
                               packageName: string | undefined | null,
                               version: string | undefined | null,
                               preload: boolean,
                               includeMode: IncludeMode| undefined | null,
                               packageManager: UnitePackageManager | undefined | null,
                               outputDirectory: string | undefined | null): Promise<number> {
        outputDirectory = this.cleanupOutputDirectory(outputDirectory);
        const uniteConfiguration = await this.loadConfiguration(outputDirectory!);

        if (includeMode === undefined || includeMode === null || includeMode.length === 0) {
            includeMode = "both";
        }

        if (!uniteConfiguration) {
            this._display.error("There is no unite.json to configure.");
            return 1;
        } else {
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.packageManager = packageManager! || uniteConfiguration.packageManager || "Npm";
        }

        if (!EngineValidation.checkOneOf<ModuleOperation>(this._display, "operation", operation, [ "add", "remove" ])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<IncludeMode>(this._display, "includeMode", includeMode, [ "app", "test", "both" ])) {
            return 1;
        }
        if (!EngineValidation.notEmpty(this._display, "packageName", packageName)) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UnitePackageManager>(this._display, "packageManager", uniteConfiguration.packageManager, [ "Npm", "Yarn" ])) {
            return 1;
        }

        this._display.log("");

        if (operation === "add") {
            return await this.clientPackageAdd(packageName!, version!, preload, includeMode, outputDirectory, uniteConfiguration);
        } else if (operation === "remove") {
            return await this.clientPackageRemove(packageName!, outputDirectory, uniteConfiguration);
        }

        return 0;
    }

    private cleanupOutputDirectory(outputDirectory: string | null | undefined): string {
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            /* no output directory specified so use current */
            outputDirectory = "./";
        } else {
            outputDirectory = this._fileSystem.pathFormat(outputDirectory!);
        }
        return outputDirectory;
    }

    private async loadConfiguration(outputDirectory: string): Promise<UniteConfiguration | undefined> {
        let uniteConfiguration: UniteConfiguration | undefined;

        /* check if there is a unite.json we can load for default options */
        try {
            const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");
            if (exists) {
                uniteConfiguration = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");
            }
        } catch (e) {
            /* we can ignore any failures here */
        }

        return uniteConfiguration;
    }

    private async initRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, license: ISpdxLicense): Promise<number> {
        this._logger.info("Engine::init", { outputDirectory, uniteConfiguration });

        const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);
        engineVariables.license = license;

        const pipelineSteps: IEnginePipelineStep[] = [];
        pipelineSteps.push(new OutputDirectory());
        pipelineSteps.push(new AppScaffold());
        pipelineSteps.push(new E2eTestScaffold());
        pipelineSteps.push(new GulpScaffold());
        pipelineSteps.push(new GulpTasksBuild());
        pipelineSteps.push(new GulpTasksUtil());
        pipelineSteps.push(new GulpTasksServe());

        pipelineSteps.push(new UnitTestScaffold());
        pipelineSteps.push(new GulpTasksUnit());

        pipelineSteps.push(new ModuleLoader());
        pipelineSteps.push(new HtmlTemplate());

        pipelineSteps.push(new Babel());
        pipelineSteps.push(new TypeScript());

        pipelineSteps.push(new EsLint());
        pipelineSteps.push(new TsLint());

        pipelineSteps.push(new MochaChai());
        pipelineSteps.push(new Jasmine());
        pipelineSteps.push(new Karma());

        pipelineSteps.push(new ReadMe());
        pipelineSteps.push(new GitIgnore());
        pipelineSteps.push(new License());

        pipelineSteps.push(new ModulesConfig());
        pipelineSteps.push(new PackageJson());
        pipelineSteps.push(new UniteConfigurationDirectories());
        pipelineSteps.push(new UniteConfigurationJson());

        const ret = await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);

        if (ret === 0) {
            this._display.banner("You should probably run npm install / yarn install before running any gulp commands.");
        }

        return ret;
    }

    private async clientPackageAdd(packageName: string, version: string, preload: boolean, includeMode: IncludeMode, outputDirectory: string, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (uniteConfiguration.clientPackages[packageName]) {
            this._display.error("Package has already been added.");
            return 1;
        }

        const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);

        const packageInfo = await engineVariables.packageManager.info(packageName);

        let fixPackageVersion = false;
        if (version === null || version === undefined || version.length === 0) {
            version = packageInfo.version;
        } else {
            fixPackageVersion = true;
        }

        uniteConfiguration.clientPackages[packageName] = {
            version: fixPackageVersion ? version : "^" + version,
            preload,
            main: packageInfo.main,
            includeMode
        };

        await engineVariables.packageManager.add(outputDirectory, packageName, version, false);

        const pipelineSteps: IEnginePipelineStep[] = [];
        pipelineSteps.push(new ModuleLoader());
        pipelineSteps.push(new HtmlTemplate());
        pipelineSteps.push(new Karma());
        pipelineSteps.push(new ModulesConfig());
        pipelineSteps.push(new UniteConfigurationJson());

        return await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
    }

    private async clientPackageRemove(packageName: string, outputDirectory: string, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!uniteConfiguration.clientPackages[packageName]) {
            this._display.error("Package has not been added.");
            return 1;
        }

        delete uniteConfiguration.clientPackages[packageName];

        const engineVariables = this.createEngineVariables(outputDirectory, uniteConfiguration);

        await engineVariables.packageManager.remove(outputDirectory, packageName, false);

        const pipelineSteps: IEnginePipelineStep[] = [];
        pipelineSteps.push(new ModuleLoader());
        pipelineSteps.push(new HtmlTemplate());
        pipelineSteps.push(new Karma());
        pipelineSteps.push(new ModulesConfig());
        pipelineSteps.push(new UniteConfigurationJson());

        return await this.runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
    }

    private createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration): EngineVariables {
        const engineVariables: EngineVariables = new EngineVariables();
        engineVariables.coreFolder = this._coreRoot;
        engineVariables.rootFolder = outputDirectory;
        engineVariables.sourceFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\src");
        engineVariables.distFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\dist");
        engineVariables.gulpBuildFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\build");
        engineVariables.reportsFolder = this._fileSystem.pathCombine(engineVariables.rootFolder, "\\reports");
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
            engineVariables.packageManager = new NpmPackageManager(this._logger, this._display, this._fileSystem);
        } else if (uniteConfiguration.packageManager === "Yarn") {
            engineVariables.packageManager = new YarnPackageManager(this._logger, this._display, this._fileSystem);
        }

        engineVariables.html = {
            head: [],
            body: []
        };

        return engineVariables;
    }

    private async runPipeline(pipelineSteps: IEnginePipelineStep[], uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        for (const pipelineStep of pipelineSteps) {
            const ret = await pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }
}