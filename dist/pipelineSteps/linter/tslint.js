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
 * Pipeline step to generate tslint configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const tsLintConfiguration_1 = require("../../configuration/models/tslint/tsLintConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class TsLint extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.linter, "TSLint");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super.condition.call(this, uniteConfiguration.sourceLanguage, "TypeScript")) {
                    logger.error("You can only use TSLint when the source language is TypeScript");
                    return 1;
                }
                return _super.fileReadJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, TsLint.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    this.configDefaults(engineVariables);
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
            engineVariables.toggleDevDependency(["tslint"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileToggleJson: { get: () => super.fileToggleJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, TsLint.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new tsLintConfiguration_1.TsLintConfiguration();
        defaultConfiguration.extends = "tslint:recommended";
        defaultConfiguration.rulesDirectory = [];
        defaultConfiguration.rules = {};
        defaultConfiguration.rules["object-literal-sort-keys"] = false;
        defaultConfiguration.rules["trailing-comma"] = [
            true,
            {
                multiline: {
                    objects: "never"
                }
            }
        ];
        defaultConfiguration.rules["no-reference"] = false;
        defaultConfiguration.rules["array-type"] = false;
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("TSLint", this._configuration);
    }
}
TsLint.FILENAME = "tslint.json";
exports.TsLint = TsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnRlci90c0xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLCtGQUE0RjtBQUc1RixvRUFBaUU7QUFFakUsTUFBYSxNQUFPLFNBQVEsbUNBQWdCO0lBS2pDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7Ozs7O1lBQzFDLElBQUksYUFBYSxFQUFFO2dCQUNmLElBQUksQ0FBQyxPQUFNLFNBQVMsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLEVBQUU7b0JBQ25FLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDL0UsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QsT0FBTyxPQUFNLFlBQVksWUFBc0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNwSixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFckMsT0FBTyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7YUFDTjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzVKLE9BQU8sT0FBTSxjQUFjLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixNQUFNLENBQUMsUUFBUSxFQUNmLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFTLEVBQUUsZ0RBQUMsT0FBQSxJQUFJLENBQUMsY0FBYyxDQUFBLEdBQUEsRUFBRTtRQUVqRSxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsZUFBZ0M7UUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7UUFFdkQsb0JBQW9CLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO1FBQ3BELG9CQUFvQixDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekMsb0JBQW9CLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDL0Qsb0JBQW9CLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUc7WUFDM0MsSUFBSTtZQUNKO2dCQUNJLFNBQVMsRUFBRTtvQkFDUCxPQUFPLEVBQUUsT0FBTztpQkFDbkI7YUFDSjtTQUNKLENBQUM7UUFDRixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ25ELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7UUFFakQsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDcEUsQ0FBQzs7QUFyRXVCLGVBQVEsR0FBVyxhQUFhLENBQUM7QUFEN0Qsd0JBdUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGludGVyL3RzTGludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSB0c2xpbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVHNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90c2xpbnQvdHNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFRzTGludCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcInRzbGludC5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBUc0xpbnRDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciwgXCJUU0xpbnRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIFRTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248VHNMaW50Q29uZmlndXJhdGlvbj4obG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHNMaW50LkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ0c2xpbnRcIl0sIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHNMaW50LkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBUc0xpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXh0ZW5kcyA9IFwidHNsaW50OnJlY29tbWVuZGVkXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJ1bGVzRGlyZWN0b3J5ID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJ1bGVzID0ge307XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXNbXCJvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcIl0gPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXNbXCJ0cmFpbGluZy1jb21tYVwiXSA9IFtcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbXVsdGlsaW5lOiB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHM6IFwibmV2ZXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXNbXCJuby1yZWZlcmVuY2VcIl0gPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXNbXCJhcnJheS10eXBlXCJdID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJUU0xpbnRcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
