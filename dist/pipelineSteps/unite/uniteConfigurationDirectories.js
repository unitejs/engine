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
const uniteDirectories_1 = require("../../configuration/models/unite/uniteDirectories");
const uniteWwwDirectories_1 = require("../../configuration/models/unite/uniteWwwDirectories");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class UniteConfigurationDirectories extends pipelineStepBase_1.PipelineStepBase {
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            uniteConfiguration.dirs = new uniteDirectories_1.UniteDirectories();
            uniteConfiguration.dirs.wwwRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.wwwRootFolder));
            uniteConfiguration.dirs.packagedRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.packagedRootFolder));
            uniteConfiguration.dirs.platformRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.platformRootFolder));
            uniteConfiguration.dirs.docsRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.docsRootFolder));
            uniteConfiguration.dirs.www = new uniteWwwDirectories_1.UniteWwwDirectories();
            uniteConfiguration.dirs.www.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.src));
            uniteConfiguration.dirs.www.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.dist));
            if (!_super("condition").call(this, uniteConfiguration.unitTestRunner, "None")) {
                uniteConfiguration.dirs.www.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitRoot));
                uniteConfiguration.dirs.www.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unit));
                uniteConfiguration.dirs.www.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitDist));
            }
            uniteConfiguration.dirs.www.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.css));
            uniteConfiguration.dirs.www.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssDist));
            if (!_super("condition").call(this, uniteConfiguration.e2eTestRunner, "None")) {
                uniteConfiguration.dirs.www.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eRoot));
                uniteConfiguration.dirs.www.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2e));
                uniteConfiguration.dirs.www.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eDist));
            }
            uniteConfiguration.dirs.www.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));
            uniteConfiguration.dirs.www.package = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.package));
            uniteConfiguration.dirs.www.build = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.build));
            uniteConfiguration.dirs.www.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assets));
            uniteConfiguration.dirs.www.assetsSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsSrc));
            uniteConfiguration.dirs.www.configuration = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.configuration));
            return 0;
        });
    }
}
exports.UniteConfigurationDirectories = UniteConfigurationDirectories;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSx3RkFBcUY7QUFDckYsOEZBQTJGO0FBRTNGLG9FQUFpRTtBQUVqRSxNQUFhLDZCQUE4QixTQUFRLG1DQUFnQjtJQUNsRCxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzdKLGtCQUFrQixDQUFDLElBQUksR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7WUFFakQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3BKLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlKLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlKLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUV0SixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztZQUN4RCxr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Q0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN6SixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUVySixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2SixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUU3SixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNySyxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBdENELHNFQXNDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHVuaXRlLmpzb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVEaXJlY3RvcmllcyB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZURpcmVjdG9yaWVzXCI7XG5pbXBvcnQgeyBVbml0ZVd3d0RpcmVjdG9yaWVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlV3d3RGlyZWN0b3JpZXNcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBVbml0ZUNvbmZpZ3VyYXRpb25EaXJlY3RvcmllcyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMgPSBuZXcgVW5pdGVEaXJlY3RvcmllcygpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kaXJzLnd3d1Jvb3QgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMucm9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIpKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMucGFja2FnZWRSb290ID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnJvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlZFJvb3RGb2xkZXIpKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMucGxhdGZvcm1Sb290ID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnJvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5wbGF0Zm9ybVJvb3RGb2xkZXIpKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMuZG9jc1Jvb3QgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMucm9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLmRvY3NSb290Rm9sZGVyKSk7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3ID0gbmV3IFVuaXRlV3d3RGlyZWN0b3JpZXMoKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LnNyYyA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnNyYykpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cuZGlzdCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3QpKTtcblxuICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiTm9uZVwiKSkge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LnVuaXRUZXN0ID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFJvb3QpKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kaXJzLnd3dy51bml0VGVzdFNyYyA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXQpKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kaXJzLnd3dy51bml0VGVzdERpc3QgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy51bml0RGlzdCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LmNzc1NyYyA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmNzcykpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cuY3NzRGlzdCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc0Rpc3QpKTtcblxuICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJOb25lXCIpKSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cuZTJlVGVzdCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmUyZVJvb3QpKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kaXJzLnd3dy5lMmVUZXN0U3JjID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlKSk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cuZTJlVGVzdERpc3QgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5lMmVEaXN0KSk7XG4gICAgICAgIH1cblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cucmVwb3J0cyA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHMpKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LnBhY2thZ2UgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlKSk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5kaXJzLnd3dy5idWlsZCA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkKSk7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LmFzc2V0cyA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aERpcmVjdG9yeVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0cykpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uZGlycy53d3cuYXNzZXRzU3JjID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjKSk7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmRpcnMud3d3LmNvbmZpZ3VyYXRpb24gPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5jb25maWd1cmF0aW9uKSk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
