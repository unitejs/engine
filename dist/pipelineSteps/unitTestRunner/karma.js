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
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                this.configDefaults(fileSystem, engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma",
                "karma-chrome-launcher",
                "karma-phantomjs-launcher",
                "karma-story-reporter",
                "karma-html-reporter",
                "karma-coverage",
                "karma-coverage-allsources",
                "karma-sourcemap-loader",
                "karma-remap-istanbul",
                "remap-istanbul",
                "bluebird"
            ], uniteConfiguration.unitTestRunner === "Karma");
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
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new karmaConfiguration_1.KarmaConfiguration();
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        defaultConfiguration.basePath = "__dirname";
        defaultConfiguration.singleRun = true;
        defaultConfiguration.frameworks = [];
        defaultConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        defaultConfiguration.browsers = ["PhantomJS"];
        defaultConfiguration.coverageReporter = {
            include: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(app-module-config|entryPoint).js"))),
            exclude: "",
            reporters: [
                {
                    type: "json",
                    dir: reportsFolder,
                    subdir: "."
                }
            ]
        };
        defaultConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };
        defaultConfiguration.remapIstanbulReporter = {
            reports: {
                text: "",
                json: `${reportsFolder}/coverage.json`,
                html: `${reportsFolder}/coverage`,
                lcovonly: `${reportsFolder}/lcov.info`
            }
        };
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));
        defaultConfiguration.preprocessors = {};
        defaultConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        defaultConfiguration.files = [];
        defaultConfiguration.files.push({
            pattern: srcInclude,
            included: false
        });
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Karma", this._configuration);
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        this._configuration.files.push({ pattern: "../unite.json", included: false });
        // Bluebird should only be necessary while we are using PhantomJS
        const bbInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));
        this._configuration.files.push({ pattern: bbInclude, included: true });
        const testPackages = engineVariables.getTestClientPackages();
        Object.keys(testPackages).forEach(key => {
            const mainSplit = testPackages[key].main.split("/");
            const main = mainSplit.pop();
            let location = mainSplit.join("/");
            if (testPackages[key].isPackage) {
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                this._configuration.files.push({ pattern: keyInclude, included: false });
            }
            else {
                location += location.length > 0 ? "/" : "";
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                this._configuration.files.push({ pattern: keyInclude, included: false });
            }
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFHM0UsNEZBQXlGO0FBRXpGLGdGQUE2RTtBQUc3RSxXQUFtQixTQUFRLCtDQUFzQjtJQUtoQyxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBRXRJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU87Z0JBQ1AsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHNCQUFzQjtnQkFDdEIscUJBQXFCO2dCQUNyQixnQkFBZ0I7Z0JBQ2hCLDJCQUEyQjtnQkFDM0Isd0JBQXdCO2dCQUN4QixzQkFBc0I7Z0JBQ3RCLGdCQUFnQjtnQkFDaEIsVUFBVTthQUNWLEVBQ0Qsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRW5GLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFekgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENB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QUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLHVCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQXhKYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQTBKQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGthcm1hIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBLYXJtYSBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcImthcm1hLmNvbmYuanNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEthcm1hQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBwcmVQcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJrYXJtYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1jaHJvbWUtbGF1bmNoZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtcGhhbnRvbWpzLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLXN0b3J5LXJlcG9ydGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLWh0bWwtcmVwb3J0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtY292ZXJhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtY292ZXJhZ2UtYWxsc291cmNlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1zb3VyY2VtYXAtbG9hZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLXJlbWFwLWlzdGFuYnVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbWFwLWlzdGFuYnVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJsdWViaXJkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7S2FybWEuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtLYXJtYS5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke0thcm1hLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgS2FybWFDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVBhdGggPSBcIl9fZGlybmFtZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zaW5nbGVSdW4gPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5mcmFtZXdvcmtzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlcG9ydGVycyA9IFtcInN0b3J5XCIsIFwiY292ZXJhZ2UtYWxsc291cmNlc1wiLCBcImNvdmVyYWdlXCIsIFwiaHRtbFwiLCBcImthcm1hLXJlbWFwLWlzdGFuYnVsXCJdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5icm93c2VycyA9IFtcIlBoYW50b21KU1wiXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY292ZXJhZ2VSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovIShhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpLFxuICAgICAgICAgICAgZXhjbHVkZTogXCJcIixcbiAgICAgICAgICAgIHJlcG9ydGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgc3ViZGlyOiBcIi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5odG1sUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBvdXRwdXREaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICByZXBvcnROYW1lOiBcInVuaXRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlbWFwSXN0YW5idWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgICAgICAgIGpzb246IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlLmpzb25gLFxuICAgICAgICAgICAgICAgIGh0bWw6IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlYCxcbiAgICAgICAgICAgICAgICBsY292b25seTogYCR7cmVwb3J0c0ZvbGRlcn0vbGNvdi5pbmZvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNyY0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovISgqLWJ1bmRsZXxhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlcHJvY2Vzc29yc1tzcmNJbmNsdWRlXSA9IFtcInNvdXJjZW1hcFwiLCBcImNvdmVyYWdlXCJdO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZpbGVzID0gW107XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBwYXR0ZXJuOiBzcmNJbmNsdWRlLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkthcm1hXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbGluZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMucHVzaCh7IHBhdHRlcm46IFwiLi4vdW5pdGUuanNvblwiLCBpbmNsdWRlZDogZmFsc2UgfSk7XG5cbiAgICAgICAgLy8gQmx1ZWJpcmQgc2hvdWxkIG9ubHkgYmUgbmVjZXNzYXJ5IHdoaWxlIHdlIGFyZSB1c2luZyBQaGFudG9tSlNcbiAgICAgICAgY29uc3QgYmJJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoXG4gICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBcImJsdWViaXJkL2pzL2Jyb3dzZXIvYmx1ZWJpcmQuanNcIikpKTtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjogYmJJbmNsdWRlLCBpbmNsdWRlZDogdHJ1ZSB9KTtcblxuICAgICAgICBjb25zdCB0ZXN0UGFja2FnZXMgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0VGVzdENsaWVudFBhY2thZ2VzKCk7XG5cbiAgICAgICAgT2JqZWN0LmtleXModGVzdFBhY2thZ2VzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYWluU3BsaXQgPSB0ZXN0UGFja2FnZXNba2V5XS5tYWluLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IG1haW4gPSBtYWluU3BsaXQucG9wKCk7XG4gICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBtYWluU3BsaXQuam9pbihcIi9cIik7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0UGFja2FnZXNba2V5XS5pc1BhY2thZ2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoXG4gICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtsb2NhdGlvbn0vKiovKi57anMsaHRtbCxjc3N9YCkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goeyBwYXR0ZXJuOiBrZXlJbmNsdWRlLCBpbmNsdWRlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9IGxvY2F0aW9uLmxlbmd0aCA+IDAgPyBcIi9cIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5SW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBgJHtrZXl9LyR7bG9jYXRpb259JHttYWlufWApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIi4uL3VuaXQtbW9kdWxlLWNvbmZpZy5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIuLi91bml0LWJvb3RzdHJhcC5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKSxcbiAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBsaW5lcy5wdXNoKFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICBjb25maWcuc2V0KCR7SnNvbkhlbHBlci5jb2RpZnkodGhpcy5fY29uZmlndXJhdGlvbil9KTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcIn07XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIvKiBcIiwgXCIgKi9cIikpO1xuICAgIH1cbn1cbiJdfQ==
