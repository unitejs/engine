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
const sharedAppFramework_1 = require("./sharedAppFramework");
class PlainApp extends sharedAppFramework_1.SharedAppFramework {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-plain-protractor-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.e2ePlugins["unitejs-plain-protractor-plugin"] = uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "Protractor";
            engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.e2ePlugins["unitejs-plain-webdriver-plugin"] = uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO";
            if (uniteConfiguration.applicationFramework === "PlainApp") {
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint"]);
                if (ret === 0) {
                    ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);
                    if (ret === 0) {
                        ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);
                        if (ret === 0) {
                            ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
                return ret;
            }
            return 0;
        });
    }
}
exports.PlainApp = PlainApp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3BsYWluQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSw2REFBMEQ7QUFFMUQsY0FBc0IsU0FBUSx1Q0FBa0I7SUFDL0IsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsaUNBQWlDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxVQUFVLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3RMLGVBQWUsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxVQUFVLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQztZQUU1SyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUM7WUFDdEwsZUFBZSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDO1lBRTVLLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUV2SSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBRXBHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUVwSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWixHQUFHLEdBQUcsTUFBTSxxQkFBaUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUMzRixDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQTNCRCw0QkEyQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9wbGFpbkFwcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
