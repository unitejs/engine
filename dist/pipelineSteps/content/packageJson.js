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
                // they will get rebuilt on the first run of the build task
                const keys = Object.keys(uniteConfiguration.clientPackages);
                for (let i = 0; i < keys.length; i++) {
                    const pkg = uniteConfiguration.clientPackages[keys[i]];
                    // Fill in package name for any that used to be just addressed by their key
                    pkg.name = pkg.name || keys[i];
                    if (pkg.transpile && pkg.transpile.alias) {
                        const parts = pkg.transpile.alias.split("/");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLG1HQUFnRztBQUdoRyxvRUFBaUU7QUFFakUsaUJBQXlCLFNBQVEsbUNBQWdCO0lBS2hDLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsTUFBTSxDQUFDLHNCQUFrQixZQUF1QixNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFdBQVcsQ0FBQyxRQUFRLEVBQ3BCLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sR0FBRyxFQUFFLEVBQUU7Z0JBQ3RELElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUV6RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFBLEVBQUU7UUFDWCxDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE1BQU0sR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixXQUFXLENBQUMsUUFBUSxFQUNwQixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFO2dCQUMxQywyQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUUxSCxlQUFlLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVB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QUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN6RSxDQUFDOztBQXJGYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0F1RkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHBhY2thZ2UuanNvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvbiBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInBhY2thZ2UuanNvblwiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogUGFja2FnZUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhY2thZ2VKc29uLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHModW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFja2FnZUpzb24uRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodGhpcy5fY29uZmlndXJhdGlvbiwgXCJsaWNlbnNlXCIsIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlLCB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSAhPT0gXCJOb25lXCIpO1xuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbi5kZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZERldkRlcGVuZGVuY2llcyh0aGlzLl9jb25maWd1cmF0aW9uLmRldkRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmRlcGVuZGVuY2llcyA9IE9iamVjdEhlbHBlci5zb3J0KHRoaXMuX2NvbmZpZ3VyYXRpb24uZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmRldkRlcGVuZGVuY2llcyA9IE9iamVjdEhlbHBlci5zb3J0KHRoaXMuX2NvbmZpZ3VyYXRpb24uZGV2RGVwZW5kZW5jaWVzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFyZSByZWNvbmZpZ3VyaW5nIHdlIHNob3VsZCByZW1vdmUgYW55IHRyYW5zcGlsZWQgY2xpZW50UGFja2FnZXNcbiAgICAgICAgICAgIC8vIHRoZXkgd2lsbCBnZXQgcmVidWlsdCBvbiB0aGUgZmlyc3QgcnVuIG9mIHRoZSBidWlsZCB0YXNrXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGtnID0gdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW2tleXNbaV1dO1xuXG4gICAgICAgICAgICAgICAgLy8gRmlsbCBpbiBwYWNrYWdlIG5hbWUgZm9yIGFueSB0aGF0IHVzZWQgdG8gYmUganVzdCBhZGRyZXNzZWQgYnkgdGhlaXIga2V5XG4gICAgICAgICAgICAgICAgcGtnLm5hbWUgPSBwa2cubmFtZSB8fCBrZXlzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBrZy50cmFuc3BpbGUgJiYgcGtnLnRyYW5zcGlsZS5hbGlhcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHBrZy50cmFuc3BpbGUuYWxpYXMuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc3BpbGVGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgcGFydHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHModHJhbnNwaWxlRm9sZGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZW1vdmluZyB0cmFuc3BpbGVkIHBhY2thZ2UgJHt0cmFuc3BpbGVGb2xkZXJ9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlEZWxldGUodHJhbnNwaWxlRm9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlbW92aW5nICR7dHJhbnNwaWxlRm9sZGVyfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFBhY2thZ2VDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubmFtZSA9IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udmVyc2lvbiA9IFwiMC4wLjFcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZGV2RGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5lbmdpbmVzID0geyBub2RlOiBcIj49OC4wLjBcIiB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiUGFja2FnZUpzb25cIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
