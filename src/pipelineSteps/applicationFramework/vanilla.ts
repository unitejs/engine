/**
 * Pipeline step to generate scaffolding for vanilla application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UnitePackageRouteConfiguration } from "../../configuration/models/unitePackages/unitePackageRouteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { TemplateHelper } from "../../helpers/templateHelper";
import { IApplicationFramework } from "../../interfaces/IApplicationFramework";
import { SharedAppFramework } from "../sharedAppFramework";

export class Vanilla extends SharedAppFramework implements IApplicationFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Vanilla");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
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

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [ true, "allow-leading-underscore" ], mainCondition);
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

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                                                        `app${sourceExtension}`,
                                                        `bootstrapper${sourceExtension}`,
                                                        `child/child${sourceExtension}`
                                                    ],
                                                   false);

            if (ret === 0) {
                ret = await super.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint${sourceExtension}`], true);
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
        const bracketSpacing = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? " " : "";

        let routerItems: string[] = [];
        const importItems: string[] = [];
        const routeItems: string[] = [];
        const keys = Object.keys(routes);
        for (let i = 0; i < keys.length; i++) {
            const route = routes[keys[i]];

            const words = TemplateHelper.generateWords(route.moduleType);
            const human = TemplateHelper.createHuman(words);

            routerItems.push(`{${bracketSpacing}route: "${keys[i]}", title: "${human}", module: () => new ${route.moduleType}()${bracketSpacing}}`);
            importItems.push(`import {${bracketSpacing}${route.moduleType}${bracketSpacing}} from "${route.modulePath}";`);
            routeItems.push(`/#/${keys[i]}`);
        }

        const remainingInserts: { [id: string]: string[] } = {};

        const ret = await super.insertContent(logger,
                                              fileSystem,
                                              uniteConfiguration,
                                              engineVariables,
                                              `app${sourceExtension}`,
                                              (srcContent) => {
                let content = srcContent;

                if (importItems.length > 0) {
                    const importsRemaining = super.insertReplaceImports(content, importItems);
                    content = importsRemaining.content;
                    remainingInserts.imports = importsRemaining.remaining;
                }

                if (routerItems.length > 0) {
                    const routerRegEx = /([ |\t]*)(this._router = \[)([\s]*)([\s\S]*?)(\];)/;
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
                }

                return content;
            });

        if (ret === 0) {
            super.insertCompletion(logger, remainingInserts, routeItems);
        }

        return ret;
    }
}
