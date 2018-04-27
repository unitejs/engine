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
                if (uniteConfiguration.unitTestFramework !== null && uniteConfiguration.unitTestFramework !== undefined) {
                    this._logger.error("unitTestFramework is not valid if unitTestRunner is None");
                    return 1;
                }
                if (uniteConfiguration.unitTestEngine !== null && uniteConfiguration.unitTestEngine !== undefined) {
                    this._logger.error("unitTestEngine is not valid if unitTestRunner is None");
                    return 1;
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
                if (uniteConfiguration.e2eTestFramework !== null && uniteConfiguration.e2eTestFramework !== undefined) {
                    this._logger.error("e2eTestFramework is not valid if e2eTestRunner is None");
                    return 1;
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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            _super("createEngineVariables").call(this, outputDirectory, uniteConfiguration, engineVariables);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUN6Rix5RkFBc0Y7QUFDdEYsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUM1RCx1RUFBb0U7QUFDcEUsdURBQW9EO0FBQ3BELCtEQUE0RDtBQUs1RCxzQkFBOEIsU0FBUSxxQ0FBaUI7SUFDdEMsR0FBRyxDQUFDLElBQTZCOztZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbEYsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBRXRILElBQUksa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkgsSUFBSSxrQkFBa0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQzthQUNqRDtpQkFBTSxJQUFJLGtCQUFrQixLQUFLLElBQUksRUFBRTtnQkFDcEMsT0FBTyxDQUFDLENBQUM7YUFDWjtZQUVELE1BQU0sSUFBSSxHQUF3QixJQUFJLHlDQUFtQixFQUFFLENBQUM7WUFFNUQsa0JBQWtCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksa0JBQWtCLENBQUMsV0FBVyxDQUFDO1lB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ZmlndXJlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29uZmlndXJlIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lQ29tbWFuZEJhc2UgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzTWV0YSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzTWV0YVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZUxvY2F0b3IgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lTG9jYXRvclwiO1xuaW1wb3J0IHsgSUNvbmZpZ3VyZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQ29uZmlndXJlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFBhcmFtc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlndXJlQ29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIGltcGxlbWVudHMgSUVuZ2luZUNvbW1hbmQ8SUVuZ2luZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElDb25maWd1cmVDb21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgYXJncy5mb3JjZSA9IGFyZ3MuZm9yY2UgPT09IHVuZGVmaW5lZCB8fCBhcmdzLmZvcmNlID09PSBudWxsID8gZmFsc2UgOiBhcmdzLmZvcmNlO1xuICAgICAgICBhcmdzLm5vQ3JlYXRlU291cmNlID0gYXJncy5ub0NyZWF0ZVNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IGFyZ3Mubm9DcmVhdGVTb3VyY2UgPT09IG51bGwgPyBmYWxzZSA6IGFyZ3Mubm9DcmVhdGVTb3VyY2U7XG5cbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIFwiY29uZmlndXJlXCIsIGFyZ3MucHJvZmlsZSwgYXJncy5mb3JjZSk7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXRhOiBFbmdpbmVWYXJpYWJsZXNNZXRhID0gbmV3IEVuZ2luZVZhcmlhYmxlc01ldGEoKTtcblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUgPSBhcmdzLnBhY2thZ2VOYW1lIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZTtcblxuICAgICAgICAvLyB0aXRsZSBoYXMgbW92ZWQgdG8gdW5pdGUtdGhlbWUuanNvbiBhbmQgaXMgbm93IG9wdGlvbmFsIHNvIHJlbW92ZSBmcm9tIHVuaXRlQ29uZmlndXJhdGlvblxuICAgICAgICBtZXRhLnRpdGxlID0gYXJncy50aXRsZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG5cbiAgICAgICAgbWV0YS5kZXNjcmlwdGlvbiA9IGFyZ3MuZGVzY3JpcHRpb247XG4gICAgICAgIG1ldGEua2V5d29yZHMgPSBhcmdzLmtleXdvcmRzO1xuICAgICAgICBtZXRhLnNob3J0TmFtZSA9IGFyZ3Muc2hvcnROYW1lO1xuICAgICAgICBtZXRhLmNvcHlyaWdodCA9IGFyZ3MuY29weXJpZ2h0O1xuICAgICAgICBtZXRhLm9yZ2FuaXphdGlvbiA9IGFyZ3Mub3JnYW5pemF0aW9uO1xuICAgICAgICBtZXRhLndlYlNpdGUgPSBhcmdzLndlYlNpdGU7XG4gICAgICAgIG1ldGEuYXV0aG9yID0gYXJncy5hdXRob3I7XG4gICAgICAgIG1ldGEuYXV0aG9yRW1haWwgPSBhcmdzLmF1dGhvckVtYWlsO1xuICAgICAgICBtZXRhLmF1dGhvcldlYlNpdGUgPSBhcmdzLmF1dGhvcldlYlNpdGU7XG4gICAgICAgIG1ldGEubmFtZXNwYWNlID0gYXJncy5uYW1lc3BhY2U7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UgPSBhcmdzLmxpY2Vuc2UgfHwgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2U7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSA9IGFyZ3Muc291cmNlTGFuZ3VhZ2UgfHwgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9IGFyZ3MubW9kdWxlVHlwZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIgPSBhcmdzLmJ1bmRsZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9IGFyZ3MudW5pdFRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPSBhcmdzLnVuaXRUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lID0gYXJncy51bml0VGVzdEVuZ2luZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID0gYXJncy5lMmVUZXN0UnVubmVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9IGFyZ3MuZTJlVGVzdEZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yaztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9IGFyZ3MubGludGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9IGFyZ3MucGFja2FnZU1hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyIHx8IFwiTnBtXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciA9IGFyZ3MudGFza01hbmFnZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc2VydmVyID0gYXJncy5zZXJ2ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLnNlcnZlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmlkZXMgPSBhcmdzLmlkZXMgfHwgdW5pdGVDb25maWd1cmF0aW9uLmlkZXMgfHwgW107XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9IGFyZ3MuYXBwbGljYXRpb25GcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUgPSBhcmdzLmNzc1ByZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCA9IGFyZ3MuY3NzUG9zdCB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdDtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc0xpbnRlciA9IGFyZ3MuY3NzTGludGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5jc3NMaW50ZXIgfHwgXCJOb25lXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kb2N1bWVudGVyID0gYXJncy5kb2N1bWVudGVyIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5kb2N1bWVudGVyIHx8IFwiTm9uZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zIHx8IHt9O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlRXh0ZW5zaW9ucyA9IFtdO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udmlld0V4dGVuc2lvbnMgPSBbXTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMuZGV2ID0geyBidW5kbGU6IGZhbHNlLCBtaW5pZnk6IGZhbHNlLCBzb3VyY2VtYXBzOiB0cnVlLCBwd2E6IGZhbHNlIH07XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucy5wcm9kID0geyBidW5kbGU6IHRydWUsIG1pbmlmeTogdHJ1ZSwgc291cmNlbWFwczogZmFsc2UsIHB3YTogZmFsc2UgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zIHx8IHsgV2ViOiB7fSB9O1xuXG4gICAgICAgIGlmIChhcmdzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwicHJvZmlsZVwiLCB7IHByb2ZpbGU6IGFyZ3MucHJvZmlsZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja1BhY2thZ2VOYW1lKHRoaXMuX2xvZ2dlciwgXCJwYWNrYWdlTmFtZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSksIFwic291cmNlTGFuZ3VhZ2VcIikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcIm1vZHVsZVR5cGVcIiwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiYnVuZGxlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL25vbmUvaS50ZXN0KHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lcikpIHtcbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgIT09IG51bGwgJiYgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJ1bml0VGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgdW5pdFRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUgIT09IG51bGwgJiYgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJ1bml0VGVzdEVuZ2luZSBpcyBub3QgdmFsaWQgaWYgdW5pdFRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0UnVubmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayksIFwidW5pdFRlc3RGcmFtZXdvcmtcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0RW5naW5lXCIsIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lcikpIHtcbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayAhPT0gbnVsbCAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiZTJlVGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgZTJlVGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiZTJlVGVzdFJ1bm5lclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrKSwgXCJlMmVUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEvbm9uZS9pLnRlc3QodW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcikpIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImxpbnRlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJjc3NQb3N0XCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQb3N0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghL25vbmUvaS50ZXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jc3NMaW50ZXIpKSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJjc3NMaW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmNzc0xpbnRlcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEvbm9uZS9pLnRlc3QodW5pdGVDb25maWd1cmF0aW9uLmRvY3VtZW50ZXIpKSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJkb2N1bWVudGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5kb2N1bWVudGVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJzZXJ2ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnNlcnZlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ0YXNrTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yaykpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLnRpdGxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInRpdGxlXCIsIHsgdGl0bGU6IGFyZ3MudGl0bGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJkZXNjcmlwdGlvblwiLCB7IGRlc2NyaXB0aW9uOiBhcmdzLmRlc2NyaXB0aW9uIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Mua2V5d29yZHMgJiYgYXJncy5rZXl3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImtleXdvcmRzXCIsIHsga2V5d29yZHM6IGFyZ3Mua2V5d29yZHMuam9pbihcIixcIikgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5zaG9ydE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwic2hvcnROYW1lXCIsIHsgc2hvcnROYW1lOiBhcmdzLnNob3J0TmFtZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJvcmdhbml6YXRpb25cIiwgeyBvcmdhbml6YXRpb246IGFyZ3Mub3JnYW5pemF0aW9uIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Mud2ViU2l0ZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ3ZWJTaXRlXCIsIHsgd2ViU2l0ZTogYXJncy53ZWJTaXRlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MuY29weXJpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImNvcHlyaWdodFwiLCB7IGNvcHlyaWdodDogYXJncy5jb3B5cmlnaHQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5uYW1lc3BhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwibmFtZXNwYWNlXCIsIHsgbmFtZXNwYWNlOiBhcmdzLm5hbWVzcGFjZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmF1dGhvcikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJhdXRob3JcIiwgeyBhdXRob3I6IGFyZ3MuYXV0aG9yIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MuYXV0aG9yRW1haWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXV0aG9yRW1haWxcIiwgeyBhdXRob3JFbWFpbDogYXJncy5hdXRob3JFbWFpbCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmF1dGhvcldlYlNpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXV0aG9yV2ViU2l0ZVwiLCB7IGF1dGhvcldlYlNpdGU6IGFyZ3MuYXV0aG9yV2ViU2l0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiZm9yY2VcIiwgeyBmb3JjZTogYXJncy5mb3JjZSB9KTtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJub0NyZWF0ZVNvdXJjZVwiLCB7IG5vQ3JlYXRlU291cmNlOiBhcmdzLm5vQ3JlYXRlU291cmNlIH0pO1xuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyZVJ1bihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBtZXRhLCBhcmdzLmZvcmNlLCBhcmdzLm5vQ3JlYXRlU291cmNlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNvbmZpZ3VyZVJ1bihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZywgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIG1ldGE6IEVuZ2luZVZhcmlhYmxlc01ldGEsIGZvcmNlOiBib29sZWFuLCBub0NyZWF0ZVNvdXJjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgc3VwZXIuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMubWV0YSA9IG1ldGE7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSA9IGZvcmNlO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMubm9DcmVhdGVTb3VyY2UgPSBub0NyZWF0ZVNvdXJjZTtcblxuICAgICAgICB0aGlzLmFkZFBpcGVsaW5lUHJlKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hZGRQaXBlbGluZUR5bmFtaWMoKTtcblxuICAgICAgICB0aGlzLmFkZFBpcGVsaW5lUG9zdCgpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRQaXBlbGluZVByZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJvdXRwdXREaXJlY3RvcnlcIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInNjYWZmb2xkXCIsIFwiYXBwU2NhZmZvbGRcIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInNjYWZmb2xkXCIsIFwidW5pdFRlc3RTY2FmZm9sZFwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJlMmVUZXN0U2NhZmZvbGRcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRQaXBlbGluZUR5bmFtaWMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBhd2FpdCBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVDYXRlZ29yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNbaV0gIT09IFwic2NhZmZvbGRcIiAmJiBjYXRlZ29yaWVzW2ldICE9PSBcInVuaXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUNhdGVnb3J5SXRlbXModGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgY2F0ZWdvcmllc1tpXSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoY2F0ZWdvcmllc1tpXSwgaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFBpcGVsaW5lUG9zdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25EaXJlY3Rvcmllc1wiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcbiAgICB9XG59XG4iXX0=
