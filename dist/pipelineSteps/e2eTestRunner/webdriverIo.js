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
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const webdriverIoConfiguration_1 = require("../../configuration/models/webdriverIo/webdriverIoConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class WebdriverIo extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO")) {
                this.configDefaults(fileSystem, engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webdriverio",
                "wdio-spec-reporter",
                "wdio-allure-reporter",
                "browser-sync",
                "selenium-standalone",
                "allure-commandline"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
            engineVariables.toggleDevDependency(["@types/webdriverio"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO") && _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO") && _super("condition").call(this, uniteConfiguration.linter, "ESLint"));
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
            }
            if (_super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO")) {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME);
                    if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                        logger.info(`Generating ${WebdriverIo.FILENAME}`);
                        const lines = this.finaliseConfig(fileSystem, uniteConfiguration, engineVariables);
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
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME, engineVariables.force);
            }
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new webdriverIoConfiguration_1.WebdriverIoConfiguration();
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        defaultConfiguration.baseUrl = "http://localhost:9000";
        defaultConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        defaultConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        defaultConfiguration.sync = false;
        defaultConfiguration.reporters = ["spec", "allure"];
        defaultConfiguration.reporterOptions = {
            allure: {
                outputDir: `${reportsFolder}/e2etemp/`
            }
        };
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._plugins = [];
        engineVariables.setConfiguration("WebdriverIO", this._configuration);
        engineVariables.setConfiguration("WebdriverIO.Plugins", this._plugins);
    }
    finaliseConfig(fileSystem, uniteConfiguration, engineVariables) {
        const lines = [];
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(this._configuration)}`);
        lines.push("exports.config.before = () => {");
        this._plugins.forEach(plugin => {
            const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${plugin}/index.js`)));
            lines.push(`    require('${pluginPath}')();`);
        });
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
        return lines;
    }
}
WebdriverIo.FILENAME = "wdio.conf.js";
exports.WebdriverIo = WebdriverIo;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFLM0UsOEdBQTJHO0FBQzNHLGdGQUE2RTtBQUc3RSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFNdEMsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEksRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWE7Z0JBQ2Qsb0JBQW9CO2dCQUNwQixzQkFBc0I7Z0JBQ3RCLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixvQkFBb0IsQ0FBQyxFQUNyQixtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsQ0FBQztZQUV0RyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN0QixtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLEtBQUssbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUUxSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFF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RUFBRSxHQUFHLE1BQU0sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXRILEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLFVBQVUsT0FBTyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUFuR2Msb0JBQVEsR0FBVyxjQUFjLENBQUM7QUFEckQsa0NBcUdDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci93ZWJkcml2ZXJJby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBXZWJkcml2ZXJJTyBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJJby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJkcml2ZXJJbyBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIndkaW8uY29uZi5qc1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogV2ViZHJpdmVySW9Db25maWd1cmF0aW9uO1xuICAgIHByaXZhdGUgX3BsdWdpbnM6IHN0cmluZ1tdO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSkge1xuICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2ViZHJpdmVyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLXNwZWMtcmVwb3J0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLWFsbHVyZS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJyb3dzZXItc3luY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVuaXVtLXN0YW5kYWxvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGx1cmUtY29tbWFuZGxpbmVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL3dlYmRyaXZlcmlvXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiV2ViZHJpdmVySU9cIikgJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJUeXBlU2NyaXB0XCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJlc2xpbnQtcGx1Z2luLXdlYmRyaXZlcmlvXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiV2ViZHJpdmVySU9cIikgJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFwiRVNMaW50XCIpKTtcblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5wbHVnaW5zLCBcIndlYmRyaXZlcmlvXCIsIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSk7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZW52LCBcIndlYmRyaXZlcmlvL3dkaW9cIiwgdHJ1ZSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIldlYmRyaXZlcklPXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiV2ViZHJpdmVySU9cIikpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgV2ViZHJpdmVySW8uRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJGaWxlTm90RXhpc3RcIiB8fCBoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7V2ViZHJpdmVySW8uRklMRU5BTUV9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gdGhpcy5maW5hbGlzZUNvbmZpZyhmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlTGluZXMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFdlYmRyaXZlcklvLkZJTEVOQU1FLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7V2ViZHJpdmVySW8uRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtXZWJkcml2ZXJJby5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFdlYmRyaXZlcklvLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo5MDAwXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNwZWNzID0gW1xuICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdERpc3RGb2xkZXIsIFwiKiovKi5zcGVjLmpzXCIpKSlcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY2FwYWJpbGl0aWVzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyb3dzZXJOYW1lOiBcImNocm9tZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnN5bmMgPSBmYWxzZTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzcGVjXCIsIFwiYWxsdXJlXCJdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlck9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhbGx1cmU6IHtcbiAgICAgICAgICAgICAgICBvdXRwdXREaXI6IGAke3JlcG9ydHNGb2xkZXJ9L2UyZXRlbXAvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB0aGlzLl9wbHVnaW5zID0gW107XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJXZWJkcml2ZXJJT1wiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJXZWJkcml2ZXJJTy5QbHVnaW5zXCIsIHRoaXMuX3BsdWdpbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluYWxpc2VDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGxpbmVzLnB1c2goYGV4cG9ydHMuY29uZmlnID0gJHtKc29uSGVscGVyLmNvZGlmeSh0aGlzLl9jb25maWd1cmF0aW9uKX1gKTtcbiAgICAgICAgbGluZXMucHVzaChcImV4cG9ydHMuY29uZmlnLmJlZm9yZSA9ICgpID0+IHtcIik7XG4gICAgICAgIHRoaXMuX3BsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZVxuICAgICAgICAgICAgICAgIChlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke3BsdWdpbn0vaW5kZXguanNgKSkpO1xuXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAgICAgcmVxdWlyZSgnJHtwbHVnaW5QYXRofScpKCk7YCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG59XG4iXX0=
