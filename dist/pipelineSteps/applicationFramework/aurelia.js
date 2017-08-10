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
    prerequisites(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                if (uniteConfiguration.bundler === "Browserify" || uniteConfiguration.bundler === "Webpack") {
                    logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["aurelia-protractor-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.e2ePlugins["aurelia-protractor-plugin"] = uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor";
            engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.e2ePlugins["unitejs-aurelia-webdriver-plugin"] = uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "WebdriverIO";
            this.toggleAllPackages(uniteConfiguration, engineVariables);
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint", "child/child"]);
                if (ret === 0) {
                    ret = yield _super("generateAppHtml").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app", "child/child"]);
                    if (ret === 0) {
                        ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
                        if (ret === 0) {
                            ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);
                            if (ret === 0) {
                                ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);
                                if (ret === 0) {
                                    ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
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
            location += "amd/";
        }
        else if (uniteConfiguration.moduleType === "CommonJS") {
            location += "commonjs/";
        }
        else if (uniteConfiguration.moduleType === "SystemJS") {
            location += "system/";
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
            { name: "aurelia-dialog", isPackage: true },
            { name: "aurelia-templating-resources", isPackage: true },
            { name: "aurelia-templating-router", isPackage: true },
            { name: "aurelia-validation", isPackage: true }
        ]);
        engineVariables.toggleClientPackage("whatwg-fetch", "fetch.js", undefined, false, "both", false, uniteConfiguration.applicationFramework === "Aurelia");
    }
    toggleClientPackages(uniteConfiguration, engineVariables, location, clientPackages) {
        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(clientPackage.name, `${location}${clientPackage.name}.js`, undefined, false, "both", clientPackage.isPackage ? true : false, uniteConfiguration.applicationFramework === "Aurelia");
        });
    }
}
exports.Aurelia = Aurelia;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLDZEQUEwRDtBQUUxRCxhQUFxQixTQUFRLHVDQUFrQjtJQUM5QixhQUFhLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDdkQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDL0ssZUFBZSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDO1lBRXJLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUN2TCxlQUFlLENBQUMsVUFBVSxDQUFDLGtDQUFrQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUM7WUFFN0ssSUFBSSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRTVELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFFdEosRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxHQUFHLE1BQU0seUJBQXFCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFFbkgsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3dCQUUzRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBRXBHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO2dDQUVwSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDWixHQUFHLEdBQUcsTUFBTSxxQkFBaUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dDQUMzRixDQUFDOzRCQUNMLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRU8saUJBQWlCLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDOUYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBRXZCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN0RCxRQUFRLElBQUksV0FBVyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsUUFBUSxJQUFJLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRUQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUU7WUFDckUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDaEMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0IsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDaEMsRUFBRSxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDeEMsRUFBRSxJQUFJLEVBQUUsMEJBQTBCLEVBQUU7WUFDcEMsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDaEMsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDL0IsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDN0IsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0IsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDbkMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDMUIsRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDbEMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0IsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDbkMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZCLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQy9CLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN4QixFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUM3QixFQUFFLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNwQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUMxQixFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM5QixFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM5QixFQUFFLElBQUksRUFBRSw0QkFBNEIsRUFBRTtZQUN0QyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO1lBQzNDLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7WUFDekQsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtZQUN0RCxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO1NBQ2xELENBQUMsQ0FBQztRQUVILGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0IsY0FBYyxFQUNkLFVBQVUsRUFDVixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLG9CQUFvQixDQUFDLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxRQUFnQixFQUNoQixjQUF1RDtRQUVoRixjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWE7WUFDaEMsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixhQUFhLENBQUMsSUFBSSxFQUNsQixHQUFHLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxLQUFLLEVBQ3JDLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDdEMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF2SEQsMEJBdUhDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvYXVyZWxpYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzY2FmZm9sZGluZyBmb3IgQXVyZWxpYSBhcHBsaWNhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgU2hhcmVkQXBwRnJhbWV3b3JrIH0gZnJvbSBcIi4vc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBBdXJlbGlhIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJlcmVxdWlzaXRlcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID09PSBcIkJyb3dzZXJpZnlcIiB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciA9PT0gXCJXZWJwYWNrXCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEF1cmVsaWEgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgYnVuZGxpbmcgd2l0aCAke3VuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImF1cmVsaWEtcHJvdHJhY3Rvci1wbHVnaW5cIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiUHJvdHJhY3RvclwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmUyZVBsdWdpbnNbXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCJdID0gdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCI7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1hdXJlbGlhLXdlYmRyaXZlci1wbHVnaW5cIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lMmVQbHVnaW5zW1widW5pdGVqcy1hdXJlbGlhLXdlYmRyaXZlci1wbHVnaW5cIl0gPSB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCI7XG5cbiAgICAgICAgdGhpcy50b2dnbGVBbGxQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpIHtcbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiLCBcImJvb3RzdHJhcHBlclwiLCBcImVudHJ5UG9pbnRcIiwgXCJjaGlsZC9jaGlsZFwiXSk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcEh0bWwobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCIsIFwiY2hpbGQvY2hpbGRcIl0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJjaGlsZC9jaGlsZFwiXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVFMmVUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCIsIFwiYm9vdHN0cmFwcGVyXCJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9nZ2xlQWxsUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IFwiZGlzdC9cIjtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwiYW1kL1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwiY29tbW9uanMvXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiU3lzdGVtSlNcIikge1xuICAgICAgICAgICAgbG9jYXRpb24gKz0gXCJzeXN0ZW0vXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvZ2dsZUNsaWVudFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsb2NhdGlvbiwgW1xuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtYW5pbWF0b3ItY3NzXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWJpbmRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtYm9vdHN0cmFwcGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWRlcGVuZGVuY3ktaW5qZWN0aW9uXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWV2ZW50LWFnZ3JlZ2F0b3JcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWh0dHAtY2xpZW50XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWZyYW1ld29ya1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1oaXN0b3J5XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWhpc3RvcnktYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2FkZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9hZGVyLWRlZmF1bHRcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9nZ2luZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2dnaW5nLWNvbnNvbGVcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbWV0YWRhdGFcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcGFsXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhbC1icm93c2VyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhdGhcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcG9seWZpbGxzXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXJvdXRlLXJlY29nbml6ZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcm91dGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRhc2stcXVldWVcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nLWJpbmRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZGlhbG9nXCIsIGlzUGFja2FnZTogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1yZXNvdXJjZXNcIiwgaXNQYWNrYWdlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nLXJvdXRlclwiLCBpc1BhY2thZ2U6IHRydWUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXZhbGlkYXRpb25cIiwgaXNQYWNrYWdlOiB0cnVlIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcIndoYXR3Zy1mZXRjaFwiLFxuICAgICAgICAgICAgXCJmZXRjaC5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b2dnbGVDbGllbnRQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2VzOiB7IG5hbWU6IHN0cmluZzsgaXNQYWNrYWdlPzogYm9vbGVhbiB9W10pOiB2b2lkIHtcblxuICAgICAgICBjbGllbnRQYWNrYWdlcy5mb3JFYWNoKGNsaWVudFBhY2thZ2UgPT4ge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lLFxuICAgICAgICAgICAgICAgIGAke2xvY2F0aW9ufSR7Y2xpZW50UGFja2FnZS5uYW1lfS5qc2AsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
