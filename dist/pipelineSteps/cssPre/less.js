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
class Less extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson")
        ];
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Less")) {
                uniteConfiguration.styleExtension = "less";
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "less");
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["less"], _super("condition").call(this, uniteConfiguration.cssPre, "Less"));
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Less")) {
                try {
                    logger.info("Creating Less folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                    logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Less folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Less = Less;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZS9sZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSwwREFBdUQ7QUFDdkQsb0VBQWlFO0FBRWpFLFVBQWtCLFNBQVEsbUNBQWdCO0lBQy9CLFVBQVU7UUFDYixNQUFNLENBQUM7WUFDSCxJQUFJLHlCQUFXLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDO1lBQ2xELElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO1NBQzVDLENBQUM7SUFDTixDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0M7OztZQUNwRCxFQUFFLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7Z0JBQzNDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRyxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBRWxHLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUV4RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFbkUsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBRTVGLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVwRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQ3ZHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUF6Q0Qsb0JBeUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUHJlL2xlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgaGFuZGxlIGxlc3Mgc3R5bGluZy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBMZXNzIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGluZmx1ZW5jZXMoKTogUGlwZWxpbmVLZXlbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjb250ZW50XCIsIFwicGFja2FnZUpzb25cIilcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFwiTGVzc1wiKSkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnN0eWxlRXh0ZW5zaW9uID0gXCJsZXNzXCI7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFwibGVzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJsZXNzXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSwgXCJMZXNzXCIpKTtcblxuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFwiTGVzc1wiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIExlc3MgZm9sZGVyXCIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzU3JjRm9sZGVyKTtcblxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiQ3JlYXRpbmcgY3NzRGlzdCBmb2xkZXJcIiwgeyBjc3NTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzRGlzdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzRGlzdEZvbGRlcik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkdlbmVyYXRpbmcgTGVzcyBmb2xkZXIgZmFpbGVkXCIsIGVyciwgeyBjc3NTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzU3JjRm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
