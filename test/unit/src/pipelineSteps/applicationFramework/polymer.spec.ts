/**
 * Tests for Polymer.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../src/configuration/models/babel/babelConfiguration";
import { ProtractorConfiguration } from "../../../../../src/configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../../../../src/configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { JavaScriptConfiguration } from "../../../../../src/configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Polymer } from "../../../../../src/pipelineSteps/applicationFramework/polymer";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Polymer", () => {
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
        uniteConfigurationStub.applicationFramework = "Polymer";
        uniteConfigurationStub.moduleType = "CommonJS";
        uniteConfigurationStub.bundler = "Webpack";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.taskManager = "Gulp";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
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
        const obj = new Polymer();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Polymer();
            uniteConfigurationStub.applicationFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Polymer();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can be called with false main condition", async () => {
            const obj = new Polymer();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(0);
        });

        it("can fail with jsdom as unit test engine", async () => {
            uniteConfigurationStub.unitTestEngine = "JSDom";
            const obj = new Polymer();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail with phantomjs as unit test engine", async () => {
            uniteConfigurationStub.unitTestEngine = "PhantomJS";
            const obj = new Polymer();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail with requirejs as bundler", async () => {
            uniteConfigurationStub.bundler = "RequireJS";
            const obj = new Polymer();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called with application framework matching", async () => {
            const obj = new Polymer();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new Polymer();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations", async () => {
            const obj = new Polymer();
            engineVariablesStub.setConfiguration("Protractor", { plugins: [ { path: "aaa" } ] });
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", []);
            engineVariablesStub.setConfiguration("Babel", { plugins: []});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("JavaScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("ESLint", { parserOptions: { ecmaFeatures: {}}, extends: [], plugins: [], settings: {}});
            engineVariablesStub.setConfiguration("TSLint", { rules: { } });
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(1);

            const packageJsonDependencies: { [id: string]: string } = {};
            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDependencies["@polymer/polymer"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["@polymer/app-route"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["@polymer/iron-location"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["@polymer/decorators"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["@webcomponents/webcomponentsjs"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["@webcomponents/shadycss"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<TsLintConfiguration>("TSLint").rules["no-empty"]).not.to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<JavaScriptConfiguration>("JavaScript").compilerOptions.experimentalDecorators).to.be.equal(true);
        });

        it("can be called with bundler as requirejs", async () => {
            uniteConfigurationStub.bundler = "RequireJS";
            const obj = new Polymer();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild.length).to.be.equal(2);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new Polymer();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);

            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations with false mainCondition", async () => {
            const obj = new Polymer();
            engineVariablesStub.setConfiguration("Protractor", { plugins: [ { path: "./node_modules/unitejs-protractor-plugin" } ] });
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", ["unitejs-webdriver-plugin"]);
            engineVariablesStub.setConfiguration("Babel", { plugins: [["@babel/plugin-proposal-decorators"], ["@babel/plugin-proposal-class-properties"]]});
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(0);
        });
    });

    describe("finalise", () => {
        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith(".js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no css", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith(".css")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
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

            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can complete with javascript", async () => {
            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can complete with false main condition", async () => {
            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can complete with typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new Polymer();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.ts");
            Chai.expect(exists).to.be.equal(true);
        });
    });

    describe("insertRoutes", () => {
        it("can be called with no routes", async () => {
            const obj = new Polymer();
            const res = await obj.insertRoutes(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, undefined);
            Chai.expect(res).to.be.equal(0);
        });

        it("can fail if unable to read files", async () => {
            const obj = new Polymer();
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
            const obj = new Polymer();
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
            Chai.expect(writtenApp).to.contain(`import "./examples/my-route";`);
            Chai.expect(writtenApp).to.contain(`import "./their/root";`);
            Chai.expect(writtenHtml).to.contain(`<co-my-route data-route="/my/route">`);
            Chai.expect(writtenHtml).to.contain(`<co-their-root data-route="/their/root">`);
            Chai.expect(writtenHtml).to.contain(`<a href="#/my/route">My Route</a>`);
            Chai.expect(writtenHtml).to.contain(`<a href="#/their/root">Their Root</a>`);
        });

        it("can be called with routes as typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";

            const obj = new Polymer();
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
            Chai.expect(writtenApp).to.contain(`import "./examples/my-route";`);
            Chai.expect(writtenApp).to.contain(`import "./their/root";`);
            Chai.expect(writtenHtml).to.contain(`<co-my-route data-route="/my/route">`);
            Chai.expect(writtenHtml).to.contain(`<co-their-root data-route="/their/root">`);
            Chai.expect(writtenHtml).to.contain(`<a href="#/my/route">My Route</a>`);
            Chai.expect(writtenHtml).to.contain(`<a href="#/their/root">Their Root</a>`);
        });

        it("can be called with routes already existing", async () => {
            const obj = new Polymer();
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

            const appContent = await fileSystemMock.fileReadText("./test/unit/temp/www/src/", "app.js");
            Chai.expect(/import "\.\/examples\/my-route\";/g.exec(appContent).length).to.be.equal(1);
            Chai.expect(/import "\.\/their\/root\";/g.exec(appContent).length).to.be.equal(1);

            const viewContent = await fileSystemMock.fileReadText("./test/unit/temp/www/src/", "app.html");
            Chai.expect(/<co-my-route data-route=\"\/my\/route\">\s*<\/co-my-route>/g.exec(viewContent).length).to.be.equal(1);
            Chai.expect(/<co-their-root data-route=\"\/their\/root\">\s*<\/co-their-root>/g.exec(viewContent).length).to.be.equal(1);
            Chai.expect(/<a href=\"#\/my\/route\">My Route<\/a>/g.exec(viewContent).length).to.be.equal(1);
            Chai.expect(/<a href=\"#\/their\/root\">Their Root<\/a>/g.exec(viewContent).length).to.be.equal(1);
        });

        it("can be called when unable to find insertion points", async () => {
            const obj = new Polymer();
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
            Chai.expect(banner).to.contain(`import "./examples/my-route";`);
            Chai.expect(banner).to.contain(`import "./their/root";`);
            Chai.expect(banner).to.contain(`<co-my-route data-route="/my/route">`);
            Chai.expect(banner).to.contain(`<co-their-root data-route="/their/root">`);
            Chai.expect(banner).to.contain(`<a href="#/my/route">My Route</a>`);
            Chai.expect(banner).to.contain(`<a href="#/their/root">Their Root</a>`);
        });
    });
});
