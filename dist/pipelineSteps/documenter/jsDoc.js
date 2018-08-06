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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2RvY3VtZW50ZXIvanNEb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUN6Riw0RkFBeUY7QUFHekYsb0VBQWlFO0FBRWpFLE1BQWEsS0FBTSxTQUFRLG1DQUFnQjtJQUtoQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7OztZQUMxQyxJQUFJLGFBQWEsRUFBRTtnQkFDZixJQUFJLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLEVBQUU7b0JBQ25FLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztvQkFDOUUsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBRUQsT0FBTyxzQkFBa0IsWUFBcUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNsSixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBRWpELE9BQU8sQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQSxFQUFFO2FBQ047aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPO2dCQUNSLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixrQkFBa0I7Z0JBQ2xCLDBDQUEwQztnQkFDMUMseUNBQXlDLENBQUMsRUFDMUMsYUFBYSxDQUFDLENBQUM7WUFFbkQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFdkYsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO2dCQUNYLEdBQUcsR0FBRyxNQUFNLHdCQUFvQixZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsS0FBSyxDQUFDLFFBQVEsRUFDZCxlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFLGdEQUFDLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQSxHQUFBLENBQUMsQ0FBQzthQUNyRTtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLFVBQXVCLEVBQUUsZUFBZ0M7UUFDNUUsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFFdEQsb0JBQW9CLENBQUMsSUFBSSxHQUFHO1lBQ3hCLGdCQUFnQixFQUFFLElBQUk7U0FDekIsQ0FBQztRQUVGLG9CQUFvQixDQUFDLElBQUksR0FBRztZQUN4QixXQUFXLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQ3hILE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1NBQzVCLENBQUM7UUFFRixvQkFBb0IsQ0FBQyxPQUFPLEdBQUc7WUFDM0Isa0JBQWtCO1lBQ2xCLDBCQUEwQjtTQUM3QixDQUFDO1FBRUYsb0JBQW9CLENBQUMsS0FBSyxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUN0RCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHO1lBQ2pDLDZCQUE2QjtZQUM3Qiw0QkFBNEI7U0FDL0IsQ0FBQztRQUVGLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRTNDLG9CQUFvQixDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDM0Msb0JBQW9CLENBQUMsTUFBTSxHQUFHO1lBQzFCLE9BQU8sRUFBRTtnQkFDTCxhQUFhO2dCQUNiLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1RztZQUNELGNBQWMsRUFBRSxjQUFjO1NBQ2pDLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDOztBQWhHdUIsY0FBUSxHQUFXLGFBQWEsQ0FBQztBQUQ3RCxzQkFrR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9kb2N1bWVudGVyL2pzRG9jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGpzZG9jIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEpzRG9jQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9qc0RvYy9qc0RvY0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBKc0RvYyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5qc2RvYy5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBKc0RvY0NvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRlciwgXCJKU0RvY1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiSmF2YVNjcmlwdFwiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgSlNEb2Mgd2hlbiB0aGUgc291cmNlIGxhbmd1YWdlIGlzIEphdmFTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248SnNEb2NDb25maWd1cmF0aW9uPihsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBKc0RvYy5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG9iajtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wianNkb2NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJqc2RvYy1iYWJlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhYmVsLWNvcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWJlbC1wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1kZWNvcmF0b3JzLWxlZ2FjeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tY2xhc3MtcHJvcGVydGllc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJDcmVhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMuZG9jc1Jvb3RGb2xkZXIpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpzRG9jLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBKc0RvY0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50YWdzID0ge1xuICAgICAgICAgICAgYWxsb3dVbmtub3duVGFnczogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm9wdHMgPSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZG9jc1Jvb3RGb2xkZXIpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIilcbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW1xuICAgICAgICAgICAgXCJwbHVnaW5zL21hcmtkb3duXCIsXG4gICAgICAgICAgICBcIm5vZGVfbW9kdWxlcy9qc2RvYy1iYWJlbFwiXG4gICAgICAgIF07XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFiZWwgPSBuZXcgQmFiZWxDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhYmVsLnBsdWdpbnMgPSBbXG4gICAgICAgICAgICBcInRyYW5zZm9ybS1kZWNvcmF0b3JzLWxlZ2FjeVwiLFxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm0tY2xhc3MtcHJvcGVydGllc1wiXG4gICAgICAgIF07XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFiZWwuYmFiZWxyYyA9IGZhbHNlO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNvdXJjZVR5cGUgPSBcIm1vZHVsZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zb3VyY2UgPSB7XG4gICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgXCIuL1JFQURNRS5tZFwiLFxuICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5zcmMpKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGluY2x1ZGVQYXR0ZXJuOiBcIi4rXFxcXC5qcyh4KT8kXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkpzRG9jXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
