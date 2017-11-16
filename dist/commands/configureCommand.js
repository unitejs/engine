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
            let uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, "configure", args.profile, !!args.force);
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
            this._logger.info("");
            return this.configureRun(args.outputDirectory, uniteConfiguration, meta, args.force);
        });
    }
    configureRun(outputDirectory, uniteConfiguration, meta, force) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            _super("createEngineVariables").call(this, outputDirectory, uniteConfiguration, engineVariables);
            engineVariables.meta = meta;
            engineVariables.force = force;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUN6Rix5RkFBc0Y7QUFDdEYsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUM1RCx1RUFBb0U7QUFDcEUsdURBQW9EO0FBQ3BELCtEQUE0RDtBQUs1RCxzQkFBOEIsU0FBUSxxQ0FBaUI7SUFDdEMsR0FBRyxDQUFDLElBQTZCOztZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFFbEYsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1lBQ2xELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxNQUFNLElBQUksR0FBd0IsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDO1lBRTVELGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUVwRiw0RkFBNEY7WUFDNUYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLGtCQUFr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LENBQUMsS0FBSyxVQUFVLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVELE1BQU0sS0FBSyxHQUFHLE1BQU0saUNBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFdEgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUM1QyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGVBQWU7UUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7SUFDMUQsQ0FBQztDQUNKO0FBOU9ELDRDQThPQyIsImZpbGUiOiJjb21tYW5kcy9jb25maWd1cmVDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb25maWd1cmUgQ29tbWFuZFxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXNNZXRhIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNNZXRhXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lTG9jYXRvciB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVMb2NhdG9yXCI7XG5pbXBvcnQgeyBJQ29uZmlndXJlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lDb25maWd1cmVDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kUGFyYW1zXCI7XG5cbmV4cG9ydCBjbGFzcyBDb25maWd1cmVDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJRW5naW5lQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBhc3luYyBydW4oYXJnczogSUNvbmZpZ3VyZUNvbW1hbmRQYXJhbXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBhcmdzLmZvcmNlID0gYXJncy5mb3JjZSA9PT0gdW5kZWZpbmVkIHx8IGFyZ3MuZm9yY2UgPT09IG51bGwgPyBmYWxzZSA6IGFyZ3MuZm9yY2U7XG5cbiAgICAgICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIFwiY29uZmlndXJlXCIsIGFyZ3MucHJvZmlsZSwgISFhcmdzLmZvcmNlKTtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodW5pdGVDb25maWd1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ldGE6IEVuZ2luZVZhcmlhYmxlc01ldGEgPSBuZXcgRW5naW5lVmFyaWFibGVzTWV0YSgpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZSA9IGFyZ3MucGFja2FnZU5hbWUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lO1xuXG4gICAgICAgIC8vIHRpdGxlIGhhcyBtb3ZlZCB0byB1bml0ZS10aGVtZS5qc29uIGFuZCBpcyBub3cgb3B0aW9uYWwgc28gcmVtb3ZlIGZyb20gdW5pdGVDb25maWd1cmF0aW9uXG4gICAgICAgIG1ldGEudGl0bGUgPSBhcmdzLnRpdGxlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgZGVsZXRlIHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcblxuICAgICAgICBtZXRhLmRlc2NyaXB0aW9uID0gYXJncy5kZXNjcmlwdGlvbjtcbiAgICAgICAgbWV0YS5rZXl3b3JkcyA9IGFyZ3Mua2V5d29yZHM7XG4gICAgICAgIG1ldGEuc2hvcnROYW1lID0gYXJncy5zaG9ydE5hbWU7XG4gICAgICAgIG1ldGEuY29weXJpZ2h0ID0gYXJncy5jb3B5cmlnaHQ7XG4gICAgICAgIG1ldGEub3JnYW5pemF0aW9uID0gYXJncy5vcmdhbml6YXRpb247XG4gICAgICAgIG1ldGEud2ViU2l0ZSA9IGFyZ3Mud2ViU2l0ZTtcbiAgICAgICAgbWV0YS5hdXRob3IgPSBhcmdzLmF1dGhvcjtcbiAgICAgICAgbWV0YS5hdXRob3JFbWFpbCA9IGFyZ3MuYXV0aG9yRW1haWw7XG4gICAgICAgIG1ldGEuYXV0aG9yV2ViU2l0ZSA9IGFyZ3MuYXV0aG9yV2ViU2l0ZTtcbiAgICAgICAgbWV0YS5uYW1lc3BhY2UgPSBhcmdzLm5hbWVzcGFjZTtcblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSA9IGFyZ3MubGljZW5zZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID0gYXJncy5zb3VyY2VMYW5ndWFnZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2U7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID0gYXJncy5tb2R1bGVUeXBlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciA9IGFyZ3MuYnVuZGxlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID0gYXJncy51bml0VGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9IGFyZ3MudW5pdFRlc3RGcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUgPSBhcmdzLnVuaXRUZXN0RW5naW5lIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPSBhcmdzLmUyZVRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrID0gYXJncy5lMmVUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID0gYXJncy5saW50ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gYXJncy5wYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgfHwgXCJOcG1cIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyID0gYXJncy50YXNrTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zZXJ2ZXIgPSBhcmdzLnNlcnZlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uc2VydmVyO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uaWRlcyA9IGFyZ3MuaWRlcyB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uaWRlcyB8fCBbXTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gYXJncy5hcHBsaWNhdGlvbkZyYW1ld29yayB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcms7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSA9IGFyZ3MuY3NzUHJlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQb3N0ID0gYXJncy5jc3NQb3N0IHx8IHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQb3N0O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzTGludGVyID0gYXJncy5jc3NMaW50ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmNzc0xpbnRlciB8fCBcIk5vbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUV4dGVuc2lvbnMgPSBbXTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnZpZXdFeHRlbnNpb25zID0gW107XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLmRldiA9IHsgYnVuZGxlOiBmYWxzZSwgbWluaWZ5OiBmYWxzZSwgc291cmNlbWFwczogdHJ1ZSwgcHdhOiBmYWxzZSB9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMucHJvZCA9IHsgYnVuZGxlOiB0cnVlLCBtaW5pZnk6IHRydWUsIHNvdXJjZW1hcHM6IGZhbHNlLCBwd2E6IGZhbHNlIH07XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyB8fCB7IFdlYjoge30gfTtcblxuICAgICAgICBpZiAoYXJncy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByb2ZpbGVcIiwgeyBwcm9maWxlOiBhcmdzLnByb2ZpbGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tQYWNrYWdlTmFtZSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJsYW5ndWFnZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UpLCBcInNvdXJjZUxhbmd1YWdlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIpKSB7XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RFbmdpbmUgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdFJ1bm5lclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmspLCBcInVuaXRUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdEVuZ2luZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgvbm9uZS9pLnRlc3QodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIpKSB7XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgIT09IG51bGwgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcImUyZVRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIGUyZVRlc3RSdW5uZXIgaXMgTm9uZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcImUyZVRlc3RSdW5uZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayksIFwiZTJlVGVzdEZyYW1ld29ya1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghL25vbmUvaS50ZXN0KHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIpKSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJsaW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiY3NzUHJlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiY3NzUG9zdFwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIS9ub25lL2kudGVzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY3NzTGludGVyKSkge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiY3NzTGludGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NMaW50ZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwic2VydmVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5zZXJ2ZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidGFza01hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmspKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy50aXRsZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJ0aXRsZVwiLCB7IHRpdGxlOiBhcmdzLnRpdGxlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiZGVzY3JpcHRpb25cIiwgeyBkZXNjcmlwdGlvbjogYXJncy5kZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmtleXdvcmRzICYmIGFyZ3Mua2V5d29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJrZXl3b3Jkc1wiLCB7IGtleXdvcmRzOiBhcmdzLmtleXdvcmRzLmpvaW4oXCIsXCIpIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3Muc2hvcnROYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInNob3J0TmFtZVwiLCB7IHNob3J0TmFtZTogYXJncy5zaG9ydE5hbWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwib3JnYW5pemF0aW9uXCIsIHsgb3JnYW5pemF0aW9uOiBhcmdzLm9yZ2FuaXphdGlvbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLndlYlNpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwid2ViU2l0ZVwiLCB7IHdlYlNpdGU6IGFyZ3Mud2ViU2l0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmNvcHlyaWdodCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJjb3B5cmlnaHRcIiwgeyBjb3B5cmlnaHQ6IGFyZ3MuY29weXJpZ2h0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubmFtZXNwYWNlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIm5hbWVzcGFjZVwiLCB7IG5hbWVzcGFjZTogYXJncy5uYW1lc3BhY2UgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5hdXRob3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiYXV0aG9yXCIsIHsgYXV0aG9yOiBhcmdzLmF1dGhvciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmF1dGhvckVtYWlsKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImF1dGhvckVtYWlsXCIsIHsgYXV0aG9yRW1haWw6IGFyZ3MuYXV0aG9yRW1haWwgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5hdXRob3JXZWJTaXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImF1dGhvcldlYlNpdGVcIiwgeyBhdXRob3JXZWJTaXRlOiBhcmdzLmF1dGhvcldlYlNpdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcImZvcmNlXCIsIHsgZm9yY2U6IGFyZ3MuZm9yY2UgfSk7XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlUnVuKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIG1ldGEsIGFyZ3MuZm9yY2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY29uZmlndXJlUnVuKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgbWV0YTogRW5naW5lVmFyaWFibGVzTWV0YSwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHN1cGVyLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLm1ldGEgPSBtZXRhO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UgPSBmb3JjZTtcblxuICAgICAgICB0aGlzLmFkZFBpcGVsaW5lUHJlKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hZGRQaXBlbGluZUR5bmFtaWMoKTtcblxuICAgICAgICB0aGlzLmFkZFBpcGVsaW5lUG9zdCgpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRQaXBlbGluZVByZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJvdXRwdXREaXJlY3RvcnlcIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInNjYWZmb2xkXCIsIFwiYXBwU2NhZmZvbGRcIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInNjYWZmb2xkXCIsIFwidW5pdFRlc3RTY2FmZm9sZFwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJlMmVUZXN0U2NhZmZvbGRcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRQaXBlbGluZUR5bmFtaWMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBhd2FpdCBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVDYXRlZ29yaWVzKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNbaV0gIT09IFwic2NhZmZvbGRcIiAmJiBjYXRlZ29yaWVzW2ldICE9PSBcInVuaXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUNhdGVnb3J5SXRlbXModGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgY2F0ZWdvcmllc1tpXSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoY2F0ZWdvcmllc1tpXSwgaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFBpcGVsaW5lUG9zdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25EaXJlY3Rvcmllc1wiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcbiAgICB9XG59XG4iXX0=
