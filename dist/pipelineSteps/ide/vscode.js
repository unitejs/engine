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
 * Pipeline step to generate vscode configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const javaScriptCompilerOptions_1 = require("../../configuration/models/vscode/javaScriptCompilerOptions");
const javaScriptConfiguration_1 = require("../../configuration/models/vscode/javaScriptConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class VsCode extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.arrayCondition(uniteConfiguration.ides, "VSCode") && super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return _super.fileReadJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, VsCode.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    this.configDefaults(fileSystem, engineVariables);
                    return 0;
                }));
            }
            else {
                return 0;
            }
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileToggleJson: { get: () => super.fileToggleJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, VsCode.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new javaScriptConfiguration_1.JavaScriptConfiguration();
        defaultConfiguration.compilerOptions = new javaScriptCompilerOptions_1.JavaScriptCompilerOptions();
        defaultConfiguration.compilerOptions.target = "es5";
        defaultConfiguration.include = [
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.src))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unit))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2e))}**/*`
        ];
        defaultConfiguration.exclude = [];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("JavaScript", this._configuration);
    }
}
VsCode.FILENAME = "jsconfig.json";
exports.VsCode = VsCode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2lkZS92c2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBSTNFLDJHQUF3RztBQUN4Ryx1R0FBb0c7QUFFcEcsb0VBQWlFO0FBRWpFLE1BQWEsTUFBTyxTQUFRLG1DQUFnQjtJQUtqQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN2SSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7Ozs7O1lBQzFDLElBQUksYUFBYSxFQUFFO2dCQUNmLE9BQU8sT0FBTSxZQUFZLFlBQTBCLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFDZixlQUFlLENBQUMsS0FBSyxFQUNyQixDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUN6RCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBRWpELE9BQU8sQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQSxFQUFFO2FBQ1Y7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7OztZQUM1SixPQUFPLE9BQU0sY0FBYyxZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFDZixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFLGdEQUFDLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQSxHQUFBLEVBQUU7UUFFakUsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLFVBQXVCLEVBQUUsZUFBZ0M7UUFDNUUsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFFM0Qsb0JBQW9CLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztRQUN2RSxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwRCxvQkFBb0IsQ0FBQyxPQUFPLEdBQUc7WUFDM0IsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTTtZQUN2SCxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO1lBQ3hILEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU07U0FDMUgsQ0FBQztRQUNGLG9CQUFvQixDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFbEMsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7QUF6RHVCLGVBQVEsR0FBVyxlQUFlLENBQUM7QUFEL0Qsd0JBMkRDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvaWRlL3ZzY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSB2c2NvZGUgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdENvbXBpbGVyT3B0aW9ucyB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy92c2NvZGUvamF2YVNjcmlwdENvbXBpbGVyT3B0aW9uc1wiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdnNjb2RlL2phdmFTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgVnNDb2RlIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwianNjb25maWcuanNvblwiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogSmF2YVNjcmlwdENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFycmF5Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5pZGVzLCBcIlZTQ29kZVwiKSAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIkphdmFTY3JpcHRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxKYXZhU2NyaXB0Q29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVnNDb2RlLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWc0NvZGUuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBKYXZhU2NyaXB0Q29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucyA9IG5ldyBKYXZhU2NyaXB0Q29tcGlsZXJPcHRpb25zKCk7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy50YXJnZXQgPSBcImVzNVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5pbmNsdWRlID0gW1xuICAgICAgICAgICAgYCR7ZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjKSl9KiovKmAsXG4gICAgICAgICAgICBgJHtmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy51bml0KSl9KiovKmAsXG4gICAgICAgICAgICBgJHtmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5lMmUpKX0qKi8qYFxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5leGNsdWRlID0gW107XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJKYXZhU2NyaXB0XCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
