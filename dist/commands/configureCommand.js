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
const pipelineKey_1 = require("../engine/pipelineKey");
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
            uniteConfiguration.taskManager = "Gulp";
            uniteConfiguration.server = "BrowserSync";
            uniteConfiguration.applicationFramework = args.applicationFramework || uniteConfiguration.applicationFramework;
            uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
            uniteConfiguration.cssPre = args.cssPre || uniteConfiguration.cssPre;
            uniteConfiguration.cssPost = args.cssPost || uniteConfiguration.cssPost;
            uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
            uniteConfiguration.sourceExtensions = [];
            uniteConfiguration.viewExtensions = [];
            if (Object.keys(uniteConfiguration.buildConfigurations).length === 0) {
                uniteConfiguration.buildConfigurations.dev = { bundle: false, minify: false, sourcemaps: true, variables: {} };
                uniteConfiguration.buildConfigurations.prod = { bundle: true, minify: true, sourcemaps: false, variables: {} };
            }
            uniteConfiguration.platforms = uniteConfiguration.platforms || { Web: {} };
            if (args.profile) {
                this._logger.info("profile", { profile: args.profile });
            }
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
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("language", uniteConfiguration.sourceLanguage), "sourceLanguage"))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("bundler", uniteConfiguration.bundler)))) {
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
            if (uniteConfiguration.e2eTestRunner === "None") {
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
            if (uniteConfiguration.linter !== "None") {
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
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework)))) {
                return 1;
            }
            this._logger.info("force", { force: args.force });
            this._logger.info("");
            return this.configureRun(args.outputDirectory, uniteConfiguration, spdxLicense, args.force);
        });
    }
    configureRun(outputDirectory, uniteConfiguration, license, force) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            _super("createEngineVariables").call(this, outputDirectory, uniteConfiguration, engineVariables);
            engineVariables.force = force;
            engineVariables.license = license;
            this.addPipelinePre();
            yield this.addPipelineDynamic();
            this.addPipelinePost();
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.warning("You should probably run npm install / yarn install before running any gulp commands.");
                this._logger.banner("Successfully Completed.");
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
            const folders = yield this._fileSystem.directoryGetFolders(this._pipelineStepFolder);
            for (let i = 0; i < folders.length; i++) {
                if (folders[i] !== "scaffold" && folders[i] !== "unite") {
                    const fullFolder = this._fileSystem.pathCombine(this._pipelineStepFolder, folders[i]);
                    const files = yield this._fileSystem.directoryGetFiles(fullFolder);
                    files.filter(file => file.endsWith(".js")).forEach(file => {
                        this._pipeline.add(folders[i], file.replace(".js", ""));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUd6Rix5RkFBc0Y7QUFDdEYsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUM1RCx1REFBb0Q7QUFLcEQsc0JBQThCLFNBQVEscUNBQWlCO0lBQ3RDLEdBQUcsQ0FBQyxJQUE2Qjs7WUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUVsRixJQUFJLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNySCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7WUFDbEQsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUNwRixrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7WUFDbEUsa0JBQWtCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hFLGtCQUFrQixD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O0lBQzFELENBQUM7Q0FDSjtBQXpMRCw0Q0F5TEMiLCJmaWxlIjoiY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29uZmlndXJlIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgSVNwZHggfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeFwiO1xuaW1wb3J0IHsgSVNwZHhMaWNlbnNlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhMaWNlbnNlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IElDb25maWd1cmVDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUNvbmZpZ3VyZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRQYXJhbXNcIjtcblxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyZUNvbW1hbmQgZXh0ZW5kcyBFbmdpbmVDb21tYW5kQmFzZSBpbXBsZW1lbnRzIElFbmdpbmVDb21tYW5kPElFbmdpbmVDb21tYW5kUGFyYW1zPiB7XG4gICAgcHVibGljIGFzeW5jIHJ1bihhcmdzOiBJQ29uZmlndXJlQ29tbWFuZFBhcmFtcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGFyZ3MuZm9yY2UgPSBhcmdzLmZvcmNlID09PSB1bmRlZmluZWQgfHwgYXJncy5mb3JjZSA9PT0gbnVsbCA/IGZhbHNlIDogYXJncy5mb3JjZTtcblxuICAgICAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihhcmdzLm91dHB1dERpcmVjdG9yeSwgXCJjb25maWd1cmVcIiwgYXJncy5wcm9maWxlLCAhIWFyZ3MuZm9yY2UpO1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lID0gYXJncy5wYWNrYWdlTmFtZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZSA9IGFyZ3MudGl0bGUgfHwgdW5pdGVDb25maWd1cmF0aW9uLnRpdGxlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSA9IGFyZ3MubGljZW5zZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID0gYXJncy5zb3VyY2VMYW5ndWFnZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2U7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID0gYXJncy5tb2R1bGVUeXBlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciA9IGFyZ3MuYnVuZGxlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID0gYXJncy51bml0VGVzdFJ1bm5lciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9IGFyZ3MudW5pdFRlc3RGcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUgPSBhcmdzLnVuaXRUZXN0RW5naW5lIHx8IHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPSBhcmdzLmUyZVRlc3RSdW5uZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrID0gYXJncy5lMmVUZXN0RnJhbWV3b3JrIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID0gYXJncy5saW50ZXIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID0gYXJncy5wYWNrYWdlTWFuYWdlciB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIgfHwgXCJOcG1cIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyID0gXCJHdWxwXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zZXJ2ZXIgPSBcIkJyb3dzZXJTeW5jXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9IGFyZ3MuYXBwbGljYXRpb25GcmFtZXdvcmsgfHwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUgPSBhcmdzLmNzc1ByZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCA9IGFyZ3MuY3NzUG9zdCB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdDtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyB8fCB7fTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUV4dGVuc2lvbnMgPSBbXTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnZpZXdFeHRlbnNpb25zID0gW107XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zLmRldiA9IHsgYnVuZGxlOiBmYWxzZSwgbWluaWZ5OiBmYWxzZSwgc291cmNlbWFwczogdHJ1ZSwgdmFyaWFibGVzOiB7fSB9O1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMucHJvZCA9IHsgYnVuZGxlOiB0cnVlLCBtaW5pZnk6IHRydWUsIHNvdXJjZW1hcHM6IGZhbHNlLCB2YXJpYWJsZXM6IHt9IH07XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zID0gdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcyB8fCB7IFdlYjoge30gfTtcblxuICAgICAgICBpZiAoYXJncy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcInByb2ZpbGVcIiwgeyBwcm9maWxlOiBhcmdzLnByb2ZpbGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tQYWNrYWdlTmFtZSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLm5vdEVtcHR5KHRoaXMuX2xvZ2dlciwgXCJ0aXRsZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGR4TGljZW5zZTogSVNwZHhMaWNlbnNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGljZW5zZURhdGEgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxJU3BkeD4odGhpcy5fZW5naW5lQXNzZXRzRm9sZGVyLCBcInNwZHgtZnVsbC5qc29uXCIpO1xuICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8c3RyaW5nPih0aGlzLl9sb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobGljZW5zZURhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgcG9zc2libGUgU1BEWCBsaWNlbnNlIHZhbHVlcyAoc2VlIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvKS5cIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3BkeExpY2Vuc2UgPSBsaWNlbnNlRGF0YVt1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIHdhcyBhIHByb2JsZW0gcmVhZGluZyB0aGUgc3BkeC1mdWxsLmpzb24gZmlsZVwiLCBlKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwibGFuZ3VhZ2VcIiwgdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlKSwgXCJzb3VyY2VMYW5ndWFnZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwibW9kdWxlVHlwZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJidW5kbGVyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RGcmFtZXdvcmsgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lICE9PSBudWxsICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwidW5pdFRlc3RFbmdpbmUgaXMgbm90IHZhbGlkIGlmIHVuaXRUZXN0UnVubmVyIGlzIE5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdFJ1bm5lclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwidGVzdEZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmspLCBcInVuaXRUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdEVuZ2luZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayAhPT0gbnVsbCAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiZTJlVGVzdEZyYW1ld29yayBpcyBub3QgdmFsaWQgaWYgZTJlVGVzdFJ1bm5lciBpcyBOb25lXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiZTJlVGVzdFJ1bm5lclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrKSwgXCJlMmVUZXN0RnJhbWV3b3JrXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgIT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJsaW50ZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiY3NzUHJlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiY3NzUG9zdFwiLCB1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3BpcGVsaW5lLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJmb3JjZVwiLCB7IGZvcmNlOiBhcmdzLmZvcmNlIH0pO1xuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyZVJ1bihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBzcGR4TGljZW5zZSwgYXJncy5mb3JjZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjb25maWd1cmVSdW4ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBsaWNlbnNlOiBJU3BkeExpY2Vuc2UsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBzdXBlci5jcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSA9IGZvcmNlO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMubGljZW5zZSA9IGxpY2Vuc2U7XG5cbiAgICAgICAgdGhpcy5hZGRQaXBlbGluZVByZSgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuYWRkUGlwZWxpbmVEeW5hbWljKCk7XG5cbiAgICAgICAgdGhpcy5hZGRQaXBlbGluZVBvc3QoKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci53YXJuaW5nKFwiWW91IHNob3VsZCBwcm9iYWJseSBydW4gbnBtIGluc3RhbGwgLyB5YXJuIGluc3RhbGwgYmVmb3JlIHJ1bm5pbmcgYW55IGd1bHAgY29tbWFuZHMuXCIpO1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFBpcGVsaW5lUHJlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJzY2FmZm9sZFwiLCBcIm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJhcHBTY2FmZm9sZFwiKTtcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwic2NhZmZvbGRcIiwgXCJ1bml0VGVzdFNjYWZmb2xkXCIpO1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJzY2FmZm9sZFwiLCBcImUyZVRlc3RTY2FmZm9sZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZFBpcGVsaW5lRHluYW1pYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0Rm9sZGVycyh0aGlzLl9waXBlbGluZVN0ZXBGb2xkZXIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9sZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvbGRlcnNbaV0gIT09IFwic2NhZmZvbGRcIiAmJiBmb2xkZXJzW2ldICE9PSBcInVuaXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxsRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9waXBlbGluZVN0ZXBGb2xkZXIsIGZvbGRlcnNbaV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhmdWxsRm9sZGVyKTtcblxuICAgICAgICAgICAgICAgIGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuZW5kc1dpdGgoXCIuanNcIikpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChmb2xkZXJzW2ldLCBmaWxlLnJlcGxhY2UoXCIuanNcIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRQaXBlbGluZVBvc3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXNcIik7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG4gICAgfVxufVxuIl19
