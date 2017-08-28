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
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
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
                "allure-commandline"], uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.toggleDevDependency(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint");
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", uniteConfiguration.e2eTestRunner === "WebdriverIO");
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, uniteConfiguration.e2eTestRunner === "WebdriverIO");
            }
            if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFLM0UsOEdBQTJHO0FBQzNHLGdGQUE2RTtBQUc3RSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFNdEMsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUN0SSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhO2dCQUNkLG9CQUFvQjtnQkFDcEIsc0JBQXNCO2dCQUN0QixjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsb0JBQW9CLENBQUMsRUFDckIsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxDQUFDO1lBRXhGLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFdEssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsMkJBQTJCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUVqSyxNQUFNLG1CQUFtQixH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QUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDOztBQWxHYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0FvR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3dlYmRyaXZlcklvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIFdlYmRyaXZlcklPIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9hcnJheUhlbHBlclwiO1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3dlYmRyaXZlcklvL3dlYmRyaXZlcklvQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYmRyaXZlcklvIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwid2Rpby5jb25mLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBXZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb247XG4gICAgcHJpdmF0ZSBfcGx1Z2luczogc3RyaW5nW107XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIikge1xuICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2ViZHJpdmVyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLXNwZWMtcmVwb3J0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLWFsbHVyZS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJyb3dzZXItc3luY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVuaXVtLXN0YW5kYWxvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGx1cmUtY29tbWFuZGxpbmVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIkB0eXBlcy93ZWJkcml2ZXJpb1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPT09IFwiVHlwZVNjcmlwdFwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJlc2xpbnQtcGx1Z2luLXdlYmRyaXZlcmlvXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJXZWJkcml2ZXJJT1wiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIgPT09IFwiRVNMaW50XCIpO1xuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLnBsdWdpbnMsIFwid2ViZHJpdmVyaW9cIiwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZW52LCBcIndlYmRyaXZlcmlvL3dkaW9cIiwgdHJ1ZSwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBXZWJkcml2ZXJJby5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtXZWJkcml2ZXJJby5GSUxFTkFNRX1gKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSB0aGlzLmZpbmFsaXNlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgV2ViZHJpdmVySW8uRklMRU5BTUUsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtXZWJkcml2ZXJJby5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke1dlYmRyaXZlcklvLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgV2ViZHJpdmVySW8uRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBXZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHNGb2xkZXIpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjkwMDBcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc3BlY3MgPSBbXG4gICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKVxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jYXBhYmlsaXRpZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJvd3Nlck5hbWU6IFwiY2hyb21lXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc3luYyA9IGZhbHNlO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlcG9ydGVycyA9IFtcInNwZWNcIiwgXCJhbGx1cmVcIl07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlcG9ydGVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFsbHVyZToge1xuICAgICAgICAgICAgICAgIG91dHB1dERpcjogYCR7cmVwb3J0c0ZvbGRlcn0vZTJldGVtcC9gXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3BsdWdpbnMgPSBbXTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIldlYmRyaXZlcklPXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIldlYmRyaXZlcklPLlBsdWdpbnNcIiwgdGhpcy5fcGx1Z2lucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5hbGlzZUNvbmZpZyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgbGluZXMucHVzaChgZXhwb3J0cy5jb25maWcgPSAke0pzb25IZWxwZXIuY29kaWZ5KHRoaXMuX2NvbmZpZ3VyYXRpb24pfWApO1xuICAgICAgICBsaW5lcy5wdXNoKFwiZXhwb3J0cy5jb25maWcuYmVmb3JlID0gKCkgPT4ge1wiKTtcbiAgICAgICAgdGhpcy5fcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbHVnaW5QYXRoID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlXG4gICAgICAgICAgICAgICAgKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7cGx1Z2lufS9pbmRleC5qc2ApKSk7XG5cbiAgICAgICAgICAgIGxpbmVzLnB1c2goYCAgICByZXF1aXJlKCcke3BsdWdpblBhdGh9JykoKTtgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpbmVzLnB1c2goXCJ9O1wiKTtcbiAgICAgICAgbGluZXMucHVzaChzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiLyogXCIsIFwiICovXCIpKTtcbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbn1cbiJdfQ==
