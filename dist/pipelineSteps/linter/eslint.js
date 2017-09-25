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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript")) {
                    logger.error("You can only use ESLint when the source language is JavaScript");
                    return 1;
                }
                return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    return _super("fileReadLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2, engineVariables.force, (lines) => __awaiter(this, void 0, void 0, function* () {
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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
            if (ret === 0) {
                ret = yield _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                    this._ignore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
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
        defaultConfiguration.parserOptions.ecmaFeatures = {};
        defaultConfiguration.extends = ["eslint:recommended"];
        defaultConfiguration.env = {
            browser: true
        };
        defaultConfiguration.globals = {
            require: true
        };
        defaultConfiguration.rules = {};
        defaultConfiguration.plugins = [];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnRlci9lc0xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLCtGQUE0RjtBQUM1RiwrRkFBNEY7QUFHNUYsb0VBQWlFO0FBRWpFLFlBQW9CLFNBQVEsbUNBQWdCO0lBT2pDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxzQkFBa0IsWUFBc0IsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixNQUFNLENBQUMsUUFBUSxFQUNmLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sR0FBRztvQkFDakQsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyx1QkFBbUIsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sS0FBSzt3QkFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7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QUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQztRQUVELGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7O0FBckhjLGVBQVEsR0FBVyxnQkFBZ0IsQ0FBQztBQUNwQyxnQkFBUyxHQUFXLGVBQWUsQ0FBQztBQUZ2RCx3QkF1SEMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9saW50ZXIvZXNMaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGVzbGludCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFc0xpbnRQYXJzZXJPcHRpb25zIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRQYXJzZXJPcHRpb25zXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgRXNMaW50IGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwiLmVzbGludHJjLmpzb25cIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTI6IHN0cmluZyA9IFwiLmVzbGludGlnbm9yZVwiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogRXNMaW50Q29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9pZ25vcmU6IHN0cmluZ1tdO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciwgXCJFU0xpbnRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIkphdmFTY3JpcHRcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIEVTTGludCB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxFc0xpbnRDb25maWd1cmF0aW9uPihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFc0xpbnQuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVJlYWRMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFc0xpbnQuRklMRU5BTUUyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChsaW5lcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZSA9IGxpbmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiZXNsaW50XCJdLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVzTGludC5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVUb2dnbGVMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFc0xpbnQuRklMRU5BTUUyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWdub3JlLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIiMgXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lnbm9yZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBFc0xpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyID0gXCJlc3ByZWVcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyc2VyT3B0aW9ucyA9IG5ldyBFc0xpbnRQYXJzZXJPcHRpb25zKCk7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuZWNtYVZlcnNpb24gPSA2O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLnNvdXJjZVR5cGUgPSBcIm1vZHVsZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLmVjbWFGZWF0dXJlcyA9IHt9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmV4dGVuZHMgPSBbXCJlc2xpbnQ6cmVjb21tZW5kZWRcIl07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVudiA9IHtcbiAgICAgICAgICAgIGJyb3dzZXI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZ2xvYmFscyA9IHtcbiAgICAgICAgICAgIHJlcXVpcmU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucnVsZXMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGx1Z2lucyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGRlZmF1bHRJZ25vcmUgPSBbXG4gICAgICAgICAgICBcImRpc3QvKlwiLFxuICAgICAgICAgICAgXCJidWlsZC8qXCIsXG4gICAgICAgICAgICBcInRlc3QvdW5pdC91bml0LWJvb3RzdHJhcC5qc1wiLFxuICAgICAgICAgICAgXCJ0ZXN0L3VuaXQvdW5pdC1tb2R1bGUtY29uZmlnLmpzXCJcbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5faWdub3JlID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRJZ25vcmUsIHRoaXMuX2lnbm9yZSk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyTGluZSA9IHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIjIFwiLCBcIlwiKTtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5faWdub3JlLmluZGV4T2YobWFya2VyTGluZSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5faWdub3JlLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9pZ25vcmUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZ25vcmVbaV0udHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkVTTGludFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJFU0xpbnQuSWdub3JlXCIsIHRoaXMuX2lnbm9yZSk7XG4gICAgfVxufVxuIl19
