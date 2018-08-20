/**
 * Pipeline step to generate scaffolding for Polymer application.
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
import { TemplateHelper } from "../../helpers/templateHelper";
import { IApplicationFramework } from "../../interfaces/IApplicationFramework";
import { SharedAppFramework } from "../sharedAppFramework";

export class Polymer extends SharedAppFramework implements IApplicationFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Polymer");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.unitTestEngine, "PhantomJS") || super.condition(uniteConfiguration.unitTestEngine, "JSDom")) {
                logger.error(`Polymer does not support unit testing with ${uniteConfiguration.unitTestEngine}`);
                return 1;
            }
            if (super.condition(uniteConfiguration.bundler, "RequireJS")) {
                logger.error(`Polymer does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }

            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy", "babel-plugin-transform-class-properties"],
                                            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));
        engineVariables.toggleDevDependency(["@types/polymer"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));
        engineVariables.toggleDevDependency(["@types/webcomponents.js"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleClientPackage("@webcomponents/webcomponentsjs-es5adapter", {
                                                name: "@webcomponents/webcomponentsjs",
                                                main: "custom-elements-es5-adapter.js",
                                                mainMinified: "custom-elements-es5-adapter.js",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@webcomponents/webcomponentsjs", {
                                                name: "@webcomponents/webcomponentsjs",
                                                main: "webcomponents-lite.js",
                                                mainMinified: "webcomponents-lite.js",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@webcomponents/shadycss", {
                                                name: "@webcomponents/shadycss",
                                                transpile: {
                                                    alias: "@webcomponents-transpiled/shadycss",
                                                    sources: ["entrypoints/*.js", "src/**/*.js"],
                                                    language: "JavaScript"
                                                },
                                                main: "*"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@polymer/polymer", {
                                                name: "@polymer/polymer",
                                                transpile: {
                                                    alias: "@polymer-transpiled/polymer",
                                                    sources: ["polymer.js", "polymer-element.js", "lib/**/*.js"],
                                                    language: "JavaScript",
                                                    stripExt: true,
                                                    modules: ["@webcomponents"]
                                                },
                                                main: "*"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@polymer/decorators", {
                                                name: "@polymer/decorators",
                                                transpile: {
                                                    alias: "@polymer-transpiled/decorators",
                                                    language: "TypeScript",
                                                    sources: ["src/*.ts"]
                                                },
                                                main: "*"
                                            },
                                            mainCondition);

        const components = ["app-route", "iron-location", "iron-pages", "iron-selector", "iron-resizable-behavior"];

        components.forEach(component => {
            engineVariables.toggleClientPackage(`@polymer/${component}`, {
                                                    name: `@polymer/${component}`,
                                                    transpile: {
                                                        alias: `@polymer-transpiled/${component}`,
                                                        language: "JavaScript",
                                                        sources: ["*.js"]
                                                    },
                                                    main: "*"
                                                },
                                                mainCondition);
        });

        engineVariables.toggleClientPackage("requirejs-text", {
                                                name: "requirejs-text",
                                                main: "text.js",
                                                map: { text: "requirejs-text" }
                                            },
                                            mainCondition && super.condition(uniteConfiguration.moduleType, "AMD"));

        engineVariables.toggleClientPackage("systemjs-plugin-text", {
                                                name: "systemjs-plugin-text",
                                                main: "text.js",
                                                map: {
                                                    text: "systemjs-plugin-text"
                                                },
                                                loaders: {
                                                    "*.html" : "text",
                                                    "*.css" : "text"
                                                }
                                            },
                                            mainCondition &&
            (super.condition(uniteConfiguration.bundler, "Browserify") ||
                super.condition(uniteConfiguration.bundler, "SystemJSBuilder") ||
                super.condition(uniteConfiguration.bundler, "Webpack")));

        if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp") && super.condition(uniteConfiguration.bundler, "RequireJS")) {
            super.createLoaderReplacement(engineVariables, "css", "text", true);
            super.createLoaderReplacement(engineVariables, "html", "text", false);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
        }

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

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const isTypeScript = super.condition(uniteConfiguration.sourceLanguage, "TypeScript");
            const sourceExtension = isTypeScript ? ".ts" : ".js";

            const srcFiles = [
                `app${sourceExtension}`,
                `child/child${sourceExtension}`,
                `bootstrapper${sourceExtension}`
            ];

            if (isTypeScript) {
                srcFiles.push("customTypes/polymer-module.d.ts");
                srcFiles.push("customTypes/polymer-element.d.ts");
            }

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, srcFiles, false);

            if (ret === 0) {
                ret = await super.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.html", "child/child.html"]);
            }

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
            }

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`], false);
            }

            if (ret === 0) {
                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
            }

            return ret;
        } else {
            return 0;
        }
    }

    public async insertRoutes(logger: ILogger,
                              fileSystem: IFileSystem,
                              uniteConfiguration: UniteConfiguration,
                              engineVariables: EngineVariables,
                              routes: { [id: string]: UnitePackageRouteConfiguration }): Promise<number> {

        const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

        let routerItems: string[] = [];
        const importItems: string[] = [];
        const routeItems: string[] = [];
        const keys = Object.keys(routes || {});
        let navigationLinks: string[] = [];

        for (let i = 0; i < keys.length; i++) {
            const route = routes[keys[i]];

            const words = TemplateHelper.generateWords(route.moduleType);
            const snake = TemplateHelper.createSnake(words);
            const human = TemplateHelper.createHuman(words);

            routerItems.push(`<co-${snake} data-route="/${keys[i]}">\n</co-${snake}>`);
            importItems.push(`import "${route.modulePath}";`);
            routeItems.push(`/#/${keys[i]}`);
            navigationLinks.push(`<a href="#/${keys[i]}">${human}</a>`);
        }

        const remainingInserts: { [id: string]: string[] } = {};

        let ret = await super.insertContent(logger,
                                            fileSystem,
                                            engineVariables,
                                            `app${sourceExtension}`,
                                            (srcContent) => {
                let content = srcContent;

                const importsRemaining = super.insertReplaceImports(content, importItems);
                content = importsRemaining.content;
                remainingInserts.imports = importsRemaining.remaining;

                return content;
            });

        if (ret === 0) {
            ret = await super.insertContent(logger,
                                            fileSystem,
                                            engineVariables,
                                            `app.html`,
                                            (srcContent) => {
                    let content = srcContent;

                    const routerRegEx = /(<iron-pages.*>)(\s*)([\s|\S]*?)((\s*)<\/iron-pages>)/;
                    const routerResults = routerRegEx.exec(content);
                    if (routerResults && routerResults.length > 4) {
                        const currentRouters = routerResults[3].trim();

                        routerItems = routerItems.filter(ri => currentRouters.replace(/\s/g, "")
                                                                            .indexOf(ri.replace(/\s/g, "")) < 0);

                        if (routerItems.length > 0) {
                            const routerVar = routerResults[1];
                            const routerNewline = routerResults[2];
                            const routerEnd = routerResults[4];

                            let replaceRouters = `${routerNewline}${currentRouters}${routerNewline}`;
                            replaceRouters += `${routerItems.map(ri => ri.replace(/\n/g, routerNewline))
                                                                         .join(`${routerNewline}`)}`;
                            content = content.replace(routerResults[0], `${routerVar}${replaceRouters}${routerEnd}`);
                        }
                    } else {
                        remainingInserts.router = routerItems;
                    }

                    const navigationRegEx = /(<nav.*>)(\s*)([\s|\S]*?)((\s*)<\/nav>)/;
                    const navigationResults = navigationRegEx.exec(content);
                    if (navigationResults && navigationResults.length > 4) {
                        const currentLinks = navigationResults[3].trim();

                        navigationLinks = navigationLinks.filter(ri => currentLinks.replace(/\s/g, "")
                                                                                   .indexOf(ri.replace(/\s/g, "")) < 0);

                        if (navigationLinks.length > 0) {
                            const navigationStart = navigationResults[1];
                            const navigationNewline = navigationResults[2];
                            const navigationEnd = navigationResults[4];

                            let replaceRouters = `${navigationNewline}${currentLinks}${navigationNewline}`;
                            replaceRouters += `${navigationLinks.map(ri => ri.replace(/\n/g, navigationNewline))
                                                                             .join(`${navigationNewline}`)}`;
                            content = content.replace(navigationResults[0], `${navigationStart}${replaceRouters}${navigationEnd}`);
                        }
                    } else {
                        remainingInserts.navigationLinks = navigationLinks;
                    }

                    return content;
                });
        }

        if (ret === 0) {
            super.insertCompletion(logger, remainingInserts, routeItems);
        }

        return ret;
    }
}
