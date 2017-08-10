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
 * Pipeline step to generate WebdriverIO configuration.
 */
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const webdriverIoConfiguration_1 = require("../../configuration/models/webdriverIo/webdriverIoConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class WebdriverIo extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webdriverio",
                "wdio-spec-reporter",
                "wdio-allure-reporter",
                "browser-sync",
                "selenium-standalone",
                "allure-commandline"], uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.toggleDevDependency(["wdio-jasmine-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint");
            engineVariables.lintPlugins.webdriverio = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";
            engineVariables.lintEnv["webdriverio/wdio"] = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";
            if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${WebdriverIo.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, WebdriverIo.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${WebdriverIo.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        const webdriverConfiguration = new webdriverIoConfiguration_1.WebdriverIoConfiguration();
        webdriverConfiguration.baseUrl = "http://localhost:9000";
        webdriverConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        webdriverConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        webdriverConfiguration.sync = false;
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            webdriverConfiguration.framework = "jasmine";
        }
        else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            webdriverConfiguration.framework = "mocha";
        }
        webdriverConfiguration.reporters = ["spec", "allure"];
        webdriverConfiguration.reporterOptions = {
            allure: {
                outputDir: `${reportsFolder}/e2etemp/`
            }
        };
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(webdriverConfiguration)}`);
        lines.push("exports.config.before = () => {");
        const keys = Object.keys(engineVariables.e2ePlugins);
        keys.forEach(plugin => {
            if (engineVariables.e2ePlugins[plugin]) {
                const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${plugin}/index.js`)));
                lines.push(`    require('${pluginPath}')();`);
            }
        });
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
WebdriverIo.FILENAME = "wdio.conf.js";
exports.WebdriverIo = WebdriverIo;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsMEVBQXVFO0FBSXZFLDhHQUEyRztBQUMzRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWE7Z0JBQ2Qsb0JBQW9CO2dCQUNwQixzQkFBc0I7Z0JBQ3RCLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixvQkFBb0IsQ0FBQyxFQUNyQixrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUM7WUFFeEYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQ3pLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMxSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXRLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7WUFFakssZUFBZSxDQUFDLFdBQVcsQ0FB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eEQsQ0FBQzs7QUFwRmMsb0JBQVEsR0FBVyxjQUFjLENBQUM7QUFEckQsa0NBc0ZDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci93ZWJkcml2ZXJJby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBXZWJkcml2ZXJJTyBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJJby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJkcml2ZXJJbyBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIndkaW8uY29uZi5qc1wiO1xuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2ViZHJpdmVyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLXNwZWMtcmVwb3J0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLWFsbHVyZS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJyb3dzZXItc3luY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVuaXVtLXN0YW5kYWxvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGx1cmUtY29tbWFuZGxpbmVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIndkaW8tamFzbWluZS1mcmFtZXdvcmtcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2Rpby1tb2NoYS1mcmFtZXdvcmtcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPT09IFwiTW9jaGEtQ2hhaVwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL3dlYmRyaXZlcmlvXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJXZWJkcml2ZXJJT1wiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSA9PT0gXCJUeXBlU2NyaXB0XCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImVzbGludC1wbHVnaW4td2ViZHJpdmVyaW9cIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmxpbnRQbHVnaW5zLndlYmRyaXZlcmlvID0gdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyID09PSBcIkVTTGludFwiO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMubGludEVudltcIndlYmRyaXZlcmlvL3dkaW9cIl0gPSB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJXZWJkcml2ZXJJT1wiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPT09IFwiRVNMaW50XCI7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgV2ViZHJpdmVySW8uRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke1dlYmRyaXZlcklvLkZJTEVOQU1FfWApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlTGluZXMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFdlYmRyaXZlcklvLkZJTEVOQU1FLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7V2ViZHJpdmVySW8uRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtXZWJkcml2ZXJJby5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFdlYmRyaXZlcklvLkZJTEVOQU1FKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbGluZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cucmVwb3J0c0ZvbGRlcikpO1xuXG4gICAgICAgIGNvbnN0IHdlYmRyaXZlckNvbmZpZ3VyYXRpb24gPSBuZXcgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uKCk7XG4gICAgICAgIHdlYmRyaXZlckNvbmZpZ3VyYXRpb24uYmFzZVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo5MDAwXCI7XG4gICAgICAgIHdlYmRyaXZlckNvbmZpZ3VyYXRpb24uc3BlY3MgPSBbXG4gICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKVxuICAgICAgICBdO1xuICAgICAgICB3ZWJkcml2ZXJDb25maWd1cmF0aW9uLmNhcGFiaWxpdGllcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicm93c2VyTmFtZTogXCJjaHJvbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgICB3ZWJkcml2ZXJDb25maWd1cmF0aW9uLnN5bmMgPSBmYWxzZTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKSB7XG4gICAgICAgICAgICB3ZWJkcml2ZXJDb25maWd1cmF0aW9uLmZyYW1ld29yayA9IFwiamFzbWluZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrID09PSBcIk1vY2hhLUNoYWlcIikge1xuICAgICAgICAgICAgd2ViZHJpdmVyQ29uZmlndXJhdGlvbi5mcmFtZXdvcmsgPSBcIm1vY2hhXCI7XG4gICAgICAgIH1cbiAgICAgICAgd2ViZHJpdmVyQ29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzcGVjXCIsIFwiYWxsdXJlXCJdO1xuICAgICAgICB3ZWJkcml2ZXJDb25maWd1cmF0aW9uLnJlcG9ydGVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFsbHVyZToge1xuICAgICAgICAgICAgICAgIG91dHB1dERpcjogYCR7cmVwb3J0c0ZvbGRlcn0vZTJldGVtcC9gXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbGluZXMucHVzaChgZXhwb3J0cy5jb25maWcgPSAke0pzb25IZWxwZXIuY29kaWZ5KHdlYmRyaXZlckNvbmZpZ3VyYXRpb24pfWApO1xuICAgICAgICBsaW5lcy5wdXNoKFwiZXhwb3J0cy5jb25maWcuYmVmb3JlID0gKCkgPT4ge1wiKTtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGVuZ2luZVZhcmlhYmxlcy5lMmVQbHVnaW5zKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICAgICAgICBpZiAoZW5naW5lVmFyaWFibGVzLmUyZVBsdWdpbnNbcGx1Z2luXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBsdWdpblBhdGggPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7cGx1Z2lufS9pbmRleC5qc2ApKSk7XG5cbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGAgICAgcmVxdWlyZSgnJHtwbHVnaW5QYXRofScpKCk7YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgfVxufVxuIl19
