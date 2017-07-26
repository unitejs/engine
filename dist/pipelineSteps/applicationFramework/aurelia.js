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
class Aurelia extends sharedAppFramework_1.SharedAppFramework {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["aurelia-protractor-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.protractorPlugins["aurelia-protractor-plugin"] = uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor";
            this.toggleAllPackages(uniteConfiguration, engineVariables);
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                if (uniteConfiguration.bundler === "Browserify" || uniteConfiguration.bundler === "Webpack") {
                    _super("error").call(this, logger, display, "Aurelia does not currently support bundling with " + uniteConfiguration.bundler);
                    return 1;
                }
                let ret = yield this.generateAppSource(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint", "child/child"]);
                if (ret === 0) {
                    ret = yield _super("generateAppHtml").call(this, logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "child/child"]);
                    if (ret === 0) {
                        ret = yield _super("generateAppCss").call(this, logger, display, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
                        if (ret === 0) {
                            ret = yield _super("generateE2eTest").call(this, logger, display, fileSystem, uniteConfiguration, engineVariables, ["app"]);
                            if (ret === 0) {
                                ret = yield this.generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);
                                if (ret === 0) {
                                    ret = yield _super("generateCss").call(this, logger, display, fileSystem, uniteConfiguration, engineVariables);
                                }
                            }
                        }
                    }
                }
                return ret;
            }
            return 0;
        });
    }
    toggleAllPackages(uniteConfiguration, engineVariables) {
        let location = "dist/";
        if (uniteConfiguration.moduleType === "AMD") {
            location += "amd";
        }
        else if (uniteConfiguration.moduleType === "CommonJS") {
            location += "commonjs";
        }
        else if (uniteConfiguration.moduleType === "SystemJS") {
            location += "system";
        }
        this.toggleClientPackages(uniteConfiguration, engineVariables, location, [
            { name: "aurelia-animator-css" },
            { name: "aurelia-binding" },
            { name: "aurelia-bootstrapper" },
            { name: "aurelia-dependency-injection" },
            { name: "aurelia-event-aggregator" },
            { name: "aurelia-fetch-client" },
            { name: "aurelia-http-client" },
            { name: "aurelia-framework" },
            { name: "aurelia-history" },
            { name: "aurelia-history-browser" },
            { name: "aurelia-loader" },
            { name: "aurelia-loader-default" },
            { name: "aurelia-logging" },
            { name: "aurelia-logging-console" },
            { name: "aurelia-metadata" },
            { name: "aurelia-pal" },
            { name: "aurelia-pal-browser" },
            { name: "aurelia-path" },
            { name: "aurelia-polyfills" },
            { name: "aurelia-route-recognizer" },
            { name: "aurelia-router" },
            { name: "aurelia-task-queue" },
            { name: "aurelia-templating" },
            { name: "aurelia-templating-binding" },
            { name: "aurelia-dialog", main: "aurelia-dialog" },
            { name: "aurelia-templating-resources", main: "aurelia-templating-resources" },
            { name: "aurelia-templating-router", main: "aurelia-templating-router" },
            { name: "aurelia-validation", main: "aurelia-validation" }
        ]);
        engineVariables.toggleClientPackage("whatwg-fetch", "", "fetch.js", "", false, "both", false, uniteConfiguration.applicationFramework === "Aurelia");
    }
    toggleClientPackages(uniteConfiguration, engineVariables, location, clientPackages) {
        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(clientPackage.name, location + (clientPackage.main ? "" : "/"), (clientPackage.main ? clientPackage.main : clientPackage.name) + ".js", "", false, "both", clientPackage.main ? true : false, uniteConfiguration.applicationFramework === "Aurelia");
        });
    }
}
exports.Aurelia = Aurelia;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLDZEQUEwRDtBQUUxRCxhQUFxQixTQUFRLHVDQUFrQjtJQUM5QixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMvSyxlQUFlLENBQUMsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQztZQUU1SyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFNUQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUYsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbURBQW1ELEdBQUcsa0JBQWtCLENBQUMsT0FBTyxFQUFFO29CQUMvRyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxZ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QUksRUFBRSx3QkFBd0IsRUFBRTtZQUNsQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMzQixFQUFFLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNuQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUM1QixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkIsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDL0IsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3hCLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzdCLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ3BDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzFCLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzlCLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzlCLEVBQUUsSUFBSSxFQUFFLDRCQUE0QixFQUFFO1lBQ3RDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNsRCxFQUFFLElBQUksRUFBRSw4QkFBOEIsRUFBRSxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDOUUsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQ3hFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTtTQUM3RCxDQUFDLENBQUM7UUFFSCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLGNBQWMsRUFDZCxFQUFFLEVBQ0YsVUFBVSxFQUNWLEVBQUUsRUFDRixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLFFBQWdCLEVBQ2hCLGNBQWlEO1FBRTFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYTtZQUNoQyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLGFBQWEsQ0FBQyxJQUFJLEVBQ2xCLFFBQVEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUMxQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUN0RSxFQUFFLEVBQ0YsS0FBSyxFQUNMLE1BQU0sRUFDTixhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLEVBQ2pDLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBOUdELDBCQThHQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
