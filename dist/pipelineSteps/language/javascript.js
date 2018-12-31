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
        const _super = Object.create(null, {
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return _super.fileReadJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
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
        const _super = Object.create(null, {
            fileToggleJson: { get: () => super.fileToggleJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleJson.call(this, logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2phdmFTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQUczRSw0RkFBeUY7QUFHekYsb0VBQWlFO0FBRWpFLE1BQWEsVUFBVyxTQUFRLG1DQUFnQjtJQUtyQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7Ozs7O1lBQzFDLElBQUksYUFBYSxFQUFFO2dCQUNmLE9BQU8sT0FBTSxZQUFZLFlBQXFCLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsVUFBVSxDQUFDLFFBQVEsRUFDbkIsZUFBZSxDQUFDLEtBQUssRUFDckIsQ0FBTyxHQUFHLEVBQUUsRUFBRTtvQkFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7b0JBRTFCLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFckMsT0FBTyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFBLEVBQUU7YUFDVjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLDJDQUEyQztZQUMzQyxlQUFlLENBQUMsbUJBQW1CLENBQy9CO2dCQUNJLHFCQUFxQjtnQkFDckIsWUFBWTtnQkFDWix5Q0FBeUM7Z0JBQ3pDLG1DQUFtQztnQkFDbkMsMENBQTBDO2dCQUMxQyxrQ0FBa0M7Z0JBQ2xDLGtCQUFrQjtnQkFDbEIsb0JBQW9CO2FBQ3ZCLEVBQ0QsS0FBSyxDQUFDLENBQUM7WUFFWCxnQ0FBZ0M7WUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXFCLE9BQU8sQ0FBQyxDQUFDO1lBQ3pGLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3BCLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdJLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9JLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEYseUJBQVcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN4Rix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDMUY7WUFFRCx3RUFBd0U7WUFDeEUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFaEYsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7Ozs7WUFDNUosT0FBTyxPQUFNLGNBQWMsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFTLEVBQUUsZ0RBQUMsT0FBQSxJQUFJLENBQUMsY0FBYyxDQUFBLEdBQUEsRUFBRTtRQUVqRSxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsZUFBZ0M7UUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFFdEQsb0JBQW9CLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQyxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLG9CQUFvQixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUFwRnVCLG1CQUFRLEdBQVcsVUFBVSxDQUFDO0FBRDFELGdDQXNGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL2phdmFTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgYmFiZWwgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgSmF2YVNjcmlwdCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5iYWJlbHJjXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBCYWJlbENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiSmF2YVNjcmlwdFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVJlYWRKc29uPEJhYmVsQ29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSmF2YVNjcmlwdC5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlRXh0ZW5zaW9ucywgXCJqc1wiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIC8vIFJlbW92aW5nIGFuZCBvbGQgZGVwZW5kZW5jeSBhbHdheXMgZmFsc2VcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJiYWJlbC1wcmVzZXQtZXMyMDE1XCIsXG4gICAgICAgICAgICAgICAgXCJiYWJlbC1jb3JlXCIsXG4gICAgICAgICAgICAgICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIixcbiAgICAgICAgICAgICAgICBcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tZGVjb3JhdG9yc1wiLFxuICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1kZWNvcmF0b3JzLWxlZ2FjeVwiLFxuICAgICAgICAgICAgICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1yZWFjdC1qc3hcIixcbiAgICAgICAgICAgICAgICBcImJhYmVsLXByZXNldC1lbnZcIixcbiAgICAgICAgICAgICAgICBcImJhYmVsLXByZXNldC1yZWFjdFwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZmFsc2UpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBvbGQgY29uZmlnIGZvciBwbHVnaW5zXG4gICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgaWYgKGJhYmVsQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLCBcImVudlwiLCBmYWxzZSwgKG9iaiwgaXRlbSkgPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+IDAgJiYgaXRlbVswXSA9PT0gb2JqWzBdKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucHJlc2V0cywgXCJyZWFjdFwiLCBmYWxzZSwgKG9iaiwgaXRlbSkgPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+IDAgJiYgaXRlbVswXSA9PT0gb2JqWzBdKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucGx1Z2lucywgXCJ0cmFuc2Zvcm0tcmVhY3QtanN4XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucGx1Z2lucywgXCJ0cmFuc2Zvcm0tZGVjb3JhdG9ycy1sZWdhY3lcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wbHVnaW5zLCBcInRyYW5zZm9ybS1jbGFzcy1wcm9wZXJ0aWVzXCIsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGFsd2F5cyBpbmNsdWRlIGJhYmVsIGFzIHdlIG1pZ2h0IG5lZWQgdG8gdHJhbnNwaWxlIGNsaWVudCBwYWNrYWdlc1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJAYmFiZWwvY29yZVwiLCBcIkBiYWJlbC9wcmVzZXQtZW52XCJdLCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEphdmFTY3JpcHQuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEJhYmVsQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXNldHMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucGx1Z2lucyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5lbnYgPSB7fTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkJhYmVsXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
