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
 * Pipeline step to generate configuration for commonjs.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class CommonJs extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.moduleType, "CommonJS");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                engineVariables.syntheticImport = "* as ";
                engineVariables.moduleId = "module.id.toString()";
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                uniteConfiguration.srcDistReplace = "(require.*?)(\.\.\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "$1../dist/";
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "module", "commonjs", mainCondition);
            }
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "env");
                if (foundPreset) {
                    foundPreset[1] = { modules: mainCondition ? "commonjs" : undefined };
                }
                else {
                    babelConfiguration.presets.push(["env", { modules: mainCondition ? "commonjs" : undefined }]);
                }
            }
            return 0;
        });
    }
}
exports.CommonJs = CommonJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTzNFLG9FQUFpRTtBQUVqRSxNQUFhLFFBQVMsU0FBUSxtQ0FBZ0I7SUFDbkMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLGFBQWEsRUFBRTtnQkFDZixlQUFlLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztnQkFDMUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQzthQUNyRDtZQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLElBQUksYUFBYSxFQUFFO2dCQUNmLGtCQUFrQixDQUFDLGNBQWMsR0FBRywyQkFBMkIsQ0FBQztnQkFDaEUsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsWUFBWSxDQUFDO2FBQ3hEO1lBRUQsTUFBTSx1QkFBdUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTBCLFlBQVksQ0FBQyxDQUFDO1lBQ3hHLElBQUksdUJBQXVCLEVBQUU7Z0JBQ3pCLDJCQUFZLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2FBQ3hHO1lBRUQsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXFCLE9BQU8sQ0FBQyxDQUFDO1lBQ3pGLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3BCLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFDakksSUFBSSxXQUFXLEVBQUU7b0JBQ2IsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDeEU7cUJBQU07b0JBQ0gsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNqRzthQUNKO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXBDRCw0QkFvQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2NvbW1vbkpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvbmZpZ3VyYXRpb24gZm9yIGNvbW1vbmpzLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29tbW9uSnMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJDb21tb25KU1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnN5bnRoZXRpY0ltcG9ydCA9IFwiKiBhcyBcIjtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5tb2R1bGVJZCA9IFwibW9kdWxlLmlkLnRvU3RyaW5nKClcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2UgPSBcIihyZXF1aXJlLio/KShcXC5cXC5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2VXaXRoID0gXCIkMS4uL2Rpc3QvXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIGlmICh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwibW9kdWxlXCIsIFwiY29tbW9uanNcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiYWJlbENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxCYWJlbENvbmZpZ3VyYXRpb24+KFwiQmFiZWxcIik7XG4gICAgICAgIGlmIChiYWJlbENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kUHJlc2V0ID0gYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMuZmluZChwcmVzZXQgPT4gQXJyYXkuaXNBcnJheShwcmVzZXQpICYmIHByZXNldC5sZW5ndGggPiAwICYmIHByZXNldFswXSA9PT0gXCJlbnZcIik7XG4gICAgICAgICAgICBpZiAoZm91bmRQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZFByZXNldFsxXSA9IHsgbW9kdWxlczogbWFpbkNvbmRpdGlvbiA/IFwiY29tbW9uanNcIiA6IHVuZGVmaW5lZCB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWJlbENvbmZpZ3VyYXRpb24ucHJlc2V0cy5wdXNoKFtcImVudlwiLCB7IG1vZHVsZXM6IG1haW5Db25kaXRpb24gPyBcImNvbW1vbmpzXCIgOiB1bmRlZmluZWQgfV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
