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
const stylintConfiguration_1 = require("../../configuration/models/stylint/stylintConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Stylint extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.cssLinter, "Stylint");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super("condition").call(this, uniteConfiguration.cssPre, "Stylus")) {
                    logger.error("You can only use Stylint when the css preprocessor is Stylus");
                    return 1;
                }
                return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Stylint.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
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
            engineVariables.toggleDevDependency(["stylint", "stylint-stylish"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Stylint.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new stylintConfiguration_1.StylintConfiguration();
        defaultConfiguration.blocks = false;
        defaultConfiguration.brackets = "never";
        defaultConfiguration.colons = "always";
        defaultConfiguration.colors = "always";
        defaultConfiguration.commaSpace = "always";
        defaultConfiguration.commentSpace = "always";
        defaultConfiguration.cssLiteral = "never";
        defaultConfiguration.customProperties = [];
        defaultConfiguration.depthLimit = false;
        defaultConfiguration.duplicates = true;
        defaultConfiguration.efficient = "always";
        defaultConfiguration.exclude = [];
        defaultConfiguration.extendPref = false;
        defaultConfiguration.globalDupe = false;
        defaultConfiguration.groupOutputByFile = true;
        defaultConfiguration.indentPref = false;
        defaultConfiguration.leadingZero = "never";
        defaultConfiguration.maxErrors = false;
        defaultConfiguration.maxWarnings = false;
        defaultConfiguration.mixed = false;
        defaultConfiguration.mixins = [];
        defaultConfiguration.namingConvention = false;
        defaultConfiguration.namingConventionStrict = false;
        defaultConfiguration.none = "never";
        defaultConfiguration.noImportant = true;
        defaultConfiguration.parenSpace = false;
        defaultConfiguration.placeholders = "always";
        defaultConfiguration.prefixVarsWithDollar = "always";
        defaultConfiguration.quotePref = false;
        defaultConfiguration.semicolons = "never";
        defaultConfiguration.sortOrder = "alphabetical";
        defaultConfiguration.stackedProperties = "never";
        defaultConfiguration.trailingWhitespace = "never";
        defaultConfiguration.universal = false;
        defaultConfiguration.valid = true;
        defaultConfiguration.zeroUnits = "never";
        defaultConfiguration.zIndexNormalize = false;
        this._configuration = Object.assign({}, defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Stylint", this._configuration);
    }
}
Stylint.FILENAME = ".stylintrc";
exports.Stylint = Stylint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc0xpbnRlci9zdHlsaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxrR0FBK0Y7QUFHL0Ysb0VBQWlFO0FBRWpFLGFBQXFCLFNBQVEsbUNBQWdCO0lBS2xDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztvQkFDN0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUNELE1BQU0sQ0FBQyxzQkFBa0IsWUFBdUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUN0SixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFckMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUEsRUFBRTtZQUNQLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FB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O1FBQ3ZDLG9CQUFvQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEMsb0JBQW9CLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN6QyxvQkFBb0IsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBRTdDLElBQUksQ0FBQyxjQUFjLHFCQUFPLG9CQUFvQixFQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4RSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyRSxDQUFDOztBQTNGdUIsZ0JBQVEsR0FBVyxZQUFZLENBQUM7QUFENUQsMEJBNkZDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzTGludGVyL3N0eWxpbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgc3R5bGludCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFN0eWxpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3N0eWxpbnQvc3R5bGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdHlsaW50IGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwiLnN0eWxpbnRyY1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogU3R5bGludENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uY3NzTGludGVyLCBcIlN0eWxpbnRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSwgXCJTdHlsdXNcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIFN0eWxpbnQgd2hlbiB0aGUgY3NzIHByZXByb2Nlc3NvciBpcyBTdHlsdXNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVJlYWRKc29uPFN0eWxpbnRDb25maWd1cmF0aW9uPihsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBTdHlsaW50LkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJzdHlsaW50XCIsIFwic3R5bGludC1zdHlsaXNoXCJdLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0eWxpbnQuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFN0eWxpbnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmxvY2tzID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJyYWNrZXRzID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb2xvbnMgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb2xvcnMgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21tYVNwYWNlID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tbWVudFNwYWNlID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY3NzTGl0ZXJhbCA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY3VzdG9tUHJvcGVydGllcyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5kZXB0aExpbWl0ID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmR1cGxpY2F0ZXMgPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5lZmZpY2llbnQgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5leGNsdWRlID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmV4dGVuZFByZWYgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZ2xvYmFsRHVwZSA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5ncm91cE91dHB1dEJ5RmlsZSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmluZGVudFByZWYgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubGVhZGluZ1plcm8gPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1heEVycm9ycyA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tYXhXYXJuaW5ncyA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5taXhlZCA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5taXhpbnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubmFtaW5nQ29udmVudGlvbiA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5uYW1pbmdDb252ZW50aW9uU3RyaWN0ID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm5vbmUgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm5vSW1wb3J0YW50ID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGFyZW5TcGFjZSA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbGFjZWhvbGRlcnMgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wcmVmaXhWYXJzV2l0aERvbGxhciA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnF1b3RlUHJlZiA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zZW1pY29sb25zID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zb3J0T3JkZXIgPSBcImFscGhhYmV0aWNhbFwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zdGFja2VkUHJvcGVydGllcyA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udHJhaWxpbmdXaGl0ZXNwYWNlID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi51bml2ZXJzYWwgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udmFsaWQgPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi56ZXJvVW5pdHMgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnpJbmRleE5vcm1hbGl6ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB7Li4uZGVmYXVsdENvbmZpZ3VyYXRpb24sIC4uLnRoaXMuX2NvbmZpZ3VyYXRpb259O1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiU3R5bGludFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
