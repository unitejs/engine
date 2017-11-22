/**
 * Configure Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { EngineVariablesMeta } from "../engine/engineVariablesMeta";
import { PipelineKey } from "../engine/pipelineKey";
import { PipelineLocator } from "../engine/pipelineLocator";
import { IConfigureCommandParams } from "../interfaces/IConfigureCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";

export class ConfigureCommand extends EngineCommandBase implements IEngineCommand<IEngineCommandParams> {
    public async run(args: IConfigureCommandParams): Promise<number> {
        args.force = args.force === undefined || args.force === null ? false : args.force;
        args.noCreateSource = args.noCreateSource === undefined || args.noCreateSource === null ? false : args.noCreateSource;

        let uniteConfiguration = await this.loadConfiguration(args.outputDirectory, "configure", args.profile, args.force);
        if (uniteConfiguration === undefined) {
            uniteConfiguration = new UniteConfiguration();
        } else if (uniteConfiguration === null) {
            return 1;
        }

        const meta: EngineVariablesMeta = new EngineVariablesMeta();

        uniteConfiguration.packageName = args.packageName || uniteConfiguration.packageName;

        // title has moved to unite-theme.json and is now optional so remove from uniteConfiguration
        meta.title = args.title || uniteConfiguration.title;
        delete uniteConfiguration.title;

        meta.description = args.description;
        meta.keywords = args.keywords;
        meta.shortName = args.shortName;
        meta.copyright = args.copyright;
        meta.organization = args.organization;
        meta.webSite = args.webSite;
        meta.author = args.author;
        meta.authorEmail = args.authorEmail;
        meta.authorWebSite = args.authorWebSite;
        meta.namespace = args.namespace;

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
        uniteConfiguration.cssLinter = args.cssLinter || uniteConfiguration.cssLinter || "None";
        uniteConfiguration.documenter = args.documenter || uniteConfiguration.documenter || "None";
        uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
        uniteConfiguration.sourceExtensions = [];
        uniteConfiguration.viewExtensions = [];

        if (Object.keys(uniteConfiguration.buildConfigurations).length === 0) {
            uniteConfiguration.buildConfigurations.dev = { bundle: false, minify: false, sourcemaps: true, pwa: false };
            uniteConfiguration.buildConfigurations.prod = { bundle: true, minify: true, sourcemaps: false, pwa: false };
        }

        uniteConfiguration.platforms = uniteConfiguration.platforms || { Web: {} };

        if (args.profile) {
            this._logger.info("profile", { profile: args.profile });
        }

        if (!ParameterValidation.checkPackageName(this._logger, "packageName", uniteConfiguration.packageName)) {
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
        if (/none/i.test(uniteConfiguration.unitTestRunner)) {
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
        if (/none/i.test(uniteConfiguration.e2eTestRunner)) {
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
        if (!/none/i.test(uniteConfiguration.linter)) {
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
        if (!/none/i.test(uniteConfiguration.cssLinter)) {
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("cssLinter", uniteConfiguration.cssLinter))) {
                return 1;
            }
        }
        if (!/none/i.test(uniteConfiguration.documenter)) {
            if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("documenter", uniteConfiguration.documenter))) {
                return 1;
            }
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

        if (args.title) {
            this._logger.info("title", { title: args.title });
        }

        if (args.description) {
            this._logger.info("description", { description: args.description });
        }

        if (args.keywords && args.keywords.length > 0) {
            this._logger.info("keywords", { keywords: args.keywords.join(",") });
        }

        if (args.shortName) {
            this._logger.info("shortName", { shortName: args.shortName });
        }

        if (args.organization) {
            this._logger.info("organization", { organization: args.organization });
        }

        if (args.webSite) {
            this._logger.info("webSite", { webSite: args.webSite });
        }

        if (args.copyright) {
            this._logger.info("copyright", { copyright: args.copyright });
        }

        if (args.namespace) {
            this._logger.info("namespace", { namespace: args.namespace });
        }

        if (args.author) {
            this._logger.info("author", { author: args.author });
        }

        if (args.authorEmail) {
            this._logger.info("authorEmail", { authorEmail: args.authorEmail });
        }

        if (args.authorWebSite) {
            this._logger.info("authorWebSite", { authorWebSite: args.authorWebSite });
        }

        this._logger.info("force", { force: args.force });
        this._logger.info("noCreateSource", { noCreateSource: args.noCreateSource });

        this._logger.info("");

        return this.configureRun(args.outputDirectory, uniteConfiguration, meta, args.force, args.noCreateSource);
    }

    private async configureRun(outputDirectory: string, uniteConfiguration: UniteConfiguration, meta: EngineVariablesMeta, force: boolean, noCreateSource: boolean): Promise<number> {
        const engineVariables = new EngineVariables();
        super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
        engineVariables.meta = meta;
        engineVariables.force = force;
        engineVariables.noCreateSource = noCreateSource;

        this.addPipelinePre();

        await this.addPipelineDynamic();

        this.addPipelinePost();

        const ret = await this._pipeline.run(uniteConfiguration, engineVariables);

        if (ret === 0) {
            this.displayCompletionMessage(engineVariables, true);
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
        const categories = await PipelineLocator.getPipelineCategories(this._fileSystem, this._engineRootFolder);

        for (let i = 0; i < categories.length; i++) {
            if (categories[i] !== "scaffold" && categories[i] !== "unite") {
                const items = await PipelineLocator.getPipelineCategoryItems(this._fileSystem, this._engineRootFolder, categories[i]);

                items.forEach(item => {
                    this._pipeline.add(categories[i], item);
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
