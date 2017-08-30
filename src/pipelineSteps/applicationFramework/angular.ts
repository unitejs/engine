/**
 * Pipeline step to generate scaffolding for angular application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";

export class Angular extends SharedAppFramework {
    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.applicationFramework, "Angular")) {
            if (super.condition(uniteConfiguration.bundler, "RequireJS")) {
                logger.error(`Angular does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this.toggleDependencies(logger, fileSystem, uniteConfiguration, engineVariables);

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"],
                                            super.condition(uniteConfiguration.applicationFramework, "Angular") && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["babel-eslint"], super.condition(uniteConfiguration.applicationFramework, "Angular") && super.condition(uniteConfiguration.linter, "ESLint"));

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", super.condition(uniteConfiguration.applicationFramework, "Angular"));
        }

        if (super.condition(uniteConfiguration.applicationFramework, "Angular")) {
            const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
            if (esLintConfiguration) {
                esLintConfiguration.parser = "babel-eslint";
            }

            const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
            if (typeScriptConfiguration) {
                typeScriptConfiguration.compilerOptions.experimentalDecorators = true;
            }

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component", "app.module", "child/child.component", "bootstrapper", "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["bootstrapper"], true);

                    if (ret === 0) {
                        ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app.module"], false);

                        if (ret === 0) {
                            ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
            }

            return ret;
        }
        return 0;
    }

    public toggleDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const packages = ["core", "common", "compiler", "platform-browser", "platform-browser-dynamic", "http", "router", "forms"];

        packages.forEach(pkg => {
            const testAdditions: { [id: string]: string } = {};
            if (pkg !== "forms") {
                testAdditions[`@angular/${pkg}/testing`] = `bundles/${pkg}-testing.umd.js`;
            }

            engineVariables.toggleClientPackage(
                `@angular/${pkg}`,
                `bundles/${pkg}.umd.js`,
                `bundles/${pkg}.umd.min.js`,
                testAdditions,
                false,
                "both",
                "none",
                false,
                undefined,
                undefined,
                undefined,
                super.condition(uniteConfiguration.applicationFramework, "Angular"));
        });

        engineVariables.toggleClientPackage(
            "rxjs",
            "*",
            undefined,
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            super.condition(uniteConfiguration.applicationFramework, "Angular"));

        engineVariables.toggleClientPackage(
            "core-js",
            "client/shim.js",
            undefined,
            undefined,
            false,
            "both",
            "both",
            false,
            undefined,
            undefined,
            undefined,
            super.condition(uniteConfiguration.applicationFramework, "Angular"));

        engineVariables.toggleClientPackage(
            "zone.js",
            "dist/zone.js",
            "dist/zone.min.js",
            {
                "long-stack-trace-zone": "dist/long-stack-trace-zone.js",
                proxy: "dist/proxy.js",
                "sync-test": "dist/sync-test.js",
                "runner-patch": super.condition(uniteConfiguration.unitTestFramework, "Jasmine") ? "dist/jasmine-patch.js" : "dist/mocha-patch.js",
                "async-test": "dist/async-test.js",
                "fake-async-test": "dist/fake-async-test.js"
            },
            false,
            "both",
            "both",
            false,
            undefined,
            undefined,
            undefined,
            super.condition(uniteConfiguration.applicationFramework, "Angular"));

        engineVariables.toggleClientPackage(
            "reflect-metadata",
            "Reflect.js",
            undefined,
            undefined,
            false,
            "both",
            "both",
            false,
            undefined,
            undefined,
            undefined,
            super.condition(uniteConfiguration.applicationFramework, "Angular"));
    }
}
