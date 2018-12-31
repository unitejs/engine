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
 * Pipeline step to generate eslint configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const esLintConfiguration_1 = require("../../configuration/models/eslint/esLintConfiguration");
const esLintParserOptions_1 = require("../../configuration/models/eslint/esLintParserOptions");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class EsLint extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.linter, "ESLint");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super.condition.call(this, uniteConfiguration.sourceLanguage, "JavaScript")) {
                    logger.error("You can only use ESLint when the source language is JavaScript");
                    return 1;
                }
                return _super.fileReadJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    return this.fileReadLines(logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2, engineVariables.force, (lines) => __awaiter(this, void 0, void 0, function* () {
                        this._ignore = lines;
                        this.configDefaults(engineVariables);
                        return 0;
                    }));
                }));
            }
            else {
                return 0;
            }
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["eslint"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileToggleJson: { get: () => super.fileToggleJson },
            fileToggleLines: { get: () => super.fileToggleLines }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super.fileToggleJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
            if (ret === 0) {
                ret = yield _super.fileToggleLines.call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                    this._ignore.push(this.wrapGeneratedMarker("# ", ""));
                    return this._ignore;
                }));
            }
            return ret;
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new esLintConfiguration_1.EsLintConfiguration();
        defaultConfiguration.parser = "espree";
        defaultConfiguration.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        defaultConfiguration.parserOptions.ecmaVersion = 6;
        defaultConfiguration.parserOptions.sourceType = "module";
        defaultConfiguration.parserOptions.ecmaFeatures = {
            legacyDecorators: true
        };
        defaultConfiguration.extends = ["eslint:recommended"];
        defaultConfiguration.env = {
            browser: true
        };
        defaultConfiguration.globals = {
            require: true
        };
        defaultConfiguration.rules = {};
        defaultConfiguration.plugins = [];
        defaultConfiguration.settings = {};
        const defaultIgnore = [
            "dist/*",
            "build/*",
            "test/unit/unit-bootstrap.js",
            "test/unit/unit-module-config.js"
        ];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._ignore = objectHelper_1.ObjectHelper.merge(defaultIgnore, this._ignore);
        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }
        for (let i = this._ignore.length - 1; i >= 0; i--) {
            if (this._ignore[i].trim().length === 0) {
                this._ignore.splice(i, 1);
            }
        }
        engineVariables.setConfiguration("ESLint", this._configuration);
        engineVariables.setConfiguration("ESLint.Ignore", this._ignore);
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnRlci9lc0xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLCtGQUE0RjtBQUM1RiwrRkFBNEY7QUFHNUYsb0VBQWlFO0FBRWpFLE1BQWEsTUFBTyxTQUFRLG1DQUFnQjtJQU9qQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7Ozs7OztZQUMxQyxJQUFJLGFBQWEsRUFBRTtnQkFDZixJQUFJLENBQUMsT0FBTSxTQUFTLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxFQUFFO29CQUNuRSxNQUFNLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7b0JBQy9FLE9BQU8sQ0FBQyxDQUFDO2lCQUNaO2dCQUVELE9BQU8sT0FBTSxZQUFZLFlBQXNCLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFDZixlQUFlLENBQUMsS0FBSyxFQUNyQixDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNyRCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFNBQVMsRUFDaEIsZUFBZSxDQUFDLEtBQUssRUFDckIsQ0FBTyxLQUFLLEVBQUUsRUFBRTt3QkFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7d0JBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQ3JDLE9BQU8sQ0FBQyxDQUFDO29CQUNiLENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBRVgsQ0FBQyxDQUFBLEVBQUU7YUFDVjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7OztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLE9BQU0sY0FBYyxZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUN0QyxhQUFhLEVBQ2IsR0FBUyxFQUFFLGdEQUFDLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQSxHQUFBLENBQUMsQ0FBQztZQUV0RSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsR0FBRyxHQUFHLE1BQU0sT0FBTSxlQUFlLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixNQUFNLENBQUMsU0FBUyxFQUNoQixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFO29CQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsQ0FBQyxDQUFBLENBQUMsQ0FBQzthQUNWO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsZUFBZ0M7UUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7UUFFdkQsb0JBQW9CLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUN2QyxvQkFBb0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDO1FBQy9ELG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3pELG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUc7WUFDOUMsZ0JBQWdCLEVBQUUsSUFBSTtTQUN6QixDQUFDO1FBRUYsb0JBQW9CLENBQUMsT0FBTyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0RCxvQkFBb0IsQ0FBQyxHQUFHLEdBQUc7WUFDdkIsT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQztRQUNGLG9CQUFvQixDQUFDLE9BQU8sR0FBRztZQUMzQixPQUFPLEVBQUUsSUFBSTtTQUNoQixDQUFDO1FBQ0Ysb0JBQW9CLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQyxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFbkMsTUFBTSxhQUFhLEdBQUc7WUFDbEIsUUFBUTtZQUNSLFNBQVM7WUFDVCw2QkFBNkI7WUFDN0IsaUNBQWlDO1NBQ3BDLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0I7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDN0I7U0FDSjtRQUVELGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7O0FBeEh1QixlQUFRLEdBQVcsZ0JBQWdCLENBQUM7QUFDcEMsZ0JBQVMsR0FBVyxlQUFlLENBQUM7QUFGaEUsd0JBMEhDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGludGVyL2VzTGludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBlc2xpbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRXNMaW50UGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50UGFyc2VyT3B0aW9uc1wiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEVzTGludCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5lc2xpbnRyYy5qc29uXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUUyOiBzdHJpbmcgPSBcIi5lc2xpbnRpZ25vcmVcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEVzTGludENvbmZpZ3VyYXRpb247XG4gICAgcHJpdmF0ZSBfaWdub3JlOiBzdHJpbmdbXTtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFwiRVNMaW50XCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGlmICghc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJKYXZhU2NyaXB0XCIpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiWW91IGNhbiBvbmx5IHVzZSBFU0xpbnQgd2hlbiB0aGUgc291cmNlIGxhbmd1YWdlIGlzIEphdmFTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248RXNMaW50Q29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXNMaW50LkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG9iajtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZVJlYWRMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFc0xpbnQuRklMRU5BTUUyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAobGluZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZ25vcmUgPSBsaW5lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImVzbGludFwiXSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFc0xpbnQuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXNMaW50LkZJTEVOQU1FMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5wdXNoKHRoaXMud3JhcEdlbmVyYXRlZE1hcmtlcihcIiMgXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lnbm9yZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBFc0xpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyID0gXCJlc3ByZWVcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyT3B0aW9ucyA9IG5ldyBFc0xpbnRQYXJzZXJPcHRpb25zKCk7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuZWNtYVZlcnNpb24gPSA2O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLnNvdXJjZVR5cGUgPSBcIm1vZHVsZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLmVjbWFGZWF0dXJlcyA9IHtcbiAgICAgICAgICAgIGxlZ2FjeURlY29yYXRvcnM6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5leHRlbmRzID0gW1wiZXNsaW50OnJlY29tbWVuZGVkXCJdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5lbnYgPSB7XG4gICAgICAgICAgICBicm93c2VyOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmdsb2JhbHMgPSB7XG4gICAgICAgICAgICByZXF1aXJlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJ1bGVzID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICBjb25zdCBkZWZhdWx0SWdub3JlID0gW1xuICAgICAgICAgICAgXCJkaXN0LypcIixcbiAgICAgICAgICAgIFwiYnVpbGQvKlwiLFxuICAgICAgICAgICAgXCJ0ZXN0L3VuaXQvdW5pdC1ib290c3RyYXAuanNcIixcbiAgICAgICAgICAgIFwidGVzdC91bml0L3VuaXQtbW9kdWxlLWNvbmZpZy5qc1wiXG4gICAgICAgIF07XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX2lnbm9yZSA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0SWdub3JlLCB0aGlzLl9pZ25vcmUpO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlckxpbmUgPSBzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiIyBcIiwgXCJcIik7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2lnbm9yZS5pbmRleE9mKG1hcmtlckxpbmUpO1xuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5faWdub3JlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faWdub3JlW2ldLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZ25vcmUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJFU0xpbnRcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiRVNMaW50Lklnbm9yZVwiLCB0aGlzLl9pZ25vcmUpO1xuICAgIH1cbn1cbiJdfQ==
