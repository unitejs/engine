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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class BuildConfiguration extends pipelineStepBase_1.PipelineStepBase {
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            folderCreate: { get: () => super.folderCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield _super.folderCreate.call(this, logger, fileSystem, engineVariables.www.configuration);
            if (ret === 0) {
                let names = ["common"];
                if (uniteConfiguration.buildConfigurations) {
                    names = names.concat(Object.keys(uniteConfiguration.buildConfigurations));
                }
                for (let i = 0; i < names.length; i++) {
                    const filename = `${names[i]}.json`;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.www.configuration, filename);
                        if (!exists) {
                            yield fileSystem.fileWriteJson(engineVariables.www.configuration, filename, {
                                name: names[i]
                            });
                        }
                    }
                    catch (err) {
                        logger.error(`Creating configuration file ${filename} failed`, err);
                        return 1;
                    }
                }
            }
            return ret;
        });
    }
}
exports.BuildConfiguration = BuildConfiguration;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYnVpbGRDb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsTUFBYSxrQkFBbUIsU0FBUSxtQ0FBZ0I7SUFDdkMsUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzVKLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTSxZQUFZLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVGLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDWCxJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV2QixJQUFJLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFO29CQUN4QyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztpQkFDN0U7Z0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25DLE1BQU0sUUFBUSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3BDLElBQUk7d0JBQ0EsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUN4RixJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNULE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUU7Z0NBQ3hFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDOzZCQUNqQixDQUFDLENBQUM7eUJBQ047cUJBQ0o7b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3BFLE9BQU8sQ0FBQyxDQUFDO3FCQUNaO2lCQUNKO2FBQ0o7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBN0JELGdEQTZCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvYnVpbGRDb25maWd1cmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGJ1aWxkIGNvbmZpZ3VyYXRpb25zLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBCdWlsZENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3dy5jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgbmFtZXMgPSBbXCJjb21tb25cIl07XG5cbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucykge1xuICAgICAgICAgICAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGAke25hbWVzW2ldfS5qc29uYDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3dy5jb25maWd1cmF0aW9uLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZW5naW5lVmFyaWFibGVzLnd3dy5jb25maWd1cmF0aW9uLCBmaWxlbmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYENyZWF0aW5nIGNvbmZpZ3VyYXRpb24gZmlsZSAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
