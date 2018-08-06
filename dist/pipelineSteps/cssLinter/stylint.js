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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc0xpbnRlci9zdHlsaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxrR0FBK0Y7QUFHL0Ysb0VBQWlFO0FBRWpFLE1BQWEsT0FBUSxTQUFRLG1DQUFnQjtJQUtsQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7OztZQUMxQyxJQUFJLGFBQWEsRUFBRTtnQkFDZixJQUFJLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUU7b0JBQ3ZELE1BQU0sQ0FBQyxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztvQkFDN0UsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QsT0FBTyxzQkFBa0IsWUFBdUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUN0SixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFckMsT0FBTyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7YUFDTjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMs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QUFLLENBQUM7UUFFN0MsSUFBSSxDQUFDLGNBQWMscUJBQU8sb0JBQW9CLEVBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXhFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7O0FBM0Z1QixnQkFBUSxHQUFXLFlBQVksQ0FBQztBQUQ1RCwwQkE2RkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NMaW50ZXIvc3R5bGludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzdHlsaW50IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgU3R5bGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3R5bGludC9zdHlsaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFN0eWxpbnQgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRTogc3RyaW5nID0gXCIuc3R5bGludHJjXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBTdHlsaW50Q29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NMaW50ZXIsIFwiU3R5bGludFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLCBcIlN0eWx1c1wiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgU3R5bGludCB3aGVuIHRoZSBjc3MgcHJlcHJvY2Vzc29yIGlzIFN0eWx1c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248U3R5bGludENvbmZpZ3VyYXRpb24+KGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFN0eWxpbnQuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgYXN5bmMgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInN0eWxpbnRcIiwgXCJzdHlsaW50LXN0eWxpc2hcIl0sIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3R5bGludC5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgU3R5bGludENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5ibG9ja3MgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYnJhY2tldHMgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbG9ucyA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbG9ycyA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbW1hU3BhY2UgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21tZW50U3BhY2UgPSBcImFsd2F5c1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jc3NMaXRlcmFsID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jdXN0b21Qcm9wZXJ0aWVzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmRlcHRoTGltaXQgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZHVwbGljYXRlcyA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVmZmljaWVudCA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmV4Y2x1ZGUgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZXh0ZW5kUHJlZiA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5nbG9iYWxEdXBlID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmdyb3VwT3V0cHV0QnlGaWxlID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uaW5kZW50UHJlZiA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5sZWFkaW5nWmVybyA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWF4RXJyb3JzID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1heFdhcm5pbmdzID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1peGVkID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1peGlucyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5uYW1pbmdDb252ZW50aW9uID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm5hbWluZ0NvbnZlbnRpb25TdHJpY3QgPSBmYWxzZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubm9uZSA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubm9JbXBvcnRhbnQgPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wYXJlblNwYWNlID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsYWNlaG9sZGVycyA9IFwiYWx3YXlzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZWZpeFZhcnNXaXRoRG9sbGFyID0gXCJhbHdheXNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucXVvdGVQcmVmID0gZmFsc2U7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNlbWljb2xvbnMgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNvcnRPcmRlciA9IFwiYWxwaGFiZXRpY2FsXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnN0YWNrZWRQcm9wZXJ0aWVzID0gXCJuZXZlclwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50cmFpbGluZ1doaXRlc3BhY2UgPSBcIm5ldmVyXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnVuaXZlcnNhbCA9IGZhbHNlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi52YWxpZCA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnplcm9Vbml0cyA9IFwibmV2ZXJcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uekluZGV4Tm9ybWFsaXplID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IHsuLi5kZWZhdWx0Q29uZmlndXJhdGlvbiwgLi4udGhpcy5fY29uZmlndXJhdGlvbn07XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJTdHlsaW50XCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
