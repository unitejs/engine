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
 * Pipeline step to generate configuration for systemjs.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class SystemJs extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.moduleType, "SystemJS");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                engineVariables.syntheticImport = "";
                engineVariables.moduleId = "__moduleName";
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                uniteConfiguration.srcDistReplace = "(System.register.*?)(\.\.\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "$1../dist/";
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "module", "system", mainCondition);
            }
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "env");
                if (foundPreset) {
                    foundPreset[1] = { modules: mainCondition ? "systemjs" : undefined };
                }
                else {
                    babelConfiguration.presets.push(["env", { modules: mainCondition ? "systemjs" : undefined }]);
                }
            }
            return 0;
        });
    }
}
exports.SystemJs = SystemJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvc3lzdGVtSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTzNFLG9FQUFpRTtBQUVqRSxNQUFhLFFBQVMsU0FBUSxtQ0FBZ0I7SUFDbkMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLGFBQWEsRUFBRTtnQkFDZixlQUFlLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztnQkFDckMsZUFBZSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7YUFDN0M7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixJQUFJLGFBQWEsRUFBRTtnQkFDZixrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsbUNBQW1DLENBQUM7Z0JBQ3hFLGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFlBQVksQ0FBQzthQUN4RDtZQUVELE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEwQixZQUFZLENBQUMsQ0FBQztZQUN4RyxJQUFJLHVCQUF1QixFQUFFO2dCQUN6QiwyQkFBWSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUN0RztZQUVELE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztZQUN6RixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7Z0JBQ2pJLElBQUksV0FBVyxFQUFFO29CQUNiLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ3hFO3FCQUFNO29CQUNILGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDakc7YUFDSjtZQUVELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFwQ0QsNEJBb0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9zeXN0ZW1Kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBzeXN0ZW1qcy5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgQmFiZWxDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2JhYmVsL2JhYmVsQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVHlwZVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHlwZVNjcmlwdC90eXBlU2NyaXB0Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFN5c3RlbUpzIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKSA6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBcIlN5c3RlbUpTXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc3ludGhldGljSW1wb3J0ID0gXCJcIjtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5tb2R1bGVJZCA9IFwiX19tb2R1bGVOYW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlID0gXCIoU3lzdGVtLnJlZ2lzdGVyLio/KShcXC5cXC5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2VXaXRoID0gXCIkMS4uL2Rpc3QvXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIGlmICh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwibW9kdWxlXCIsIFwic3lzdGVtXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFiZWxDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248QmFiZWxDb25maWd1cmF0aW9uPihcIkJhYmVsXCIpO1xuICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZFByZXNldCA9IGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLmZpbmQocHJlc2V0ID0+IEFycmF5LmlzQXJyYXkocHJlc2V0KSAmJiBwcmVzZXQubGVuZ3RoID4gMCAmJiBwcmVzZXRbMF0gPT09IFwiZW52XCIpO1xuICAgICAgICAgICAgaWYgKGZvdW5kUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgZm91bmRQcmVzZXRbMV0gPSB7IG1vZHVsZXM6IG1haW5Db25kaXRpb24gPyBcInN5c3RlbWpzXCIgOiB1bmRlZmluZWQgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMucHVzaChbXCJlbnZcIiwgeyBtb2R1bGVzOiBtYWluQ29uZGl0aW9uID8gXCJzeXN0ZW1qc1wiIDogdW5kZWZpbmVkIH1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
