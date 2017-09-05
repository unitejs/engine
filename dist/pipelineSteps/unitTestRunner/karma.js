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
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Karma extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson")
        ];
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma")) {
                logger.info(`Initialising ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                if (!engineVariables.force) {
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, Karma.FILENAME);
                        if (exists) {
                            const conf = yield fileSystem.fileReadText(engineVariables.wwwRootFolder, Karma.FILENAME);
                            const jsonMatches = /config.set\(((.|\n|\r)*)\)/.exec(conf);
                            if (jsonMatches && jsonMatches.length === 3) {
                                this._configuration = jsonHelper_1.JsonHelper.parseCode(jsonMatches[1]);
                                if (this._configuration.files) {
                                    this._configuration.files = this._configuration.files.filter(item => item.isPerm);
                                }
                            }
                            else {
                                logger.error(`Reading existing ${Karma.FILENAME} regex failed to parse`);
                                return 1;
                            }
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${Karma.FILENAME} failed`, err);
                        return 1;
                    }
                }
                this.configDefaults(fileSystem, uniteConfiguration, engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
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
            ], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma"));
            if (_super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma")) {
                logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                const lines = [];
                this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);
                return 0;
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME, engineVariables.force);
            }
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
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));
        defaultConfiguration.preprocessors = {};
        defaultConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        defaultConfiguration.files = [];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: srcInclude,
            included: false,
            isPerm: true
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: "../unite.json",
            included: false,
            isPerm: true
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true,
            isPerm: true
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true,
            isPerm: true
        }, true, (object, item) => object.pattern === item.pattern);
        arrayHelper_1.ArrayHelper.addRemove(this._configuration.files, {
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false,
            isPerm: true
        }, true, (object, item) => object.pattern === item.pattern);
        engineVariables.setConfiguration("Karma", this._configuration);
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSwwRUFBdUU7QUFDdkUsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUd6RiwwREFBdUQ7QUFDdkQsb0VBQWlFO0FBRWpFLFdBQW1CLFNBQVEsbUNBQWdCO0lBS2hDLFVBQVU7UUFDYixNQUFNLENBQUM7WUFDSCxJQUFJLHlCQUFXLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDO1lBQ2xELElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO1NBQzVDLENBQUM7SUFDTixDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFFdEksRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRTVGLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUUxRixNQUFNLFdBQVcsR0FBb0IsNEJBQTRCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM3RSxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLHVCQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0NBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUN0RixDQUFDOzRCQUNMLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxDQUFDLFFBQVEsd0JBQXdCLENBQUMsQ0FBQztnQ0FDekUsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDYixDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDL0QsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDYixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPO2dCQUN4QyxzQkFBc0I7Z0JBQ3RCLHFCQUFxQjtnQkFDckIsZ0JBQWdCO2dCQUNoQiwyQkFBMkI7Z0JBQzNCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLHVCQUF1QjtnQkFDdkIsd0JBQXdCO2dCQUN4QiwwQkFBMEI7Z0JBQzFCLHVCQUF1QjtnQkFDdkIsbUJBQW1CO2FBQ3RCLEVBQ21DLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBRWpHLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFFMUYsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXRGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVILENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQztRQUNwSCxNQUFNLG9CQUFvQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUV0RCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUUxSSxvQkFBb0IsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzVDLG9CQUFvQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEMsb0JBQW9CLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQyxvQkFBb0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBQzlHLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkMsb0JBQW9CLENBQUMsZ0JBQWdCLEdBQUc7WUFDcEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDLENBQUM7WUFDMUwsT0FBTyxFQUFFLEVBQUU7WUFDWCxTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLGFBQWE7b0JBQ2xCLE1BQU0sRUFBRSxHQUFHO2lCQUNkO2FBQ0o7U0FDSixDQUFDO1FBRUYsb0JBQW9CLENBQUMsWUFBWSxHQUFHO1lBQ2hDLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxNQUFNO1NBQ3JCLENBQUM7UUFFRixvQkFBb0IsQ0FBQyxxQkFBcUIsR0FBRztZQUN6QyxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEdBQUcsYUFBYSxnQkFBZ0I7Z0JBQ3RDLElBQUksRUFBRSxHQUFHLGFBQWEsV0FBVztnQkFDakMsUUFBUSxFQUFFLEdBQUcsYUFBYSxZQUFZO2FBQ3pDO1NBQ0osQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0ssb0JBQW9CLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFM0Usb0JBQW9CLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQyxJQUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFDekI7WUFDSyxPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxJQUFJO1NBQ2hCLEVBQ0QsSUFBSSxFQUNKLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFDekI7WUFDSyxPQUFPLEVBQUUsZUFBZTtZQUN4QixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxJQUFJO1NBQ2hCLEVBQ0QsSUFBSSxFQUNKLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFDekI7WUFDSyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFDN0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQztZQUN0SixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJO1NBQ2hCLEVBQ0QsSUFBSSxFQUNKLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFDekI7WUFDSyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFDN0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUNsSixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJO1NBQ2hCLEVBQ0QsSUFBSSxFQUNKLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFDekI7WUFDSyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFDN0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDMUksUUFBUSxFQUFFLEtBQUs7WUFDZixNQUFNLEVBQUUsSUFBSTtTQUNoQixFQUNELElBQUksRUFDSixDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssTUFBTSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLGNBQWMsQ0FBQyxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsS0FBZTtRQUNySSxLQUFLLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsdUJBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBakxjLGNBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsc0JBbUxDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RSdW5uZXIva2FybWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUga2FybWEgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBLYXJtYUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMva2FybWEva2FybWFDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBLYXJtYSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcImthcm1hLmNvbmYuanNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEthcm1hQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCIpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJLYXJtYVwiKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEluaXRpYWxpc2luZyAke0thcm1hLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgaWYgKCFlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEthcm1hLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRUZXh0KGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb25NYXRjaGVzOiBSZWdFeHBFeGVjQXJyYXkgPSAvY29uZmlnLnNldFxcKCgoLnxcXG58XFxyKSopXFwpLy5leGVjKGNvbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25NYXRjaGVzICYmIGpzb25NYXRjaGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBKc29uSGVscGVyLnBhcnNlQ29kZShqc29uTWF0Y2hlc1sxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcyA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pc1Blcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7S2FybWEuRklMRU5BTUV9IHJlZ2V4IGZhaWxlZCB0byBwYXJzZWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke0thcm1hLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWFcIixcbiAgICAgICAgICAgIFwia2FybWEtc3RvcnktcmVwb3J0ZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtaHRtbC1yZXBvcnRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZVwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZS1hbGxzb3VyY2VzXCIsXG4gICAgICAgICAgICBcImthcm1hLXNvdXJjZW1hcC1sb2FkZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwicmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwia2FybWEtY2hyb21lLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLWZpcmVmb3gtbGF1bmNoZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcGhhbnRvbWpzLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICBcImthcm1hLXNhZmFyaS1sYXVuY2hlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1pZS1sYXVuY2hlclwiXG4gICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikpO1xuXG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0thcm1hLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsaW5lcyk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSwgbGluZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEthcm1hLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEthcm1hQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IHJlcG9ydHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cucmVwb3J0c0ZvbGRlcikpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhc2VQYXRoID0gXCJfX2Rpcm5hbWVcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2luZ2xlUnVuID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZnJhbWV3b3JrcyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzdG9yeVwiLCBcImNvdmVyYWdlLWFsbHNvdXJjZXNcIiwgXCJjb3ZlcmFnZVwiLCBcImh0bWxcIiwgXCJrYXJtYS1yZW1hcC1pc3RhbmJ1bFwiXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYnJvd3NlcnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY292ZXJhZ2VSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovIShhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpLFxuICAgICAgICAgICAgZXhjbHVkZTogXCJcIixcbiAgICAgICAgICAgIHJlcG9ydGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgc3ViZGlyOiBcIi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5odG1sUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBvdXRwdXREaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICByZXBvcnROYW1lOiBcInVuaXRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlbWFwSXN0YW5idWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgICAgICAgIGpzb246IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlLmpzb25gLFxuICAgICAgICAgICAgICAgIGh0bWw6IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlYCxcbiAgICAgICAgICAgICAgICBsY292b25seTogYCR7cmVwb3J0c0ZvbGRlcn0vbGNvdi5pbmZvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNyY0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovISgqLWJ1bmRsZXxhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlcHJvY2Vzc29yc1tzcmNJbmNsdWRlXSA9IFtcInNvdXJjZW1hcFwiLCBcImNvdmVyYWdlXCJdO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZpbGVzID0gW107XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IHNyY0luY2x1ZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQZXJtOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3QsIGl0ZW0pID0+IG9iamVjdC5wYXR0ZXJuID09PSBpdGVtLnBhdHRlcm4pO1xuXG4gICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBcIi4uL3VuaXRlLmpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Blcm06IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdERpc3RGb2xkZXIsIFwiLi4vdW5pdC1tb2R1bGUtY29uZmlnLmpzXCIpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Blcm06IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdERpc3RGb2xkZXIsIFwiLi4vdW5pdC1ib290c3RyYXAuanNcIikpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGVybTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcblxuICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodGhpcy5fY29uZmlndXJhdGlvbi5maWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIqKi8qLnNwZWMuanNcIikpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Blcm06IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdHRlcm4gPT09IGl0ZW0ucGF0dGVybik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJLYXJtYVwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIGxpbmVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBsaW5lcy5wdXNoKFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpIHtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICBjb25maWcuc2V0KCR7SnNvbkhlbHBlci5jb2RpZnkodGhpcy5fY29uZmlndXJhdGlvbil9KTtgKTtcbiAgICAgICAgbGluZXMucHVzaChcIn07XCIpO1xuICAgICAgICBsaW5lcy5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIvKiBcIiwgXCIgKi9cIikpO1xuICAgIH1cbn1cbiJdfQ==
