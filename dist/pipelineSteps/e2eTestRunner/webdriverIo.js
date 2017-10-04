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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class WebdriverIo extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                this.configDefaults(fileSystem, engineVariables);
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webdriverio",
                "wdio-spec-reporter",
                "wdio-allure-reporter",
                "browser-sync",
                "selenium-standalone",
                "allure-commandline"], mainCondition);
            engineVariables.toggleDevDependency(["@types/webdriverio"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], mainCondition && _super("condition").call(this, uniteConfiguration.linter, "ESLint"));
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this.finaliseConfig(fileSystem, uniteConfiguration, engineVariables); }));
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
                browserName: "chrome",
                chromeOptions: {
                    args: ["headless", "disable-gpu"]
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFLM0UsOEdBQTJHO0FBRTNHLG9FQUFpRTtBQUVqRSxpQkFBeUIsU0FBUSxtQ0FBZ0I7SUFNdEMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzlKLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhO2dCQUNkLG9CQUFvQjtnQkFDcEIsc0JBQXNCO2dCQUN0QixjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsb0JBQW9CLENBQUMsRUFDckIsYUFBYSxDQUFDLENBQUM7WUFFbkQsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDdEIsYUFBYSxJQUFJLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFdkgsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsMkJBQTJCLENBQUMsRUFB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Q0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMzQixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDOUQsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEgsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsVUFBVSxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDOztBQWhHYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0FrR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3dlYmRyaXZlcklvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIFdlYmRyaXZlcklPIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9hcnJheUhlbHBlclwiO1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3dlYmRyaXZlcklvL3dlYmRyaXZlcklvQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFdlYmRyaXZlcklvIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwid2Rpby5jb25mLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBXZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb247XG4gICAgcHJpdmF0ZSBfcGx1Z2luczogc3RyaW5nW107XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpIDogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiV2ViZHJpdmVySU9cIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2ViZHJpdmVyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLXNwZWMtcmVwb3J0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZGlvLWFsbHVyZS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJyb3dzZXItc3luY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVuaXVtLXN0YW5kYWxvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGx1cmUtY29tbWFuZGxpbmVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIkB0eXBlcy93ZWJkcml2ZXJpb1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImVzbGludC1wbHVnaW4td2ViZHJpdmVyaW9cIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFwiRVNMaW50XCIpKTtcblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5wbHVnaW5zLCBcIndlYmRyaXZlcmlvXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmVudiwgXCJ3ZWJkcml2ZXJpby93ZGlvXCIsIHRydWUsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2ViZHJpdmVySW8uRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5maW5hbGlzZUNvbmZpZyhmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IHJlcG9ydHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cucmVwb3J0c0ZvbGRlcikpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhc2VVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMFwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zcGVjcyA9IFtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmUyZVRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNhcGFiaWxpdGllcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicm93c2VyTmFtZTogXCJjaHJvbWVcIixcbiAgICAgICAgICAgICAgICBjaHJvbWVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtcImhlYWRsZXNzXCIsIFwiZGlzYWJsZS1ncHVcIl1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnN5bmMgPSBmYWxzZTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzcGVjXCIsIFwiYWxsdXJlXCJdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlck9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhbGx1cmU6IHtcbiAgICAgICAgICAgICAgICBvdXRwdXREaXI6IGAke3JlcG9ydHNGb2xkZXJ9L2UyZXRlbXAvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB0aGlzLl9wbHVnaW5zID0gW107XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJXZWJkcml2ZXJJT1wiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJXZWJkcml2ZXJJTy5QbHVnaW5zXCIsIHRoaXMuX3BsdWdpbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluYWxpc2VDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGxpbmVzLnB1c2goYGV4cG9ydHMuY29uZmlnID0gJHtKc29uSGVscGVyLmNvZGlmeSh0aGlzLl9jb25maWd1cmF0aW9uKX1gKTtcbiAgICAgICAgbGluZXMucHVzaChcImV4cG9ydHMuY29uZmlnLmJlZm9yZSA9ICgpID0+IHtcIik7XG4gICAgICAgIHRoaXMuX3BsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZVxuICAgICAgICAgICAgICAgIChlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke3BsdWdpbn0vaW5kZXguanNgKSkpO1xuXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAgICAgcmVxdWlyZSgnJHtwbHVnaW5QYXRofScpKCk7YCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG59XG4iXX0=
