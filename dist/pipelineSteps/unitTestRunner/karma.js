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
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        defaultConfiguration.basePath = "__dirname";
        defaultConfiguration.singleRun = true;
        defaultConfiguration.frameworks = [];
        defaultConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        defaultConfiguration.browsers = [];
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
        const srcPreProcess = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/*")));
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
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true,
            watched: true,
            includeType: "fixed"
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUd6RixvRUFBaUU7QUFFakUsV0FBbUIsU0FBUSxtQ0FBZ0I7SUFLaEMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM5SixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLENBQUMsc0JBQWtCLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixLQUFLLENBQUMsUUFBUSxFQUNkLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sSUFBSTtvQkFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxNQUFNLFdBQVcsR0FBb0IsNEJBQTRCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM3RSxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLHVCQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0NBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxj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QVUsQ0FBQyxDQUFDO1FBQzdGLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUV6QyxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLHVCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVwRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7O0FBNUxjLGNBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsc0JBOExDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RSdW5uZXIva2FybWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUga2FybWEgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBLYXJtYUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMva2FybWEva2FybWFDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgS2FybWEgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJrYXJtYS5jb25mLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBLYXJtYUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZFRleHQobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2FybWEuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb25NYXRjaGVzOiBSZWdFeHBFeGVjQXJyYXkgPSAvY29uZmlnLnNldFxcKCgoLnxcXG58XFxyKSopXFwpLy5leGVjKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25NYXRjaGVzICYmIGpzb25NYXRjaGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBKc29uSGVscGVyLnBhcnNlQ29kZShqc29uTWF0Y2hlc1sxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtlZXBGaWxlcyA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pbmNsdWRlVHlwZSA9PT0gXCJwb2x5ZmlsbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2VlcEZpbGVzID0ga2VlcEZpbGVzLmNvbmNhdCh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLmZpbHRlcihpdGVtID0+IGl0ZW0uaW5jbHVkZVR5cGUgPT09IFwiZml4ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzID0ga2VlcEZpbGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7S2FybWEuRklMRU5BTUV9IHJlZ2V4IGZhaWxlZCB0byBwYXJzZWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWFcIixcbiAgICAgICAgICAgIFwia2FybWEtc3RvcnktcmVwb3J0ZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtaHRtbC1yZXBvcnRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZVwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZS1hbGxzb3VyY2VzXCIsXG4gICAgICAgICAgICBcImthcm1hLXNvdXJjZW1hcC1sb2FkZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwicmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwia2FybWEtY2hyb21lLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLWZpcmVmb3gtbGF1bmNoZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcGhhbnRvbWpzLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLXNhZmFyaS1sYXVuY2hlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1pZS1sYXVuY2hlclwiXG4gICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEthcm1hLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuZ2VuZXJhdGVDb25maWcoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEthcm1hQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IHJlcG9ydHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cucmVwb3J0c0ZvbGRlcikpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhc2VQYXRoID0gXCJfX2Rpcm5hbWVcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2luZ2xlUnVuID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZnJhbWV3b3JrcyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzdG9yeVwiLCBcImNvdmVyYWdlLWFsbHNvdXJjZXNcIiwgXCJjb3ZlcmFnZVwiLCBcImh0bWxcIiwgXCJrYXJtYS1yZW1hcC1pc3RhbmJ1bFwiXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYnJvd3NlcnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY292ZXJhZ2VSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovIShhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpLFxuICAgICAgICAgICAgZXhjbHVkZTogXCJcIixcbiAgICAgICAgICAgIHJlcG9ydGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgc3ViZGlyOiBcIi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5odG1sUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBvdXRwdXREaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICByZXBvcnROYW1lOiBcInVuaXRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlbWFwSXN0YW5idWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgICAgICAgIGpzb246IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlLmpzb25gLFxuICAgICAgICAgICAgICAgIGh0bWw6IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlYCxcbiAgICAgICAgICAgICAgICBsY292b25seTogYCR7cmVwb3J0c0ZvbGRlcn0vbGNvdi5pbmZvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNyY1ByZVByb2Nlc3MgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovISgqLWJ1bmRsZXxhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpO1xuXG4gICAgICAgIGNvbnN0IHNyY0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovKlwiKSkpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlcHJvY2Vzc29yc1tzcmNQcmVQcm9jZXNzXSA9IFtcInNvdXJjZW1hcFwiLCBcImNvdmVyYWdlXCJdO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZpbGVzID0gW107XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBzcmNJbmNsdWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2F0Y2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVUeXBlOiBcImZpeGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcblxuICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodGhpcy5fY29uZmlndXJhdGlvbi5maWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IFwiLi4vdW5pdGUuanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2F0Y2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVUeXBlOiBcImZpeGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcblxuICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodGhpcy5fY29uZmlndXJhdGlvbi5maWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIi4uL3VuaXQtbW9kdWxlLWNvbmZpZy5qc1wiKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXRjaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVR5cGU6IFwiZml4ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3QsIGl0ZW0pID0+IG9iamVjdC5wYXR0ZXJuID09PSBpdGVtLnBhdHRlcm4pO1xuXG4gICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdERpc3RGb2xkZXIsIFwiLi4vdW5pdC1ib290c3RyYXAuanNcIikpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2F0Y2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVUeXBlOiBcImZpeGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcblxuICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodGhpcy5fY29uZmlndXJhdGlvbi5maWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2F0Y2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVUeXBlOiBcImZpeGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkthcm1hXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoKTogc3RyaW5nW10ge1xuICAgICAgICAvLyBPcmRlciB0aGUgaW5jbHVkZSB0eXBlc1xuICAgICAgICBsZXQgb3JkZXJlZEZpbGVzID0gdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmluY2x1ZGVUeXBlID09PSBcInBvbHlmaWxsXCIpO1xuICAgICAgICBvcmRlcmVkRmlsZXMgPSBvcmRlcmVkRmlsZXMuY29uY2F0KHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pbmNsdWRlVHlwZSA9PT0gXCJmaXhlZFwiKSk7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMgPSBvcmRlcmVkRmlsZXM7XG5cbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGxpbmVzLnB1c2goXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZykge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgICAgIGNvbmZpZy5zZXQoJHtKc29uSGVscGVyLmNvZGlmeSh0aGlzLl9jb25maWd1cmF0aW9uKX0pO2ApO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG5cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbn1cbiJdfQ==
