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
            let ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.www.assetsSrc, engineVariables.force, mainCondition);
            if (ret === 0) {
                ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.www.assets, engineVariables.force, mainCondition);
                if (ret === 0) {
                    const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
                    const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/");
                    ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE, destThemeFolder, Assets.FILENAME_TILE, engineVariables.force, false);
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, destThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, engineVariables.force, false);
                    }
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_CSS, destThemeFolder, Assets.FILENAME_LOADER_CSS, engineVariables.force, false);
                    }
                    if (ret === 0) {
                        ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_HTML, destThemeFolder, Assets.FILENAME_LOADER_HTML, engineVariables.force, false);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsTUFBYSxNQUFPLFNBQVEsbUNBQWdCO0lBTTNCLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLHNCQUFrQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztZQUU1SCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUVySCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7b0JBQ1gsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUN6RyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUV4RixHQUFHLEdBQUcsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFDM0QsZUFBZSxFQUFFLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFFaEcsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO3dCQUNYLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMseUJBQXlCLEVBQ3ZFLGVBQWUsRUFBRSxNQUFNLENBQUMseUJBQXlCLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDL0c7b0JBRUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO3dCQUNYLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQ2pFLGVBQWUsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDekc7b0JBRUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO3dCQUNYLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsb0JBQW9CLEVBQ2xFLGVBQWUsRUFBRSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDMUc7aUJBQ0o7YUFDSjtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBOztBQXpDdUIsb0JBQWEsR0FBVyxlQUFlLENBQUM7QUFDeEMsZ0NBQXlCLEdBQVcsc0JBQXNCLENBQUM7QUFDM0QsMEJBQW1CLEdBQVcsWUFBWSxDQUFDO0FBQzNDLDJCQUFvQixHQUFXLGFBQWEsQ0FBQztBQUp6RSx3QkEyQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2Fzc2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBjcmVhdGUgYXNzZXQgc291cmNlcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgQXNzZXRzIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUVfVElMRTogc3RyaW5nID0gXCJsb2dvLXRpbGUuc3ZnXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUVfVElMRV9UUkFOU1BBUkVOVDogc3RyaW5nID0gXCJsb2dvLXRyYW5zcGFyZW50LnN2Z1wiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX0xPQURFUl9DU1M6IHN0cmluZyA9IFwibG9hZGVyLmNzc1wiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX0xPQURFUl9IVE1MOiBzdHJpbmcgPSBcImxvYWRlci5odG1sXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInVuaXRlanMtaW1hZ2UtY2xpXCJdLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJUb2dnbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyYywgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJUb2dnbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0cywgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImFzc2V0c1NyYy90aGVtZS9cIik7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzdFRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyYywgXCJ0aGVtZS9cIik7XG5cbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHNvdXJjZVRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUVfVElMRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9USUxFLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX1RJTEVfVFJBTlNQQVJFTlQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX1RJTEVfVFJBTlNQQVJFTlQsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX0xPQURFUl9DU1MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX0xPQURFUl9DU1MsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FX0xPQURFUl9IVE1MLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0VGhlbWVGb2xkZXIsIEFzc2V0cy5GSUxFTkFNRV9MT0FERVJfSFRNTCwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
