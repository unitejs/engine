/**
 * Configure Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { ISpdx } from "../configuration/models/spdx/ISpdx";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineKey } from "../engine/pipelineKey";
import { IConfigureCommandParams } from "../interfaces/IConfigureCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";

export class ConfigureCommand extends EngineCommandBase implements IEngineCommand<IEngineCommandParams> {
    public async run(args: IConfigureCommandParams): Promise<number> {
        args.force = args.force === undefined || args.force === null ? false : args.force;

        let uniteConfiguration = await this.loadConfiguration(args.outputDirectory, "configure", args.profile, !!args.force);
        if (uniteConfiguration === undefined) {
            uniteConfiguration = new UniteConfiguration();
        } else if (uniteConfiguration === null) {
            return 1;
        }

        uniteConfiguration.packageName = args.packageName || uniteConfiguration.packageName;
        uniteConfiguration.title = args.title || uniteConfiguration.title;
        uniteConfiguration.license = args.license || uniteConfiguration.license;
        uniteConfiguration.sourceLanguage = args.sourceLanguage || uniteConfiguration.sourceLanguage;
        uniteConfiguration.moduleType = args.moduleType || uniteConfiguration.moduleType;
        uniteConfiguration.bundler = args.bundler || uniteConfiguration.bundler;
        uniteConfiguration.unitTestRunner = args.unitTestRunner || uniteConfiguration.unitTestRunner;
        uniteConfiguration.unitTestFramework = args.unitTestFramework || uniteConfiguration.unitTestFramework;
        uniteConfiguration.unitTestEngine = args.unitTestEngine || uniteConfiguration.unitTestEngine;
        uniteConfiguration.e2eTestRunner = args.e2eTestRunner || uniteConfiguration.e2eTestRunner;
        uniteConfiguration.e2eTestFramework = args.e2eTestFramework || uniteConfiguration.e2eTestFramework;
        uniteConfiguration.linter = args.linter || uniteConfiguration.linter;
        uniteConfiguration.packageManager = args.packageManager || uniteConfiguration.packageManager || "Npm";
        uniteConfiguration.taskManager = args.taskManager || uniteConfiguration.taskManager;
        uniteConfiguration.server = args.server || uniteConfiguration.server;
        uniteConfiguration.ides = args.ides || uniteConfiguration.ides || [];
        uniteConfiguration.applicationFramework = args.applicationFramework || uniteConfiguration.applicationFramework;
        uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
        uniteConfiguration.cssPre = args.cssPre || uniteConfiguration.cssPre;
        uniteConfiguration.cssPost = args.cssPost || uniteConfiguration.cssPost;
        uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
        uniteConfiguration.sourceExtensions = [];
        uniteConfiguration.viewExtensions = [];

        if (Object.keys(uniteConfiguration.buildConfigurations).length === 0) {
            uniteConfiguration.buildConfigurations.dev = { bundle: false, minify: false, sourcemaps: true };
            uniteConfiguration.buildConfigurations.prod = { bundle: true, minify: true, sourcemaps: false };
        }

        uniteConfiguration.platforms = uniteConfiguration.platforms || { Web: {} };

        if (args.profile) {
            this._logger.info("profile", { profile: args.profile });
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
            if (uniteConfiguration.unitTestFramework !== null && uniteConfiguration.unitTestFramework !== undefined) {
                this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                return 1;
            }
            if (uniteConfiguration.unitTestEngine !== null && uniteConfiguration.unitTestEngine !== undefined) {
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
            if (uniteConfiguration.e2eTestFramework !== null && uniteConfiguration.e2eTestFramework !== undefined) {
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
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("server", uniteConfiguration.server))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("taskManager", uniteConfiguration.taskManager))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }
        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("applicationFramework", uniteConfiguration.applicationFramework))) {
            return 1;
        }

        this._logger.info("force", { force: args.force });

        this._logger.info("");

        return this.configureRun(args.outputDirectory, uniteConfiguration, spdxLicense, args.force);
    }

    private async configureRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, license: ISpdxLicense, force: boolean): Promise<number> {
        const engineVariables = new EngineVariables();
        super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
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
