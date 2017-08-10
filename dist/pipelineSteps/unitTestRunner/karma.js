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
 * Pipeline step to generate karma configuration.
 */
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma",
                "karma-chrome-launcher",
                "karma-phantomjs-launcher",
                "karma-story-reporter",
                "karma-html-reporter",
                "karma-coverage",
                "karma-sourcemap-loader",
                "karma-remap-istanbul",
                "remap-istanbul",
                "bluebird"
            ], uniteConfiguration.unitTestRunner === "Karma");
            engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD");
            // We use SystemJS for testing CommonJS modules so we don't need to webpack the tests
            engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" &&
                (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS"));
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine");
            if (uniteConfiguration.unitTestRunner === "Karma") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Karma.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Karma.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const testFrameworks = [];
        const testIncludes = [];
        testIncludes.push({ pattern: "../unite.json", included: false });
        const bbInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));
        testIncludes.push({ pattern: bbInclude, included: true });
        if (uniteConfiguration.moduleType === "AMD") {
            const reqInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "requirejs/require.js")));
            testIncludes.push({ pattern: reqInclude, included: true });
        }
        else if (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS") {
            const sysInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "systemjs/dist/system.src.js")));
            // We use SystemJS for testing CommonJS modules so we don't need to webpack the tests
            testIncludes.push({ pattern: sysInclude, included: true });
        }
        const testPackages = engineVariables.getTestClientPackages();
        Object.keys(testPackages).forEach(key => {
            const mainSplit = testPackages[key].main.split("/");
            const main = mainSplit.pop();
            let location = mainSplit.join("/");
            if (testPackages[key].isPackage) {
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                testIncludes.push({ pattern: keyInclude, included: false });
            }
            else {
                location += location.length > 0 ? "/" : "";
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                testIncludes.push({ pattern: keyInclude, included: false });
            }
        });
        if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            testFrameworks.push("mocha");
            testFrameworks.push("chai");
        }
        else if (uniteConfiguration.unitTestFramework === "Jasmine") {
            testFrameworks.push("jasmine");
        }
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|entryPoint).js")));
        testIncludes.push({
            pattern: srcInclude,
            included: false
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        const karmaConfiguration = new karmaConfiguration_1.KarmaConfiguration();
        karmaConfiguration.basePath = "__dirname";
        karmaConfiguration.singleRun = true;
        karmaConfiguration.frameworks = testFrameworks;
        karmaConfiguration.reporters = ["story", "coverage", "html", "karma-remap-istanbul"];
        karmaConfiguration.browsers = ["PhantomJS"];
        karmaConfiguration.coverageReporter = {
            reporters: [
                {
                    type: "json",
                    dir: reportsFolder,
                    subdir: "."
                }
            ]
        };
        karmaConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };
        karmaConfiguration.remapIstanbulReporter = {
            reports: {
                json: `${reportsFolder}/coverage.json`,
                html: `${reportsFolder}/coverage`,
                "text-summary": ""
            }
        };
        karmaConfiguration.preprocessors = {};
        if (srcInclude) {
            karmaConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        }
        karmaConfiguration.files = testIncludes;
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(karmaConfiguration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUd2RSw0RkFBeUY7QUFFekYsZ0ZBQTZFO0FBRzdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU87Z0JBQ1AsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHNCQUFzQjtnQkFDdEIscUJBQXFCO2dCQUNyQixnQkFBZ0I7Z0JBQ2hCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLFVBQVU7YUFDVixFQUNELGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUVuRixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUM3SSxxRkFBcUY7WUFDckYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU87Z0JBQzNELENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVwSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMzSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxl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dUJBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQTlKYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQWdLQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGthcm1hIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgS2FybWFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2thcm1hL2thcm1hQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEthcm1hIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwia2FybWEuY29uZi5qc1wiO1xuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtY2hyb21lLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLXBoYW50b21qcy1sYXVuY2hlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1zdG9yeS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1odG1sLXJlcG9ydGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLWNvdmVyYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLXNvdXJjZW1hcC1sb2FkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmx1ZWJpcmRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicmVxdWlyZWpzXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIik7XG4gICAgICAgIC8vIFdlIHVzZSBTeXN0ZW1KUyBmb3IgdGVzdGluZyBDb21tb25KUyBtb2R1bGVzIHNvIHdlIGRvbid0IG5lZWQgdG8gd2VicGFjayB0aGUgdGVzdHNcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wic3lzdGVtanNcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJTeXN0ZW1KU1wiIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJrYXJtYS1tb2NoYVwiLCBcImthcm1hLWNoYWlcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9PT0gXCJNb2NoYS1DaGFpXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJrYXJtYS1qYXNtaW5lXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0thcm1hLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcn0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlTGluZXMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEthcm1hLkZJTEVOQU1FLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7S2FybWEuRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtLYXJtYS5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEthcm1hLkZJTEVOQU1FKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbGluZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRlc3RGcmFtZXdvcmtzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRlc3RJbmNsdWRlczogeyBwYXR0ZXJuOiBzdHJpbmc7IGluY2x1ZGVkOiBib29sZWFuIH1bXSA9IFtdO1xuXG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHsgcGF0dGVybjogXCIuLi91bml0ZS5qc29uXCIsIGluY2x1ZGVkOiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBiYkluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIFwiYmx1ZWJpcmQvanMvYnJvd3Nlci9ibHVlYmlyZC5qc1wiKSkpO1xuICAgICAgICB0ZXN0SW5jbHVkZXMucHVzaCh7IHBhdHRlcm46IGJiSW5jbHVkZSwgaW5jbHVkZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKSB7XG4gICAgICAgICAgICBjb25zdCByZXFJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoXG4gICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgXCJyZXF1aXJlanMvcmVxdWlyZS5qc1wiKSkpO1xuICAgICAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goeyBwYXR0ZXJuOiByZXFJbmNsdWRlLCBpbmNsdWRlZDogdHJ1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJTeXN0ZW1KU1wiIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHN5c0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBcInN5c3RlbWpzL2Rpc3Qvc3lzdGVtLnNyYy5qc1wiKSkpO1xuICAgICAgICAgICAgLy8gV2UgdXNlIFN5c3RlbUpTIGZvciB0ZXN0aW5nIENvbW1vbkpTIG1vZHVsZXMgc28gd2UgZG9uJ3QgbmVlZCB0byB3ZWJwYWNrIHRoZSB0ZXN0c1xuICAgICAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goeyBwYXR0ZXJuOiBzeXNJbmNsdWRlLCBpbmNsdWRlZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRlc3RQYWNrYWdlcyA9IGVuZ2luZVZhcmlhYmxlcy5nZXRUZXN0Q2xpZW50UGFja2FnZXMoKTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0ZXN0UGFja2FnZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1haW5TcGxpdCA9IHRlc3RQYWNrYWdlc1trZXldLm1haW4uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgY29uc3QgbWFpbiA9IG1haW5TcGxpdC5wb3AoKTtcbiAgICAgICAgICAgIGxldCBsb2NhdGlvbiA9IG1haW5TcGxpdC5qb2luKFwiL1wiKTtcblxuICAgICAgICAgICAgaWYgKHRlc3RQYWNrYWdlc1trZXldLmlzUGFja2FnZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7a2V5fS8ke2xvY2F0aW9ufS8qKi8qLntqcyxodG1sLGNzc31gKSkpO1xuICAgICAgICAgICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbiArPSBsb2NhdGlvbi5sZW5ndGggPiAwID8gXCIvXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7a2V5fS8ke2xvY2F0aW9ufSR7bWFpbn1gKSkpO1xuICAgICAgICAgICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrID09PSBcIk1vY2hhLUNoYWlcIikge1xuICAgICAgICAgICAgdGVzdEZyYW1ld29ya3MucHVzaChcIm1vY2hhXCIpO1xuICAgICAgICAgICAgdGVzdEZyYW1ld29ya3MucHVzaChcImNoYWlcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrID09PSBcIkphc21pbmVcIikge1xuICAgICAgICAgICAgdGVzdEZyYW1ld29ya3MucHVzaChcImphc21pbmVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzcmNJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuZGlzdEZvbGRlciwgXCIqKi8hKCotYnVuZGxlfGVudHJ5UG9pbnQpLmpzXCIpKSk7XG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IHNyY0luY2x1ZGUsXG4gICAgICAgICAgICBpbmNsdWRlZDogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIuLi91bml0LW1vZHVsZS1jb25maWcuanNcIikpKSxcbiAgICAgICAgICAgIGluY2x1ZGVkOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIuLi91bml0LWJvb3RzdHJhcC5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgY29uc3Qga2FybWFDb25maWd1cmF0aW9uID0gbmV3IEthcm1hQ29uZmlndXJhdGlvbigpO1xuICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24uYmFzZVBhdGggPSBcIl9fZGlybmFtZVwiO1xuICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24uc2luZ2xlUnVuID0gdHJ1ZTtcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmZyYW1ld29ya3MgPSB0ZXN0RnJhbWV3b3JrcztcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLnJlcG9ydGVycyA9IFtcInN0b3J5XCIsIFwiY292ZXJhZ2VcIiwgXCJodG1sXCIsIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIl07XG4gICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5icm93c2VycyA9IFtcIlBoYW50b21KU1wiXTtcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmNvdmVyYWdlUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICByZXBvcnRlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICBkaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgIHN1YmRpcjogXCIuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmh0bWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIG91dHB1dERpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgIHJlcG9ydE5hbWU6IFwidW5pdFwiXG4gICAgICAgIH07XG5cbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLnJlbWFwSXN0YW5idWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgICAgICAgICBqc29uOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZS5qc29uYCxcbiAgICAgICAgICAgICAgICBodG1sOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZWAsXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LXN1bW1hcnlcIjogXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5wcmVwcm9jZXNzb3JzID0ge307XG4gICAgICAgIGlmIChzcmNJbmNsdWRlKSB7XG4gICAgICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24ucHJlcHJvY2Vzc29yc1tzcmNJbmNsdWRlXSA9IFtcInNvdXJjZW1hcFwiLCBcImNvdmVyYWdlXCJdO1xuICAgICAgICB9XG4gICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5maWxlcyA9IHRlc3RJbmNsdWRlcztcblxuICAgICAgICBsaW5lcy5wdXNoKFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICBjb25maWcuc2V0KCR7SnNvbkhlbHBlci5jb2RpZnkoa2FybWFDb25maWd1cmF0aW9uKX0pO2ApO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgfVxufVxuIl19
