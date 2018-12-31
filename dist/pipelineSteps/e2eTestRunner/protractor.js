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
 * Pipeline step to generate Protractor configuration.
 */
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const protractorConfiguration_1 = require("../../configuration/models/protractor/protractorConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Protractor extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.e2eTestRunner, "Protractor");
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
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "webdriver-manager", "browser-sync"], mainCondition);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "protractor", true, mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileToggleLines: { get: () => super.fileToggleLines }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleLines.call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this.createConfig(); }));
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new protractorConfiguration_1.ProtractorConfiguration();
        defaultConfiguration.baseUrl = "http://localhost:9000";
        defaultConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eDist, "**/*.spec.js")))
        ];
        defaultConfiguration.capabilities = {
            browserName: "chrome",
            chromeOptions: {
                args: ["--headless", "--disable-gpu", "--no-sandbox"]
            }
        };
        defaultConfiguration.plugins = [];
        defaultConfiguration.localSeleniumStandaloneOpts = { jvmArgs: [] };
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._scriptStart = [];
        this._scriptEnd = [];
        engineVariables.setConfiguration("Protractor", this._configuration);
        engineVariables.setConfiguration("Protractor.ScriptStart", this._scriptStart);
        engineVariables.setConfiguration("Protractor.ScriptEnd", this._scriptEnd);
    }
    createConfig() {
        let lines = [];
        lines = lines.concat(this._scriptStart);
        lines.push("const fs = require('fs');");
        lines.push("const path = require('path');");
        lines.push("const webDriverPath = path.resolve('./node_modules/webdriver-manager/selenium/');");
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(this._configuration)};`);
        lines.push("const files = fs.readdirSync(webDriverPath);");
        lines.push("const jvmArgs = [];");
        lines.push("files.forEach(file => {");
        lines.push("    const lowerFile = file.toLowerCase();");
        lines.push("    if (lowerFile.substr(-3) !== \"zip\" && lowerFile.substr(-6) !== \"tar.gz\" && lowerFile.substr(-3) !== \"xml\" && lowerFile.substr(-4) !== \"json\") {");
        lines.push("        if (lowerFile.substr(0, 5) === \"gecko\") {");
        lines.push("            jvmArgs.push('-Dwebdriver.gecko.driver=' + path.join(webDriverPath, file));");
        lines.push("        } else if (lowerFile.substr(0, 6) === \"chrome\") {");
        lines.push("            jvmArgs.push('-Dwebdriver.chrome.driver=' + path.join(webDriverPath, file));");
        lines.push("        } else if (lowerFile.substr(0, 8) === \"iedriver\") {");
        lines.push("            jvmArgs.push('-Dwebdriver.ie.driver=' + path.join(webDriverPath, file));");
        lines.push("        } else if (lowerFile.substr(0, 18) === \"microsoftwebdriver\") {");
        lines.push("            jvmArgs.push('-Dwebdriver.edge.driver=' + path.join(webDriverPath, file));");
        lines.push("        }");
        lines.push("    }");
        lines.push("});");
        lines.push("exports.config.localSeleniumStandaloneOpts.jvmArgs = jvmArgs;");
        lines = lines.concat(this._scriptEnd);
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
        return lines;
    }
}
Protractor.FILENAME = "protractor.conf.js";
exports.Protractor = Protractor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBSTNFLDJHQUF3RztBQUd4RyxvRUFBaUU7QUFFakUsTUFBYSxVQUFXLFNBQVEsbUNBQWdCO0lBT3JDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDOUosSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7YUFDcEQ7WUFFRCxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFeEcsTUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXNCLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLElBQUksbUJBQW1CLEVBQUU7Z0JBQ3JCLDJCQUFZLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2FBQ3RGO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVB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QUFDO1FBQ3ZHLEtBQUssQ0FBQyxJQUFJLENBQUMsK0RBQStELENBQUMsQ0FBQztRQUM1RSxLQUFLLENBQUMsSUFBSSxDQUFDLHNGQUFzRixDQUFDLENBQUM7UUFDbkcsS0FBSyxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1FBQ3ZGLEtBQUssQ0FBQyxJQUFJLENBQUMsd0ZBQXdGLENBQUMsQ0FBQztRQUNyRyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7UUFDNUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7O0FBOUZ1QixtQkFBUSxHQUFXLG9CQUFvQixDQUFDO0FBRHBFLGdDQWdHQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBQcm90cmFjdG9yIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm90cmFjdG9yIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwicHJvdHJhY3Rvci5jb25mLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBQcm90cmFjdG9yQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9zY3JpcHRTdGFydDogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBfc2NyaXB0RW5kOiBzdHJpbmdbXTtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicHJvdHJhY3RvclwiLCBcIndlYmRyaXZlci1tYW5hZ2VyXCIsIFwiYnJvd3Nlci1zeW5jXCJdLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZW52LCBcInByb3RyYWN0b3JcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm90cmFjdG9yLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuY3JlYXRlQ29uZmlnKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFByb3RyYWN0b3JDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo5MDAwXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNwZWNzID0gW1xuICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlRGlzdCwgXCIqKi8qLnNwZWMuanNcIikpKVxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jYXBhYmlsaXRpZXMgPSB7XG4gICAgICAgICAgICBicm93c2VyTmFtZTogXCJjaHJvbWVcIixcbiAgICAgICAgICAgIGNocm9tZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBhcmdzOiBbXCItLWhlYWRsZXNzXCIsIFwiLS1kaXNhYmxlLWdwdVwiLCBcIi0tbm8tc2FuZGJveFwiXVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubG9jYWxTZWxlbml1bVN0YW5kYWxvbmVPcHRzID0geyBqdm1BcmdzOiBbXSB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHRoaXMuX3NjcmlwdFN0YXJ0ID0gW107XG4gICAgICAgIHRoaXMuX3NjcmlwdEVuZCA9IFtdO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiUHJvdHJhY3RvclwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdFN0YXJ0XCIsIHRoaXMuX3NjcmlwdFN0YXJ0KTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdEVuZFwiLCB0aGlzLl9zY3JpcHRFbmQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29uZmlnKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdCh0aGlzLl9zY3JpcHRTdGFydCk7XG5cbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IHdlYkRyaXZlclBhdGggPSBwYXRoLnJlc29sdmUoJy4vbm9kZV9tb2R1bGVzL3dlYmRyaXZlci1tYW5hZ2VyL3NlbGVuaXVtLycpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgZXhwb3J0cy5jb25maWcgPSAke0pzb25IZWxwZXIuY29kaWZ5KHRoaXMuX2NvbmZpZ3VyYXRpb24pfTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMod2ViRHJpdmVyUGF0aCk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3QganZtQXJncyA9IFtdO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImZpbGVzLmZvckVhY2goZmlsZSA9PiB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgIGNvbnN0IGxvd2VyRmlsZSA9IGZpbGUudG9Mb3dlckNhc2UoKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgaWYgKGxvd2VyRmlsZS5zdWJzdHIoLTMpICE9PSBcXFwiemlwXFxcIiAmJiBsb3dlckZpbGUuc3Vic3RyKC02KSAhPT0gXFxcInRhci5nelxcXCIgJiYgbG93ZXJGaWxlLnN1YnN0cigtMykgIT09IFxcXCJ4bWxcXFwiICYmIGxvd2VyRmlsZS5zdWJzdHIoLTQpICE9PSBcXFwianNvblxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIGlmIChsb3dlckZpbGUuc3Vic3RyKDAsIDUpID09PSBcXFwiZ2Vja29cXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICAgICAganZtQXJncy5wdXNoKCctRHdlYmRyaXZlci5nZWNrby5kcml2ZXI9JyArIHBhdGguam9pbih3ZWJEcml2ZXJQYXRoLCBmaWxlKSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9IGVsc2UgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgNikgPT09IFxcXCJjaHJvbWVcXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICAgICAganZtQXJncy5wdXNoKCctRHdlYmRyaXZlci5jaHJvbWUuZHJpdmVyPScgKyBwYXRoLmpvaW4od2ViRHJpdmVyUGF0aCwgZmlsZSkpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgfSBlbHNlIGlmIChsb3dlckZpbGUuc3Vic3RyKDAsIDgpID09PSBcXFwiaWVkcml2ZXJcXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICAgICAganZtQXJncy5wdXNoKCctRHdlYmRyaXZlci5pZS5kcml2ZXI9JyArIHBhdGguam9pbih3ZWJEcml2ZXJQYXRoLCBmaWxlKSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9IGVsc2UgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgMTgpID09PSBcXFwibWljcm9zb2Z0d2ViZHJpdmVyXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgICAgIGp2bUFyZ3MucHVzaCgnLUR3ZWJkcml2ZXIuZWRnZS5kcml2ZXI9JyArIHBhdGguam9pbih3ZWJEcml2ZXJQYXRoLCBmaWxlKSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgIH1cIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJ9KTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJleHBvcnRzLmNvbmZpZy5sb2NhbFNlbGVuaXVtU3RhbmRhbG9uZU9wdHMuanZtQXJncyA9IGp2bUFyZ3M7XCIpO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdCh0aGlzLl9zY3JpcHRFbmQpO1xuICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIvKiBcIiwgXCIgKi9cIikpO1xuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfVxufVxuIl19
