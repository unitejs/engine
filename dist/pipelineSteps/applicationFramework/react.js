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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSw2REFBMEQ7QUFFMUQsV0FBbUIsU0FBUSx1Q0FBa0I7SUFDNUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3ZLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUU1SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsRUFDL0Qsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUUvSSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLE9BQU8sRUFDUCxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRXpELGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0IsV0FBVyxFQUNYLG1CQUFtQixFQUNuQix1QkFBdUIsRUFDdkIsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxDQUFDLENBQUM7WUFFekQsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixrQkFBa0IsRUFDbEIseUJBQXlCLEVBQ3pCLDZCQUE2QixFQUM3QixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUV6RCxlQUFlLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDO1lBQ25KLGVBQWUsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM3SixlQUFlLENBQUMsV0FBVyxDQUFDLDBCQUEwQixDQUFDLEdBQUcsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUM7WUFDeEosZUFBZSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUM7WUFFbEksZUFBZSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7WUFFakwsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUMzRixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRTtvQkFDNUYsTUFBTSxhQUFhLEVBQUU7b0JBQ3JCLGNBQWMsYUFBYSxFQUFFO29CQUM3QixjQUFjO29CQUNkLFlBQVk7aUJBQUMsQ0FBQyxDQUFDO2dCQUVuQixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBRXBHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUVwSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWixHQUFHLEdBQUcsTUFBTSxxQkFBaUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUMzRixDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqRUQsc0JBaUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcmVhY3QuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
