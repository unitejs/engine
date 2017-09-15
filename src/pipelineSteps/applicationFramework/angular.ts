/**
 * Pipeline step to generate scaffolding for angular application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { SharedAppFramework } from "../sharedAppFramework";

export class Angular extends SharedAppFramework {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("language", "javaScript"),
            new PipelineKey("language", "typeScript"),
            new PipelineKey("linter", "esLint"),
            new PipelineKey("taskManager", "gulp")
        ];
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.applicationFramework, "Angular")) {
            if (super.condition(uniteConfiguration.bundler, "RequireJS")) {
                logger.error(`Angular does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this.toggleDependencies(logger, fileSystem, uniteConfiguration, engineVariables);

        const cond = super.condition(uniteConfiguration.applicationFramework, "Angular");

        const usingGulp = cond && super.condition(uniteConfiguration.taskManager, "Gulp");
        if (usingGulp) {
            engineVariables.buildTranspileInclude.push("const inline = require(\"gulp-inline-ng2-template\");");
            engineVariables.buildTranspilePreBuild.push(".pipe(buildConfiguration.bundle ? inline({ useRelativePaths: true }) : gutil.noop())");
        }

        engineVariables.toggleDevDependency(["gulp-inline-ng2-template"], usingGulp);

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"],
                                            cond && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["babel-eslint"], cond && super.condition(uniteConfiguration.linter, "ESLint"));
        engineVariables.toggleDevDependency(["@types/systemjs"],
                                            cond && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", cond);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.globals, "__moduleName", true, cond);
            ObjectHelper.addRemove(esLintConfiguration.globals, "module", true, cond);
        }

        if (super.condition(uniteConfiguration.applicationFramework, "Angular")) {
            if (esLintConfiguration) {
                esLintConfiguration.parser = "babel-eslint";
            }

            const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
            if (typeScriptConfiguration) {
                typeScriptConfiguration.compilerOptions.experimentalDecorators = true;
            }

            const sourceExtension = uniteConfiguration.sourceLanguage === "TypeScript" ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app.component${sourceExtension}`,
                `app.module${sourceExtension}`,
                `child/child.component${sourceExtension}`,
                `bootstrapper${sourceExtension}`,
                `entryPoint${sourceExtension}`
            ]);

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component.html", "child/child.component.html"]);

                if (ret === 0) {
                    ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component", "child/child.component"]);

                    if (ret === 0) {
                        ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);

                        if (ret === 0) {
                            ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`bootstrapper.spec${sourceExtension}`], true);

                            if (ret === 0) {
                                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.module.spec${sourceExtension}`], false);

                                if (ret === 0) {
                                    ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                                }
                            }
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
            undefined,
            super.condition(uniteConfiguration.applicationFramework, "Angular"));
    }
}
