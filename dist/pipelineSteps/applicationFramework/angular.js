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
 * Pipeline step to generate scaffolding for angular application.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const sharedAppFramework_1 = require("../sharedAppFramework");
class Angular extends sharedAppFramework_1.SharedAppFramework {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.applicationFramework, "Angular");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (_super("condition").call(this, uniteConfiguration.bundler, "RequireJS")) {
                    logger.error(`Angular does not currently support bundling with ${uniteConfiguration.bundler}`);
                    return 1;
                }
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            this.toggleDependencies(logger, uniteConfiguration, engineVariables, mainCondition);
            const usingGulp = _super("condition").call(this, uniteConfiguration.taskManager, "Gulp");
            if (mainCondition && usingGulp) {
                engineVariables.buildTranspileInclude.push("const inline = require(\"gulp-inline-ng2-template\");");
                engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
                engineVariables.buildTranspilePreBuild.push(".pipe(buildConfiguration.bundle ? inline({");
                engineVariables.buildTranspilePreBuild.push("                useRelativePaths: true,");
                engineVariables.buildTranspilePreBuild.push("                removeLineBreaks: true,");
                engineVariables.buildTranspilePreBuild.push("                customFilePath: (ext, inlinePath) => ext[0] === \".css\" ?");
                engineVariables.buildTranspilePreBuild.push("                    inlinePath.replace(`\${path.sep}src\${path.sep}`, `\${path.sep}dist\${path.sep}`) : inlinePath");
                engineVariables.buildTranspilePreBuild.push("        }) : gutil.noop())");
                const moduleIdRegEx = engineVariables.moduleId.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
                engineVariables.buildTranspilePreBuild.push(`        .pipe(buildConfiguration.bundle ? replace(/moduleId: ${moduleIdRegEx},/, "") : gutil.noop())`);
            }
            engineVariables.toggleDevDependency(["gulp-inline-ng2-template"], mainCondition && usingGulp);
            engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy", "babel-plugin-transform-class-properties"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && _super("condition").call(this, uniteConfiguration.linter, "ESLint"));
            engineVariables.toggleDevDependency(["@types/systemjs"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
            }
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.globals, "__moduleName", true, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.globals, "module", true, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            const tsLintConfiguration = engineVariables.getConfiguration("TSLint");
            if (tsLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "interface-name", false, mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                const sourceExtension = _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                    `app.component${sourceExtension}`,
                    `app.module${sourceExtension}`,
                    `child/child.component${sourceExtension}`,
                    `bootstrapper${sourceExtension}`,
                    `entryPoint${sourceExtension}`
                ]);
                if (ret === 0) {
                    ret = yield _super("generateAppHtml").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app.component.html", "child/child.component.html"]);
                }
                if (ret === 0) {
                    ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app.component", "child/child.component"]);
                }
                if (ret === 0) {
                    ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);
                }
                if (ret === 0) {
                    ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`bootstrapper.spec${sourceExtension}`], true);
                }
                if (ret === 0) {
                    ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.module.spec${sourceExtension}`], false);
                }
                if (ret === 0) {
                    ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                }
                return ret;
            }
            else {
                return 0;
            }
        });
    }
    toggleDependencies(logger, uniteConfiguration, engineVariables, mainCondition) {
        const packages = ["core", "common", "compiler", "platform-browser", "platform-browser-dynamic", "http", "router", "forms"];
        packages.forEach(pkg => {
            const testAdditions = {};
            if (pkg !== "forms") {
                testAdditions[`@angular/${pkg}/testing`] = `bundles/${pkg}-testing.umd.js`;
            }
            engineVariables.toggleClientPackage(`@angular/${pkg}`, {
                name: `@angular/${pkg}`,
                main: `bundles/${pkg}.umd.js`,
                mainMinified: `bundles/${pkg}.umd.min.js`,
                testingAdditions: testAdditions,
                preload: false,
                includeMode: "both",
                isPackage: false
            }, mainCondition);
        });
        engineVariables.toggleClientPackage("rxjs", {
            name: "rxjs",
            main: "*",
            preload: false,
            includeMode: "both"
        }, mainCondition);
        engineVariables.toggleClientPackage("core-js", {
            name: "core-js",
            main: "client/shim.js",
            includeMode: "both",
            scriptIncludeMode: "both"
        }, mainCondition);
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
        }, mainCondition);
        engineVariables.toggleClientPackage("reflect-metadata", {
            name: "reflect-metadata",
            main: "Reflect.js",
            includeMode: "both",
            scriptIncludeMode: "both"
        }, mainCondition);
    }
}
exports.Angular = Angular;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2FuZ3VsYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBQ3pFLDhFQUEyRTtBQVUzRSw4REFBMkQ7QUFFM0QsYUFBcUIsU0FBUSx1Q0FBa0I7SUFDcEMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzlKLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUNELHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0UsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzdKLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXBGLE1BQU0sU0FBUyxHQUFHLG1CQUFlLFlBQUMs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QUNoQyxnQkFBZ0IsRUFBRTtnQkFDZCx1QkFBdUIsRUFBRSwrQkFBK0I7Z0JBQ3hELEtBQUssRUFBRSxlQUFlO2dCQUN0QixXQUFXLEVBQUUsbUJBQW1CO2dCQUNoQyxjQUFjLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtnQkFDbEksWUFBWSxFQUFFLG9CQUFvQjtnQkFDbEMsaUJBQWlCLEVBQUUseUJBQXlCO2FBQy9DO1lBQ0QsV0FBVyxFQUFFLE1BQU07WUFDbkIsaUJBQWlCLEVBQUUsTUFBTTtTQUM1QixFQUNELGFBQWEsQ0FBQyxDQUFDO1FBRW5ELGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLElBQUksRUFBRSxZQUFZO1lBQ2xCLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGlCQUFpQixFQUFFLE1BQU07U0FDNUIsRUFDRCxhQUFhLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7QUF0TEQsMEJBc0xDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvYW5ndWxhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzY2FmZm9sZGluZyBmb3IgYW5ndWxhciBhcHBsaWNhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3RzbGludC90c0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBKYXZhU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy92c2NvZGUvamF2YVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi4vc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBBbmd1bGFyIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmssIFwiQW5ndWxhclwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJSZXF1aXJlSlNcIikpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEFuZ3VsYXIgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgYnVuZGxpbmcgd2l0aCAke3VuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHVuaXRlQ29uZmlndXJhdGlvbi52aWV3RXh0ZW5zaW9ucywgXCJodG1sXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy50b2dnbGVEZXBlbmRlbmNpZXMobG9nZ2VyLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgY29uc3QgdXNpbmdHdWxwID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpO1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiB1c2luZ0d1bHApIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZUluY2x1ZGUucHVzaChcImNvbnN0IGlubGluZSA9IHJlcXVpcmUoXFxcImd1bHAtaW5saW5lLW5nMi10ZW1wbGF0ZVxcXCIpO1wiKTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZUluY2x1ZGUucHVzaChcImNvbnN0IHJlcGxhY2UgPSByZXF1aXJlKFxcXCJndWxwLXJlcGxhY2VcXFwiKTtcIik7XG5cbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZVByZUJ1aWxkLnB1c2goXCIucGlwZShidWlsZENvbmZpZ3VyYXRpb24uYnVuZGxlID8gaW5saW5lKHtcIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYnVpbGRUcmFuc3BpbGVQcmVCdWlsZC5wdXNoKFwiICAgICAgICAgICAgICAgIHVzZVJlbGF0aXZlUGF0aHM6IHRydWUsXCIpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkVHJhbnNwaWxlUHJlQnVpbGQucHVzaChcIiAgICAgICAgICAgICAgICByZW1vdmVMaW5lQnJlYWtzOiB0cnVlLFwiKTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZVByZUJ1aWxkLnB1c2goXCIgICAgICAgICAgICAgICAgY3VzdG9tRmlsZVBhdGg6IChleHQsIGlubGluZVBhdGgpID0+IGV4dFswXSA9PT0gXFxcIi5jc3NcXFwiID9cIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYnVpbGRUcmFuc3BpbGVQcmVCdWlsZC5wdXNoKFwiICAgICAgICAgICAgICAgICAgICBpbmxpbmVQYXRoLnJlcGxhY2UoYFxcJHtwYXRoLnNlcH1zcmNcXCR7cGF0aC5zZXB9YCwgYFxcJHtwYXRoLnNlcH1kaXN0XFwke3BhdGguc2VwfWApIDogaW5saW5lUGF0aFwiKTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZVByZUJ1aWxkLnB1c2goXCIgICAgICAgIH0pIDogZ3V0aWwubm9vcCgpKVwiKTtcblxuICAgICAgICAgICAgY29uc3QgbW9kdWxlSWRSZWdFeCA9IGVuZ2luZVZhcmlhYmxlcy5tb2R1bGVJZC5yZXBsYWNlKC9cXC4vZywgXCJcXFxcLlwiKS5yZXBsYWNlKC9cXCgvZywgXCJcXFxcKFwiKS5yZXBsYWNlKC9cXCkvZywgXCJcXFxcKVwiKTtcblxuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkVHJhbnNwaWxlUHJlQnVpbGQucHVzaChgICAgICAgICAucGlwZShidWlsZENvbmZpZ3VyYXRpb24uYnVuZGxlID8gcmVwbGFjZSgvbW9kdWxlSWQ6ICR7bW9kdWxlSWRSZWdFeH0sLywgXCJcIikgOiBndXRpbC5ub29wKCkpYCk7XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJndWxwLWlubGluZS1uZzItdGVtcGxhdGVcIl0sIG1haW5Db25kaXRpb24gJiYgdXNpbmdHdWxwKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWRlY29yYXRvcnMtbGVnYWN5XCIsIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1jbGFzcy1wcm9wZXJ0aWVzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiSmF2YVNjcmlwdFwiKSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImJhYmVsLWVzbGludFwiXSwgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmxpbnRlciwgXCJFU0xpbnRcIikpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJAdHlwZXMvc3lzdGVtanNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJUeXBlU2NyaXB0XCIpKTtcblxuICAgICAgICBjb25zdCBiYWJlbENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxCYWJlbENvbmZpZ3VyYXRpb24+KFwiQmFiZWxcIik7XG4gICAgICAgIGlmIChiYWJlbENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucGx1Z2lucywgXCJ0cmFuc2Zvcm0tZGVjb3JhdG9ycy1sZWdhY3lcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoYmFiZWxDb25maWd1cmF0aW9uLnBsdWdpbnMsIFwidHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlc0xpbnRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIik7XG4gICAgICAgIGlmIChlc0xpbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZ2xvYmFscywgXCJfX21vZHVsZU5hbWVcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uZ2xvYmFscywgXCJtb2R1bGVcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24sIFwicGFyc2VyXCIsIFwiYmFiZWwtZXNsaW50XCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLnJ1bGVzLCBcIm5vLXVudXNlZC12YXJzXCIsIDEsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZVNjcmlwdENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxUeXBlU2NyaXB0Q29uZmlndXJhdGlvbj4oXCJUeXBlU2NyaXB0XCIpO1xuICAgICAgICBpZiAodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBcImV4cGVyaW1lbnRhbERlY29yYXRvcnNcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqYXZhU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEphdmFTY3JpcHRDb25maWd1cmF0aW9uPihcIkphdmFTY3JpcHRcIik7XG4gICAgICAgIGlmIChqYXZhU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShqYXZhU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwiZXhwZXJpbWVudGFsRGVjb3JhdG9yc1wiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxUc0xpbnRDb25maWd1cmF0aW9uPihcIlRTTGludFwiKTtcbiAgICAgICAgaWYgKHRzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJuby1lbXB0eVwiLCB7IHNldmVyaXR5OiBcIndhcm5pbmdcIiB9LCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJuby1lbXB0eS1pbnRlcmZhY2VcIiwgeyBzZXZlcml0eTogXCJ3YXJuaW5nXCIgfSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHRzTGludENvbmZpZ3VyYXRpb24ucnVsZXMsIFwiaW50ZXJmYWNlLW5hbWVcIiwgZmFsc2UsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb24gPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikgPyBcIi50c1wiIDogXCIuanNcIjtcblxuICAgICAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVBcHBTb3VyY2UobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1xuICAgICAgICAgICAgICAgIGBhcHAuY29tcG9uZW50JHtzb3VyY2VFeHRlbnNpb259YCxcbiAgICAgICAgICAgICAgICBgYXBwLm1vZHVsZSR7c291cmNlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgYGNoaWxkL2NoaWxkLmNvbXBvbmVudCR7c291cmNlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgYGJvb3RzdHJhcHBlciR7c291cmNlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgYGVudHJ5UG9pbnQke3NvdXJjZUV4dGVuc2lvbn1gXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQXBwSHRtbChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHAuY29tcG9uZW50Lmh0bWxcIiwgXCJjaGlsZC9jaGlsZC5jb21wb25lbnQuaHRtbFwiXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHAuY29tcG9uZW50XCIsIFwiY2hpbGQvY2hpbGQuY29tcG9uZW50XCJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlRTJlVGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYGFwcC5zcGVjJHtzb3VyY2VFeHRlbnNpb259YF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZVVuaXRUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtgYm9vdHN0cmFwcGVyLnNwZWMke3NvdXJjZUV4dGVuc2lvbn1gXSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BhcHAubW9kdWxlLnNwZWMke3NvdXJjZUV4dGVuc2lvbn1gXSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0b2dnbGVEZXBlbmRlbmNpZXMobG9nZ2VyOiBJTG9nZ2VyLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFja2FnZXMgPSBbXCJjb3JlXCIsIFwiY29tbW9uXCIsIFwiY29tcGlsZXJcIiwgXCJwbGF0Zm9ybS1icm93c2VyXCIsIFwicGxhdGZvcm0tYnJvd3Nlci1keW5hbWljXCIsIFwiaHR0cFwiLCBcInJvdXRlclwiLCBcImZvcm1zXCJdO1xuXG4gICAgICAgIHBhY2thZ2VzLmZvckVhY2gocGtnID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RBZGRpdGlvbnM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgICAgICAgaWYgKHBrZyAhPT0gXCJmb3Jtc1wiKSB7XG4gICAgICAgICAgICAgICAgdGVzdEFkZGl0aW9uc1tgQGFuZ3VsYXIvJHtwa2d9L3Rlc3RpbmdgXSA9IGBidW5kbGVzLyR7cGtnfS10ZXN0aW5nLnVtZC5qc2A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKGBAYW5ndWxhci8ke3BrZ31gLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYEBhbmd1bGFyLyR7cGtnfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogYGJ1bmRsZXMvJHtwa2d9LnVtZC5qc2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBgYnVuZGxlcy8ke3BrZ30udW1kLm1pbi5qc2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdGVzdEFkZGl0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJib3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcInJ4anNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJyeGpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYm90aFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFwiY29yZS1qc1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNvcmUtanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwiY2xpZW50L3NoaW0uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcImJvdGhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcInpvbmUuanNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJ6b25lLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcImRpc3Qvem9uZS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcImRpc3Qvem9uZS5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxvbmctc3RhY2stdHJhY2Utem9uZVwiOiBcImRpc3QvbG9uZy1zdGFjay10cmFjZS16b25lLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHk6IFwiZGlzdC9wcm94eS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3luYy10ZXN0XCI6IFwiZGlzdC9zeW5jLXRlc3QuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJ1bm5lci1wYXRjaFwiOiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrLCBcIkphc21pbmVcIikgPyBcImRpc3QvamFzbWluZS1wYXRjaC5qc1wiIDogXCJkaXN0L21vY2hhLXBhdGNoLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhc3luYy10ZXN0XCI6IFwiZGlzdC9hc3luYy10ZXN0LmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWtlLWFzeW5jLXRlc3RcIjogXCJkaXN0L2Zha2UtYXN5bmMtdGVzdC5qc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYm90aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwiYm90aFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFwicmVmbGVjdC1tZXRhZGF0YVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInJlZmxlY3QtbWV0YWRhdGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwiUmVmbGVjdC5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYm90aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwiYm90aFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
