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
/**
 * Pipeline step to generate package.json.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const packageConfiguration_1 = require("../../configuration/models/packages/packageConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class PackageJson extends pipelineStepBase_1.PipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, PackageJson.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                this._configuration = obj;
                this.configDefaults(uniteConfiguration, engineVariables);
                return 0;
            }));
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, PackageJson.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                objectHelper_1.ObjectHelper.addRemove(this._configuration, "license", uniteConfiguration.license, uniteConfiguration.license !== "None");
                engineVariables.buildDependencies(uniteConfiguration, this._configuration.dependencies);
                engineVariables.buildDevDependencies(this._configuration.devDependencies);
                this._configuration.dependencies = objectHelper_1.ObjectHelper.sort(this._configuration.dependencies);
                this._configuration.devDependencies = objectHelper_1.ObjectHelper.sort(this._configuration.devDependencies);
                return this._configuration;
            }));
            if (ret === 0 && uniteConfiguration.clientPackages) {
                // Since we are reconfiguring we should remove any transpiled clientPackages
                // tnhey will get rebuilt on the first run of the build task
                const keys = Object.keys(uniteConfiguration.clientPackages);
                for (let i = 0; i < keys.length; i++) {
                    const pkg = uniteConfiguration.clientPackages[keys[i]];
                    // Fill in package name for any that used to be just addressed by their key
                    pkg.name = pkg.name || keys[i];
                    if (pkg.transpileAlias) {
                        const parts = pkg.transpileAlias.split("/");
                        const transpileFolder = fileSystem.pathCombine(engineVariables.www.packageFolder, parts[0]);
                        try {
                            const exists = yield fileSystem.directoryExists(transpileFolder);
                            if (exists) {
                                logger.info(`Removing transpiled package ${transpileFolder}`);
                                yield fileSystem.directoryDelete(transpileFolder);
                            }
                        }
                        catch (err) {
                            logger.error(`Removing ${transpileFolder} failed`, err);
                            return 1;
                        }
                    }
                }
            }
            return ret;
        });
    }
    configDefaults(uniteConfiguration, engineVariables) {
        const defaultConfiguration = new packageConfiguration_1.PackageConfiguration();
        defaultConfiguration.name = uniteConfiguration.packageName;
        defaultConfiguration.version = "0.0.1";
        defaultConfiguration.devDependencies = {};
        defaultConfiguration.dependencies = {};
        defaultConfiguration.engines = { node: ">=8.0.0" };
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("PackageJson", this._configuration);
    }
}
PackageJson.FILENAME = "package.json";
exports.PackageJson = PackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLG1HQUFnRztBQUdoRyxvRUFBaUU7QUFFakUsaUJBQXlCLFNBQVEsbUNBQWdCO0lBS2hDLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsTUFBTSxDQUFDLHNCQUFrQixZQUF1QixNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFdBQVcsQ0FBQyxRQUFRLEVBQ3BCLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sR0FBRyxFQUFFLEVBQUU7Z0JBQ3RELElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUV6RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFBLEVBQUU7UUFDWCxDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE1BQU0sR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixXQUFXLENBQUMsUUFBUSxFQUNwQixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFO2dCQUMxQywyQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUUxSCxlQUFlLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVB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b0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBGLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7O0FBckZjLG9CQUFRLEdBQVcsY0FBYyxDQUFDO0FBRHJELGtDQXVGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgcGFja2FnZS5qc29uLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VKc29uIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwicGFja2FnZS5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBQYWNrYWdlQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFja2FnZUpzb24uRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyh1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYWNrYWdlSnNvbi5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0aGlzLl9jb25maWd1cmF0aW9uLCBcImxpY2Vuc2VcIiwgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UsIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlICE9PSBcIk5vbmVcIik7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uLmRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHRoaXMuX2NvbmZpZ3VyYXRpb24uZGV2RGVwZW5kZW5jaWVzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZGVwZW5kZW5jaWVzID0gT2JqZWN0SGVscGVyLnNvcnQodGhpcy5fY29uZmlndXJhdGlvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZGV2RGVwZW5kZW5jaWVzID0gT2JqZWN0SGVscGVyLnNvcnQodGhpcy5fY29uZmlndXJhdGlvbi5kZXZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmV0ID09PSAwICYmIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgLy8gU2luY2Ugd2UgYXJlIHJlY29uZmlndXJpbmcgd2Ugc2hvdWxkIHJlbW92ZSBhbnkgdHJhbnNwaWxlZCBjbGllbnRQYWNrYWdlc1xuICAgICAgICAgICAgLy8gdG5oZXkgd2lsbCBnZXQgcmVidWlsdCBvbiB0aGUgZmlyc3QgcnVuIG9mIHRoZSBidWlsZCB0YXNrXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGtnID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2tleXNbaV1dO1xuXG4gICAgICAgICAgICAgICAgLy8gRmlsbCBpbiBwYWNrYWdlIG5hbWUgZm9yIGFueSB0aGF0IHVzZWQgdG8gYmUganVzdCBhZGRyZXNzZWQgYnkgdGhlaXIga2V5XG4gICAgICAgICAgICAgICAgcGtnLm5hbWUgPSBwa2cubmFtZSB8fCBrZXlzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBrZy50cmFuc3BpbGVBbGlhcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHBrZy50cmFuc3BpbGVBbGlhcy5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zcGlsZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBwYXJ0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyh0cmFuc3BpbGVGb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFJlbW92aW5nIHRyYW5zcGlsZWQgcGFja2FnZSAke3RyYW5zcGlsZUZvbGRlcn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZSh0cmFuc3BpbGVGb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVtb3ZpbmcgJHt0cmFuc3BpbGVGb2xkZXJ9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgUGFja2FnZUNvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5uYW1lID0gdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi52ZXJzaW9uID0gXCIwLjAuMVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5kZXZEZXBlbmRlbmNpZXMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVuZ2luZXMgPSB7IG5vZGU6IFwiPj04LjAuMFwiIH07XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJQYWNrYWdlSnNvblwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
