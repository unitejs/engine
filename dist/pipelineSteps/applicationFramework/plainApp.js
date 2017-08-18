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
            engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            if (uniteConfiguration.applicationFramework === "PlainApp") {
                const protractorConfiguration = engineVariables.getConfiguration("Protractor");
                if (protractorConfiguration) {
                    protractorConfiguration.plugins.push({ path: "unitejs-plain-protractor-plugin" });
                }
                const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
                if (webdriverIoPlugins) {
                    webdriverIoPlugins.push("unitejs-plain-webdriver-plugin");
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3BsYWluQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFRQSw2REFBMEQ7QUFFMUQsY0FBc0IsU0FBUSx1Q0FBa0I7SUFDL0IsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsaUNBQWlDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxVQUFVLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXRMLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssVUFBVSxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUV0TCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7Z0JBQ3hHLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztvQkFDMUIsdUJBQXVCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxpQ0FBaUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3RGLENBQUM7Z0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQVcscUJBQXFCLENBQUMsQ0FBQztnQkFDN0YsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNyQixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztnQkFDOUQsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFFdkksRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxHQUFHLE1BQU0seUJBQXFCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUVwRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFFcEgsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1osR0FBRyxHQUFHLE1BQU0scUJBQWlCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDM0YsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsQ0QsNEJBa0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcGxhaW5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgc2NhZmZvbGRpbmcgZm9yIHBsYWluIGFwcGxpY2F0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi9zaGFyZWRBcHBGcmFtZXdvcmtcIjtcblxuZXhwb3J0IGNsYXNzIFBsYWluQXBwIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLXBsYWluLXByb3RyYWN0b3ItcGx1Z2luXCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiUGxhaW5BcHBcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInVuaXRlanMtcGxhaW4td2ViZHJpdmVyLXBsdWdpblwiXSwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIlBsYWluQXBwXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJQbGFpbkFwcFwiKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFByb3RyYWN0b3JDb25maWd1cmF0aW9uPihcIlByb3RyYWN0b3JcIik7XG4gICAgICAgICAgICBpZiAocHJvdHJhY3RvckNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5wbHVnaW5zLnB1c2goeyBwYXRoOiBcInVuaXRlanMtcGxhaW4tcHJvdHJhY3Rvci1wbHVnaW5cIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHdlYmRyaXZlcklvUGx1Z2lucyA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPHN0cmluZ1tdPihcIldlYmRyaXZlcklPLlBsdWdpbnNcIik7XG4gICAgICAgICAgICBpZiAod2ViZHJpdmVySW9QbHVnaW5zKSB7XG4gICAgICAgICAgICAgICAgd2ViZHJpdmVySW9QbHVnaW5zLnB1c2goXCJ1bml0ZWpzLXBsYWluLXdlYmRyaXZlci1wbHVnaW5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiLCBcImJvb3RzdHJhcHBlclwiLCBcImVudHJ5UG9pbnRcIl0pO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVFMmVUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVVbml0VGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHBcIiwgXCJib290c3RyYXBwZXJcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
