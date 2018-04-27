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
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Karma extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.unitTestRunner, "Karma");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return _super("fileReadText").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME, engineVariables.force, (text) => __awaiter(this, void 0, void 0, function* () {
                    if (text) {
                        const jsonMatches = /config.set\(((.|\n|\r)*)\)/.exec(text);
                        if (jsonMatches && jsonMatches.length === 3) {
                            this._configuration = jsonHelper_1.JsonHelper.parseCode(jsonMatches[1]);
                            if (this._configuration.files) {
                                let keepFiles = this._configuration.files.filter(item => item.includeType === "polyfill");
                                keepFiles = keepFiles.concat(this._configuration.files.filter(item => item.includeType === "fixed"));
                                this._configuration.files = keepFiles;
                            }
                        }
                        else {
                            logger.error(`Reading existing ${Karma.FILENAME} regex failed to parse`);
                            return 1;
                        }
                    }
                    this.configDefaults(fileSystem, uniteConfiguration, engineVariables);
                    return 0;
                }));
            }
            else {
                return 0;
            }
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma",
                "karma-story-reporter",
                "karma-html-reporter",
                "karma-coverage",
                "karma-coverage-allsources",
                "karma-sourcemap-loader",
                "karma-remap-istanbul",
                "remap-istanbul",
                "karma-chrome-launcher",
                "karma-edge-launcher",
                "karma-firefox-launcher",
                "karma-phantomjs-launcher",
                "karma-safari-launcher",
                "karma-ie-launcher"
            ], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this.generateConfig(); }));
        });
    }
    configDefaults(fileSystem, uniteConfiguration, engineVariables) {
        const defaultConfiguration = new karmaConfiguration_1.KarmaConfiguration();
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));
        defaultConfiguration.basePath = "__dirname";
        defaultConfiguration.singleRun = true;
        defaultConfiguration.frameworks = [];
        defaultConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        defaultConfiguration.browsers = [];
        defaultConfiguration.coverageReporter = {
            include: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.dist, "**/!(app-module-config|entryPoint).js"))),
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
        const srcPreProcess = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.dist, "**/!(*-bundle|app-module-config|entryPoint).js")));
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.dist, "**/*")));
        defaultConfiguration.preprocessors = {};
        defaultConfiguration.preprocessors[srcPreProcess] = ["sourcemap", "coverage"];
        defaultConfiguration.files = [];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: srcInclude,
            included: false,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: "../unite.json",
            included: false,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: "./assetsSrc/theme/unite-theme.json",
            included: false,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitDist, "../unit-module-config.js"))),
            included: true,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitDist, "../unit-bootstrap.js"))),
            included: true,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitDist, "**/*.spec.js"))),
            included: false,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        engineVariables.setConfiguration("Karma", this._configuration);
    }
    generateConfig() {
        // Order the include types
        let orderedFiles = this._configuration.files.filter(item => item.includeType === "polyfill");
        orderedFiles = orderedFiles.concat(this._configuration.files.filter(item => item.includeType === "fixed"));
        this._configuration.files = orderedFiles;
        const lines = [];
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
        return lines;
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUd6RixvRUFBaUU7QUFFakUsV0FBbUIsU0FBUSxtQ0FBZ0I7SUFLaEMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDOUosSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsT0FBTyxzQkFBa0IsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLEtBQUssQ0FBQyxRQUFRLEVBQ2QsZUFBZSxDQUFDLEtBQUssRUFDckIsQ0FBTyxJQUFJLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxJQUFJLEVBQUU7d0JBQ04sTUFBTSxXQUFXLEdBQW9CLDRCQUE0QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDN0UsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsdUJBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNELElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0NBQzNCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENB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QU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLGNBQWM7UUFDbEIsMEJBQTBCO1FBQzFCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUM7UUFDN0YsWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUV6QyxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLHVCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVwRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDOztBQXZNdUIsY0FBUSxHQUFXLGVBQWUsQ0FBQztBQUQvRCxzQkF5TUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdFJ1bm5lci9rYXJtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBrYXJtYSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBLYXJtYSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcImthcm1hLmNvbmYuanNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEthcm1hQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJLYXJtYVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkVGV4dChsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLYXJtYS5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbk1hdGNoZXM6IFJlZ0V4cEV4ZWNBcnJheSA9IC9jb25maWcuc2V0XFwoKCgufFxcbnxcXHIpKilcXCkvLmV4ZWModGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbk1hdGNoZXMgJiYganNvbk1hdGNoZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IEpzb25IZWxwZXIucGFyc2VDb2RlKGpzb25NYXRjaGVzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29uZmlndXJhdGlvbi5maWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQga2VlcEZpbGVzID0gdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmluY2x1ZGVUeXBlID09PSBcInBvbHlmaWxsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwRmlsZXMgPSBrZWVwRmlsZXMuY29uY2F0KHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pbmNsdWRlVHlwZSA9PT0gXCJmaXhlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMgPSBrZWVwRmlsZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtLYXJtYS5GSUxFTkFNRX0gcmVnZXggZmFpbGVkIHRvIHBhcnNlYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJrYXJtYVwiLFxuICAgICAgICAgICAgXCJrYXJtYS1zdG9yeS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1odG1sLXJlcG9ydGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLWNvdmVyYWdlXCIsXG4gICAgICAgICAgICBcImthcm1hLWNvdmVyYWdlLWFsbHNvdXJjZXNcIixcbiAgICAgICAgICAgIFwia2FybWEtc291cmNlbWFwLWxvYWRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1yZW1hcC1pc3RhbmJ1bFwiLFxuICAgICAgICAgICAgXCJyZW1hcC1pc3RhbmJ1bFwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jaHJvbWUtbGF1bmNoZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtZWRnZS1sYXVuY2hlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1maXJlZm94LWxhdW5jaGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLXBoYW50b21qcy1sYXVuY2hlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1zYWZhcmktbGF1bmNoZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtaWUtbGF1bmNoZXJcIlxuICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLYXJtYS5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLmdlbmVyYXRlQ29uZmlnKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBLYXJtYUNvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHMpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlUGF0aCA9IFwiX19kaXJuYW1lXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNpbmdsZVJ1biA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZyYW1ld29ya3MgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucmVwb3J0ZXJzID0gW1wic3RvcnlcIiwgXCJjb3ZlcmFnZS1hbGxzb3VyY2VzXCIsIFwiY292ZXJhZ2VcIiwgXCJodG1sXCIsIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIl07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJyb3dzZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBpbmNsdWRlOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0LCBcIioqLyEoYXBwLW1vZHVsZS1jb25maWd8ZW50cnlQb2ludCkuanNcIikpKSxcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFwiXCIsXG4gICAgICAgICAgICByZXBvcnRlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICBkaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgIHN1YmRpcjogXCIuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uaHRtbFJlcG9ydGVyID0ge1xuICAgICAgICAgICAgb3V0cHV0RGlyOiByZXBvcnRzRm9sZGVyLFxuICAgICAgICAgICAgcmVwb3J0TmFtZTogXCJ1bml0XCJcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZW1hcElzdGFuYnVsUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICByZXBvcnRzOiB7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICAgICAgICBqc29uOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZS5qc29uYCxcbiAgICAgICAgICAgICAgICBodG1sOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZWAsXG4gICAgICAgICAgICAgICAgbGNvdm9ubHk6IGAke3JlcG9ydHNGb2xkZXJ9L2xjb3YuaW5mb2BcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzcmNQcmVQcm9jZXNzID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0LCBcIioqLyEoKi1idW5kbGV8YXBwLW1vZHVsZS1jb25maWd8ZW50cnlQb2ludCkuanNcIikpKTtcblxuICAgICAgICBjb25zdCBzcmNJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0LCBcIioqLypcIikpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wcmVwcm9jZXNzb3JzID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnNbc3JjUHJlUHJvY2Vzc10gPSBbXCJzb3VyY2VtYXBcIiwgXCJjb3ZlcmFnZVwiXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5maWxlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogc3JjSW5jbHVkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhdGNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlVHlwZTogXCJmaXhlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBcIi4uL3VuaXRlLmpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhdGNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlVHlwZTogXCJmaXhlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBcIi4vYXNzZXRzU3JjL3RoZW1lL3VuaXRlLXRoZW1lLmpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhdGNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlVHlwZTogXCJmaXhlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXREaXN0LCBcIi4uL3VuaXQtbW9kdWxlLWNvbmZpZy5qc1wiKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXRjaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVR5cGU6IFwiZml4ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3QsIGl0ZW0pID0+IG9iamVjdC5wYXR0ZXJuID09PSBpdGVtLnBhdHRlcm4pO1xuXG4gICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0RGlzdCwgXCIuLi91bml0LWJvb3RzdHJhcC5qc1wiKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXRjaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVR5cGU6IFwiZml4ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3QsIGl0ZW0pID0+IG9iamVjdC5wYXR0ZXJuID09PSBpdGVtLnBhdHRlcm4pO1xuXG4gICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0RGlzdCwgXCIqKi8qLnNwZWMuanNcIikpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhdGNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlVHlwZTogXCJmaXhlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJLYXJtYVwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlQ29uZmlnKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgLy8gT3JkZXIgdGhlIGluY2x1ZGUgdHlwZXNcbiAgICAgICAgbGV0IG9yZGVyZWRGaWxlcyA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pbmNsdWRlVHlwZSA9PT0gXCJwb2x5ZmlsbFwiKTtcbiAgICAgICAgb3JkZXJlZEZpbGVzID0gb3JkZXJlZEZpbGVzLmNvbmNhdCh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLmZpbHRlcihpdGVtID0+IGl0ZW0uaW5jbHVkZVR5cGUgPT09IFwiZml4ZWRcIikpO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzID0gb3JkZXJlZEZpbGVzO1xuXG4gICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBsaW5lcy5wdXNoKFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICBjb25maWcuc2V0KCR7SnNvbkhlbHBlci5jb2RpZnkodGhpcy5fY29uZmlndXJhdGlvbil9KTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcIn07XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIvKiBcIiwgXCIgKi9cIikpO1xuXG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG59XG4iXX0=
