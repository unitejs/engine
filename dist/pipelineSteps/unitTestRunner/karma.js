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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUd2RSw0RkFBeUY7QUFFekYsZ0ZBQTZFO0FBRzdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU87Z0JBQ1AsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHNCQUFzQjtnQkFDdEIscUJBQXFCO2dCQUNyQixnQkFBZ0I7Z0JBQ2hCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLFVBQVU7YUFDVixFQUNELGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUVuRixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUM3SSxxRkFBcUY7WUFDckYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU87Z0JBQzNELENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVwSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMzSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxl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SSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ3BELGtCQUFrQixDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFDMUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNwQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDO1FBQy9DLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDckYsa0JBQWtCLENBQUMsUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUc7WUFDbEMsU0FBUyxFQUFFO2dCQUNQO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLEdBQUcsRUFBRSxhQUFhO29CQUNsQixNQUFNLEVBQUUsR0FBRztpQkFDZDthQUNKO1NBQ0osQ0FBQztRQUVGLGtCQUFrQixDQUFDLFlBQVksR0FBRztZQUM5QixTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsTUFBTTtTQUNyQixDQUFDO1FBRUYsa0JBQWtCLENBQUMscUJBQXFCLEdBQUc7WUFDdkMsT0FBTyxFQUFFO2dCQUNMLElBQUksRUFBRSxHQUFHLGFBQWEsZ0JBQWdCO2dCQUN0QyxJQUFJLEVBQUUsR0FBRyxhQUFhLFdBQVc7Z0JBQ2pDLGNBQWMsRUFBRSxFQUFFO2FBQ3JCO1NBQ0osQ0FBQztRQUVGLGtCQUFrQixDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNiLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBQ0Qsa0JBQWtCLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUV4QyxLQUFLLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsdUJBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQTlKYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQWdLQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
