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
 * Pipeline step to generate jsdoc configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const babelConfiguration_1 = require("../../configuration/models/babel/babelConfiguration");
const jsDocConfiguration_1 = require("../../configuration/models/jsDoc/jsDocConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class JsDoc extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.documenter, "JSDoc");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript")) {
                    logger.error("You can only use JSDoc when the source language is JavaScript");
                    return 1;
                }
                return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, JsDoc.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    this.configDefaults(fileSystem, engineVariables);
                    return 0;
                }));
            }
            else {
                return 0;
            }
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["jsdoc",
                "jsdoc-babel",
                "babel-core",
                "babel-preset-env",
                "babel-plugin-transform-decorators-legacy",
                "babel-plugin-transform-class-properties"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderCreate").call(this, logger, fileSystem, engineVariables.docsRootFolder);
            if (ret === 0) {
                ret = yield _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, JsDoc.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
            }
            return ret;
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new jsDocConfiguration_1.JsDocConfiguration();
        defaultConfiguration.tags = {
            allowUnknownTags: true
        };
        defaultConfiguration.opts = {
            destination: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.docsRootFolder))
                .replace(/^\.\//, "")
        };
        defaultConfiguration.plugins = [
            "plugins/markdown",
            "node_modules/jsdoc-babel"
        ];
        defaultConfiguration.babel = new babelConfiguration_1.BabelConfiguration();
        defaultConfiguration.babel.plugins = [
            "transform-decorators-legacy",
            "transform-class-properties"
        ];
        defaultConfiguration.babel.babelrc = false;
        defaultConfiguration.sourceType = "module";
        defaultConfiguration.source = {
            include: [
                "./README.md",
                fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.src))
            ],
            includePattern: ".+\\.js(x)?$"
        };
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("JsDoc", this._configuration);
    }
}
JsDoc.FILENAME = ".jsdoc.json";
exports.JsDoc = JsDoc;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2RvY3VtZW50ZXIvanNEb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUN6Riw0RkFBeUY7QUFHekYsb0VBQWlFO0FBRWpFLFdBQW1CLFNBQVEsbUNBQWdCO0lBS2hDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztvQkFDOUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxzQkFBa0IsWUFBcUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNsSixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBRWpELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTztnQkFDUixhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osa0JBQWtCO2dCQUNsQiwwQ0FBMEM7Z0JBQzFDLHlDQUF5QyxDQUFDLEVBQzFDLGFBQWEsQ0FBQyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFdkYsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixLQUFLLENBQUMsUUFBUSxFQUNkLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFTLEVBQUUsZ0RBQUMsTUFBTSxDQUFOLElBQUksQ0FBQyxjQUFjLENBQUEsR0FBQSxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxlQUFnQztRQUM1RSxNQUFNLG9CQUFvQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUV0RCxvQkFBb0IsQ0FBQyxJQUFJLEdBQUc7WUFDeEIsZ0JBQWdCLEVBQUUsSUFBSTtTQUN6QixDQUFDO1FBRUYsb0JBQW9CLENBQUMsSUFBSSxHQUFHO1lBQ3hCLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDeEgsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7U0FDNUIsQ0FBQztRQUVGLG9CQUFvQixDQUFDLE9BQU8sR0FBRztZQUMzQixrQkFBa0I7WUFDbEIsMEJBQTBCO1NBQzdCLENBQUM7UUFFRixvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ3RELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUc7WUFDakMsNkJBQTZCO1lBQzdCLDRCQUE0QjtTQUMvQixDQUFDO1FBRUYsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFM0Msb0JBQW9CLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMzQyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUc7WUFDMUIsT0FBTyxFQUFFO2dCQUNMLGFBQWE7Z0JBQ2IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVHO1lBQ0QsY0FBYyxFQUFFLGNBQWM7U0FDakMsQ0FBQztRQUVGLElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBGLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7O0FBaEd1QixjQUFRLEdBQVcsYUFBYSxDQUFDO0FBRDdELHNCQWtHQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2RvY3VtZW50ZXIvanNEb2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUganNkb2MgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgQmFiZWxDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2JhYmVsL2JhYmVsQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSnNEb2NDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2pzRG9jL2pzRG9jQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEpzRG9jIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwiLmpzZG9jLmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEpzRG9jQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5kb2N1bWVudGVyLCBcIkpTRG9jXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGlmICghc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJKYXZhU2NyaXB0XCIpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiWW91IGNhbiBvbmx5IHVzZSBKU0RvYyB3aGVuIHRoZSBzb3VyY2UgbGFuZ3VhZ2UgaXMgSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxKc0RvY0NvbmZpZ3VyYXRpb24+KGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEpzRG9jLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJqc2RvY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImpzZG9jLWJhYmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFiZWwtY29yZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhYmVsLXByZXNldC1lbnZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWRlY29yYXRvcnMtbGVnYWN5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1jbGFzcy1wcm9wZXJ0aWVzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy5kb2NzUm9vdEZvbGRlcik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSnNEb2MuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEpzRG9jQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnRhZ3MgPSB7XG4gICAgICAgICAgICBhbGxvd1Vua25vd25UYWdzOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ub3B0cyA9IHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5kb2NzUm9vdEZvbGRlcikpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXG4gICAgICAgICAgICBcInBsdWdpbnMvbWFya2Rvd25cIixcbiAgICAgICAgICAgIFwibm9kZV9tb2R1bGVzL2pzZG9jLWJhYmVsXCJcbiAgICAgICAgXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYWJlbCA9IG5ldyBCYWJlbENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFiZWwucGx1Z2lucyA9IFtcbiAgICAgICAgICAgIFwidHJhbnNmb3JtLWRlY29yYXRvcnMtbGVnYWN5XCIsXG4gICAgICAgICAgICBcInRyYW5zZm9ybS1jbGFzcy1wcm9wZXJ0aWVzXCJcbiAgICAgICAgXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYWJlbC5iYWJlbHJjID0gZmFsc2U7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc291cmNlVHlwZSA9IFwibW9kdWxlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNvdXJjZSA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICBcIi4vUkVBRE1FLm1kXCIsXG4gICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnNyYykpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5jbHVkZVBhdHRlcm46IFwiLitcXFxcLmpzKHgpPyRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSnNEb2NcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
