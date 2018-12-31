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
/**
 * Pipeline step to generate scaffolding for Aurelia application.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const templateHelper_1 = require("../../helpers/templateHelper");
const sharedAppFramework_1 = require("../sharedAppFramework");
class Aurelia extends sharedAppFramework_1.SharedAppFramework {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.applicationFramework, "Aurelia");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (_super.condition.call(this, uniteConfiguration.bundler, "Browserify") || _super.condition.call(this, uniteConfiguration.bundler, "Webpack")) {
                    logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                    return 1;
                }
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-protractor-plugin", "aurelia-protractor-plugin"], mainCondition && _super.condition.call(this, uniteConfiguration.e2eTestRunner, "Protractor"));
            engineVariables.toggleDevDependency(["unitejs-webdriver-plugin"], mainCondition && _super.condition.call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
            engineVariables.toggleDevDependency(["@babel/plugin-proposal-decorators", "@babel/plugin-proposal-class-properties"], mainCondition && _super.condition.call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && _super.condition.call(this, uniteConfiguration.linter, "ESLint"));
            this.toggleAllPackages(uniteConfiguration, engineVariables, mainCondition);
            const protractorConfiguration = engineVariables.getConfiguration("Protractor");
            if (protractorConfiguration) {
                const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.package, "unitejs-protractor-plugin")));
                arrayHelper_1.ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
            }
            const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
            if (webdriverIoPlugins) {
                arrayHelper_1.ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-webdriver-plugin", mainCondition);
            }
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, ["@babel/plugin-proposal-decorators", { legacy: true }], mainCondition, (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, ["@babel/plugin-proposal-class-properties", { loose: true }], mainCondition, (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
            }
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "esModuleInterop", true, mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            const tsLintConfiguration = engineVariables.getConfiguration("TSLint");
            if (tsLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            generateAppSource: { get: () => super.generateAppSource },
            generateAppHtml: { get: () => super.generateAppHtml },
            generateAppCss: { get: () => super.generateAppCss },
            generateE2eTest: { get: () => super.generateE2eTest },
            generateCss: { get: () => super.generateCss }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                const sourceExtension = _super.condition.call(this, uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                    `app${sourceExtension}`,
                    `bootstrapper${sourceExtension}`,
                    `child/child${sourceExtension}`
                ], false);
                if (ret === 0) {
                    ret = yield _super.generateAppSource.call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint${sourceExtension}`], true);
                }
                if (ret === 0) {
                    ret = yield _super.generateAppHtml.call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app.html", "child/child.html"]);
                }
                if (ret === 0) {
                    ret = yield _super.generateAppCss.call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
                }
                if (ret === 0) {
                    ret = yield _super.generateE2eTest.call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`], true);
                }
                if (ret === 0) {
                    ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
                }
                if (ret === 0) {
                    ret = yield _super.generateCss.call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                }
                return ret;
            }
            else {
                return 0;
            }
        });
    }
    insertRoutes(logger, fileSystem, uniteConfiguration, engineVariables, routes) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            insertContent: { get: () => super.insertContent },
            insertCompletion: { get: () => super.insertCompletion }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const sourceExtension = _super.condition.call(this, uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";
            let routerItems = [];
            const routeItems = [];
            let navigationLinks = [];
            const keys = Object.keys(routes || {});
            for (let i = 0; i < keys.length; i++) {
                const route = routes[keys[i]];
                const words = templateHelper_1.TemplateHelper.generateWords(route.moduleType);
                const camel = templateHelper_1.TemplateHelper.createCamel(words);
                const human = templateHelper_1.TemplateHelper.createHuman(words);
                routerItems.push(`{\n    route: "/${keys[i]}", name: "${camel}", moduleId: "${route.modulePath}"\n}`);
                routeItems.push(`/#/${keys[i]}`);
                navigationLinks.push(`<a route-href="route: ${camel}">${human}</a>`);
            }
            const remainingInserts = {};
            let ret = yield _super.insertContent.call(this, logger, fileSystem, engineVariables, `app${sourceExtension}`, (srcContent) => {
                let content = srcContent;
                const routerRegEx = /([ |\t]*)(config.map\(\[)([\s]*)([\s\S]*?)(\]\);)/;
                const routerResults = routerRegEx.exec(content);
                if (routerResults && routerResults.length > 4) {
                    const currentRouters = routerResults[4].trim();
                    routerItems = routerItems.filter(ri => currentRouters.replace(/\s/g, "")
                        .indexOf(ri.replace(/\s/g, "")) < 0);
                    if (routerItems.length > 0) {
                        const routerIndent = routerResults[1];
                        const routerVar = routerResults[2];
                        const routerNewline = routerResults[3];
                        const routerEnd = routerResults[5];
                        let replaceRouters = `${routerNewline}${currentRouters},${routerNewline}`;
                        replaceRouters += `${routerItems.map(ri => ri.replace(/\n/g, routerNewline))
                            .join(`,${routerNewline}`)}\n`;
                        content = content.replace(routerResults[0], `${routerIndent}${routerVar}${replaceRouters}${routerIndent}${routerEnd}`);
                    }
                }
                else {
                    remainingInserts.router = routerItems;
                }
                return content;
            });
            if (ret === 0) {
                ret = yield _super.insertContent.call(this, logger, fileSystem, engineVariables, `app.html`, (srcContent) => {
                    let content = srcContent;
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
                    }
                    else {
                        remainingInserts.navigationLinks = navigationLinks;
                    }
                    return content;
                });
            }
            if (ret === 0) {
                _super.insertCompletion.call(this, logger, remainingInserts, routeItems);
            }
            return ret;
        });
    }
    toggleAllPackages(uniteConfiguration, engineVariables, mainCondition) {
        let location = "dist/";
        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            location += "amd/";
        }
        else if (super.condition(uniteConfiguration.moduleType, "CommonJS")) {
            location += "commonjs/";
        }
        else {
            location += "system/";
        }
        const clientPackages = [
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
            }, mainCondition);
        });
        engineVariables.toggleClientPackage("whatwg-fetch", {
            name: "whatwg-fetch",
            main: "dist/fetch.umd.js"
        }, mainCondition);
        engineVariables.toggleClientPackage("requirejs-text", {
            name: "requirejs-text",
            main: "text.js",
            map: { text: "requirejs-text" }
        }, mainCondition && super.condition(uniteConfiguration.moduleType, "AMD"));
        engineVariables.toggleClientPackage("systemjs-plugin-text", {
            name: "systemjs-plugin-text",
            main: "text.js",
            map: { text: "systemjs-plugin-text" }
        }, mainCondition && super.condition(uniteConfiguration.moduleType, "SystemJS"));
    }
}
exports.Aurelia = Aurelia;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQVkzRSxpRUFBOEQ7QUFFOUQsOERBQTJEO0FBRTNELE1BQWEsT0FBUSxTQUFRLHVDQUFrQjtJQUNwQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7Ozs7WUFDMUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsSUFBSSxPQUFNLFNBQVMsWUFBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsWUFBWSxLQUFLLE9BQU0sU0FBUyxZQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtvQkFDckgsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QseUJBQVcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMxRTtZQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLDJCQUEyQixDQUFDLEVBQzFELGFBQWEsSUFBSSxPQUFNLFNBQVMsWUFBQyxrQkFBa0IsQ0FB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cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBBdXJlbGlhIGFwcGxpY2F0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFRzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHNsaW50L3RzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3R5cGVTY3JpcHQvdHlwZVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZVJvdXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVBhY2thZ2VzL3VuaXRlUGFja2FnZVJvdXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdnNjb2RlL2phdmFTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgVGVtcGxhdGVIZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy90ZW1wbGF0ZUhlbHBlclwiO1xuaW1wb3J0IHsgSUFwcGxpY2F0aW9uRnJhbWV3b3JrIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvSUFwcGxpY2F0aW9uRnJhbWV3b3JrXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi4vc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBBdXJlbGlhIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmssIFwiQXVyZWxpYVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIkJyb3dzZXJpZnlcIikgfHwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIldlYnBhY2tcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEF1cmVsaWEgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgYnVuZGxpbmcgd2l0aCAke3VuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHVuaXRlQ29uZmlndXJhdGlvbi52aWV3RXh0ZW5zaW9ucywgXCJodG1sXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1wcm90cmFjdG9yLXBsdWdpblwiLCBcImF1cmVsaWEtcHJvdHJhY3Rvci1wbHVnaW5cIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLXdlYmRyaXZlci1wbHVnaW5cIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIldlYmRyaXZlcklPXCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnNcIiwgXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWNsYXNzLXByb3BlcnRpZXNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJKYXZhU2NyaXB0XCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJiYWJlbC1lc2xpbnRcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFwiRVNMaW50XCIpKTtcblxuICAgICAgICB0aGlzLnRvZ2dsZUFsbFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFByb3RyYWN0b3JDb25maWd1cmF0aW9uPihcIlByb3RyYWN0b3JcIik7XG4gICAgICAgIGlmIChwcm90cmFjdG9yQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlLCBcInVuaXRlanMtcHJvdHJhY3Rvci1wbHVnaW5cIikpKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5wbHVnaW5zLCB7IHBhdGg6IHBsdWdpbiB9LCBtYWluQ29uZGl0aW9uLCAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0aCA9PT0gaXRlbS5wYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3ZWJkcml2ZXJJb1BsdWdpbnMgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJXZWJkcml2ZXJJTy5QbHVnaW5zXCIpO1xuICAgICAgICBpZiAod2ViZHJpdmVySW9QbHVnaW5zKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUod2ViZHJpdmVySW9QbHVnaW5zLCBcInVuaXRlanMtd2ViZHJpdmVyLXBsdWdpblwiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgaWYgKGJhYmVsQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGJhYmVsQ29uZmlndXJhdGlvbi5wbHVnaW5zLCBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnNcIiwgeyBsZWdhY3k6IHRydWUgfV0sIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iaiwgaXRlbSkgPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+IDAgJiYgaXRlbVswXSA9PT0gb2JqWzBdKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucGx1Z2lucywgW1wiQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1jbGFzcy1wcm9wZXJ0aWVzXCIsIHsgbG9vc2U6IHRydWUgfV0sIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iaiwgaXRlbSkgPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+IDAgJiYgaXRlbVswXSA9PT0gb2JqWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbiwgXCJwYXJzZXJcIiwgXCJiYWJlbC1lc2xpbnRcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24ucnVsZXMsIFwibm8tdW51c2VkLXZhcnNcIiwgMSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIGlmICh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwiZXhwZXJpbWVudGFsRGVjb3JhdG9yc1wiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBcImVzTW9kdWxlSW50ZXJvcFwiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGphdmFTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248SmF2YVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgaWYgKGphdmFTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGphdmFTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucywgXCJleHBlcmltZW50YWxEZWNvcmF0b3JzXCIsIHRydWUsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFRzTGludENvbmZpZ3VyYXRpb24+KFwiVFNMaW50XCIpO1xuICAgICAgICBpZiAodHNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0c0xpbnRDb25maWd1cmF0aW9uLnJ1bGVzLCBcIm5vLWVtcHR5XCIsIHsgc2V2ZXJpdHk6IFwid2FybmluZ1wiIH0sIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0c0xpbnRDb25maWd1cmF0aW9uLnJ1bGVzLCBcIm5vLWVtcHR5LWludGVyZmFjZVwiLCB7IHNldmVyaXR5OiBcIndhcm5pbmdcIiB9LCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJ2YXJpYWJsZS1uYW1lXCIsIFt0cnVlLCBcImFsbG93LWxlYWRpbmctdW5kZXJzY29yZVwiXSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUV4dGVuc2lvbiA9IHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSA/IFwiLnRzXCIgOiBcIi5qc1wiO1xuXG4gICAgICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBgYXBwJHtzb3VyY2VFeHRlbnNpb259YCxcbiAgICAgICAgICAgICAgICAgICAgYGJvb3RzdHJhcHBlciR7c291cmNlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgICAgIGBjaGlsZC9jaGlsZCR7c291cmNlRXh0ZW5zaW9ufWBcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVBcHBTb3VyY2UobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BlbnRyeVBvaW50JHtzb3VyY2VFeHRlbnNpb259YF0sIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVBcHBIdG1sKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcC5odG1sXCIsIFwiY2hpbGQvY2hpbGQuaHRtbFwiXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJjaGlsZC9jaGlsZFwiXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUUyZVRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BhcHAuc3BlYyR7c291cmNlRXh0ZW5zaW9ufWBdLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVVbml0VGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYGFwcC5zcGVjJHtzb3VyY2VFeHRlbnNpb259YCwgYGJvb3RzdHJhcHBlci5zcGVjJHtzb3VyY2VFeHRlbnNpb259YF0sIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbnNlcnRSb3V0ZXMobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiB7IFtpZDogc3RyaW5nXTogVW5pdGVQYWNrYWdlUm91dGVDb25maWd1cmF0aW9uIH0pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb24gPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikgPyBcIi50c1wiIDogXCIuanNcIjtcblxuICAgICAgICBsZXQgcm91dGVySXRlbXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IHJvdXRlSXRlbXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGxldCBuYXZpZ2F0aW9uTGlua3M6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJvdXRlcyB8fCB7fSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm91dGUgPSByb3V0ZXNba2V5c1tpXV07XG5cbiAgICAgICAgICAgIGNvbnN0IHdvcmRzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVXb3Jkcyhyb3V0ZS5tb2R1bGVUeXBlKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlQ2FtZWwod29yZHMpO1xuICAgICAgICAgICAgY29uc3QgaHVtYW4gPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGVIdW1hbih3b3Jkcyk7XG5cbiAgICAgICAgICAgIHJvdXRlckl0ZW1zLnB1c2goYHtcXG4gICAgcm91dGU6IFwiLyR7a2V5c1tpXX1cIiwgbmFtZTogXCIke2NhbWVsfVwiLCBtb2R1bGVJZDogXCIke3JvdXRlLm1vZHVsZVBhdGh9XCJcXG59YCk7XG4gICAgICAgICAgICByb3V0ZUl0ZW1zLnB1c2goYC8jLyR7a2V5c1tpXX1gKTtcbiAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rcy5wdXNoKGA8YSByb3V0ZS1ocmVmPVwicm91dGU6ICR7Y2FtZWx9XCI+JHtodW1hbn08L2E+YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZW1haW5pbmdJbnNlcnRzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nW10gfSA9IHt9O1xuXG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5pbnNlcnRDb250ZW50KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwJHtzb3VyY2VFeHRlbnNpb259YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNyY0NvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudCA9IHNyY0NvbnRlbnQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZXJSZWdFeCA9IC8oWyB8XFx0XSopKGNvbmZpZy5tYXBcXChcXFspKFtcXHNdKikoW1xcc1xcU10qPykoXFxdXFwpOykvO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlclJlc3VsdHMgPSByb3V0ZXJSZWdFeC5leGVjKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZXJSZXN1bHRzICYmIHJvdXRlclJlc3VsdHMubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Um91dGVycyA9IHJvdXRlclJlc3VsdHNbNF0udHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlckl0ZW1zID0gcm91dGVySXRlbXMuZmlsdGVyKHJpID0+IGN1cnJlbnRSb3V0ZXJzLnJlcGxhY2UoL1xccy9nLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbmRleE9mKHJpLnJlcGxhY2UoL1xccy9nLCBcIlwiKSkgPCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGVySXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm91dGVySW5kZW50ID0gcm91dGVyUmVzdWx0c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlclZhciA9IHJvdXRlclJlc3VsdHNbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3V0ZXJOZXdsaW5lID0gcm91dGVyUmVzdWx0c1szXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlckVuZCA9IHJvdXRlclJlc3VsdHNbNV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXBsYWNlUm91dGVycyA9IGAke3JvdXRlck5ld2xpbmV9JHtjdXJyZW50Um91dGVyc30sJHtyb3V0ZXJOZXdsaW5lfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlUm91dGVycyArPSBgJHtyb3V0ZXJJdGVtcy5tYXAocmkgPT4gcmkucmVwbGFjZSgvXFxuL2csIHJvdXRlck5ld2xpbmUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oYCwke3JvdXRlck5ld2xpbmV9YCl9XFxuYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uocm91dGVyUmVzdWx0c1swXSwgYCR7cm91dGVySW5kZW50fSR7cm91dGVyVmFyfSR7cmVwbGFjZVJvdXRlcnN9JHtyb3V0ZXJJbmRlbnR9JHtyb3V0ZXJFbmR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdJbnNlcnRzLnJvdXRlciA9IHJvdXRlckl0ZW1zO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuaW5zZXJ0Q29udGVudChsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcC5odG1sYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNyY0NvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBzcmNDb250ZW50O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25SZWdFeCA9IC8oPG5hdi4qPikoXFxzKikoW1xcc3xcXFNdKj8pKChcXHMqKTxcXC9uYXY+KS87XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25SZXN1bHRzID0gbmF2aWdhdGlvblJlZ0V4LmV4ZWMoY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0aW9uUmVzdWx0cyAmJiBuYXZpZ2F0aW9uUmVzdWx0cy5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50TGlua3MgPSBuYXZpZ2F0aW9uUmVzdWx0c1szXS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rcyA9IG5hdmlnYXRpb25MaW5rcy5maWx0ZXIocmkgPT4gY3VycmVudExpbmtzLnJlcGxhY2UoL1xccy9nLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5kZXhPZihyaS5yZXBsYWNlKC9cXHMvZywgXCJcIikpIDwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0aW9uTGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25TdGFydCA9IG5hdmlnYXRpb25SZXN1bHRzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25OZXdsaW5lID0gbmF2aWdhdGlvblJlc3VsdHNbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmF2aWdhdGlvbkVuZCA9IG5hdmlnYXRpb25SZXN1bHRzWzRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcGxhY2VSb3V0ZXJzID0gYCR7bmF2aWdhdGlvbk5ld2xpbmV9JHtjdXJyZW50TGlua3N9JHtuYXZpZ2F0aW9uTmV3bGluZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSb3V0ZXJzICs9IGAke25hdmlnYXRpb25MaW5rcy5tYXAocmkgPT4gcmkucmVwbGFjZSgvXFxuL2csIG5hdmlnYXRpb25OZXdsaW5lKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oYCR7bmF2aWdhdGlvbk5ld2xpbmV9YCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKG5hdmlnYXRpb25SZXN1bHRzWzBdLCBgJHtuYXZpZ2F0aW9uU3RhcnR9JHtyZXBsYWNlUm91dGVyc30ke25hdmlnYXRpb25FbmR9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdJbnNlcnRzLm5hdmlnYXRpb25MaW5rcyA9IG5hdmlnYXRpb25MaW5rcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgc3VwZXIuaW5zZXJ0Q29tcGxldGlvbihsb2dnZXIsIHJlbWFpbmluZ0luc2VydHMsIHJvdXRlSXRlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZUFsbFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBcImRpc3QvXCI7XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJBTURcIikpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwiYW1kL1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJDb21tb25KU1wiKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gKz0gXCJjb21tb25qcy9cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2F0aW9uICs9IFwic3lzdGVtL1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2xpZW50UGFja2FnZXM6IHsgbmFtZTogc3RyaW5nOyBpc1BhY2thZ2U/OiBib29sZWFuIH1bXSA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWFuaW1hdG9yLWNzc1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1iaW5kaW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWJvb3RzdHJhcHBlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1kZXBlbmRlbmN5LWluamVjdGlvblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1odHRwLWNsaWVudFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1mcmFtZXdvcmtcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtaGlzdG9yeVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1oaXN0b3J5LWJyb3dzZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9hZGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvYWRlci1kZWZhdWx0XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWxvZ2dpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9nZ2luZy1jb25zb2xlXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLW1ldGFkYXRhXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhbFwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wYWwtYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1wYXRoXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBvbHlmaWxsc1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1yb3V0ZS1yZWNvZ25pemVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXJvdXRlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10YXNrLXF1ZXVlXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1iaW5kaW5nXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWRpYWxvZ1wiLCBpc1BhY2thZ2U6IHRydWUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRlbXBsYXRpbmctcmVzb3VyY2VzXCIsIGlzUGFja2FnZTogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1yb3V0ZXJcIiwgaXNQYWNrYWdlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS12YWxpZGF0aW9uXCIsIGlzUGFja2FnZTogdHJ1ZSB9XG4gICAgICAgIF07XG5cbiAgICAgICAgY2xpZW50UGFja2FnZXMuZm9yRWFjaChjbGllbnRQYWNrYWdlID0+IHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKGNsaWVudFBhY2thZ2UubmFtZSwge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNsaWVudFBhY2thZ2UubmFtZSxcbiAgICAgICAgICAgICAgICBtYWluOiBgJHtsb2NhdGlvbn0ke2NsaWVudFBhY2thZ2UubmFtZX0uanNgLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJ3aGF0d2ctZmV0Y2hcIiwge1xuICAgICAgICAgICAgbmFtZTogXCJ3aGF0d2ctZmV0Y2hcIixcbiAgICAgICAgICAgIG1haW46IFwiZGlzdC9mZXRjaC51bWQuanNcIlxuICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcInJlcXVpcmVqcy10ZXh0XCIsIHtcbiAgICAgICAgICAgIG5hbWU6IFwicmVxdWlyZWpzLXRleHRcIixcbiAgICAgICAgICAgIG1haW46IFwidGV4dC5qc1wiLFxuICAgICAgICAgICAgbWFwOiB7IHRleHQ6IFwicmVxdWlyZWpzLXRleHRcIiB9XG4gICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBcIkFNRFwiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJzeXN0ZW1qcy1wbHVnaW4tdGV4dFwiLCB7XG4gICAgICAgICAgICBuYW1lOiBcInN5c3RlbWpzLXBsdWdpbi10ZXh0XCIsXG4gICAgICAgICAgICBtYWluOiBcInRleHQuanNcIixcbiAgICAgICAgICAgIG1hcDogeyB0ZXh0OiBcInN5c3RlbWpzLXBsdWdpbi10ZXh0XCIgfVxuICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJTeXN0ZW1KU1wiKSk7XG4gICAgfVxufVxuIl19
