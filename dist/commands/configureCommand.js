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
 * Configure Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
const engineVariablesMeta_1 = require("../engine/engineVariablesMeta");
const pipelineKey_1 = require("../engine/pipelineKey");
const pipelineLocator_1 = require("../engine/pipelineLocator");
class ConfigureCommand extends engineCommandBase_1.EngineCommandBase {
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.force = args.force === undefined || args.force === null ? false : args.force;
            args.noCreateSource = args.noCreateSource === undefined || args.noCreateSource === null ? false : args.noCreateSource;
            let uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, "configure", args.profile, args.force);
            if (uniteConfiguration === undefined) {
                uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            }
            else if (uniteConfiguration === null) {
                return 1;
            }
            const meta = new engineVariablesMeta_1.EngineVariablesMeta();
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
            const unitTestRunnerSetByProfile = uniteConfiguration.unitTestRunner !== undefined && uniteConfiguration.unitTestRunner !== null;
            const e2eTestRunnerSetByProfile = uniteConfiguration.e2eTestRunner !== undefined && uniteConfiguration.e2eTestRunner !== null;
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
            if (!parameterValidation_1.ParameterValidation.checkPackageName(this._logger, "packageName", uniteConfiguration.packageName)) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("language", uniteConfiguration.sourceLanguage), "sourceLanguage"))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("bundler", uniteConfiguration.bundler)))) {
                return 1;
            }
            if (/none/i.test(uniteConfiguration.unitTestRunner)) {
                // If profile had unitTestRunner set and now unitTestRunner is disabled
                // turn off the other unit test components
                if (unitTestRunnerSetByProfile) {
                    uniteConfiguration.unitTestFramework = undefined;
                    uniteConfiguration.unitTestEngine = undefined;
                }
                else {
                    if (uniteConfiguration.unitTestFramework !== null && uniteConfiguration.unitTestFramework !== undefined) {
                        this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                        return 1;
                    }
                    if (uniteConfiguration.unitTestEngine !== null && uniteConfiguration.unitTestEngine !== undefined) {
                        this._logger.error("unitTestEngine is not valid if unitTestRunner is None");
                        return 1;
                    }
                }
            }
            else {
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("unitTestRunner", uniteConfiguration.unitTestRunner)))) {
                    return 1;
                }
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("testFramework", uniteConfiguration.unitTestFramework), "unitTestFramework"))) {
                    return 1;
                }
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("unitTestEngine", uniteConfiguration.unitTestEngine)))) {
                    return 1;
                }
            }
            if (/none/i.test(uniteConfiguration.e2eTestRunner)) {
                // If profile had e2eTestRunner set and now e2eTestRunner is disabled
                // turn off the other e2e test components
                if (e2eTestRunnerSetByProfile) {
                    uniteConfiguration.e2eTestFramework = undefined;
                }
                else {
                    if (uniteConfiguration.e2eTestFramework !== null && uniteConfiguration.e2eTestFramework !== undefined) {
                        this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                        return 1;
                    }
                }
            }
            else {
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("e2eTestRunner", uniteConfiguration.e2eTestRunner)))) {
                    return 1;
                }
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("testFramework", uniteConfiguration.e2eTestFramework), "e2eTestFramework"))) {
                    return 1;
                }
            }
            if (!/none/i.test(uniteConfiguration.linter)) {
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("linter", uniteConfiguration.linter)))) {
                    return 1;
                }
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("cssPre", uniteConfiguration.cssPre)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("cssPost", uniteConfiguration.cssPost)))) {
                return 1;
            }
            if (!/none/i.test(uniteConfiguration.cssLinter)) {
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("cssLinter", uniteConfiguration.cssLinter)))) {
                    return 1;
                }
            }
            if (!/none/i.test(uniteConfiguration.documenter)) {
                if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("documenter", uniteConfiguration.documenter)))) {
                    return 1;
                }
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("server", uniteConfiguration.server)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("taskManager", uniteConfiguration.taskManager)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework)))) {
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
        });
    }
    configureRun(outputDirectory, uniteConfiguration, meta, force, noCreateSource) {
        const _super = Object.create(null, {
            createEngineVariables: { get: () => super.createEngineVariables }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            _super.createEngineVariables.call(this, outputDirectory, uniteConfiguration, engineVariables);
            engineVariables.meta = meta;
            engineVariables.force = force;
            engineVariables.noCreateSource = noCreateSource;
            this.addPipelinePre();
            yield this.addPipelineDynamic();
            this.addPipelinePost();
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this.displayCompletionMessage(engineVariables, true);
            }
            return ret;
        });
    }
    addPipelinePre() {
        this._pipeline.add("scaffold", "outputDirectory");
        this._pipeline.add("scaffold", "appScaffold");
        this._pipeline.add("scaffold", "unitTestScaffold");
        this._pipeline.add("scaffold", "e2eTestScaffold");
    }
    addPipelineDynamic() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield pipelineLocator_1.PipelineLocator.getPipelineCategories(this._fileSystem, this._engineRootFolder);
            for (let i = 0; i < categories.length; i++) {
                if (categories[i] !== "scaffold" && categories[i] !== "unite") {
                    const items = yield pipelineLocator_1.PipelineLocator.getPipelineCategoryItems(this._fileSystem, this._engineRootFolder, categories[i]);
                    items.forEach(item => {
                        this._pipeline.add(categories[i], item);
                    });
                }
            }
        });
    }
    addPipelinePost() {
        this._pipeline.add("unite", "uniteConfigurationDirectories");
        this._pipeline.add("unite", "uniteThemeConfigurationJson");
        this._pipeline.add("unite", "uniteConfigurationJson");
    }
}
exports.ConfigureCommand = ConfigureCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUN6Rix5RkFBc0Y7QUFDdEYsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUM1RCx1RUFBb0U7QUFDcEUsdURBQW9EO0FBQ3BELCtEQUE0RDtBQUs1RCxNQUFhLGdCQUFpQixTQUFRLHFDQUFpQjtJQUN0QyxHQUFHLENBQUMsSUFBNkI7O1lBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7WUFFdEgsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuSCxJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtnQkFDbEMsa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO2FBQ2pEO2lCQUFNLElBQUksa0JBQWtCLEtBQUssSUFBSSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsQ0FBQzthQUNaO1lBRUQsTUFBTSxJQUFJLEdBQXdCLElBQUkseUNBQW1CLEVBQUUsQ0FBQztZQUU1RCxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7WUFFcEYsNEZBQTRGO1lBQzVGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7WUFDcEQsT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7WUFFaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRWhDLE1BQU0sMEJBQTBCLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDO1lBQ2pJLE1BQU0seUJBQXlCLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDO1lBRTlILGtCQUFrQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7WUFDN0Ysa0JBQWtCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDO1lBQ2pGLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7WUFDN0Ysa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDO1lBQ3RHLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztZQUM3RixrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7WUFDMUYsa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDO1lBQ25HLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztZQUNyRSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDO1lBQ3RHLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUNwRixrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDckUsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksa0JBQWtCLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNyRSxrQkFBa0IsQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLElBQUksa0JBQWtCLENBQUMsb0JBQW9CLENBQUM7WUFDL0csa0JBQWtCLENBQUMsY0FBYyxHQUFHLGtCQUFrQixDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7WUFDNUUsa0JBQWtCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQ3JFLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RSxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDO1lBQ3hGLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLGtCQUFrQixDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUM7WUFDM0Ysa0JBQWtCLENBQUMsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDO1lBQ3RGLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUN6QyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBRXZDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2xFLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztnQkFDNUcsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQy9HO1lBRUQsa0JBQWtCLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLFNBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUUzRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzNEO1lBRUQsSUFBSSxDQUFDLHlDQUFtQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNwRyxPQUFPLENBQUMsQ0FBQzthQUNaO1lBRUQsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUEsRUFBRTtnQkFDckksT0FBTyxDQUFDLENBQUM7YUFDWjtZQUNELElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBLEVBQUU7Z0JBQ2pILE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFDRCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQSxFQUFFO2dCQUMzRyxPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNqRCx1RUFBdUU7Z0JBQ3ZFLDBDQUEwQztnQkFDMUMsSUFBSSwwQkFBMEIsRUFBRTtvQkFDNUIsa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO29CQUNqRCxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO2lCQUNqRDtxQkFBTTtvQkFDSCxJQUFJLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLElBQUksSUFBSSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7d0JBQ3JHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7d0JBQy9FLE9BQU8sQ0FBQyxDQUFDO3FCQUNaO29CQUNELElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO3dCQUMvRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO3dCQUM1RSxPQUFPLENBQUMsQ0FBQztxQkFDWjtpQkFDSjthQUNKO2lCQUFNO2dCQUNILElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUEsRUFBRTtvQkFDekgsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSxFQUFFO29CQUNoSixPQUFPLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBLEVBQUU7b0JBQ3pILE9BQU8sQ0FBQyxDQUFDO2lCQUNaO2FBQ0o7WUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2hELHFFQUFxRTtnQkFDckUseUNBQXlDO2dCQUN6QyxJQUFJLHlCQUF5QixFQUFFO29CQUMzQixrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7aUJBQ25EO3FCQUFNO29CQUNILElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssSUFBSSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsRUFBRTt3QkFDbkcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQzt3QkFDN0UsT0FBTyxDQUFDLENBQUM7cUJBQ1o7aUJBQ0o7YUFDSjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQSxFQUFFO29CQUN2SCxPQUFPLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBLEVBQUU7b0JBQzlJLE9BQU8sQ0FBQyxDQUFDO2lCQUNaO2FBQ0o7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsRUFBRTtvQkFDekcsT0FBTyxDQUFDLENBQUM7aUJBQ1o7YUFDSjtZQUNELElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEVBQUU7Z0JBQ3pHLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFDRCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQSxFQUFFO2dCQUMzRyxPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBLEVBQUU7b0JBQy9HLE9BQU8sQ0FBQyxDQUFDO2lCQUNaO2FBQ0o7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUEsRUFBRTtvQkFDakgsT0FBTyxDQUFDLENBQUM7aUJBQ1o7YUFDSjtZQUNELElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEVBQUU7Z0JBQ3pHLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFDRCxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQSxFQUFFO2dCQUNuSCxPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQSxFQUFFO2dCQUN6SCxPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsc0JBQXNCLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFBLEVBQUU7Z0JBQ3JJLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ3JEO1lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDdkU7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3hFO1lBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDakU7WUFFRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQzthQUMxRTtZQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDM0Q7WUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNqRTtZQUVELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ2pFO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUN4RDtZQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZFO1lBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7YUFDN0U7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFFN0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlHLENBQUM7S0FBQTtJQUVhLFlBQVksQ0FBQyxlQUF1QixFQUFFLGtCQUFzQyxFQUFFLElBQXlCLEVBQUUsS0FBYyxFQUFFLGNBQXVCOzs7OztZQUMxSixNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUM5QyxPQUFNLHFCQUFxQixZQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUU7WUFDbEYsZUFBZSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDNUIsZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDOUIsZUFBZSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7WUFFaEQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRXRCLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFaEMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFMUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO2dCQUNYLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDeEQ7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVPLGNBQWM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFYSxrQkFBa0I7O1lBQzVCLE1BQU0sVUFBVSxHQUFHLE1BQU0saUNBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRXpHLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sRUFBRTtvQkFDM0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxpQ0FBZSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV0SCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7UUFDTCxDQUFDO0tBQUE7SUFFTyxlQUFlO1FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDSjtBQXRRRCw0Q0FzUUMiLCJmaWxlIjoiY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29uZmlndXJlIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lQ29tbWFuZEJhc2UgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzTWV0YSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzTWV0YVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZUxvY2F0b3IgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lTG9jYXRvclwiO1xuaW1wb3J0IHsgSUNvbmZpZ3VyZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQ29uZmlndXJlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFBhcmFtc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlndXJlQ29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIGltcGxlbWVudHMgSUVuZ2luZUNvbW1hbmQ8SUVuZ2luZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElDb25maWd1cmVDb21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgYXJncy5mb3JjZSA9IGFyZ3MuZm9yY2UgPT09IHVuZGVmaW5lZCB8fCBhcmdzLmZvcmNlID09PSBudWxsID8gZmFsc2UgOiBhcmdzLmZvcmNlO1xuICAgICAgICBhcmdzLm5vQ3JlYXRlU291cmNlID0gYXJncy5ub0NyZWF0ZVNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IGFyZ3Mubm9DcmVhdGVTb3VyY2UgPT09IG51bGwgPyBmYWxzZSA6IGFyZ3Mubm9DcmVhdGVTb3VyY2U7XG5cbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIFwiY29uZmlndXJlXCIsIGFyZ3MucHJvZmlsZSwgYXJncy5mb3JjZSk7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXRhOiBFbmdpbmVWYXJpYWJsZXNNZXRhID0gbmV3IEVuZ2luZVZhcmlhYmxlc01ldGEoKTtcblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUgPSBhcmdzLnBhY2thZ2VOYW1lIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZTtcblxuICAgICAgICAvLyB0aXRsZSBoYXMgbW92ZWQgdG8gdW5pdGUtdGhlbWUuanNvbiBhbmQgaXMgbm93IG9wdGlvbmFsIHNvIHJlbW92ZSBmcm9tIHVuaXRlQ29uZmlndXJhdGlvblxuICAgICAgICBtZXRhLnRpdGxlID0gYXJncy50aXRsZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG5cbiAgICAgICAgbWV0YS5kZXNjcmlwdGlvbiA9IGFyZ3MuZGVzY3JpcHRpb247XG4gICAgICAgIG1ldGEua2V5d29yZHMgPSBhcmdzLmtleXdvcmRzO1xuICAgICAgICBtZXRhLnNob3J0TmFtZSA9IGFyZ3Muc2hvcnROYW1lO1xuICAgICAgICBtZXRhLmNvcHlyaWdodCA9IGFyZ3MuY29weXJpZ2h0O1xuICAgICAgICBtZXRhLm9yZ2FuaXphdGlvbiA9IGFyZ3Mub3JnYW5pemF0aW9uO1xuICAgICAgICBtZXRhLndlYlNpdGUgPSBhcmdzLndlYlNpdGU7XG4gICAgICAgIG1ldGEuYXV0aG9yID0gYXJncy5hdXRob3I7XG4gICAgICAgIG1ldGEuYXV0aG9yRW1haWwgPSBhcmdzLmF1dGhvckVtYWlsO1xuICAgICAgICBtZXRhLmF1dGhvcldlYlNpdGUgPSBhcmdzLmF1dGhvcldlYlNpdGU7XG4gICAgICAgIG1ldGEubmFtZXNwYWNlID0gYXJncy5uYW1lc3BhY2U7XG5cbiAgICAgICAgY29uc3QgdW5pdFRlc3RSdW5uZXJTZXRCeVByb2ZpbGUgPSB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgIT09IHVuZGVmaW5lZCAmJiB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgIT09IG51bGw7XG4gICAgICAgIGNvbnN0IGUyZVRlc3RSdW5uZXJTZXRCeVByb2ZpbGUgPSB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciAhPT0gdW5kZWZpbmVkICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyICE9PSBudWxsO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlID0gYXJncy5saWNlbnNlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPSBhcmdzLnNvdXJjZUxhbmd1YWdlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPSBhcmdzLm1vZHVsZVR5cGUgfHwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID0gYXJncy5idW5kbGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPSBhcmdzLnVuaXRUZXN0UnVubmVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrID0gYXJncy51bml0VGVzdEZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSA9IGFyZ3MudW5pdFRlc3RFbmdpbmUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9IGFyZ3MuZTJlVGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPSBhcmdzLmUyZVRlc3RGcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPSBhcmdzLmxpbnRlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgPSBhcmdzLnBhY2thZ2VNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciB8fCBcIk5wbVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIgPSBhcmdzLnRhc2tNYW5hZ2VyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNlcnZlciA9IGFyZ3Muc2VydmVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5zZXJ2ZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5pZGVzID0gYXJncy5pZGVzIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5pZGVzIHx8IFtdO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPSBhcmdzLmFwcGxpY2F0aW9uRnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzIHx8IHt9O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlID0gYXJncy5jc3NQcmUgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QgPSBhcmdzLmNzc1Bvc3QgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3Q7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NMaW50ZXIgPSBhcmdzLmNzc0xpbnRlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzTGludGVyIHx8IFwiTm9uZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRlciA9IGFyZ3MuZG9jdW1lbnRlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRlciB8fCBcIk5vbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUV4dGVuc2lvbnMgPSBbXTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnZpZXdFeHRlbnNpb25zID0gW107XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLmRldiA9IHsgYnVuZGxlOiBmYWxzZSwgbWluaWZ5OiBmYWxzZSwgc291cmNlbWFwczogdHJ1ZSwgcHdhOiBmYWxzZSB9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMucHJvZCA9IHsgYnVuZGxlOiB0cnVlLCBtaW5pZnk6IHRydWUsIHNvdXJjZW1hcHM6IGZhbHNlLCBwd2E6IGZhbHNlIH07XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyB8fCB7IFdlYjoge30gfTtcblxuICAgICAgICBpZiAoYXJncy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByb2ZpbGVcIiwgeyBwcm9maWxlOiBhcmdzLnByb2ZpbGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tQYWNrYWdlTmFtZSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJsYW5ndWFnZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UpLCBcInNvdXJjZUxhbmd1YWdlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIpKSB7XG4gICAgICAgICAgICAvLyBJZiBwcm9maWxlIGhhZCB1bml0VGVzdFJ1bm5lciBzZXQgYW5kIG5vdyB1bml0VGVzdFJ1bm5lciBpcyBkaXNhYmxlZFxuICAgICAgICAgICAgLy8gdHVybiBvZmYgdGhlIG90aGVyIHVuaXQgdGVzdCBjb21wb25lbnRzXG4gICAgICAgICAgICBpZiAodW5pdFRlc3RSdW5uZXJTZXRCeVByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcInVuaXRUZXN0RnJhbWV3b3JrIGlzIG5vdCB2YWxpZCBpZiB1bml0VGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSAhPT0gbnVsbCAmJiB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJ1bml0VGVzdEVuZ2luZSBpcyBub3QgdmFsaWQgaWYgdW5pdFRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidW5pdFRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInRlc3RGcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrKSwgXCJ1bml0VGVzdEZyYW1ld29ya1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidW5pdFRlc3RFbmdpbmVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoL25vbmUvaS50ZXN0KHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyKSkge1xuICAgICAgICAgICAgLy8gSWYgcHJvZmlsZSBoYWQgZTJlVGVzdFJ1bm5lciBzZXQgYW5kIG5vdyBlMmVUZXN0UnVubmVyIGlzIGRpc2FibGVkXG4gICAgICAgICAgICAvLyB0dXJuIG9mZiB0aGUgb3RoZXIgZTJlIHRlc3QgY29tcG9uZW50c1xuICAgICAgICAgICAgaWYgKGUyZVRlc3RSdW5uZXJTZXRCeVByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiZTJlVGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgZTJlVGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJlMmVUZXN0UnVubmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInRlc3RGcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmspLCBcImUyZVRlc3RGcmFtZXdvcmtcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIS9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyKSkge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwibGludGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImNzc1ByZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImNzc1Bvc3RcIiwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEvbm9uZS9pLnRlc3QodW5pdGVDb25maWd1cmF0aW9uLmNzc0xpbnRlcikpIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImNzc0xpbnRlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzTGludGVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIS9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRlcikpIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImRvY3VtZW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmRvY3VtZW50ZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInNlcnZlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uc2VydmVyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInRhc2tNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwidGl0bGVcIiwgeyB0aXRsZTogYXJncy50aXRsZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImRlc2NyaXB0aW9uXCIsIHsgZGVzY3JpcHRpb246IGFyZ3MuZGVzY3JpcHRpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5rZXl3b3JkcyAmJiBhcmdzLmtleXdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwia2V5d29yZHNcIiwgeyBrZXl3b3JkczogYXJncy5rZXl3b3Jkcy5qb2luKFwiLFwiKSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLnNob3J0TmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJzaG9ydE5hbWVcIiwgeyBzaG9ydE5hbWU6IGFyZ3Muc2hvcnROYW1lIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Mub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm9yZ2FuaXphdGlvblwiLCB7IG9yZ2FuaXphdGlvbjogYXJncy5vcmdhbml6YXRpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy53ZWJTaXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIndlYlNpdGVcIiwgeyB3ZWJTaXRlOiBhcmdzLndlYlNpdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5jb3B5cmlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiY29weXJpZ2h0XCIsIHsgY29weXJpZ2h0OiBhcmdzLmNvcHlyaWdodCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm5hbWVzcGFjZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJuYW1lc3BhY2VcIiwgeyBuYW1lc3BhY2U6IGFyZ3MubmFtZXNwYWNlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MuYXV0aG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImF1dGhvclwiLCB7IGF1dGhvcjogYXJncy5hdXRob3IgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5hdXRob3JFbWFpbCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJhdXRob3JFbWFpbFwiLCB7IGF1dGhvckVtYWlsOiBhcmdzLmF1dGhvckVtYWlsIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MuYXV0aG9yV2ViU2l0ZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJhdXRob3JXZWJTaXRlXCIsIHsgYXV0aG9yV2ViU2l0ZTogYXJncy5hdXRob3JXZWJTaXRlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJmb3JjZVwiLCB7IGZvcmNlOiBhcmdzLmZvcmNlIH0pO1xuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm5vQ3JlYXRlU291cmNlXCIsIHsgbm9DcmVhdGVTb3VyY2U6IGFyZ3Mubm9DcmVhdGVTb3VyY2UgfSk7XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlUnVuKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIG1ldGEsIGFyZ3MuZm9yY2UsIGFyZ3Mubm9DcmVhdGVTb3VyY2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY29uZmlndXJlUnVuKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgbWV0YTogRW5naW5lVmFyaWFibGVzTWV0YSwgZm9yY2U6IGJvb2xlYW4sIG5vQ3JlYXRlU291cmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBzdXBlci5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5tZXRhID0gbWV0YTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlID0gZm9yY2U7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5ub0NyZWF0ZVNvdXJjZSA9IG5vQ3JlYXRlU291cmNlO1xuXG4gICAgICAgIHRoaXMuYWRkUGlwZWxpbmVQcmUoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmFkZFBpcGVsaW5lRHluYW1pYygpO1xuXG4gICAgICAgIHRoaXMuYWRkUGlwZWxpbmVQb3N0KCk7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDb21wbGV0aW9uTWVzc2FnZShlbmdpbmVWYXJpYWJsZXMsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFBpcGVsaW5lUHJlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJzY2FmZm9sZFwiLCBcIm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJhcHBTY2FmZm9sZFwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJ1bml0VGVzdFNjYWZmb2xkXCIpO1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJzY2FmZm9sZFwiLCBcImUyZVRlc3RTY2FmZm9sZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZFBpcGVsaW5lRHluYW1pYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IGF3YWl0IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUNhdGVnb3JpZXModGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlcik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllc1tpXSAhPT0gXCJzY2FmZm9sZFwiICYmIGNhdGVnb3JpZXNbaV0gIT09IFwidW5pdGVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgUGlwZWxpbmVMb2NhdG9yLmdldFBpcGVsaW5lQ2F0ZWdvcnlJdGVtcyh0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBjYXRlZ29yaWVzW2ldKTtcblxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChjYXRlZ29yaWVzW2ldLCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkUGlwZWxpbmVQb3N0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzXCIpO1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvblwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuICAgIH1cbn1cbiJdfQ==
