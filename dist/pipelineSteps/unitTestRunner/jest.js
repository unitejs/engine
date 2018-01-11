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
                ret = yield _super("fileToggleText").call(this, logger, fileSystem, engineVariables.www.unitRoot, Jest.FILENAME_MOCK_DUMMY, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return _super("wrapGeneratedMarker").call(this, "/* ", " */"); }));
            }
            return ret;
        });
    }
    configDefaults(fileSystem, uniteConfiguration, engineVariables) {
        const defaultConfiguration = new jestConfiguration_1.JestConfiguration();
        const distFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.dist));
        const unitRootFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitRoot));
        const unitDistFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitDist));
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));
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
        defaultConfiguration.coverageDirectory = reportsFolder.replace(/\.\//, "<rootDir>/");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2plc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLHlGQUFzRjtBQUd0RixvRUFBaUU7QUFFakUsVUFBa0IsU0FBUSxtQ0FBZ0I7SUFNL0IsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM5SixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO29CQUN4RixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO29CQUMvRixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFD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b0JBQW9CLENBQUMsZ0JBQWdCLEdBQUc7WUFDcEMsU0FBUyxFQUFFLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLGdCQUFnQjtTQUM3RSxDQUFDO1FBQ0Ysb0JBQW9CLENBQUMsVUFBVSxHQUFHO1lBQzlCLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLG9CQUFvQjtTQUN0RSxDQUFDO1FBQ0Ysb0JBQW9CLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QyxvQkFBb0IsQ0FBQyxtQkFBbUIsR0FBRztZQUN2QyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyx3Q0FBd0M7U0FDNUUsQ0FBQztRQUNGLG9CQUFvQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEMsb0JBQW9CLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDckYsb0JBQW9CLENBQUMsaUJBQWlCLEdBQUc7WUFDckMsTUFBTTtZQUNOLE1BQU07WUFDTixNQUFNO1NBQ1QsQ0FBQztRQUNGLG9CQUFvQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEMsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUF4R3VCLGFBQVEsR0FBVyxrQkFBa0IsQ0FBQztBQUN0Qyx3QkFBbUIsR0FBVyxlQUFlLENBQUM7QUFGMUUsb0JBMEdDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RSdW5uZXIvamVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBqZXN0IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEplc3RDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2plc3QvamVzdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBKZXN0IGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwiamVzdC5jb25maWcuanNvblwiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX01PQ0tfRFVNTVk6IHN0cmluZyA9IFwiZHVtbXkubW9jay5qc1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogSmVzdENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiSmVzdFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUsIFwiQ29tbW9uSlNcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIENvbW1vbkpTIE1vZHVsZSBUeXBlIHdoZW4gdGhlIFVuaXQgVGVzdCBSdW5uZXIgaXMgSmVzdFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrLCBcIkphc21pbmVcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJZb3UgY2FuIG9ubHkgdXNlIEphc21pbmUgVW5pdCBUZXN0IEZyYW1ld29yayB3aGVuIHRoZSBVbml0IFRlc3QgUnVubmVyIGlzIEplc3RcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEVuZ2luZSwgXCJKU0RvbVwiKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIllvdSBjYW4gb25seSB1c2UgSlNEb20gVW5pdCBUZXN0IEVuZ2luZSB3aGVuIHRoZSBVbml0IFRlc3QgUnVubmVyIGlzIEplc3RcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248SmVzdENvbmZpZ3VyYXRpb24+KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEplc3QuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiamVzdFwiLCBcImplc3QtY2xpXCJdLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEplc3QuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZVRleHQobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFJvb3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKZXN0LkZJTEVOQU1FX01PQ0tfRFVNTVksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBKZXN0Q29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGRpc3RGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cuZGlzdCkpO1xuICAgICAgICBjb25zdCB1bml0Um9vdEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy51bml0Um9vdCkpO1xuICAgICAgICBjb25zdCB1bml0RGlzdEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy51bml0RGlzdCkpO1xuICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHMpKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50ZXN0TWF0Y2ggPSBbXG4gICAgICAgICAgICBgJHt1bml0RGlzdEZvbGRlci5yZXBsYWNlKC9cXC5cXC8vLCBcIjxyb290RGlyPi9cIil9LyoqLyouc3BlYy5qc2BcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubW9kdWxlTmFtZU1hcHBlciA9IHtcbiAgICAgICAgICAgIFwiXFxcXC5jc3MkXCI6IGAke3VuaXRSb290Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiPHJvb3REaXI+L1wiKX0vZHVtbXkubW9jay5qc2BcbiAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uc2V0dXBGaWxlcyA9IFtcbiAgICAgICAgICAgIGAke3VuaXRSb290Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiPHJvb3REaXI+L1wiKX0vdW5pdC1ib290c3RyYXAuanNgXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbGxlY3RDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbGxlY3RDb3ZlcmFnZUZyb20gPSBbXG4gICAgICAgICAgICBgJHtkaXN0Rm9sZGVyLnJlcGxhY2UoL1xcLlxcLy8sIFwiXCIpfS8qKi8hKGFwcC1tb2R1bGUtY29uZmlnfGVudHJ5UG9pbnQpLmpzYFxuICAgICAgICBdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5tYXBDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlRGlyZWN0b3J5ID0gcmVwb3J0c0ZvbGRlci5yZXBsYWNlKC9cXC5cXC8vLCBcIjxyb290RGlyPi9cIik7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvdmVyYWdlUmVwb3J0ZXJzID0gW1xuICAgICAgICAgICAgXCJqc29uXCIsXG4gICAgICAgICAgICBcImxjb3ZcIixcbiAgICAgICAgICAgIFwidGV4dFwiXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnZlcmJvc2UgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSmVzdFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
