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
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            this.configDefaults(fileSystem, engineVariables);
            return 0;
        });
    }
    install(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "webdriver-manager", "browser-sync"], true);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "protractor", true, true);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileWriteLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME, engineVariables.force, () => __awaiter(this, void 0, void 0, function* () { return this.createConfig(); }));
        });
    }
    uninstall(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "webdriver-manager", "browser-sync"], false);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "protractor", true, false);
            }
            return yield _super("deleteFileLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME, engineVariables.force);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBSTNFLDJHQUF3RztBQUd4RyxvRUFBaUU7QUFFakUsZ0JBQXdCLFNBQVEsbUNBQWdCO0lBT3JDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEksSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFakQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRS9GLE1BQU0sbUJBQW1CLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFzQixRQUFRLENBQUMsQ0FBQztZQUM1RixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLDJCQUFZLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7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QVcsb0JBQW9CLENBQUM7QUFEM0QsZ0NBcUdDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci9wcm90cmFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIFByb3RyYWN0b3IgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFByb3RyYWN0b3IgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJwcm90cmFjdG9yLmNvbmYuanNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFByb3RyYWN0b3JDb25maWd1cmF0aW9uO1xuICAgIHByaXZhdGUgX3NjcmlwdFN0YXJ0OiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIF9zY3JpcHRFbmQ6IHN0cmluZ1tdO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKSA6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbnN0YWxsKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInByb3RyYWN0b3JcIiwgXCJ3ZWJkcml2ZXItbWFuYWdlclwiLCBcImJyb3dzZXItc3luY1wiXSwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgZXNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEVzTGludENvbmZpZ3VyYXRpb24+KFwiRVNMaW50XCIpO1xuICAgICAgICBpZiAoZXNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmVudiwgXCJwcm90cmFjdG9yXCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlV3JpdGVMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm90cmFjdG9yLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5jcmVhdGVDb25maWcoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHVuaW5zdGFsbChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwcm90cmFjdG9yXCIsIFwid2ViZHJpdmVyLW1hbmFnZXJcIiwgXCJicm93c2VyLXN5bmNcIl0sIGZhbHNlKTtcblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZW52LCBcInByb3RyYWN0b3JcIiwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGVMaW5lcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBQcm90cmFjdG9yLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFByb3RyYWN0b3JDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo5MDAwXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNwZWNzID0gW1xuICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdERpc3RGb2xkZXIsIFwiKiovKi5zcGVjLmpzXCIpKSlcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY2FwYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgYnJvd3Nlck5hbWU6IFwiY2hyb21lXCJcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmxvY2FsU2VsZW5pdW1TdGFuZGFsb25lT3B0cyA9IHsganZtQXJnczogW119O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHRoaXMuX3NjcmlwdFN0YXJ0ID0gW107XG4gICAgICAgIHRoaXMuX3NjcmlwdEVuZCA9IFtdO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiUHJvdHJhY3RvclwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdFN0YXJ0XCIsIHRoaXMuX3NjcmlwdFN0YXJ0KTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yLlNjcmlwdEVuZFwiLCB0aGlzLl9zY3JpcHRFbmQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29uZmlnKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdCh0aGlzLl9zY3JpcHRTdGFydCk7XG5cbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IHdlYkRyaXZlclBhdGggPSBwYXRoLnJlc29sdmUoJy4vbm9kZV9tb2R1bGVzL3dlYmRyaXZlci1tYW5hZ2VyL3NlbGVuaXVtLycpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgZXhwb3J0cy5jb25maWcgPSAke0pzb25IZWxwZXIuY29kaWZ5KHRoaXMuX2NvbmZpZ3VyYXRpb24pfTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoKHdlYkRyaXZlclBhdGgpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJjb25zdCBqdm1BcmdzID0gW107XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgY29uc3QgbG93ZXJGaWxlID0gZmlsZS50b0xvd2VyQ2FzZSgpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICBpZiAobG93ZXJGaWxlLnN1YnN0cigtMykgIT09IFxcXCJ6aXBcXFwiICYmIGxvd2VyRmlsZS5zdWJzdHIoLTYpICE9PSBcXFwidGFyLmd6XFxcIiAmJiBsb3dlckZpbGUuc3Vic3RyKC0zKSAhPT0gXFxcInhtbFxcXCIgJiYgbG93ZXJGaWxlLnN1YnN0cigtNCkgIT09IFxcXCJqc29uXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgNSkgPT09IFxcXCJnZWNrb1xcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmdlY2tvLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH0gZWxzZSBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCA2KSA9PT0gXFxcImNocm9tZVxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmNocm9tZS5kcml2ZXI9JyArIHBhdGguam9pbih3ZWJEcml2ZXJQYXRoLCBmaWxlKSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9IGVsc2UgaWYgKGxvd2VyRmlsZS5zdWJzdHIoMCwgOCkgPT09IFxcXCJpZWRyaXZlclxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmllLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH0gZWxzZSBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCAxOCkgPT09IFxcXCJtaWNyb3NvZnR3ZWJkcml2ZXJcXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICAgICAganZtQXJncy5wdXNoKCctRHdlYmRyaXZlci5lZGdlLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH1cIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgfVwiKTtcbiAgICAgICAgbGluZXMucHVzaChcIn0pO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImV4cG9ydHMuY29uZmlnLmxvY2FsU2VsZW5pdW1TdGFuZGFsb25lT3B0cy5qdm1BcmdzID0ganZtQXJncztcIik7XG4gICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KHRoaXMuX3NjcmlwdEVuZCk7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG59XG4iXX0=
