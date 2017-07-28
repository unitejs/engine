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
class React extends sharedAppFramework_1.SharedAppFramework {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-preset-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript");
            engineVariables.toggleDevDependency(["eslint-plugin-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint");
            engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleClientPackage("react", "dist/react.js", "dist/react.min.js", false, "both", false, uniteConfiguration.applicationFramework === "React");
            engineVariables.toggleClientPackage("react-dom", "dist/react-dom.js", "dist/react-dom.min.js", false, "both", false, uniteConfiguration.applicationFramework === "React");
            engineVariables.toggleClientPackage("react-router-dom", "umd/react-router-dom.js", "umd/react-router-dom.min.js", false, "both", false, uniteConfiguration.applicationFramework === "React");
            engineVariables.transpilePresets.react = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript";
            engineVariables.lintFeatures.jsx = { required: uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint", object: true };
            engineVariables.lintExtends["plugin:react/recommended"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint";
            engineVariables.lintPlugins.react = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint";
            engineVariables.transpileProperties.jsx = { required: uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript", object: "react" };
            if (uniteConfiguration.applicationFramework === "React") {
                const codeExtension = uniteConfiguration.sourceLanguage === "JavaScript" ? "!jsx" : "!tsx";
                let ret = yield this.generateAppSource(logger, display, fileSystem, uniteConfiguration, engineVariables, [
                    `app${codeExtension}`,
                    `child/child${codeExtension}`,
                    "bootstrapper",
                    "entryPoint"
                ]);
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
            return 0;
        });
    }
}
exports.React = React;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFRQSw2REFBMEQ7QUFFMUQsV0FBbUIsU0FBUSx1Q0FBa0I7SUFDNUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDdkssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRTVKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQyxFQUMvRCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRS9JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0IsT0FBTyxFQUNQLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxDQUFDLENBQUM7WUFFekQsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLHVCQUF1QixFQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUV6RCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLGtCQUFrQixFQUNsQix5QkFBeUIsRUFDekIsNkJBQTZCLEVBQzdCLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRXpELGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUM7WUFDbkosZUFBZSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQzdKLGVBQWUsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztZQUN4SixlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztZQUVsSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUVqTCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQzNGLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRTtvQkFDckcsTUFBTSxhQUFhLEVBQUU7b0JBQ3JCLGNBQWMsYUFBYSxFQUFFO29CQUM3QixjQUFjO29CQUNkLFlBQVk7aUJBQUMsQ0FBQyxDQUFDO2dCQUVuQixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUU3RyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBRTdILEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNaLEdBQUcsR0FBRyxNQUFNLHFCQUFpQixZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUNwRyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqRUQsc0JBaUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcmVhY3QuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
