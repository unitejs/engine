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
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Protractor extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson"),
            new pipelineKey_1.PipelineKey("linter", "esLint")
        ];
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor")) {
                this.configDefaults(fileSystem, engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "webdriver-manager", "browser-sync"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor"));
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "protractor", true, _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor"));
            }
            if (_super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor")) {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
                    if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                        logger.info(`Generating ${Protractor.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = this.createConfig();
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Protractor.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Protractor.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Protractor.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME, engineVariables.force);
            }
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new protractorConfiguration_1.ProtractorConfiguration();
        defaultConfiguration.baseUrl = "http://localhost:9000";
        defaultConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        defaultConfiguration.capabilities = {
            browserName: "chrome"
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
        lines.push("const files = fs.readdirSync((webDriverPath));");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBSTNFLDJHQUF3RztBQUd4RywwREFBdUQ7QUFDdkQsb0VBQWlFO0FBRWpFLGdCQUF3QixTQUFRLG1DQUFnQjtJQU9yQyxVQUFVO1FBQ2IsTUFBTSxDQUFDO1lBQ0gsSUFBSSx5QkFBVyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQztZQUNsRCxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztZQUN6QyxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztTQUN0QyxDQUFDO0lBQ04sQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RJLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFFMUosTUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXNCLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FB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SUFBSSxDQUFDLHNGQUFzRixDQUFDLENBQUM7UUFDbkcsS0FBSyxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1FBQ3ZGLEtBQUssQ0FBQyxJQUFJLENBQUMsd0ZBQXdGLENBQUMsQ0FBQztRQUNyRyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7UUFDNUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUF6R2MsbUJBQVEsR0FBVyxvQkFBb0IsQ0FBQztBQUQzRCxnQ0EyR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3Byb3RyYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgUHJvdHJhY3RvciBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm90cmFjdG9yIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwicHJvdHJhY3Rvci5jb25mLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBQcm90cmFjdG9yQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9zY3JpcHRTdGFydDogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBfc2NyaXB0RW5kOiBzdHJpbmdbXTtcblxuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwibGludGVyXCIsIFwiZXNMaW50XCIpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwcm90cmFjdG9yXCIsIFwid2ViZHJpdmVyLW1hbmFnZXJcIiwgXCJicm93c2VyLXN5bmNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpKTtcblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZW52LCBcInByb3RyYWN0b3JcIiwgdHJ1ZSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHN1cGVyLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFByb3RyYWN0b3IuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJGaWxlTm90RXhpc3RcIiB8fCBoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7UHJvdHJhY3Rvci5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gdGhpcy5jcmVhdGVDb25maWcoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUHJvdHJhY3Rvci5GSUxFTkFNRSwgbGluZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke1Byb3RyYWN0b3IuRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtQcm90cmFjdG9yLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUHJvdHJhY3Rvci5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFByb3RyYWN0b3JDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo5MDAwXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNwZWNzID0gW1xuICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdERpc3RGb2xkZXIsIFwiKiovKi5zcGVjLmpzXCIpKSlcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY2FwYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgYnJvd3Nlck5hbWU6IFwiY2hyb21lXCJcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmxvY2FsU2VsZW5pdW1TdGFuZGFsb25lT3B0cyA9IHsganZtQXJnczogW119O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHRoaXMuX3NjcmlwdFN0YXJ0ID0gW107XG4gICAgICAgIHRoaXMuX3NjcmlwdEVuZCA9IFtdO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiUHJvdHJhY3RvclwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdFN0YXJ0XCIsIHRoaXMuX3NjcmlwdFN0YXJ0KTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdEVuZFwiLCB0aGlzLl9zY3JpcHRFbmQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29uZmlnKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdCh0aGlzLl9zY3JpcHRTdGFydCk7XG5cbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IHdlYkRyaXZlclBhdGggPSBwYXRoLnJlc29sdmUoJy4vbm9kZV9tb2R1bGVzL3dlYmRyaXZlci1tYW5hZ2VyL3NlbGVuaXVtLycpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgZXhwb3J0cy5jb25maWcgPSAke0pzb25IZWxwZXIuY29kaWZ5KHRoaXMuX2NvbmZpZ3VyYXRpb24pfTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoKHdlYkRyaXZlclBhdGgpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJjb25zdCBqdm1BcmdzID0gW107XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgY29uc3QgbG93ZXJGaWxlID0gZmlsZS50b0xvd2VyQ2FzZSgpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICBpZiAobG93ZXJGaWxlLnN1YnN0cigtMykgIT09IFxcXCJ6aXBcXFwiICYmIGxvd2VyRmlsZS5zdWJzdHIoLTYpICE9PSBcXFwidGFyLmd6XFxcIiAmJiBsb3dlckZpbGUuc3Vic3RyKC0zKSAhPT0gXFxcInhtbFxcXCIgJiYgbG93ZXJGaWxlLnN1YnN0cigtNCkgIT09IFxcXCJqc29uXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgNSkgPT09IFxcXCJnZWNrb1xcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmdlY2tvLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH0gZWxzZSBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCA2KSA9PT0gXFxcImNocm9tZVxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmNocm9tZS5kcml2ZXI9JyArIHBhdGguam9pbih3ZWJEcml2ZXJQYXRoLCBmaWxlKSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9IGVsc2UgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgOCkgPT09IFxcXCJpZWRyaXZlclxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmllLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH0gZWxzZSBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCAxOCkgPT09IFxcXCJtaWNyb3NvZnR3ZWJkcml2ZXJcXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICAgICAganZtQXJncy5wdXNoKCctRHdlYmRyaXZlci5lZGdlLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH1cIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgfVwiKTtcbiAgICAgICAgbGluZXMucHVzaChcIn0pO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImV4cG9ydHMuY29uZmlnLmxvY2FsU2VsZW5pdW1TdGFuZGFsb25lT3B0cy5qdm1BcmdzID0ganZtQXJncztcIik7XG4gICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KHRoaXMuX3NjcmlwdEVuZCk7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG59XG4iXX0=
