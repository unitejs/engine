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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Protractor extends enginePipelineStepBase_1.EnginePipelineStepBase {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBSTNFLDJHQUF3RztBQUV4RyxnRkFBNkU7QUFHN0UsZ0JBQXdCLFNBQVEsK0NBQXNCO0lBT3JDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RJLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFFMUosTUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXNCLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsMkJBQVksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDekksQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlB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QUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7UUFDNUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUFqR2MsbUJBQVEsR0FBVyxvQkFBb0IsQ0FBQztBQUQzRCxnQ0FtR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3Byb3RyYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgUHJvdHJhY3RvciBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgUHJvdHJhY3RvciBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInByb3RyYWN0b3IuY29uZi5qc1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogUHJvdHJhY3RvckNvbmZpZ3VyYXRpb247XG4gICAgcHJpdmF0ZSBfc2NyaXB0U3RhcnQ6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3NjcmlwdEVuZDogc3RyaW5nW107XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInByb3RyYWN0b3JcIiwgXCJ3ZWJkcml2ZXItbWFuYWdlclwiLCBcImJyb3dzZXItc3luY1wiXSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpO1xuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5lbnYsIFwicHJvdHJhY3RvclwiLCB0cnVlLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiUHJvdHJhY3RvclwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUHJvdHJhY3Rvci5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtQcm90cmFjdG9yLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSB0aGlzLmNyZWF0ZUNvbmZpZygpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBQcm90cmFjdG9yLkZJTEVOQU1FLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7UHJvdHJhY3Rvci5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke1Byb3RyYWN0b3IuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBQcm90cmFjdG9yLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgUHJvdHJhY3RvckNvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjkwMDBcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc3BlY3MgPSBbXG4gICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKVxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jYXBhYmlsaXRpZXMgPSB7XG4gICAgICAgICAgICBicm93c2VyTmFtZTogXCJjaHJvbWVcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubG9jYWxTZWxlbml1bVN0YW5kYWxvbmVPcHRzID0geyBqdm1BcmdzOiBbXX07XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5fc2NyaXB0U3RhcnQgPSBbXTtcbiAgICAgICAgdGhpcy5fc2NyaXB0RW5kID0gW107XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQcm90cmFjdG9yXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIlByb3RyYWN0b3IuU2NyaXB0U3RhcnRcIiwgdGhpcy5fc2NyaXB0U3RhcnQpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIlByb3RyYWN0b3IuU2NyaXB0RW5kXCIsIHRoaXMuX3NjcmlwdEVuZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDb25maWcoKTogc3RyaW5nW10ge1xuICAgICAgICBsZXQgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KHRoaXMuX3NjcmlwdFN0YXJ0KTtcblxuICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3Qgd2ViRHJpdmVyUGF0aCA9IHBhdGgucmVzb2x2ZSgnLi9ub2RlX21vZHVsZXMvd2ViZHJpdmVyLW1hbmFnZXIvc2VsZW5pdW0vJyk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKGBleHBvcnRzLmNvbmZpZyA9ICR7SnNvbkhlbHBlci5jb2RpZnkodGhpcy5fY29uZmlndXJhdGlvbil9O2ApO1xuICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYygod2ViRHJpdmVyUGF0aCkpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcImNvbnN0IGp2bUFyZ3MgPSBbXTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCJmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICBjb25zdCBsb3dlckZpbGUgPSBmaWxlLnRvTG93ZXJDYXNlKCk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgIGlmIChsb3dlckZpbGUuc3Vic3RyKC0zKSAhPT0gXFxcInppcFxcXCIgJiYgbG93ZXJGaWxlLnN1YnN0cigtNikgIT09IFxcXCJ0YXIuZ3pcXFwiICYmIGxvd2VyRmlsZS5zdWJzdHIoLTMpICE9PSBcXFwieG1sXFxcIiAmJiBsb3dlckZpbGUuc3Vic3RyKC00KSAhPT0gXFxcImpzb25cXFwiKSB7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCA1KSA9PT0gXFxcImdlY2tvXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgICAgIGp2bUFyZ3MucHVzaCgnLUR3ZWJkcml2ZXIuZ2Vja28uZHJpdmVyPScgKyBwYXRoLmpvaW4od2ViRHJpdmVyUGF0aCwgZmlsZSkpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgfSBlbHNlIGlmIChsb3dlckZpbGUuc3Vic3RyKDAsIDYpID09PSBcXFwiY2hyb21lXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgICAgIGp2bUFyZ3MucHVzaCgnLUR3ZWJkcml2ZXIuY2hyb21lLmRyaXZlcj0nICsgcGF0aC5qb2luKHdlYkRyaXZlclBhdGgsIGZpbGUpKTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIH0gZWxzZSBpZiAobG93ZXJGaWxlLnN1YnN0cigwLCA4KSA9PT0gXFxcImllZHJpdmVyXFxcIikge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgICAgIGp2bUFyZ3MucHVzaCgnLUR3ZWJkcml2ZXIuaWUuZHJpdmVyPScgKyBwYXRoLmpvaW4od2ViRHJpdmVyUGF0aCwgZmlsZSkpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgfSBlbHNlIGlmIChsb3dlckZpbGUuc3Vic3RyKDAsIDE4KSA9PT0gXFxcIm1pY3Jvc29mdHdlYmRyaXZlclxcXCIpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBqdm1BcmdzLnB1c2goJy1Ed2ViZHJpdmVyLmVkZ2UuZHJpdmVyPScgKyBwYXRoLmpvaW4od2ViRHJpdmVyUGF0aCwgZmlsZSkpO1wiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgfVwiKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICB9XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwifSk7XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiZXhwb3J0cy5jb25maWcubG9jYWxTZWxlbml1bVN0YW5kYWxvbmVPcHRzLmp2bUFyZ3MgPSBqdm1BcmdzO1wiKTtcbiAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQodGhpcy5fc2NyaXB0RW5kKTtcbiAgICAgICAgbGluZXMucHVzaChzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiLyogXCIsIFwiICovXCIpKTtcbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbn1cbiJdfQ==
