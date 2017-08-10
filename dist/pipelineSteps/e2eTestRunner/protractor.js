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
const protractorConfiguration_1 = require("../../configuration/models/protractor/protractorConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Protractor extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.lintEnv.protractor = uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.linter === "ESLint";
            if (uniteConfiguration.e2eTestRunner === "Protractor") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Protractor.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
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
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        const protractorConfiguration = new protractorConfiguration_1.ProtractorConfiguration();
        protractorConfiguration.baseUrl = "http://localhost:9000";
        protractorConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        protractorConfiguration.capabilities = {
            browserName: "chrome"
        };
        protractorConfiguration.plugins = [];
        for (const key in engineVariables.e2ePlugins) {
            const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, key)));
            if (engineVariables.e2ePlugins[key]) {
                let exists = false;
                protractorConfiguration.plugins.forEach(plugin => {
                    if (plugin.path === pluginPath) {
                        exists = true;
                    }
                });
                if (!exists) {
                    protractorConfiguration.plugins.push({ path: pluginPath });
                }
            }
            else {
                protractorConfiguration.plugins.forEach((plugin, index) => {
                    if (plugin.path === pluginPath) {
                        protractorConfiguration.plugins.splice(index, 1);
                    }
                });
            }
        }
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
            lines.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");
            protractorConfiguration.framework = "jasmine";
            protractorConfiguration.jasmineNodeOpts = {
                showColors: true
            };
        }
        else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            protractorConfiguration.framework = "mocha";
            protractorConfiguration.mochaOpts = {
                reporter: "mochawesome-screenshots",
                reporterOptions: {
                    reportDir: `${reportsFolder}/e2e/`,
                    reportName: "index",
                    takePassedScreenshot: true
                },
                timeout: 10000
            };
        }
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(protractorConfiguration)};`);
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("exports.config.onPrepare = () => {");
            lines.push("    jasmine.getEnv().clearReporters();");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new Jasmine2HtmlReporter({");
            lines.push(`            savePath: '${reportsFolder}/e2e/',`);
            lines.push("            fileName: 'index'");
            lines.push("        })");
            lines.push("    );");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new SpecReporter({");
            lines.push("            displayStacktrace: 'all'");
            lines.push("        })");
            lines.push("    );");
            lines.push("};");
        }
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Protractor.FILENAME = "protractor.conf.js";
exports.Protractor = Protractor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFHdkUsMkdBQXdHO0FBRXhHLGdGQUE2RTtBQUc3RSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFHckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUN2SCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQ0FBbUMsRUFBRSx1QkFBdUIsQ0FBQyxFQUM5RCxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQzVJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUU1SyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUM7WUFFakksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQztvQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUU5SCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FB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QUFRLEdBQVcsb0JBQW9CLENBQUM7QUFEM0QsZ0NBZ0hDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci9wcm90cmFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIFByb3RyYWN0b3IgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgUHJvdHJhY3RvciBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInByb3RyYWN0b3IuY29uZi5qc1wiO1xuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicHJvdHJhY3RvclwiLCBcImJyb3dzZXItc3luY1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiUHJvdHJhY3RvclwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicHJvdHJhY3Rvci1qYXNtaW5lMi1odG1sLXJlcG9ydGVyXCIsIFwiamFzbWluZS1zcGVjLXJlcG9ydGVyXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGF3ZXNvbWUtc2NyZWVuc2hvdHNcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIlByb3RyYWN0b3JcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9PT0gXCJNb2NoYS1DaGFpXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5saW50RW52LnByb3RyYWN0b3IgPSB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciA9PT0gXCJFU0xpbnRcIjtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiUHJvdHJhY3RvclwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHN1cGVyLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFByb3RyYWN0b3IuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke1Byb3RyYWN0b3IuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUHJvdHJhY3Rvci5GSUxFTkFNRSwgbGluZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke1Byb3RyYWN0b3IuRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtQcm90cmFjdG9yLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUHJvdHJhY3Rvci5GSUxFTkFNRSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIGxpbmVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHNGb2xkZXIpKTtcblxuICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IG5ldyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbigpO1xuICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5iYXNlVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjkwMDBcIjtcbiAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uc3BlY3MgPSBbXG4gICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKVxuICAgICAgICBdO1xuICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5jYXBhYmlsaXRpZXMgPSB7XG4gICAgICAgICAgICBicm93c2VyTmFtZTogXCJjaHJvbWVcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHByb3RyYWN0b3JDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBlbmdpbmVWYXJpYWJsZXMuZTJlUGx1Z2lucykge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGtleSkpKTtcbiAgICAgICAgICAgIGlmIChlbmdpbmVWYXJpYWJsZXMuZTJlUGx1Z2luc1trZXldKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JDb25maWd1cmF0aW9uLnBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGx1Z2luLnBhdGggPT09IHBsdWdpblBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5wbHVnaW5zLnB1c2goeyBwYXRoOiBwbHVnaW5QYXRoIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24ucGx1Z2lucy5mb3JFYWNoKChwbHVnaW4sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW4ucGF0aCA9PT0gcGx1Z2luUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24ucGx1Z2lucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKSB7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3QgSmFzbWluZTJIdG1sUmVwb3J0ZXIgPSByZXF1aXJlKCdwcm90cmFjdG9yLWphc21pbmUyLWh0bWwtcmVwb3J0ZXInKTtcIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwiY29uc3QgU3BlY1JlcG9ydGVyID0gcmVxdWlyZSgnamFzbWluZS1zcGVjLXJlcG9ydGVyJykuU3BlY1JlcG9ydGVyO1wiKTtcblxuICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJqYXNtaW5lXCI7XG4gICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5qYXNtaW5lTm9kZU9wdHMgPSB7XG4gICAgICAgICAgICAgICAgc2hvd0NvbG9yczogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9PT0gXCJNb2NoYS1DaGFpXCIpIHtcbiAgICAgICAgICAgIHByb3RyYWN0b3JDb25maWd1cmF0aW9uLmZyYW1ld29yayA9IFwibW9jaGFcIjtcbiAgICAgICAgICAgIHByb3RyYWN0b3JDb25maWd1cmF0aW9uLm1vY2hhT3B0cyA9IHtcbiAgICAgICAgICAgICAgICByZXBvcnRlcjogXCJtb2NoYXdlc29tZS1zY3JlZW5zaG90c1wiLFxuICAgICAgICAgICAgICAgIHJlcG9ydGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICByZXBvcnREaXI6IGAke3JlcG9ydHNGb2xkZXJ9L2UyZS9gLFxuICAgICAgICAgICAgICAgICAgICByZXBvcnROYW1lOiBcImluZGV4XCIsXG4gICAgICAgICAgICAgICAgICAgIHRha2VQYXNzZWRTY3JlZW5zaG90OiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVzLnB1c2goYGV4cG9ydHMuY29uZmlnID0gJHtKc29uSGVscGVyLmNvZGlmeShwcm90cmFjdG9yQ29uZmlndXJhdGlvbil9O2ApO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yayA9PT0gXCJKYXNtaW5lXCIpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCJleHBvcnRzLmNvbmZpZy5vblByZXBhcmUgPSAoKSA9PiB7XCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmNsZWFyUmVwb3J0ZXJzKCk7XCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKFwiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIG5ldyBKYXNtaW5lMkh0bWxSZXBvcnRlcih7XCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChgICAgICAgICAgICAgc2F2ZVBhdGg6ICcke3JlcG9ydHNGb2xkZXJ9L2UyZS8nLGApO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgICAgIGZpbGVOYW1lOiAnaW5kZXgnXCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIiAgICAgICAgfSlcIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwiICAgICk7XCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKFwiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgIG5ldyBTcGVjUmVwb3J0ZXIoe1wiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCIgICAgICAgICAgICBkaXNwbGF5U3RhY2t0cmFjZTogJ2FsbCdcIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwiICAgICAgICB9KVwiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCIgICAgKTtcIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIvKiBcIiwgXCIgKi9cIikpO1xuICAgIH1cbn1cbiJdfQ==
