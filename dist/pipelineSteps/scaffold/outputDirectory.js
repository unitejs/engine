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
class OutputDirectory extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("applicationFramework", "*"),
            new pipelineKey_1.PipelineKey("bundler", "*"),
            new pipelineKey_1.PipelineKey("content", "*"),
            new pipelineKey_1.PipelineKey("cssPost", "*"),
            new pipelineKey_1.PipelineKey("cssPre", "*"),
            new pipelineKey_1.PipelineKey("e2eTestRunner", "*"),
            new pipelineKey_1.PipelineKey("language", "*"),
            new pipelineKey_1.PipelineKey("linter", "*"),
            new pipelineKey_1.PipelineKey("moduleType", "*"),
            new pipelineKey_1.PipelineKey("packageManager", "*"),
            new pipelineKey_1.PipelineKey("platform", "*"),
            new pipelineKey_1.PipelineKey("scaffold", "appScaffold"),
            new pipelineKey_1.PipelineKey("scaffold", "e2eTestScaffold"),
            new pipelineKey_1.PipelineKey("scaffold", "unitTestScaffold"),
            new pipelineKey_1.PipelineKey("server", "*"),
            new pipelineKey_1.PipelineKey("taskManager", "*"),
            new pipelineKey_1.PipelineKey("testFramework", "*"),
            new pipelineKey_1.PipelineKey("unite", "*"),
            new pipelineKey_1.PipelineKey("unitTestEngine", "*"),
            new pipelineKey_1.PipelineKey("unitTestRunner", "*")
        ];
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info("Creating Root Directory", { rootFolder: engineVariables.rootFolder });
                yield fileSystem.directoryCreate(engineVariables.rootFolder);
            }
            catch (err) {
                logger.error("Creating Root Directory failed", err, { wwwFolder: engineVariables.rootFolder });
                return 1;
            }
            try {
                logger.info("Creating WWW Directory", { wwwFolder: engineVariables.wwwRootFolder });
                yield fileSystem.directoryCreate(engineVariables.wwwRootFolder);
            }
            catch (err) {
                logger.error("Creating WWW Directory failed", err, { wwwFolder: engineVariables.wwwRootFolder });
                return 1;
            }
            try {
                logger.info("Creating Packaged Directory", { wwwFolder: engineVariables.packagedRootFolder });
                yield fileSystem.directoryCreate(engineVariables.packagedRootFolder);
                return 0;
            }
            catch (err) {
                logger.error("Creating Packaged Directory failed", err, { wwwFolder: engineVariables.packagedRootFolder });
                return 1;
            }
        });
    }
}
exports.OutputDirectory = OutputDirectory;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsMERBQXVEO0FBQ3ZELG9FQUFpRTtBQUVqRSxxQkFBNkIsU0FBUSxtQ0FBZ0I7SUFDMUMsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUM7WUFDNUMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7WUFDL0IsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7WUFDL0IsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7WUFDL0IsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7WUFDOUIsSUFBSSx5QkFBVyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUM7WUFDckMsSUFBSSx5QkFBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUM7WUFDaEMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7WUFDOUIsSUFBSSx5QkFBVyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUM7WUFDbEMsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQztZQUN0QyxJQUFJLHlCQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztZQUNoQyxJQUFJLHlCQUFXLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztZQUMxQyxJQUFJLHlCQUFXLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1lBQzlDLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUM7WUFDL0MsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7WUFDOUIsSUFBSSx5QkFBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7WUFDbkMsSUFBSSx5QkFBVyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUM7WUFDckMsSUFBSSx5QkFBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7WUFDN0IsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQztZQUN0QyxJQUFJLHlCQUFXLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDO1NBQ3pDLENBQUM7SUFDTixDQUFDO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDbkYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDcEYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDakcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBcERELDBDQW9EQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBjcmVhdGUgb3V0cHV0IGRpcmVjdG9yeS5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXREaXJlY3RvcnkgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgaW5mbHVlbmNlcygpOiBQaXBlbGluZUtleVtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgXCIqXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcIipcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjc3NQb3N0XCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNzc1ByZVwiLCBcIipcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJlMmVUZXN0UnVubmVyXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImxpbnRlclwiLCBcIipcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInBsYXRmb3JtXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwiYXBwU2NhZmZvbGRcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJzY2FmZm9sZFwiLCBcImUyZVRlc3RTY2FmZm9sZFwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwidW5pdFRlc3RTY2FmZm9sZFwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInNlcnZlclwiLCBcIipcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ0YXNrTWFuYWdlclwiLCBcIipcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0RW5naW5lXCIsIFwiKlwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0UnVubmVyXCIsIFwiKlwiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIFJvb3QgRGlyZWN0b3J5XCIsIHsgcm9vdEZvbGRlcjogZW5naW5lVmFyaWFibGVzLnJvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShlbmdpbmVWYXJpYWJsZXMucm9vdEZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiQ3JlYXRpbmcgUm9vdCBEaXJlY3RvcnkgZmFpbGVkXCIsIGVyciwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy5yb290Rm9sZGVyIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJDcmVhdGluZyBXV1cgRGlyZWN0b3J5XCIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJDcmVhdGluZyBXV1cgRGlyZWN0b3J5IGZhaWxlZFwiLCBlcnIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiQ3JlYXRpbmcgUGFja2FnZWQgRGlyZWN0b3J5XCIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMucGFja2FnZWRSb290Rm9sZGVyIH0pO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZW5naW5lVmFyaWFibGVzLnBhY2thZ2VkUm9vdEZvbGRlcik7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJDcmVhdGluZyBQYWNrYWdlZCBEaXJlY3RvcnkgZmFpbGVkXCIsIGVyciwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlZFJvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
