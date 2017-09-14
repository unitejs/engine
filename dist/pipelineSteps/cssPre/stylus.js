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
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Stylus extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson")
        ];
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Stylus")) {
                uniteConfiguration.styleExtension = "styl";
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "stylus");
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["stylus"], _super("condition").call(this, uniteConfiguration.cssPre, "Stylus"));
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Stylus")) {
                try {
                    logger.info("Creating Stylus folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                    logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Stylus = Stylus;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZS9zdHlsdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFFakUsWUFBb0IsU0FBUSxtQ0FBZ0I7SUFDakMsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7U0FDNUMsQ0FBQztJQUNOLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7O1lBQ3BELEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztnQkFDM0MsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZHLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUM7WUFFdEcsRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBRTFGLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUVuRSxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztvQkFFNUYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRXBFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztvQkFDekcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXpDRCx3QkF5Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQcmUvc3R5bHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGhhbmRsZSBzdHlsdXMgc3R5bGluZy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdHlsdXMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgaW5mbHVlbmNlcygpOiBQaXBlbGluZUtleVtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSwgXCJTdHlsdXNcIikpIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zdHlsZUV4dGVuc2lvbiA9IFwic3R5bFwiO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBcInN0eWx1c1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJzdHlsdXNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLCBcIlN0eWx1c1wiKSk7XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLCBcIlN0eWx1c1wiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIFN0eWx1cyBmb2xkZXJcIiwgeyBjc3NTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzU3JjRm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJDcmVhdGluZyBjc3NEaXN0IGZvbGRlclwiLCB7IGNzc1NyY0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5jc3NEaXN0Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZW5naW5lVmFyaWFibGVzLnd3dy5jc3NEaXN0Rm9sZGVyKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiR2VuZXJhdGluZyBTdHlsdXMgZm9sZGVyIGZhaWxlZFwiLCBlcnIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
