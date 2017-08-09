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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-preset-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript");
            engineVariables.toggleDevDependency(["eslint-plugin-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint");
            engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleDevDependency(["unitejs-react-protractor-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.e2ePlugins["unitejs-react-protractor-plugin"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "Protractor";
            engineVariables.toggleDevDependency(["unitejs-react-webdriver-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.e2ePlugins["unitejs-react-webdriver-plugin"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "WebdriverIO";
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
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                    `app${codeExtension}`,
                    `child/child${codeExtension}`,
                    "bootstrapper",
                    "entryPoint"
                ]);
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
            return 0;
        });
    }
}
exports.React = React;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSw2REFBMEQ7QUFFMUQsV0FBbUIsU0FBUSx1Q0FBa0I7SUFDNUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3ZLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUU1SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsRUFDL0Qsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUUvSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDbkwsZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDO1lBRXpLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUNuTCxlQUFlLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUM7WUFFekssZUFBZSxDQUFDLG1CQUFtQixDQUMvQixPQUFPLEVBQ1AsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUV6RCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxtQkFBbUIsRUFDbkIsdUJBQXVCLEVBQ3ZCLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRXpELGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0Isa0JBQWtCLEVBQ2xCLHlCQUF5QixFQUN6Qiw2QkFBNkIsRUFDN0IsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxDQUFDLENBQUM7WUFFekQsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQztZQUNuSixlQUFlLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDN0osZUFBZSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDO1lBQ3hKLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDO1lBRWxJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEdBQUcsRUFBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDO1lBRWpMLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztnQkFDM0YsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUU7b0JBQzVGLE1BQU0sYUFBYSxFQUFFO29CQUNyQixjQUFjLGFBQWEsRUFBRTtvQkFDN0IsY0FBYztvQkFDZCxZQUFZO2lCQUFDLENBQUMsQ0FBQztnQkFFbkIsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxHQUFHLE1BQU0seUJBQXFCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUVwRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFFcEgsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1osR0FBRyxHQUFHLE1BQU0scUJBQWlCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDM0YsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBdkVELHNCQXVFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
