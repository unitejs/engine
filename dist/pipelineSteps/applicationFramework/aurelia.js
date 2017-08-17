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
        else {
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
        engineVariables.toggleClientPackage("whatwg-fetch", "fetch.js", undefined, false, "both", false, undefined, uniteConfiguration.applicationFramework === "Aurelia");
    }
    toggleClientPackages(uniteConfiguration, engineVariables, location, clientPackages) {
        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(clientPackage.name, `${location}${clientPackage.name}.js`, undefined, false, "both", clientPackage.isPackage ? true : false, undefined, uniteConfiguration.applicationFramework === "Aurelia");
        });
    }
}
exports.Aurelia = Aurelia;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLDZEQUEwRDtBQUUxRCxhQUFxQixTQUFRLHVDQUFrQjtJQUM5QixhQUFhLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDdkQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDL0ssZUFBZSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDO1lBRXJLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxJQUFJLGtCQUFr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QUNsRCxDQUFDLENBQUM7UUFFSCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLGNBQWMsRUFDZCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLFFBQWdCLEVBQ2hCLGNBQXVEO1FBRWhGLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYTtZQUNoQyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLGFBQWEsQ0FBQyxJQUFJLEVBQ2xCLEdBQUcsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEtBQUssRUFDckMsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUN0QyxTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF6SEQsMEJBeUhDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvYXVyZWxpYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzY2FmZm9sZGluZyBmb3IgQXVyZWxpYSBhcHBsaWNhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgU2hhcmVkQXBwRnJhbWV3b3JrIH0gZnJvbSBcIi4vc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBBdXJlbGlhIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJlcmVxdWlzaXRlcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIikge1xuICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID09PSBcIkJyb3dzZXJpZnlcIiB8fCB1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciA9PT0gXCJXZWJwYWNrXCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEF1cmVsaWEgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgYnVuZGxpbmcgd2l0aCAke3VuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImF1cmVsaWEtcHJvdHJhY3Rvci1wbHVnaW5cIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiUHJvdHJhY3RvclwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmUyZVBsdWdpbnNbXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCJdID0gdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCI7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1hdXJlbGlhLXdlYmRyaXZlci1wbHVnaW5cIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5lMmVQbHVnaW5zW1widW5pdGVqcy1hdXJlbGlhLXdlYmRyaXZlci1wbHVnaW5cIl0gPSB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCI7XG5cbiAgICAgICAgdGhpcy50b2dnbGVBbGxQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpIHtcbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiLCBcImJvb3RzdHJhcHBlclwiLCBcImVudHJ5UG9pbnRcIiwgXCJjaGlsZC9jaGlsZFwiXSk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcEh0bWwobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCIsIFwiY2hpbGQvY2hpbGRcIl0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJjaGlsZC9jaGlsZFwiXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVFMmVUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCIsIFwiYm9vdHN0cmFwcGVyXCJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9nZ2xlQWxsUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IFwiZGlzdC9cIjtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwiYW1kL1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwiY29tbW9uanMvXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiArPSBcInN5c3RlbS9cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlQ2xpZW50UGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGxvY2F0aW9uLCBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1hbmltYXRvci1jc3NcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtYmluZGluZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1ib290c3RyYXBwZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZGVwZW5kZW5jeS1pbmplY3Rpb25cIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZXZlbnQtYWdncmVnYXRvclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtaHR0cC1jbGllbnRcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZnJhbWV3b3JrXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWhpc3RvcnlcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtaGlzdG9yeS1icm93c2VyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvYWRlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2FkZXItZGVmYXVsdFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2dnaW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvZ2dpbmctY29uc29sZVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1tZXRhZGF0YVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wYWxcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcGFsLWJyb3dzZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcGF0aFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wb2x5ZmlsbHNcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcm91dGUtcmVjb2duaXplclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1yb3V0ZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGFzay1xdWV1ZVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmctYmluZGluZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1kaWFsb2dcIiwgaXNQYWNrYWdlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nLXJlc291cmNlc1wiLCBpc1BhY2thZ2U6IHRydWUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmctcm91dGVyXCIsIGlzUGFja2FnZTogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdmFsaWRhdGlvblwiLCBpc1BhY2thZ2U6IHRydWUgfVxuICAgICAgICBdKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwid2hhdHdnLWZldGNoXCIsXG4gICAgICAgICAgICBcImZldGNoLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZUNsaWVudFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHsgbmFtZTogc3RyaW5nOyBpc1BhY2thZ2U/OiBib29sZWFuIH1bXSk6IHZvaWQge1xuXG4gICAgICAgIGNsaWVudFBhY2thZ2VzLmZvckVhY2goY2xpZW50UGFja2FnZSA9PiB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm5hbWUsXG4gICAgICAgICAgICAgICAgYCR7bG9jYXRpb259JHtjbGllbnRQYWNrYWdlLm5hbWV9LmpzYCxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
