/**
 * Pipeline step to generate scaffolding for Aurelia application.
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

export class Aurelia extends SharedAppFramework implements IApplicationFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Aurelia");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.bundler, "Browserify") || super.condition(uniteConfiguration.bundler, "Webpack")) {
                logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-protractor-plugin", "aurelia-protractor-plugin"],
                                            mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-webdriver-plugin"],
                                            mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy", "babel-plugin-transform-class-properties"],
                                            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));

        this.toggleAllPackages(uniteConfiguration, engineVariables, mainCondition);

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
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
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
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables,
                                                   [
                    `app${sourceExtension}`,
                    `bootstrapper${sourceExtension}`,
                    `child/child${sourceExtension}`
                ],
                                                   false);

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
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`], true);
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
        const routeItems: string[] = [];
        let navigationLinks: string[] = [];

        const keys = Object.keys(routes || {});
        for (let i = 0; i < keys.length; i++) {
            const route = routes[keys[i]];

            const words = TemplateHelper.generateWords(route.moduleType);
            const camel = TemplateHelper.createCamel(words);
            const human = TemplateHelper.createHuman(words);

            routerItems.push(`{\n    route: "/${keys[i]}", name: "${camel}", moduleId: "${route.modulePath}"\n}`);
            routeItems.push(`/#/${keys[i]}`);
            navigationLinks.push(`<a route-href="route: ${camel}">${human}</a>`);
        }

        const remainingInserts: { [id: string]: string[] } = {};

        let ret = await super.insertContent(logger,
                                            fileSystem,
                                            engineVariables,
                                            `app${sourceExtension}`,
                                            (srcContent) => {
                let content = srcContent;

                const routerRegEx = /([ |\t]*)(config.map\(\[)([\s]*)([\s\S]*?)(\]\);)/;
                const routerResults = routerRegEx.exec(content);
                if (routerResults && routerResults.length > 4) {
                    const currentRouters = routerResults[4].trim();

                    routerItems = routerItems.filter(ri => currentRouters.replace(/\s/g, "").indexOf(ri.replace(/\s/g, "")) < 0);

                    if (routerItems.length > 0) {
                        const routerIndent = routerResults[1];
                        const routerVar = routerResults[2];
                        const routerNewline = routerResults[3];
                        const routerEnd = routerResults[5];

                        let replaceRouters = `${routerNewline}${currentRouters},${routerNewline}`;
                        replaceRouters += `${routerItems.map(ri => ri.replace(/\n/g, routerNewline)).join(`,${routerNewline}`)}\n`;
                        content = content.replace(routerResults[0], `${routerIndent}${routerVar}${replaceRouters}${routerIndent}${routerEnd}`);
                    }
                } else {
                    remainingInserts.router = routerItems;
                }

                return content;
            });

        if (ret === 0) {
            ret = await super.insertContent(logger,
                                            fileSystem,
                                            engineVariables,
                                            `app.html`,
                                            (srcContent) => {
                    let content = srcContent;

                    const navigationRegEx = /(<nav.*>)(\s*)([\s|\S]*?)((\s*)<\/nav>)/;
                    const navigationResults = navigationRegEx.exec(content);
                    if (navigationResults && navigationResults.length > 4) {
                        const currentLinks = navigationResults[3].trim();

                        navigationLinks = navigationLinks.filter(ri => currentLinks.replace(/\s/g, "").indexOf(ri.replace(/\s/g, "")) < 0);

                        if (navigationLinks.length > 0) {
                            const navigationStart = navigationResults[1];
                            const navigationNewline = navigationResults[2];
                            const navigationEnd = navigationResults[4];

                            let replaceRouters = `${navigationNewline}${currentLinks}${navigationNewline}`;
                            replaceRouters += `${navigationLinks.map(ri => ri.replace(/\n/g, navigationNewline)).join(`${navigationNewline}`)}`;
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

    private toggleAllPackages(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        let location = "dist/";

        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            location += "amd/";
        } else if (super.condition(uniteConfiguration.moduleType, "CommonJS")) {
            location += "commonjs/";
        } else {
            location += "system/";
        }

        const clientPackages: { name: string; isPackage?: boolean }[] = [
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
        ];

        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(clientPackage.name, {
                name: clientPackage.name,
                main: `${location}${clientPackage.name}.js`,
                isPackage: clientPackage.isPackage ? true : false
            },
                                                mainCondition);
        });

        engineVariables.toggleClientPackage("whatwg-fetch", {
            name: "whatwg-fetch",
            main: "fetch.js"
        },
                                            mainCondition);

        engineVariables.toggleClientPackage("requirejs-text", {
            name: "requirejs-text",
            main: "text.js",
            map: { text: "requirejs-text" }
        },
                                            mainCondition && super.condition(uniteConfiguration.moduleType, "AMD"));

        engineVariables.toggleClientPackage("systemjs-plugin-text", {
            name: "systemjs-plugin-text",
            main: "text.js",
            map: { text: "systemjs-plugin-text" }
        },
                                            mainCondition && super.condition(uniteConfiguration.moduleType, "SystemJS"));
    }
}
