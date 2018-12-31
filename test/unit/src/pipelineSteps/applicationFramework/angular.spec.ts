/**
 * Tests for Angular.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../src/configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../../../../src/configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../../../../src/configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../../../../src/configuration/models/tslint/tsLintConfiguration";
import { TypeScriptConfiguration } from "../../../../../src/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Angular } from "../../../../../src/pipelineSteps/applicationFramework/angular";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Angular", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.banner = () => { };
        loggerStub.warning = () => { };

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "Angular";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.bundler = "Webpack";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
        uniteConfigurationStub.taskManager = "Gulp";
        uniteConfigurationStub.clientPackages = {};
        uniteConfigurationStub.sourceExtensions = ["js"];
        uniteConfigurationStub.viewExtensions = [];
        uniteConfigurationStub.styleExtension = "css";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Angular();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Angular();
            uniteConfigurationStub.applicationFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Angular();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can be called with false main condition", async () => {
            const obj = new Angular();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with application framework not matching", async () => {
            const obj = new Angular();
            uniteConfigurationStub.applicationFramework = "Vanilla";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with application framework matching but failing bundler", async () => {
            const obj = new Angular();
            uniteConfigurationStub.bundler = "RequireJS";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not currently support");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(0);
        });

        it("can be called with application framework matching and working bundler", async () => {
            const obj = new Angular();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });
    });

    describe("configure", () => {
        it("can be called with javascript", async () => {
            engineVariablesStub.setConfiguration("Babel", { plugins: []});
            engineVariablesStub.setConfiguration("ESLint", { parser: "espree"});
            engineVariablesStub.setConfiguration("Protractor", { plugins: [ { path: "aaa" } ] });
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", []);
            engineVariablesStub.setConfiguration("JavaScript", { compilerOptions: {}});
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild.length).to.be.equal(7);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parser).to.be.equal("babel-eslint");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript")).to.be.equal(undefined);
            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["zone.js"].testingAdditions["runner-patch"]).to.be.equal("dist/jasmine-patch.js");
        });

        it("can be called with typescript", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("TSLint", { rules: { } });
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.sourceExtensions = ["ts"];
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild.length).to.be.equal(7);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<TsLintConfiguration>("TSLint").rules["no-empty"]).to.not.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.experimentalDecorators).to.be.equal(true);
            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["zone.js"].testingAdditions["runner-patch"]).to.be.equal("dist/jasmine-patch.js");
        });

        it("can be called with mocha framework", async () => {
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["zone.js"].testingAdditions["runner-patch"]).to.be.equal("dist/mocha-patch.js");
        });

        it("can be called with not gulp", async () => {
            uniteConfigurationStub.taskManager = undefined;
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild.length).to.be.equal(0);
        });

        it("can be called no configurations with false mainCondition", async () => {
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations with false mainCondition", async () => {
            engineVariablesStub.setConfiguration("Babel", { plugins: [["@babel/plugin-proposal-decorators"], ["@babel/plugin-proposal-class-properties"]]});
            engineVariablesStub.setConfiguration("ESLint", { parser: "babel-eslint"});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("Protractor", { plugins: [ { path: "./node_modules/unitejs-protractor-plugin" } ] });
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", ["unitejs-webdriver-plugin"]);
            const obj = new Angular();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parser).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.experimentalDecorators).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no e2e tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no html", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("html")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.component.html");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no css", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("css")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.component.css");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no shared unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no custom unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("app.module.spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.module.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can complete successfully with false main condition", async () => {
            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can complete successfully with javascript", async () => {
            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can complete successfully with typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new Angular();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.ts");
            Chai.expect(exists).to.be.equal(true);
        });
    });

    describe("insertRoutes", () => {
        it("can be called with no routes", async () => {
            const obj = new Angular();
            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, undefined);
            Chai.expect(res).to.be.equal(0);
        });

        it("can fail if unable to read files", async () => {
            const obj = new Angular();
            await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            sandbox.stub(fileSystemMock, "fileReadText").throws(new Error("err"));

            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                }
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Unable");
        });

        it("can be called with routes as javascript", async () => {
            const obj = new Angular();
            await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            let writtenApp: string;
            let writtenHtml: string;
            sandbox.stub(fileSystemMock, "fileWriteText").callsFake(async (folder, file, content) => {
                if (!writtenApp) {
                    writtenApp = content;
                } else {
                    writtenHtml = content;
                }
                return Promise.resolve();
            });

            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
                "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(writtenApp).to.contain(`import {MyRoute} from "./examples/my-route";`);
            Chai.expect(writtenApp).to.contain(`import {TheirRoot} from "./their/root";`);
            Chai.expect(writtenApp).to.contain(`{path: "my/route", component: MyRoute}`);
            Chai.expect(writtenApp).to.contain(`{path: "their/root", component: TheirRoot}`);
            Chai.expect(writtenHtml).to.contain(`<a routerLink="/my/route">My Route</a>`);
            Chai.expect(writtenHtml).to.contain(`<a routerLink="/their/root">Their Root</a>`);
        });

        it("can be called with routes as typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";

            const obj = new Angular();
            await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            let writtenApp: string;
            let writtenHtml: string;
            sandbox.stub(fileSystemMock, "fileWriteText").callsFake(async (folder, file, content) => {
                if (!writtenApp) {
                    writtenApp = content;
                } else {
                    writtenHtml = content;
                }
                return Promise.resolve();
            });

            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
                "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(writtenApp).to.contain(`import { MyRoute } from "./examples/my-route";`);
            Chai.expect(writtenApp).to.contain(`import { TheirRoot } from "./their/root";`);
            Chai.expect(writtenApp).to.contain(`{ path: "my/route", component: MyRoute }`);
            Chai.expect(writtenApp).to.contain(`{ path: "their/root", component: TheirRoot }`);
            Chai.expect(writtenHtml).to.contain(`<a routerLink="/my/route">My Route</a>`);
            Chai.expect(writtenHtml).to.contain(`<a routerLink="/their/root">Their Root</a>`);
        });

        it("can be called with routes already existing", async () => {
            const obj = new Angular();
            await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            const routes = {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
                "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            };
            let res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, routes);
            Chai.expect(res).to.be.equal(0);

            res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, routes);
            Chai.expect(res).to.be.equal(0);

            const appContent = await fileSystemMock.fileReadText("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(/import {MyRoute} from "\.\/examples\/my-route\";/g.exec(appContent).length).to.be.equal(1);
            Chai.expect(/import {TheirRoot} from "\.\/their\/root\";/g.exec(appContent).length).to.be.equal(1);
            Chai.expect(/{path: \"my\/route\", component: MyRoute}/g.exec(appContent).length).to.be.equal(1);
            Chai.expect(/{path: \"their\/root\", component: TheirRoot}/g.exec(appContent).length).to.be.equal(1);

            const viewContent = await fileSystemMock.fileReadText("./test/unit/temp/www/src/", "app.component.html");
            Chai.expect(/<a routerLink=\"\/my\/route\">My Route<\/a>/g.exec(viewContent).length).to.be.equal(1);
            Chai.expect(/<a routerLink=\"\/their\/root\">Their Root<\/a>/g.exec(viewContent).length).to.be.equal(1);
        });

        it("can be called when unable to find insertion points", async () => {
            const obj = new Angular();
            await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            sandbox.stub(fileSystemMock, "fileReadText").resolves("");

            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
                "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            });
            Chai.expect(res).to.be.equal(0);
            const banner = loggerBannerSpy.args.join();
            Chai.expect(banner).to.contain(`import {MyRoute} from "./examples/my-route";`);
            Chai.expect(banner).to.contain(`import {TheirRoot} from "./their/root";`);
            Chai.expect(banner).to.contain(`{path: "my/route", component: MyRoute}`);
            Chai.expect(banner).to.contain(`{path: "their/root", component: TheirRoot}`);
            Chai.expect(banner).to.contain(`<a routerLink="/my/route">My Route</a>`);
            Chai.expect(banner).to.contain(`<a routerLink="/their/root">Their Root</a>`);
        });
    });
});
