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
 * Pipeline step to generate jest configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const jestConfiguration_1 = require("../../configuration/models/jest/jestConfiguration");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Jest extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.unitTestRunner, "Jest");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (!_super("condition").call(this, uniteConfiguration.moduleType, "CommonJS")) {
                    logger.error("You can only use CommonJS Module Type when the Unit Test Runner is Jest");
                    return 1;
                }
                if (!_super("condition").call(this, uniteConfiguration.unitTestFramework, "Jasmine")) {
                    logger.error("You can only use Jasmine Unit Test Framework when the Unit Test Runner is Jest");
                    return 1;
                }
                if (!_super("condition").call(this, uniteConfiguration.unitTestEngine, "JSDom")) {
                    logger.error("You can only use JSDom Unit Test Engine when the Unit Test Runner is Jest");
                    return 1;
                }
                return _super("fileReadJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Jest.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                    this._configuration = obj;
                    this.configDefaults(fileSystem, uniteConfiguration, engineVariables);
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
            engineVariables.toggleDevDependency(["jest", "jest-cli"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("fileToggleJson").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Jest.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
            if (ret === 0) {
                ret = yield _super("fileToggleText").call(this, logger, fileSystem, engineVariables.www.unitTestFolder, Jest.FILENAME_MOCK_DUMMY, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return _super("wrapGeneratedMarker").call(this, "/* ", " */"); }));
            }
            return ret;
        });
    }
    configDefaults(fileSystem, uniteConfiguration, engineVariables) {
        const defaultConfiguration = new jestConfiguration_1.JestConfiguration();
        const distFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.distFolder));
        const unitRootFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestFolder));
        const unitDistFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestDistFolder));
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        defaultConfiguration.testMatch = [
            `${unitDistFolder.replace(/\.\//, "<rootDir>/")}/**/*.spec.js`
        ];
        defaultConfiguration.moduleNameMapper = {
            "\\.css$": `${unitRootFolder.replace(/\.\//, "<rootDir>/")}/dummy.mock.js`
        };
        defaultConfiguration.setupFiles = [
            `${unitRootFolder.replace(/\.\//, "<rootDir>/")}/unit-bootstrap.js`
        ];
        defaultConfiguration.collectCoverage = true;
        defaultConfiguration.collectCoverageFrom = [
            `${distFolder.replace(/\.\//, "")}/**/!(app-module-config|entryPoint).js`
        ];
        defaultConfiguration.mapCoverage = true;
        defaultConfiguration.coverageDirectory = reportsFolder.replace(/\.\//, "<rootDir>/"),
            defaultConfiguration.coverageReporters = [
                "json",
                "lcov",
                "text"
            ];
        defaultConfiguration.verbose = true;
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Jest", this._configuration);
    }
}
Jest.FILENAME = "jest.config.json";
Jest.FILENAME_MOCK_DUMMY = "dummy.mock.js";
exports.Jest = Jest;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2plc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLHlGQUFzRjtBQUd0RixvRUFBaUU7QUFFakUsVUFBa0IsU0FBUSxtQ0FBZ0I7SUFNL0IsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM5SixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO29CQUN4RixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO29CQUMvRixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFD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RixvQkFBb0IsQ0FBQyxnQkFBZ0IsR0FBRztZQUNwQyxTQUFTLEVBQUUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsZ0JBQWdCO1NBQzdFLENBQUM7UUFDRixvQkFBb0IsQ0FBQyxVQUFVLEdBQUc7WUFDOUIsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsb0JBQW9CO1NBQ3RFLENBQUM7UUFDRixvQkFBb0IsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVDLG9CQUFvQixDQUFDLG1CQUFtQixHQUFHO1lBQ3ZDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLHdDQUF3QztTQUM1RSxDQUFDO1FBQ0Ysb0JBQW9CLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QyxvQkFBb0IsQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7WUFDcEYsb0JBQW9CLENBQUMsaUJBQWlCLEdBQUc7Z0JBQ3JDLE1BQU07Z0JBQ04sTUFBTTtnQkFDTixNQUFNO2FBQ1QsQ0FBQztRQUNGLG9CQUFvQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEMsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUF4R2MsYUFBUSxHQUFXLGtCQUFrQixDQUFDO0FBQ3RDLHdCQUFtQixHQUFXLGVBQWUsQ0FBQztBQUZqRSxvQkEwR0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdFJ1bm5lci9qZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGplc3QgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSmVzdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvamVzdC9qZXN0Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEplc3QgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJqZXN0LmNvbmZpZy5qc29uXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUVfTU9DS19EVU1NWTogc3RyaW5nID0gXCJkdW1teS5tb2NrLmpzXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBKZXN0Q29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJKZXN0XCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJDb21tb25KU1wiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgQ29tbW9uSlMgTW9kdWxlIFR5cGUgd2hlbiB0aGUgVW5pdCBUZXN0IFJ1bm5lciBpcyBKZXN0XCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmssIFwiSmFzbWluZVwiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgSmFzbWluZSBVbml0IFRlc3QgRnJhbWV3b3JrIHdoZW4gdGhlIFVuaXQgVGVzdCBSdW5uZXIgaXMgSmVzdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RW5naW5lLCBcIkpTRG9tXCIpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiWW91IGNhbiBvbmx5IHVzZSBKU0RvbSBVbml0IFRlc3QgRW5naW5lIHdoZW4gdGhlIFVuaXQgVGVzdCBSdW5uZXIgaXMgSmVzdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxKZXN0Q29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSmVzdC5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG9iajtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJqZXN0XCIsIFwiamVzdC1jbGlcIl0sIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZUpzb24obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSmVzdC5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlVGV4dChsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEplc3QuRklMRU5BTUVfTU9DS19EVU1NWSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiBzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiLyogXCIsIFwiICovXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IEplc3RDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgZGlzdEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5kaXN0Rm9sZGVyKSk7XG4gICAgICAgIGNvbnN0IHVuaXRSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0Rm9sZGVyKSk7XG4gICAgICAgIGNvbnN0IHVuaXREaXN0Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlcikpO1xuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHNGb2xkZXIpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50ZXN0TWF0Y2ggPSBbXG4gICAgICAgICAgICBgJHt1bml0RGlzdEZvbGRlci5yZXBsYWNlKC9cXC5cXC8vLCBcIjxyb290RGlyPi9cIil9LyoqLyouc3BlYy5qc2BcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubW9kdWxlTmFtZU1hcHBlciA9IHtcbiAgICAgICAgICAgIFwiXFxcXC5jc3MkXCI6IGAke3VuaXRSb290Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiPHJvb3REaXI+L1wiKX0vZHVtbXkubW9jay5qc2BcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2V0dXBGaWxlcyA9IFtcbiAgICAgICAgICAgIGAke3VuaXRSb290Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiPHJvb3REaXI+L1wiKX0vdW5pdC1ib290c3RyYXAuanNgXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbGxlY3RDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbGxlY3RDb3ZlcmFnZUZyb20gPSBbXG4gICAgICAgICAgICBgJHtkaXN0Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiXCIpfS8qKi8hKGFwcC1tb2R1bGUtY29uZmlnfGVudHJ5UG9pbnQpLmpzYFxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tYXBDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlRGlyZWN0b3J5ID0gcmVwb3J0c0ZvbGRlci5yZXBsYWNlKC9cXC5cXC8vLCBcIjxyb290RGlyPi9cIiksXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlUmVwb3J0ZXJzID0gW1xuICAgICAgICAgICAgXCJqc29uXCIsXG4gICAgICAgICAgICBcImxjb3ZcIixcbiAgICAgICAgICAgIFwidGV4dFwiXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnZlcmJvc2UgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSmVzdFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
