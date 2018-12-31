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
 * Pipeline step to generate typeDoc configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const typeDocConfiguration_1 = require("../../configuration/models/typeDoc/typeDocConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class TypeDoc extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.documenter, "TypeDoc");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super.condition.call(this, uniteConfiguration.sourceLanguage, "TypeScript")) {
                    logger.error("You can only use TypeDoc when the source language is TypeScript");
                    return 1;
                }
                return _super.fileReadJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, TypeDoc.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    this.configDefaults(fileSystem, uniteConfiguration, engineVariables);
                    return 0;
                }));
            }
            else {
                return 0;
            }
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["typedoc"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            folderCreate: { get: () => super.folderCreate },
            fileToggleJson: { get: () => super.fileToggleJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super.folderCreate.call(this, logger, fileSystem, engineVariables.docsRootFolder);
            if (ret === 0) {
                ret = yield _super.fileToggleJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, TypeDoc.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
            }
            return ret;
        });
    }
    configDefaults(fileSystem, uniteConfiguration, engineVariables) {
        const defaultConfiguration = new typeDocConfiguration_1.TypeDocConfiguration();
        defaultConfiguration.mode = "file";
        defaultConfiguration.theme = "default";
        defaultConfiguration.out = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.docsRootFolder))
            .replace(/^\.\//, "");
        defaultConfiguration.includeDeclarations = false;
        defaultConfiguration.externalPattern = "**/*.d.ts";
        defaultConfiguration.excludeExternals = true;
        defaultConfiguration.ignoreCompilerErrors = true;
        defaultConfiguration.module = "es2015";
        defaultConfiguration.target = "es2015";
        defaultConfiguration.moduleResolution = "node";
        defaultConfiguration.experimentalDecorators = true;
        defaultConfiguration.emitDecoratorMetadata = true;
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("TypeDoc", this._configuration);
    }
}
TypeDoc.FILENAME = "typedoc.json";
exports.TypeDoc = TypeDoc;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2RvY3VtZW50ZXIvdHlwZURvYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFHM0Usa0dBQStGO0FBRy9GLG9FQUFpRTtBQUVqRSxNQUFhLE9BQVEsU0FBUSxtQ0FBZ0I7SUFLbEMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7Ozs7WUFDMUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLE9BQU0sU0FBUyxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsRUFBRTtvQkFDbkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO29CQUNoRixPQUFPLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxPQUFPLE9BQU0sWUFBWSxZQUF1QixNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLENBQU8sR0FBRyxFQUFFLEVBQUU7b0JBQ3RKLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUUxQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFFckUsT0FBTyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7YUFDTjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRWhFLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7OztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLE9BQU0sWUFBWSxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXZGLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDWCxHQUFHLEdBQUcsTUFBTSxPQUFNLGNBQWMsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFTLEVBQUUsZ0RBQUMsT0FBQSxJQUFJLENBQUMsY0FBYyxDQUFBLEdBQUEsQ0FBQyxDQUFDO2FBQ3JFO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQztRQUNwSCxNQUFNLG9CQUFvQixHQUFHLElBQUksMkNBQW9CLEVBQUUsQ0FBQztRQUV4RCxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ25DLG9CQUFvQixDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDdkMsb0JBQW9CLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3RJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUIsb0JBQW9CLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pELG9CQUFvQixDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUM7UUFDbkQsb0JBQW9CLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdDLG9CQUFvQixDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUVqRCxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdkMsb0JBQW9CLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1FBQy9DLG9CQUFvQixDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztRQUNuRCxvQkFBb0IsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFFbEQsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsQ0FBQzs7QUF6RXVCLGdCQUFRLEdBQVcsY0FBYyxDQUFDO0FBRDlELDBCQTJFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2RvY3VtZW50ZXIvdHlwZURvYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSB0eXBlRG9jIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFR5cGVEb2NDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3R5cGVEb2MvdHlwZURvY0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBUeXBlRG9jIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwidHlwZWRvYy5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBUeXBlRG9jQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5kb2N1bWVudGVyLCBcIlR5cGVEb2NcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIFR5cGVEb2Mgd2hlbiB0aGUgc291cmNlIGxhbmd1YWdlIGlzIFR5cGVTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVJlYWRKc29uPFR5cGVEb2NDb25maWd1cmF0aW9uPihsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlRG9jLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInR5cGVkb2NcIl0sIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLmRvY3NSb290Rm9sZGVyKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUeXBlRG9jLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgVHlwZURvY0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tb2RlID0gXCJmaWxlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnRoZW1lID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm91dCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLmRvY3NSb290Rm9sZGVyKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmluY2x1ZGVEZWNsYXJhdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXh0ZXJuYWxQYXR0ZXJuID0gXCIqKi8qLmQudHNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXhjbHVkZUV4dGVybmFscyA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmlnbm9yZUNvbXBpbGVyRXJyb3JzID0gdHJ1ZTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tb2R1bGUgPSBcImVzMjAxNVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50YXJnZXQgPSBcImVzMjAxNVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tb2R1bGVSZXNvbHV0aW9uID0gXCJub2RlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmV4cGVyaW1lbnRhbERlY29yYXRvcnMgPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5lbWl0RGVjb3JhdG9yTWV0YWRhdGEgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiVHlwZURvY1wiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
