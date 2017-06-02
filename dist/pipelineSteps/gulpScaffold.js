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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulpfile.js in", { outputDirectory: uniteConfiguration.outputDirectory });
                const lines = [];
                lines.push("require('require-dir')('build/tasks');");
                engineVariables.requiredDevDependencies.push("gulp");
                engineVariables.requiredDevDependencies.push("require-dir");
                yield fileSystem.fileWriteLines(uniteConfiguration.outputDirectory, "gulpfile.js", lines);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulpfile.js failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
            engineVariables.gulpBuildFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\build");
            try {
                _super("log").call(this, logger, display, "Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                yield fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }
            engineVariables.gulpTasksFolder = fileSystem.directoryPathCombine(engineVariables.gulpBuildFolder, "\\tasks");
            try {
                _super("log").call(this, logger, display, "Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                yield fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
            engineVariables.gulpUtilFolder = fileSystem.directoryPathCombine(engineVariables.gulpTasksFolder, "\\util");
            try {
                _super("log").call(this, logger, display, "Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                yield fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        });
    }
}
exports.GulpScaffold = GulpScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFNjYWZmb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSw2RUFBMEU7QUFNMUUsa0JBQTBCLFNBQVEsK0NBQXNCO0lBQ3ZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUVqSCxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7Z0JBRTNCLEtBQUssQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFFckQsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckQsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFNUQsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUYsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUM1SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELGVBQWUsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNqSCxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNsSCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2hJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsZUFBZSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNsSCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2hJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsZUFBZSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RyxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUMvRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUNBQXFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTlDRCxvQ0E4Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9ndWxwU2NhZmZvbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
