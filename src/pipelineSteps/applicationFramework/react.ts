/**
 * Pipeline step to generate scaffolding for React application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "./sharedAppFramework";

export class React extends SharedAppFramework {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-preset-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript");
        engineVariables.toggleDevDependency(["eslint-plugin-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint");

        engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"],
                                            uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.toggleDevDependency(["unitejs-react-protractor-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "Protractor");
        engineVariables.e2ePlugins["unitejs-react-protractor-plugin"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "Protractor";

        engineVariables.toggleDevDependency(["unitejs-react-webdriver-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
        engineVariables.e2ePlugins["unitejs-react-webdriver-plugin"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "WebdriverIO";

        engineVariables.toggleClientPackage(
            "react",
            "dist/react.js",
            "dist/react.min.js",
            false,
            "both",
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        engineVariables.toggleClientPackage(
            "react-dom",
            "dist/react-dom.js",
            "dist/react-dom.min.js",
            false,
            "both",
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        engineVariables.toggleClientPackage(
            "react-router-dom",
            "umd/react-router-dom.js",
            "umd/react-router-dom.min.js",
            false,
            "both",
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        engineVariables.transpilePresets.react = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript";
        engineVariables.lintFeatures.jsx = { required: uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint", object: true };
        engineVariables.lintExtends["plugin:react/recommended"] = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint";
        engineVariables.lintPlugins.react = uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint";

        engineVariables.transpileProperties.jsx = {required: uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript", object: "react"};

        if (uniteConfiguration.applicationFramework === "React") {
            const codeExtension = `!${engineVariables.sourceLanguageExt}x`;
            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app${codeExtension}`,
                `child/child${codeExtension}`,
                "bootstrapper",
                "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);

                    if (ret === 0) {
                        ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                    }
                }
            }

            return ret;
        }

        return 0;
    }
}
