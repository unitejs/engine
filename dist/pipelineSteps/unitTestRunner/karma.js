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
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma")) {
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
                "remap-istanbul"
            ], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma"));
            if (_super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma")) {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
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
        defaultConfiguration.files.push({
            pattern: srcInclude,
            included: false
        });
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Karma", this._configuration);
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const testPackages = engineVariables.getTestClientPackages();
        Object.keys(testPackages).forEach(key => {
            const pkg = testPackages[key];
            if (pkg.main) {
                const mainSplit = pkg.main.split("/");
                let main = mainSplit.pop();
                let location = mainSplit.join("/");
                let keyInclude;
                if (pkg.isPackage) {
                    keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                }
                else {
                    location += location.length > 0 ? "/" : "";
                    if (main === "*") {
                        main = "**/*.{js,html,css}";
                    }
                    keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                }
                this._configuration.files.push({ pattern: keyInclude, included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both" });
                if (pkg.testingAdditions) {
                    const additionKeys = Object.keys(pkg.testingAdditions);
                    additionKeys.forEach(additionKey => {
                        const additionKeyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${pkg.testingAdditions[additionKey]}`)));
                        this._configuration.files.push({ pattern: additionKeyInclude, included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both" });
                    });
                }
            }
            if (testPackages[key].assets !== undefined && testPackages[key].assets !== null && testPackages[key].assets.length > 0) {
                const cas = testPackages[key].assets.split(";");
                cas.forEach((ca) => {
                    const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${ca}`)));
                    this._configuration.files.push({ pattern: keyInclude, included: false });
                });
            }
        });
        this._configuration.files.push({ pattern: "../unite.json", included: false });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFHM0UsNEZBQXlGO0FBRXpGLGdGQUE2RTtBQUc3RSxXQUFtQixTQUFRLCtDQUFzQjtJQUtoQyxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUV0SSxFQUFFLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3pFLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTztnQkFDeEMsc0JBQXNCO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLGdCQUFnQjtnQkFDaEIsMkJBQTJCO2dCQUMzQix3QkFBd0I7Z0JBQ3hCLHNCQUFzQjtnQkFDdEIsZ0JBQWdCO2FBQ25CLEVBQ21DLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBRWpHLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFekgsRUFBRSxDQUFDLENBQUMsa0JBQWtC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QUFrQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDekssUUFBUSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLHVCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQXJLYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQXVLQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGthcm1hIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBLYXJtYSBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcImthcm1hLmNvbmYuanNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEthcm1hQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWFcIixcbiAgICAgICAgICAgIFwia2FybWEtc3RvcnktcmVwb3J0ZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtaHRtbC1yZXBvcnRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZVwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZS1hbGxzb3VyY2VzXCIsXG4gICAgICAgICAgICBcImthcm1hLXNvdXJjZW1hcC1sb2FkZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwicmVtYXAtaXN0YW5idWxcIlxuICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpKTtcblxuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJLYXJtYVwiKSkge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgc3VwZXIuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0thcm1hLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSwgbGluZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtLYXJtYS5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBLYXJtYUNvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHNGb2xkZXIpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlUGF0aCA9IFwiX19kaXJuYW1lXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNpbmdsZVJ1biA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZyYW1ld29ya3MgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucmVwb3J0ZXJzID0gW1wic3RvcnlcIiwgXCJjb3ZlcmFnZS1hbGxzb3VyY2VzXCIsIFwiY292ZXJhZ2VcIiwgXCJodG1sXCIsIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIl07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJyb3dzZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBpbmNsdWRlOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0Rm9sZGVyLCBcIioqLyEoYXBwLW1vZHVsZS1jb25maWd8ZW50cnlQb2ludCkuanNcIikpKSxcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFwiXCIsXG4gICAgICAgICAgICByZXBvcnRlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICBkaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgIHN1YmRpcjogXCIuXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uaHRtbFJlcG9ydGVyID0ge1xuICAgICAgICAgICAgb3V0cHV0RGlyOiByZXBvcnRzRm9sZGVyLFxuICAgICAgICAgICAgcmVwb3J0TmFtZTogXCJ1bml0XCJcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5yZW1hcElzdGFuYnVsUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICByZXBvcnRzOiB7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICAgICAgICBqc29uOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZS5qc29uYCxcbiAgICAgICAgICAgICAgICBodG1sOiBgJHtyZXBvcnRzRm9sZGVyfS9jb3ZlcmFnZWAsXG4gICAgICAgICAgICAgICAgbGNvdm9ubHk6IGAke3JlcG9ydHNGb2xkZXJ9L2xjb3YuaW5mb2BcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzcmNJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0Rm9sZGVyLCBcIioqLyEoKi1idW5kbGV8YXBwLW1vZHVsZS1jb25maWd8ZW50cnlQb2ludCkuanNcIikpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wcmVwcm9jZXNzb3JzID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnNbc3JjSW5jbHVkZV0gPSBbXCJzb3VyY2VtYXBcIiwgXCJjb3ZlcmFnZVwiXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5maWxlcyA9IFtdO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogc3JjSW5jbHVkZSxcbiAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkthcm1hXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbGluZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRlc3RQYWNrYWdlcyA9IGVuZ2luZVZhcmlhYmxlcy5nZXRUZXN0Q2xpZW50UGFja2FnZXMoKTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0ZXN0UGFja2FnZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBrZyA9IHRlc3RQYWNrYWdlc1trZXldO1xuICAgICAgICAgICAgaWYgKHBrZy5tYWluKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFpblNwbGl0ID0gcGtnLm1haW4uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgIGxldCBtYWluID0gbWFpblNwbGl0LnBvcCgpO1xuICAgICAgICAgICAgICAgIGxldCBsb2NhdGlvbiA9IG1haW5TcGxpdC5qb2luKFwiL1wiKTtcblxuICAgICAgICAgICAgICAgIGxldCBrZXlJbmNsdWRlO1xuICAgICAgICAgICAgICAgIGlmIChwa2cuaXNQYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtsb2NhdGlvbn0vKiovKi57anMsaHRtbCxjc3N9YCkpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiArPSBsb2NhdGlvbi5sZW5ndGggPiAwID8gXCIvXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFpbiA9PT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4gPSBcIioqLyoue2pzLGh0bWwsY3NzfVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtsb2NhdGlvbn0ke21haW59YCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IHBrZy5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gXCJub3RCdW5kbGVkXCIgfHwgcGtnLnNjcmlwdEluY2x1ZGVNb2RlID09PSBcImJvdGhcIiB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChwa2cudGVzdGluZ0FkZGl0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbktleXMgPSBPYmplY3Qua2V5cyhwa2cudGVzdGluZ0FkZGl0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uS2V5cy5mb3JFYWNoKGFkZGl0aW9uS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uS2V5SW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7a2V5fS8ke3BrZy50ZXN0aW5nQWRkaXRpb25zW2FkZGl0aW9uS2V5XX1gKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjogYWRkaXRpb25LZXlJbmNsdWRlLCBpbmNsdWRlZDogcGtnLnNjcmlwdEluY2x1ZGVNb2RlID09PSBcIm5vdEJ1bmRsZWRcIiB8fCBwa2cuc2NyaXB0SW5jbHVkZU1vZGUgPT09IFwiYm90aFwiIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0ZXN0UGFja2FnZXNba2V5XS5hc3NldHMgIT09IHVuZGVmaW5lZCAmJiB0ZXN0UGFja2FnZXNba2V5XS5hc3NldHMgIT09IG51bGwgJiYgdGVzdFBhY2thZ2VzW2tleV0uYXNzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXMgPSB0ZXN0UGFja2FnZXNba2V5XS5hc3NldHMuc3BsaXQoXCI7XCIpO1xuICAgICAgICAgICAgICAgIGNhcy5mb3JFYWNoKChjYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBgJHtrZXl9LyR7Y2F9YCkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goeyBwYXR0ZXJuOiBcIi4uL3VuaXRlLmpzb25cIiwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBwYXR0ZXJuOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdERpc3RGb2xkZXIsIFwiLi4vdW5pdC1tb2R1bGUtY29uZmlnLmpzXCIpKSksXG4gICAgICAgICAgICBpbmNsdWRlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIi4uL3VuaXQtYm9vdHN0cmFwLmpzXCIpKSksXG4gICAgICAgICAgICBpbmNsdWRlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmVzLnB1c2goXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZykge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgICAgIGNvbmZpZy5zZXQoJHtKc29uSGVscGVyLmNvZGlmeSh0aGlzLl9jb25maWd1cmF0aW9uKX0pO2ApO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgfVxufVxuIl19
