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
        return super.condition(uniteConfiguration.documentor, "JSDoc");
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
        };
        defaultConfiguration.plugins = [
            "plugins/markdown",
            "node_modules/jsdoc-babel"
        ];
        defaultConfiguration.babel = new babelConfiguration_1.BabelConfiguration();
        defaultConfiguration.babel.plugins = [
            "transform-class-properties",
            "transform-decorators-legacy"
        ];
        defaultConfiguration.babel.babelrc = false;
        defaultConfiguration.sourceType = "module";
        defaultConfiguration.source = {
            include: [
                "./README.md",
                fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.srcFolder))
            ],
            includePattern: ".+\\.js(x)?$"
        };
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("JsDoc", this._configuration);
    }
}
JsDoc.FILENAME = ".jsdoc.json";
exports.JsDoc = JsDoc;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2RvY3VtZW50b3IvanNEb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLDRGQUF5RjtBQUN6Riw0RkFBeUY7QUFHekYsb0VBQWlFO0FBRWpFLFdBQW1CLFNBQVEsbUNBQWdCO0lBS2hDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOzs7WUFDMUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztvQkFDOUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxzQkFBa0IsWUFBcUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNsSixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBRWpELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTztnQkFDUixhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osa0JBQWtCO2dCQUNsQiwwQ0FBMEM7Z0JBQzFDLHlDQUF5QyxDQUFDLEVBQzFDLGFBQWEsQ0FBQyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFdkYsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixLQUFLLENBQUMsUUFBUSxFQUNkLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFTLEVBQUUsZ0RBQUMsTUFBTSxDQUFOLElBQUksQ0FBQyxjQUFjLENBQUEsR0FBQSxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxlQUFnQztRQUM1RSxNQUFNLG9CQUFvQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUV0RCxvQkFBb0IsQ0FBQyxJQUFJLEdBQUc7WUFDeEIsZ0JBQWdCLEVBQUUsSUFBSTtTQUN6QixDQUFDO1FBRUYsb0JBQW9CLENBQUMsSUFBSSxHQUFHO1lBQ3hCLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNoSSxDQUFDO1FBRUYsb0JBQW9CLENBQUMsT0FBTyxHQUFHO1lBQzNCLGtCQUFrQjtZQUNsQiwwQkFBMEI7U0FDN0IsQ0FBQztRQUVGLG9CQUFvQixDQUFDLEtBQUssR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDdEQsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRztZQUNqQyw0QkFBNEI7WUFDNUIsNkJBQTZCO1NBQ2hDLENBQUM7UUFFRixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUUzQyxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzNDLG9CQUFvQixDQUFDLE1BQU0sR0FBRztZQUMxQixPQUFPLEVBQUU7Z0JBQ0wsYUFBYTtnQkFDYixVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbEg7WUFDRCxjQUFjLEVBQUUsY0FBYztTQUNqQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUEvRmMsY0FBUSxHQUFXLGFBQWEsQ0FBQztBQURwRCxzQkFpR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9kb2N1bWVudG9yL2pzRG9jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGpzZG9jIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEpzRG9jQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9qc0RvYy9qc0RvY0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBKc0RvYyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5qc2RvYy5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBKc0RvY0NvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRvciwgXCJKU0RvY1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiSmF2YVNjcmlwdFwiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgSlNEb2Mgd2hlbiB0aGUgc291cmNlIGxhbmd1YWdlIGlzIEphdmFTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248SnNEb2NDb25maWd1cmF0aW9uPihsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBKc0RvYy5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG9iajtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wianNkb2NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJqc2RvYy1iYWJlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhYmVsLWNvcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWJlbC1wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1kZWNvcmF0b3JzLWxlZ2FjeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tY2xhc3MtcHJvcGVydGllc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJDcmVhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMuZG9jc1Jvb3RGb2xkZXIpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpzRG9jLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBKc0RvY0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50YWdzID0ge1xuICAgICAgICAgICAgYWxsb3dVbmtub3duVGFnczogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm9wdHMgPSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZG9jc1Jvb3RGb2xkZXIpKVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnMgPSBbXG4gICAgICAgICAgICBcInBsdWdpbnMvbWFya2Rvd25cIixcbiAgICAgICAgICAgIFwibm9kZV9tb2R1bGVzL2pzZG9jLWJhYmVsXCJcbiAgICAgICAgXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYWJlbCA9IG5ldyBCYWJlbENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFiZWwucGx1Z2lucyA9IFtcbiAgICAgICAgICAgIFwidHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIixcbiAgICAgICAgICAgIFwidHJhbnNmb3JtLWRlY29yYXRvcnMtbGVnYWN5XCJcbiAgICAgICAgXTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYWJlbC5iYWJlbHJjID0gZmFsc2U7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc291cmNlVHlwZSA9IFwibW9kdWxlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnNvdXJjZSA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICBcIi4vUkVBRE1FLm1kXCIsXG4gICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlcikpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5jbHVkZVBhdHRlcm46IFwiLitcXFxcLmpzKHgpPyRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSnNEb2NcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
