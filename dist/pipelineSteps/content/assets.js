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
        const _super = Object.create(null, {
            folderToggle: { get: () => super.folderToggle },
            copyFile: { get: () => super.copyFile }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super.folderToggle.call(this, logger, fileSystem, engineVariables.www.assetsSrc, engineVariables.force, mainCondition);
            if (ret === 0) {
                ret = yield _super.folderToggle.call(this, logger, fileSystem, engineVariables.www.assets, engineVariables.force, mainCondition);
                if (ret === 0) {
                    const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
                    const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/");
                    ret = yield _super.copyFile.call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE, destThemeFolder, Assets.FILENAME_TILE, engineVariables.force, false);
                    if (ret === 0) {
                        ret = yield _super.copyFile.call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, destThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, engineVariables.force, false);
                    }
                    if (ret === 0) {
                        ret = yield _super.copyFile.call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_CSS, destThemeFolder, Assets.FILENAME_LOADER_CSS, engineVariables.force, false);
                    }
                    if (ret === 0) {
                        ret = yield _super.copyFile.call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_HTML, destThemeFolder, Assets.FILENAME_LOADER_HTML, engineVariables.force, false);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsTUFBYSxNQUFPLFNBQVEsbUNBQWdCO0lBTTNCLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7OztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLE9BQU0sWUFBWSxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztZQUU1SCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsR0FBRyxHQUFHLE1BQU0sT0FBTSxZQUFZLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUVySCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7b0JBQ1gsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUN6RyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUV4RixHQUFHLEdBQUcsTUFBTSxPQUFNLFFBQVEsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxhQUFhLEVBQzNELGVBQWUsRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRWhHLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTt3QkFDWCxHQUFHLEdBQUcsTUFBTSxPQUFNLFFBQVEsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyx5QkFBeUIsRUFDdkUsZUFBZSxFQUFFLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUMvRztvQkFFRCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7d0JBQ1gsR0FBRyxHQUFHLE1BQU0sT0FBTSxRQUFRLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQ2pFLGVBQWUsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDekc7b0JBRUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO3dCQUNYLEdBQUcsR0FBRyxNQUFNLE9BQU0sUUFBUSxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixFQUNsRSxlQUFlLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQzFHO2lCQUNKO2FBQ0o7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTs7QUF6Q3VCLG9CQUFhLEdBQVcsZUFBZSxDQUFDO0FBQ3hDLGdDQUF5QixHQUFXLHNCQUFzQixDQUFDO0FBQzNELDBCQUFtQixHQUFXLFlBQVksQ0FBQztBQUMzQywyQkFBb0IsR0FBVyxhQUFhLENBQUM7QUFKekUsd0JBMkNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9hc3NldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gY3JlYXRlIGFzc2V0IHNvdXJjZXMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEFzc2V0cyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX1RJTEU6IHN0cmluZyA9IFwibG9nby10aWxlLnN2Z1wiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX1RJTEVfVFJBTlNQQVJFTlQ6IHN0cmluZyA9IFwibG9nby10cmFuc3BhcmVudC5zdmdcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRV9MT0FERVJfQ1NTOiBzdHJpbmcgPSBcImxvYWRlci5jc3NcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRV9MT0FERVJfSFRNTDogc3RyaW5nID0gXCJsb2FkZXIuaHRtbFwiO1xuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLWltYWdlLWNsaVwiXSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyVG9nZ2xlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHNTcmMsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyVG9nZ2xlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHMsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VUaGVtZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgXCJhc3NldHNTcmMvdGhlbWUvXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RUaGVtZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHNTcmMsIFwidGhlbWUvXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX1RJTEUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUVfVElMRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9USUxFX1RSQU5TUEFSRU5ULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9USUxFX1RSQU5TUEFSRU5ULCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfQ1NTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfQ1NTLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfSFRNTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUVfTE9BREVSX0hUTUwsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
