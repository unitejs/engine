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
 * Package Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
const pipelineKey_1 = require("../engine/pipelineKey");
class PackageCommand extends engineCommandBase_1.EngineCommandBase {
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, undefined, undefined, false);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            return this.packageAdd(args, uniteConfiguration);
        });
    }
    packageAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
                return 1;
            }
            this._logger.info("");
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            const rootPackageFolder = this._fileSystem.pathCombine(engineVariables.engineRootFolder, "node_modules/unitejs-packages/assets/");
            const packageFolder = this._fileSystem.pathCombine(rootPackageFolder, args.packageName);
            const packageDirExists = yield this._fileSystem.directoryExists(packageFolder);
            let ret = 0;
            if (packageDirExists) {
                this.displayCompletionMessage(engineVariables, true);
            }
            else {
                ret = 1;
                this._logger.error(`Package folder '${packageFolder}' does not exist`);
            }
            return ret;
        });
    }
}
exports.PackageCommand = PackageCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFFekYsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUM1RCx1REFBb0Q7QUFJcEQsb0JBQTRCLFNBQVEscUNBQWlCO0lBQ3BDLEdBQUcsQ0FBQyxJQUEyQjs7WUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFM0csRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Z0JBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0lBRWEsVUFBVSxDQUFDLElBQTJCLEVBQUUsa0JBQXNDOztZQUN4RixFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXRCLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRXRGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLHVDQUF1QyxDQUFDLENBQUM7WUFFbEksTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXhGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUUvRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLGFBQWEsa0JBQWtCLENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBMUNELHdDQTBDQyIsImZpbGUiOiJjb21tYW5kcy9wYWNrYWdlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSVBhY2thZ2VDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VDb21tYW5kUGFyYW1zXCI7XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlQ29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIGltcGxlbWVudHMgSUVuZ2luZUNvbW1hbmQ8SVBhY2thZ2VDb21tYW5kUGFyYW1zPiB7XG4gICAgcHVibGljIGFzeW5jIHJ1bihhcmdzOiBJUGFja2FnZUNvbW1hbmRQYXJhbXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5fcGlwZWxpbmUudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnBhY2thZ2VBZGQoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBhY2thZ2VBZGQoYXJnczogSVBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgYXJncy5wYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGNvbnN0IHJvb3RQYWNrYWdlRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lUm9vdEZvbGRlciwgXCJub2RlX21vZHVsZXMvdW5pdGVqcy1wYWNrYWdlcy9hc3NldHMvXCIpO1xuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHJvb3RQYWNrYWdlRm9sZGVyLCBhcmdzLnBhY2thZ2VOYW1lKTtcblxuICAgICAgICBjb25zdCBwYWNrYWdlRGlyRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMocGFja2FnZUZvbGRlcik7XG5cbiAgICAgICAgbGV0IHJldCA9IDA7XG4gICAgICAgIGlmIChwYWNrYWdlRGlyRXhpc3RzKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDb21wbGV0aW9uTWVzc2FnZShlbmdpbmVWYXJpYWJsZXMsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGFja2FnZSBmb2xkZXIgJyR7cGFja2FnZUZvbGRlcn0nIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
