/**
 * Pipeline step to generate scaffolding for angular application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UnitePackageRouteConfiguration } from "../../configuration/models/unitePackages/unitePackageRouteConfiguration";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { IApplicationFramework } from "../../interfaces/IApplicationFramework";
import { SharedAppFramework } from "../sharedAppFramework";

export class Angular extends SharedAppFramework implements IApplicationFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Angular");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.bundler, "RequireJS")) {
                logger.error(`Angular does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        this.toggleDependencies(logger, uniteConfiguration, engineVariables, mainCondition);

        const usingGulp = super.condition(uniteConfiguration.taskManager, "Gulp");
        if (mainCondition && usingGulp) {
            engineVariables.buildTranspileInclude.push("const inline = require(\"gulp-inline-ng2-template\");");
            engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");

            engineVariables.buildTranspilePreBuild.push("        .pipe(buildConfiguration.bundle ? inline({");
            engineVariables.buildTranspilePreBuild.push("                useRelativePaths: true,");
            engineVariables.buildTranspilePreBuild.push("                removeLineBreaks: true,");
            engineVariables.buildTranspilePreBuild.push("                customFilePath: (ext, inlinePath) => ext[0] === \".css\" ?");
            engineVariables.buildTranspilePreBuild.push("                    inlinePath.replace(`\${path.sep}src\${path.sep}`, `\${path.sep}dist\${path.sep}`) : inlinePath");
            engineVariables.buildTranspilePreBuild.push("        }) : gutil.noop())");

            const moduleIdRegEx = engineVariables.moduleId.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

            engineVariables.buildTranspilePreBuild.push(`        .pipe(buildConfiguration.bundle ? replace(/moduleId: ${moduleIdRegEx},/, "") : gutil.noop())`);
        }

        engineVariables.toggleDevDependency(["gulp-inline-ng2-template"], mainCondition && usingGulp);

        engineVariables.toggleDevDependency(["unitejs-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy", "babel-plugin-transform-class-properties"],
                                            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));
        engineVariables.toggleDevDependency(["@types/systemjs"],
                                            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.package, "unitejs-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-webdriver-plugin", mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.globals, "__moduleName", true, mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.globals, "module", true, mainCondition);
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "interface-name", false, mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                                                        `app.component${sourceExtension}`,
                                                        `app.module${sourceExtension}`,
                                                        `child/child.component${sourceExtension}`,
                                                        `bootstrapper${sourceExtension}`
                                                    ],
                                                   false);

            if (ret === 0) {
                ret = await super.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component.html", "child/child.component.html"]);
            }

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component", "child/child.component"]);
            }

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`bootstrapper.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.module.spec${sourceExtension}`], false);
            }

            if (ret === 0) {
                ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
            }

            return ret;
        } else {
            return 0;
        }
    }

    public toggleDependencies(logger: ILogger, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        const packages = ["core", "common", "compiler", "platform-browser", "platform-browser-dynamic", "http", "router", "forms"];

        packages.forEach(pkg => {
            const testAdditions: { [id: string]: string } = {};
            if (pkg !== "forms") {
                testAdditions[`@angular/${pkg}/testing`] = `bundles/${pkg}-testing.umd.js`;
            }

            engineVariables.toggleClientPackage(`@angular/${pkg}`, {
                                                    name: `@angular/${pkg}`,
                                                    main: `bundles/${pkg}.umd.js`,
                                                    mainMinified: `bundles/${pkg}.umd.min.js`,
                                                    testingAdditions: testAdditions,
                                                    includeMode: "both"
                                                },
                                                mainCondition);
        });

        engineVariables.toggleClientPackage("rxjs", {
                                                name: "rxjs",
                                                main: "*",
                                                mainLib: ["*.js",
                                                    "add/**/*.js",
                                                    "observable/**/*.js",
                                                    "operator/**/*.js",
                                                    "operators/**/*.js",
                                                    "scheduler/**/*.js",
                                                    "symbol/**/*.js",
                                                    "testing/**/*.js",
                                                    "util/**/*.js"
                                                ],
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("core-js", {
                                                name: "core-js",
                                                main: "client/shim.js",
                                                mainMinified: "client/shim.min.js",
                                                includeMode: "both",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("zone.js", {
                                                name: "zone.js",
                                                main: "dist/zone.js",
                                                mainMinified: "dist/zone.min.js",
                                                testingAdditions: {
                                                    "long-stack-trace-zone": "dist/long-stack-trace-zone.js",
                                                    proxy: "dist/proxy.js",
                                                    "sync-test": "dist/sync-test.js",
                                                    "runner-patch": super.condition(uniteConfiguration.unitTestFramework, "Jasmine") ? "dist/jasmine-patch.js" : "dist/mocha-patch.js",
                                                    "async-test": "dist/async-test.js",
                                                    "fake-async-test": "dist/fake-async-test.js"
                                                },
                                                includeMode: "both",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        // main condition false to always remove, since ng5 no longer requires
        engineVariables.toggleClientPackage("reflect-metadata", {
                                                name: "reflect-metadata"
                                            },
                                            false);
    }

    public async insertRoutes(logger: ILogger,
                              fileSystem: IFileSystem,
                              uniteConfiguration: UniteConfiguration,
                              engineVariables: EngineVariables,
                              routes: { [id: string]: UnitePackageRouteConfiguration }): Promise<number> {
        return 0;
    }
}
