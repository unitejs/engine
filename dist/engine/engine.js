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
const uniteModuleLoader_1 = require("../configuration/models/unite/uniteModuleLoader");
const uniteSourceLanguage_1 = require("../configuration/models/unite/uniteSourceLanguage");
const enumEx_1 = require("../core/enumEx");
const createOutputDirectory_1 = require("../pipelineSteps/createOutputDirectory");
const generateAppScaffold_1 = require("../pipelineSteps/generateAppScaffold");
const generateBabelConfiguration_1 = require("../pipelineSteps/generateBabelConfiguration");
const generateGulpBuildConfiguration_1 = require("../pipelineSteps/generateGulpBuildConfiguration");
const generateGulpScaffold_1 = require("../pipelineSteps/generateGulpScaffold");
const generateGulpTasksBuild_1 = require("../pipelineSteps/generateGulpTasksBuild");
const generateGulpTasksUtil_1 = require("../pipelineSteps/generateGulpTasksUtil");
const generateHtmlTemplate_1 = require("../pipelineSteps/generateHtmlTemplate");
const generateModuleLoaderScaffold_1 = require("../pipelineSteps/generateModuleLoaderScaffold");
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
    init(packageName, title, sourceLanguage, moduleLoader, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "title", title)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "sourceLanguage", sourceLanguage, enumEx_1.EnumEx.getNames(uniteSourceLanguage_1.UniteSourceLanguage))) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleLoader", moduleLoader, enumEx_1.EnumEx.getNames(uniteModuleLoader_1.UniteModuleLoader))) {
                return 1;
            }
            outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory);
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
                return 1;
            }
            this._logger.info("Engine::init", { packageName, sourceLanguage, moduleLoader, outputDirectory });
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            uniteConfiguration.packageName = packageName;
            uniteConfiguration.title = title;
            uniteConfiguration.sourceLanguage = sourceLanguage;
            uniteConfiguration.moduleLoader = moduleLoader;
            uniteConfiguration.outputDirectory = outputDirectory;
            uniteConfiguration.staticClientModules = [];
            const engineVariables = new engineVariables_1.EngineVariables();
            engineVariables.uniteSourceLanguage = enumEx_1.EnumEx.getValueByName(uniteSourceLanguage_1.UniteSourceLanguage, uniteConfiguration.sourceLanguage);
            engineVariables.uniteModuleLoader = enumEx_1.EnumEx.getValueByName(uniteModuleLoader_1.UniteModuleLoader, uniteConfiguration.moduleLoader);
            engineVariables.requiredDependencies = [];
            engineVariables.requiredDevDependencies = [];
            engineVariables.assetsDirectory = "./node_modules/unitejs-core/dist/assets/";
            engineVariables.dependenciesFile = "unite-dependencies.json";
            const pipelineSteps = [];
            pipelineSteps.push(new createOutputDirectory_1.CreateOutputDirectory());
            pipelineSteps.push(new generateAppScaffold_1.GenerateAppScaffold());
            pipelineSteps.push(new generateGulpScaffold_1.GenerateGulpScaffold());
            pipelineSteps.push(new generateGulpBuildConfiguration_1.GenerateGulpBuildConfiguration());
            pipelineSteps.push(new generateGulpTasksBuild_1.GenerateGulpTasksBuild());
            pipelineSteps.push(new generateGulpTasksUtil_1.GenerateGulpTasksUtil());
            pipelineSteps.push(new generateModuleLoaderScaffold_1.GenerateModuleLoaderScaffold());
            pipelineSteps.push(new generateHtmlTemplate_1.GenerateHtmlTemplate());
            pipelineSteps.push(new generateBabelConfiguration_1.GenerateBabelConfiguration());
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBQ3RGLHVGQUFvRjtBQUNwRiwyRkFBd0Y7QUFDeEYsMkNBQXdDO0FBTXhDLGtGQUErRTtBQUMvRSw4RUFBMkU7QUFDM0UsNEZBQXlGO0FBQ3pGLG9HQUFpRztBQUNqRyxnRkFBNkU7QUFDN0Usb0ZBQWlGO0FBQ2pGLGtGQUErRTtBQUMvRSxnRkFBNkU7QUFDN0UsZ0dBQTZGO0FBQzdGLDhFQUEyRTtBQUMzRSw0RkFBeUY7QUFDekYseURBQXNEO0FBQ3RELHVEQUFvRDtBQUVwRDtJQUtJLFlBQVksTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUI7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVZLElBQUksQ0FBQyxXQUFzQyxFQUN0QyxLQUFnQyxFQUNoQyxjQUF5QyxFQUN6QyxZQUF1QyxFQUN2QyxlQUEwQzs7WUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQ0FBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQ0FBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsbUNBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGVBQU0sQ0FBQyxRQUFRLENBQUMseUNBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLG1DQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsZUFBTSxDQUFDLFFBQVEsQ0FBQyxxQ0FBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLGVBQWdCLENBQUMsQ0FBQztZQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1DQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1lBQ3BELGtCQUFrQixDQUFDLFdBQVcsR0FBRyxXQUFZLENBQUM7WUFDOUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLEtBQU0sQ0FBQztZQUNsQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsY0FBZSxDQUFDO1lBQ3BELGtCQUFrQixDQUFDLFlBQVksR0FBRyxZQUFhLENBQUM7WUFDaEQsa0JBQWtCLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztZQUNyRCxrQkFBa0IsQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFFNUMsTUFBTSxlQUFlLEdBQW9CLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQy9ELGVBQWUsQ0FBQyxtQkFBbUIsR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFzQix5Q0FBbUIsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN6SSxlQUFlLENBQUMsaUJBQWlCLEdBQUcsZUFBTSxDQUFDLGNBQWMsQ0FBb0IscUNBQWlCLEVBQUUsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakksZUFBZSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztZQUMxQyxlQUFlLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1lBQzdDLGVBQWUsQ0FBQyxlQUFlLEdBQUcsMENBQTBDLENBQUM7WUFDN0UsZUFBZSxDQUFDLGdCQUFnQixHQUFHLHlCQUF5QixDQUFDO1lBRTdELE1BQU0sYUFBYSxHQUEwQixFQUFFLENBQUM7WUFDaEQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLDZDQUFxQixFQUFFLENBQUMsQ0FBQztZQUNoRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUkseUNBQW1CLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLCtEQUE4QixFQUFFLENBQUMsQ0FBQztZQUN6RCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksK0NBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSw2Q0FBcUIsRUFBRSxDQUFDLENBQUM7WUFDaEQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLDJEQUE0QixFQUFFLENBQUMsQ0FBQztZQUN2RCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksMkNBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSx1REFBMEIsRUFBRSxDQUFDLENBQUM7WUFDckQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLHVEQUEwQixFQUFFLENBQUMsQ0FBQztZQUNyRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUkseUNBQW1CLEVBQUUsQ0FBQyxDQUFDO1lBRTlDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDM0gsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXpFRCx3QkF5RUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
