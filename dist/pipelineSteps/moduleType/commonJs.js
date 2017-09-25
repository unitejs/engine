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
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTzNFLG9FQUFpRTtBQUVqRSxjQUFzQixTQUFRLG1DQUFnQjtJQUNuQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsa0JBQWtCLENBQUMsY0FBYyxHQUFHLHdCQUF3QixDQUFDO2dCQUM3RCxrQkFBa0IsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUM7WUFDdkQsQ0FBQztZQUVELE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEwQixZQUFZLENBQUMsQ0FBQztZQUN4RyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLDJCQUFZLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3pHLENBQUM7WUFFRCxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBcUIsT0FBTyxDQUFDLENBQUM7WUFDekYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFDakksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDZCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsYUFBYSxHQUFHLFVBQVUsR0FBRyxTQUFTLEVBQUUsQ0FBQztnQkFDekUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLGFBQWEsR0FBRyxVQUFVLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRyxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQTVCRCw0QkE0QkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2NvbW1vbkpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvbmZpZ3VyYXRpb24gZm9yIGNvbW1vbmpzLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29tbW9uSnMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJDb21tb25KU1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2UgPSBcIihyZXF1aXJlKSo/KC4uXFwvc3JjXFwvKVwiO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlV2l0aCA9IFwiLi4vZGlzdC9cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGVTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VHlwZVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucywgXCJtb2R1bGVcIiwgXCJjb21tb25qc1wiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgaWYgKGJhYmVsQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgZm91bmRQcmVzZXQgPSBiYWJlbENvbmZpZ3VyYXRpb24ucHJlc2V0cy5maW5kKHByZXNldCA9PiBBcnJheS5pc0FycmF5KHByZXNldCkgJiYgcHJlc2V0Lmxlbmd0aCA+IDAgJiYgcHJlc2V0WzBdID09PSBcImVudlwiKTtcbiAgICAgICAgICAgIGlmIChmb3VuZFByZXNldCkge1xuICAgICAgICAgICAgICAgIGZvdW5kUHJlc2V0WzFdID0geyBtb2R1bGVzOiBtYWluQ29uZGl0aW9uID8gXCJjb21tb25qc1wiIDogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLnB1c2goW1wiZW52XCIsIHsgbW9kdWxlczogbWFpbkNvbmRpdGlvbiA/IFwiY29tbW9uanNcIiA6IHVuZGVmaW5lZCB9XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
