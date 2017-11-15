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
class Assets extends pipelineStepBase_1.PipelineStepBase {
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-image-cli"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.www.assetsSrcFolder, engineVariables.force, mainCondition);
            if (ret === 0) {
                ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.www.assetsFolder, engineVariables.force, mainCondition);
                if (ret === 0) {
                    const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
                    const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");
                    ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE, destThemeFolder, Assets.FILENAME_TILE, engineVariables.force);
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, destThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, engineVariables.force);
                    }
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_CSS, destThemeFolder, Assets.FILENAME_LOADER_CSS, engineVariables.force);
                    }
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_HTML, destThemeFolder, Assets.FILENAME_LOADER_HTML, engineVariables.force);
                    }
                }
            }
            return ret;
        });
    }
}
Assets.FILENAME_TILE = "logo-tile.svg";
Assets.FILENAME_TILE_TRANSPARENT = "logo-transparent.svg";
Assets.FILENAME_LOADER_CSS = "loader.css";
Assets.FILENAME_LOADER_HTML = "loader.html";
exports.Assets = Assets;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsWUFBb0IsU0FBUSxtQ0FBZ0I7SUFNM0IsU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDMUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosSUFBSSxHQUFHLEdBQUcsTUFBTSxzQkFBa0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFbEksRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUUzSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQ3pHLE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBRTlGLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFdEosRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osR0FBRyxHQUFHLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLHlCQUF5QixFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbEwsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0SyxDQUFDO29CQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hLLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBOztBQXJDYyxvQkFBYSxHQUFXLGVBQWUsQ0FBQztBQUN4QyxnQ0FBeUIsR0FBVyxzQkFBc0IsQ0FBQztBQUMzRCwwQkFBbUIsR0FBVyxZQUFZLENBQUM7QUFDM0MsMkJBQW9CLEdBQVcsYUFBYSxDQUFDO0FBSmhFLHdCQXVDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGNyZWF0ZSBhc3NldCBzb3VyY2VzLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBBc3NldHMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9USUxFOiBzdHJpbmcgPSBcImxvZ28tdGlsZS5zdmdcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9USUxFX1RSQU5TUEFSRU5UOiBzdHJpbmcgPSBcImxvZ28tdHJhbnNwYXJlbnQuc3ZnXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUVfTE9BREVSX0NTUzogc3RyaW5nID0gXCJsb2FkZXIuY3NzXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUVfTE9BREVSX0hUTUw6IHN0cmluZyA9IFwibG9hZGVyLmh0bWxcIjtcblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1pbWFnZS1jbGlcIl0sIG1haW5Db25kaXRpb24pO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlclRvZ2dsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlclRvZ2dsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzRm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlVGhlbWVGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiYXNzZXRzU3JjL3RoZW1lL1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXN0VGhlbWVGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBcInRoZW1lL1wiKTtcblxuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9USUxFLCBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9USUxFLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHNvdXJjZVRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUVfVElMRV9UUkFOU1BBUkVOVCwgZGVzdFRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUVfVElMRV9UUkFOU1BBUkVOVCwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfQ1NTLCBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfQ1NTLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX0xPQURFUl9IVE1MLCBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfSFRNTCwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
