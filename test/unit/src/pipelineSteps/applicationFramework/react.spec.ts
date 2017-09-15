/**
 * Tests for React.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../dist/configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../../../../dist/configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../../../../dist/configuration/models/protractor/protractorConfiguration";
import { TypeScriptConfiguration } from "../../../../../dist/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { React } from "../../../../../dist/pipelineSteps/applicationFramework/react";
import { FileSystemMock } from "../../fileSystem.mock";

describe("React", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "React";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
        uniteConfigurationStub.clientPackages = {};
        uniteConfigurationStub.sourceExtensions = ["js"];
        uniteConfigurationStub.viewExtensions = [];
        uniteConfigurationStub.styleExtension = "css";
        uniteConfigurationStub.notBundledLoader = "rjs";
        uniteConfigurationStub.bundledLoader = "rjs";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
        engineVariablesStub.setConfiguration("Protractor", { plugins: []});
        engineVariablesStub.setConfiguration("ESLint", { parserOptions: { ecmaFeatures: {}}, extends: [], env: {}, globals: {}, rules: {}, plugins: []});
        engineVariablesStub.setConfiguration("Babel", { presets: []});
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new React();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new React();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(7);
        });
    });

    describe("initialise", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new React();
            uniteConfigurationStub.applicationFramework = "Aurelia";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with application framework matching and javascript", async () => {
            const obj = new React();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.contain("jsx");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });

        it("can be called with application framework matching and typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new React();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.sourceExtensions).to.contain("tsx");
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });
    });

    describe("process", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new React();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);
        });

        it("can be called with application framework matching and javascript", async () => {
            const obj = new React();
            engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.push({ path: "aaa" });
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);

            const packageJsonDependencies: { [id: string]: string } = {};
            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDependencies.react).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["react-dom"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["react-router-dom"]).to.be.equal("1.2.3");

            Chai.expect(packageJsonDevDependencies["@types/react"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/react-dom"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/react-router-dom"]).to.be.equal(undefined);

            Chai.expect(packageJsonDevDependencies["babel-preset-react"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["eslint-plugin-react"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets).contains("react");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaFeatures.jsx).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).contains("plugin:react/recommended");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).contains("react");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript")).to.be.equal(undefined);
        });

        it("can be called with application framework matching and webdriverio", async () => {
            engineVariablesStub.setConfiguration("Protractor", undefined);
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", []);
            const obj = new React();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(1);
        });

        it("can be called with application framework matching and typescript", async () => {
            engineVariablesStub.setConfiguration("ESLint", undefined);
            engineVariablesStub.setConfiguration("Babel", undefined);
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});

            const obj = new React();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.linter = "TSLint";
            uniteConfigurationStub.sourceExtensions = ["ts"];
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);

            const packageJsonDependencies: { [id: string]: string } = {};
            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDependencies.react).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["react-dom"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDependencies["react-router-dom"]).to.be.equal("1.2.3");

            Chai.expect(packageJsonDevDependencies["@types/react"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/react-dom"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/react-router-dom"]).to.be.equal("1.2.3");

            Chai.expect(packageJsonDevDependencies["babel-preset-react"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["eslint-plugin-react"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.jsx).to.be.equal("react");
        });

        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith(".jsx")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new React();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.jsx");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no e2e tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new React();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.jsx");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new React();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
