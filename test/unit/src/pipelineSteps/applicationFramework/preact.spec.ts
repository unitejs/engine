/**
 * Tests for Preact.
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
import { JavaScriptConfiguration } from "../../../../../src/configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Preact } from "../../../../../src/pipelineSteps/applicationFramework/preact";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Preact", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "Preact";
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
        const obj = new Preact();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Preact();
            uniteConfigurationStub.applicationFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Preact();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can be called with false main condition", async () => {
            const obj = new Preact();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.not.contain("jsx");
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.not.contain("tsx");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(0);
        });

        it("can be called with application framework matching and javascript", async () => {
            const obj = new Preact();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.contain("jsx");
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.not.contain("tsx");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });

        it("can be called with application framework matching and typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new Preact();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.not.contain("jsx");
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.contain("tsx");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new Preact();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations", async () => {
            const obj = new Preact();
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

            Chai.expect(packageJsonDependencies.preact).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["preact-router"]).to.be.equal("1.2.3");

            Chai.expect(packageJsonDevDependencies["eslint-plugin-react"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins[0]).to.be.deep.equal([ "transform-react-jsx", { pragma: "h"} ]);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaFeatures.jsx).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).contains("plugin:react/recommended");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).contains("react");
            Chai.expect(engineVariablesStub.getConfiguration<TsLintConfiguration>("TSLint").rules["no-empty"]).not.to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<JavaScriptConfiguration>("JavaScript").compilerOptions.experimentalDecorators).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.jsx).to.be.equal("react");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.jsxFactory).to.be.equal("h");
        });

        it("can be called width transpiling module type", async () => {
            const obj = new Preact();
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.bundler = "RequireJS";

            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(uniteConfigurationStub.clientPackages.preact.transpile.alias).to.be.equal("preact-transpiled");
            Chai.expect(uniteConfigurationStub.clientPackages.preact.mainMinified).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.clientPackages["preact-router"].transpile.alias).to.be.equal("preact-router-transpiled");
            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild.length).to.be.equal(1);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new Preact();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);

            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations with false mainCondition", async () => {
            const obj = new Preact();
            engineVariablesStub.setConfiguration("Protractor", { plugins: [ { path: "./node_modules/unitejs-preact-protractor-plugin" } ] });
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", ["unitejs-preact-webdriver-plugin"]);
            engineVariablesStub.setConfiguration("Babel", { plugins: [[ "transform-react-jsx", { pragma: "h"} ]]});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: { jsx: true }});
            engineVariablesStub.setConfiguration("ESLint", { parserOptions: { ecmaFeatures: { jsx: "react"}}, extends: ["plugin:react/recommended", "react"], plugins: ["react"], settings: {}});
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaFeatures.jsx).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).not.contains("plugin:react/recommended");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).not.contains("react");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.jsx).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.jsxFactory).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith(".jsx")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.jsx");
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

            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.jsx");
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

            const obj = new Preact();
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

            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can complete with javascript", async () => {
            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can complete with false main condition", async () => {
            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can complete with typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new Preact();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.ts");
            Chai.expect(exists).to.be.equal(true);
        });
    });
});
