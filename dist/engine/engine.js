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
 * Main engine
 */
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
const enumEx_1 = require("../core/enumEx");
const createOutputDirectory_1 = require("../pipelineSteps/createOutputDirectory");
const generateGulpBuildConfiguration_1 = require("../pipelineSteps/generateGulpBuildConfiguration");
const generateGulpScaffold_1 = require("../pipelineSteps/generateGulpScaffold");
const generateGulpTasksBuild_1 = require("../pipelineSteps/generateGulpTasksBuild");
const generateGulpTasksUtil_1 = require("../pipelineSteps/generateGulpTasksUtil");
const generateHtmlTemplate_1 = require("../pipelineSteps/generateHtmlTemplate");
const generatePackageJson_1 = require("../pipelineSteps/generatePackageJson");
const generateUniteConfiguration_1 = require("../pipelineSteps/generateUniteConfiguration");
const engineValidation_1 = require("./engineValidation");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    init(packageName, language, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "language", language, enumEx_1.EnumEx.getNames(uniteLanguage_1.UniteLanguage))) {
                return 1;
            }
            outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory);
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
                return 1;
            }
            this._logger.info("Engine::init", { packageName, language, outputDirectory });
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            uniteConfiguration.name = packageName;
            uniteConfiguration.language = language;
            uniteConfiguration.outputDirectory = outputDirectory;
            uniteConfiguration.devDependencies = {};
            const engineVariables = new engineVariables_1.EngineVariables();
            const pipelineSteps = [];
            pipelineSteps.push(new createOutputDirectory_1.CreateOutputDirectory());
            pipelineSteps.push(new generateHtmlTemplate_1.GenerateHtmlTemplate());
            pipelineSteps.push(new generateGulpScaffold_1.GenerateGulpScaffold());
            pipelineSteps.push(new generateGulpBuildConfiguration_1.GenerateGulpBuildConfiguration());
            pipelineSteps.push(new generateGulpTasksBuild_1.GenerateGulpTasksBuild());
            pipelineSteps.push(new generateGulpTasksUtil_1.GenerateGulpTasksUtil());
            pipelineSteps.push(new generateUniteConfiguration_1.GenerateUniteConfiguration());
            pipelineSteps.push(new generatePackageJson_1.GeneratePackageJson());
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBQ3RGLCtFQUE0RTtBQUM1RSwyQ0FBd0M7QUFNeEMsa0ZBQStFO0FBQy9FLG9HQUFpRztBQUNqRyxnRkFBNkU7QUFDN0Usb0ZBQWlGO0FBQ2pGLGtGQUErRTtBQUMvRSxnRkFBNkU7QUFDN0UsOEVBQTJFO0FBQzNFLDRGQUF5RjtBQUN6Rix5REFBc0Q7QUFDdEQsdURBQW9EO0FBRXBEO0lBS0ksWUFBWSxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QjtRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksSUFBSSxDQUFDLFdBQXNDLEVBQUUsUUFBbUMsRUFBRSxlQUEwQzs7WUFDckksRUFBRSxDQUFDLENBQUMsQ0FBQyxtQ0FBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQ0FBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLENBQUMsNkJBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLGVBQWdCLENBQUMsQ0FBQztZQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1DQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFOUUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7WUFDcEQsa0JBQWtCLENBQUMsSUFBSSxHQUFHLFdBQVksQ0FBQztZQUN2QyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsUUFBUyxDQUFDO1lBQ3hDLGtCQUFrQixDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7WUFDckQsa0JBQWtCLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUV4QyxNQUFNLGVBQWUsR0FBb0IsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFFL0QsTUFBTSxhQUFhLEdBQTBCLEVBQUUsQ0FBQztZQUNoRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksNkNBQXFCLEVBQUUsQ0FBQyxDQUFDO1lBQ2hELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLDJDQUFvQixFQUFFLENBQUMsQ0FBQztZQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksK0RBQThCLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQ0FBc0IsRUFBRSxDQUFDLENBQUM7WUFDakQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLDZDQUFxQixFQUFFLENBQUMsQ0FBQztZQUNoRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksdURBQTBCLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDLENBQUM7WUFFOUMsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUMzSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBcERELHdCQW9EQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
