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
 * Pipeline step to generate babel configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const babelConfiguration_1 = require("../../configuration/models/babel/babelConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class JavaScript extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "js", true);
                    this.configDefaults(engineVariables);
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
            // Removing and old dependency always false
            engineVariables.toggleDevDependency([
                "babel-preset-es2015",
                "babel-core",
                "babel-plugin-transform-class-properties",
                "babel-plugin-transform-decorators",
                "babel-plugin-transform-decorators-legacy",
                "babel-plugin-transform-react-jsx",
                "babel-preset-env",
                "babel-preset-react"
            ], false);
            // Remove old config for plugins
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.presets, "env", false, (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.presets, "react", false, (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, "transform-react-jsx", false);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", false);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", false);
            }
            // We always include babel as we might need to transpile client packages
            engineVariables.toggleDevDependency(["@babel/core", "@babel/preset-env"], true);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new babelConfiguration_1.BabelConfiguration();
        defaultConfiguration.presets = [];
        defaultConfiguration.plugins = [];
        defaultConfiguration.env = {};
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Babel", this._configuration);
    }
}
JavaScript.FILENAME = ".babelrc";
exports.JavaScript = JavaScript;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2phdmFTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQUczRSw0RkFBeUY7QUFHekYsb0VBQWlFO0FBRWpFLE1BQWEsVUFBVyxTQUFRLG1DQUFnQjtJQUtyQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7OztZQUMxQyxJQUFJLGFBQWEsRUFBRTtnQkFDZixPQUFPLHNCQUFrQixZQUFxQixNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLENBQU8sR0FBRyxFQUFFLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUUxQix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3ZFLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBRXJDLE9BQU8sQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQSxFQUFFO2FBQ1Y7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SiwyQ0FBMkM7WUFDM0MsZUFBZSxDQUFDLG1CQUFtQixDQUMvQjtnQkFDSSxxQkFBcUI7Z0JBQ3JCLFlBQVk7Z0JBQ1oseUNBQXlDO2dCQUN6QyxtQ0FBbUM7Z0JBQ25DLDBDQUEwQztnQkFDMUMsa0NBQWtDO2dCQUNsQyxrQkFBa0I7Z0JBQ2xCLG9CQUFvQjthQUN2QixFQUNELEtBQUssQ0FBQyxDQUFDO1lBRVgsZ0NBQWdDO1lBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztZQUN6RixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3SSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvSSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2hGLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDeEYseUJBQVcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFGO1lBRUQsd0VBQXdFO1lBQ3hFLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWhGLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM1SixPQUFPLHdCQUFvQixZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsVUFBVSxDQUFDLFFBQVEsRUFDbkIsZUFBZSxDQUFDLEtBQUssRUFDckIsYUFBYSxFQUNiLEdBQVMsRUFBRSxnREFBQyxPQUFBLElBQUksQ0FBQyxjQUFjLENBQUEsR0FBQSxFQUFFO1FBRWpFLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxlQUFnQztRQUNuRCxNQUFNLG9CQUFvQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUV0RCxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLG9CQUFvQixDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEMsb0JBQW9CLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUU5QixJQUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDOztBQXBGdUIsbUJBQVEsR0FBVyxVQUFVLENBQUM7QUFEMUQsZ0NBc0ZDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvamF2YVNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBiYWJlbCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBKYXZhU2NyaXB0IGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwiLmJhYmVscmNcIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IEJhYmVsQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJKYXZhU2NyaXB0XCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248QmFiZWxDb25maWd1cmF0aW9uPihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKYXZhU2NyaXB0LkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG5cbiAgICAgICAgICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VFeHRlbnNpb25zLCBcImpzXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgYW5kIG9sZCBkZXBlbmRlbmN5IGFsd2F5cyBmYWxzZVxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcImJhYmVsLXByZXNldC1lczIwMTVcIixcbiAgICAgICAgICAgICAgICBcImJhYmVsLWNvcmVcIixcbiAgICAgICAgICAgICAgICBcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tY2xhc3MtcHJvcGVydGllc1wiLFxuICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1kZWNvcmF0b3JzXCIsXG4gICAgICAgICAgICAgICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWRlY29yYXRvcnMtbGVnYWN5XCIsXG4gICAgICAgICAgICAgICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLXJlYWN0LWpzeFwiLFxuICAgICAgICAgICAgICAgIFwiYmFiZWwtcHJlc2V0LWVudlwiLFxuICAgICAgICAgICAgICAgIFwiYmFiZWwtcHJlc2V0LXJlYWN0XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmYWxzZSk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIG9sZCBjb25maWcgZm9yIHBsdWdpbnNcbiAgICAgICAgY29uc3QgYmFiZWxDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248QmFiZWxDb25maWd1cmF0aW9uPihcIkJhYmVsXCIpO1xuICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMsIFwiZW52XCIsIGZhbHNlLCAob2JqLCBpdGVtKSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0ubGVuZ3RoID4gMCAmJiBpdGVtWzBdID09PSBvYmpbMF0pO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLCBcInJlYWN0XCIsIGZhbHNlLCAob2JqLCBpdGVtKSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0ubGVuZ3RoID4gMCAmJiBpdGVtWzBdID09PSBvYmpbMF0pO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wbHVnaW5zLCBcInRyYW5zZm9ybS1yZWFjdC1qc3hcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wbHVnaW5zLCBcInRyYW5zZm9ybS1kZWNvcmF0b3JzLWxlZ2FjeVwiLCBmYWxzZSk7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoYmFiZWxDb25maWd1cmF0aW9uLnBsdWdpbnMsIFwidHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIiwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgYWx3YXlzIGluY2x1ZGUgYmFiZWwgYXMgd2UgbWlnaHQgbmVlZCB0byB0cmFuc3BpbGUgY2xpZW50IHBhY2thZ2VzXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIkBiYWJlbC9jb3JlXCIsIFwiQGJhYmVsL3ByZXNldC1lbnZcIl0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSmF2YVNjcmlwdC5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgQmFiZWxDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlc2V0cyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVudiA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiQmFiZWxcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
