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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc0xpbnRlci9zdHlsaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxrR0FBK0Y7QUFHL0Ysb0VBQWlFO0FBRWpFLGFBQXFCLFNBQVEsbUNBQWdCO0lBS2xDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7O1lBQzFDLElBQUksYUFBYSxFQUFFO2dCQUNmLElBQUksQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRTtvQkFDdkQsTUFBTSxDQUFDLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUM3RSxPQUFPLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxPQUFPLHNCQUFrQixZQUF1QixNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLENBQU8sR0FBRyxFQUFFLEVBQUU7b0JBQ3RKLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUUxQixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUVyQyxPQUFPLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUEsRUFBRTthQUNOO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxDQUFDO2FBQ1o7UUFDTCxDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxFQUFF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Q0FBQztRQUU3QyxJQUFJLENBQUMsY0FBYyxxQkFBTyxvQkFBb0IsRUFBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsQ0FBQzs7QUEzRnVCLGdCQUFRLEdBQVcsWUFBWSxDQUFDO0FBRDVELDBCQTZGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc0xpbnRlci9zdHlsaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHN0eWxpbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBTdHlsaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9zdHlsaW50L3N0eWxpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgU3R5bGludCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5zdHlsaW50cmNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFN0eWxpbnRDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmNzc0xpbnRlciwgXCJTdHlsaW50XCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGlmICghc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFwiU3R5bHVzXCIpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiWW91IGNhbiBvbmx5IHVzZSBTdHlsaW50IHdoZW4gdGhlIGNzcyBwcmVwcm9jZXNzb3IgaXMgU3R5bHVzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxTdHlsaW50Q29uZmlndXJhdGlvbj4obG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgU3R5bGludC5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG9iajtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wic3R5bGludFwiLCBcInN0eWxpbnQtc3R5bGlzaFwiXSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHlsaW50LkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBTdHlsaW50Q29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJsb2NrcyA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5icmFja2V0cyA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29sb25zID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29sb3JzID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tbWFTcGFjZSA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbW1lbnRTcGFjZSA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNzc0xpdGVyYWwgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmN1c3RvbVByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZGVwdGhMaW1pdCA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5kdXBsaWNhdGVzID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZWZmaWNpZW50ID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXhjbHVkZSA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5leHRlbmRQcmVmID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmdsb2JhbER1cGUgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZ3JvdXBPdXRwdXRCeUZpbGUgPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5pbmRlbnRQcmVmID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmxlYWRpbmdaZXJvID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tYXhFcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWF4V2FybmluZ3MgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWl4ZWQgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWl4aW5zID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm5hbWluZ0NvbnZlbnRpb24gPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubmFtaW5nQ29udmVudGlvblN0cmljdCA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5ub25lID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5ub0ltcG9ydGFudCA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBhcmVuU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGxhY2Vob2xkZXJzID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlZml4VmFyc1dpdGhEb2xsYXIgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5xdW90ZVByZWYgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2VtaWNvbG9ucyA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc29ydE9yZGVyID0gXCJhbHBoYWJldGljYWxcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc3RhY2tlZFByb3BlcnRpZXMgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnRyYWlsaW5nV2hpdGVzcGFjZSA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udW5pdmVyc2FsID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uemVyb1VuaXRzID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi56SW5kZXhOb3JtYWxpemUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gey4uLmRlZmF1bHRDb25maWd1cmF0aW9uLCAuLi50aGlzLl9jb25maWd1cmF0aW9ufTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIlN0eWxpbnRcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
