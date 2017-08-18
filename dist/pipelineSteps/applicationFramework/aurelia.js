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
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
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
            engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            this.toggleAllPackages(uniteConfiguration, engineVariables);
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                const protractorConfiguration = engineVariables.getConfiguration("Protractor");
                if (protractorConfiguration) {
                    protractorConfiguration.plugins.push({ path: "aurelia-protractor-plugin" });
                }
                const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
                if (webdriverIoPlugins) {
                    webdriverIoPlugins.push("unitejs-aurelia-webdriver-plugin");
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLDZEQUEwRDtBQUUxRCxhQUFxQixTQUFRLHVDQUFrQjtJQUM5QixVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDcEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDL0ssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsa0NBQWtDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxDQUFDO1lBRXZMLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUU1RCxFQUFFLENBQUMsQ0FBQyxr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OEJBQThCLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtZQUN6RCxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO1lBQ3RELEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7U0FDbEQsQ0FBQyxDQUFDO1FBRUgsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixjQUFjLEVBQ2QsVUFBVSxFQUNWLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLG9CQUFvQixDQUFDLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxRQUFnQixFQUNoQixjQUF1RDtRQUVoRixjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWE7WUFDaEMsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixhQUFhLENBQUMsSUFBSSxFQUNsQixHQUFHLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxLQUFLLEVBQ3JDLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDdEMsU0FBUyxFQUNULGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBL0hELDBCQStIQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgc2NhZmZvbGRpbmcgZm9yIEF1cmVsaWEgYXBwbGljYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFNoYXJlZEFwcEZyYW1ld29yayB9IGZyb20gXCIuL3NoYXJlZEFwcEZyYW1ld29ya1wiO1xuXG5leHBvcnQgY2xhc3MgQXVyZWxpYSBleHRlbmRzIFNoYXJlZEFwcEZyYW1ld29yayB7XG4gICAgcHVibGljIGFzeW5jIHByZVByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpIHtcbiAgICAgICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciA9PT0gXCJCcm93c2VyaWZ5XCIgfHwgdW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIgPT09IFwiV2VicGFja1wiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBBdXJlbGlhIGRvZXMgbm90IGN1cnJlbnRseSBzdXBwb3J0IGJ1bmRsaW5nIHdpdGggJHt1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlcn1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIlByb3RyYWN0b3JcIik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInVuaXRlanMtYXVyZWxpYS13ZWJkcml2ZXItcGx1Z2luXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyID09PSBcIldlYmRyaXZlcklPXCIpO1xuXG4gICAgICAgIHRoaXMudG9nZ2xlQWxsUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFByb3RyYWN0b3JDb25maWd1cmF0aW9uPihcIlByb3RyYWN0b3JcIik7XG4gICAgICAgICAgICBpZiAocHJvdHJhY3RvckNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5wbHVnaW5zLnB1c2goeyBwYXRoOiBcImF1cmVsaWEtcHJvdHJhY3Rvci1wbHVnaW5cIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHdlYmRyaXZlcklvUGx1Z2lucyA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPHN0cmluZ1tdPihcIldlYmRyaXZlcklPLlBsdWdpbnNcIik7XG4gICAgICAgICAgICBpZiAod2ViZHJpdmVySW9QbHVnaW5zKSB7XG4gICAgICAgICAgICAgICAgd2ViZHJpdmVySW9QbHVnaW5zLnB1c2goXCJ1bml0ZWpzLWF1cmVsaWEtd2ViZHJpdmVyLXBsdWdpblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVBcHBTb3VyY2UobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCIsIFwiYm9vdHN0cmFwcGVyXCIsIFwiZW50cnlQb2ludFwiLCBcImNoaWxkL2NoaWxkXCJdKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQXBwSHRtbChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHBcIiwgXCJjaGlsZC9jaGlsZFwiXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQXBwQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImNoaWxkL2NoaWxkXCJdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUUyZVRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwXCJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVVbml0VGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHBcIiwgXCJib290c3RyYXBwZXJcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUNzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b2dnbGVBbGxQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gXCJkaXN0L1wiO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIikge1xuICAgICAgICAgICAgbG9jYXRpb24gKz0gXCJhbWQvXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIikge1xuICAgICAgICAgICAgbG9jYXRpb24gKz0gXCJjb21tb25qcy9cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwic3lzdGVtL1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2dnbGVDbGllbnRQYWNrYWdlcyh1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgbG9jYXRpb24sIFtcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWFuaW1hdG9yLWNzc1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1iaW5kaW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWJvb3RzdHJhcHBlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1kZXBlbmRlbmN5LWluamVjdGlvblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1odHRwLWNsaWVudFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1mcmFtZXdvcmtcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtaGlzdG9yeVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1oaXN0b3J5LWJyb3dzZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9hZGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvYWRlci1kZWZhdWx0XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvZ2dpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9nZ2luZy1jb25zb2xlXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLW1ldGFkYXRhXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhbFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wYWwtYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wYXRoXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBvbHlmaWxsc1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1yb3V0ZS1yZWNvZ25pemVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXJvdXRlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10YXNrLXF1ZXVlXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1iaW5kaW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWRpYWxvZ1wiLCBpc1BhY2thZ2U6IHRydWUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmctcmVzb3VyY2VzXCIsIGlzUGFja2FnZTogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1yb3V0ZXJcIiwgaXNQYWNrYWdlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS12YWxpZGF0aW9uXCIsIGlzUGFja2FnZTogdHJ1ZSB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJ3aGF0d2ctZmV0Y2hcIixcbiAgICAgICAgICAgIFwiZmV0Y2guanNcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9nZ2xlQ2xpZW50UGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlczogeyBuYW1lOiBzdHJpbmc7IGlzUGFja2FnZT86IGJvb2xlYW4gfVtdKTogdm9pZCB7XG5cbiAgICAgICAgY2xpZW50UGFja2FnZXMuZm9yRWFjaChjbGllbnRQYWNrYWdlID0+IHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubmFtZSxcbiAgICAgICAgICAgICAgICBgJHtsb2NhdGlvbn0ke2NsaWVudFBhY2thZ2UubmFtZX0uanNgLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
