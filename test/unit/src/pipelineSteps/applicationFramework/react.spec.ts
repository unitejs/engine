/**
 * Tests for React.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
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

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.sourceLanguageExt = "js";
        engineVariablesStub.styleLanguageExt = "css";
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.createDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new React();
        Chai.should().exist(obj);
    });

    describe("process", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new React();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-protractor-plugin"]).to.be.equal(false);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-webdriver-plugin"]).to.be.equal(false);
        });

        it("can be called with application framework matching and javascript", async () => {
            const obj = new React();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-protractor-plugin"]).to.be.equal(true);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-webdriver-plugin"]).to.be.equal(false);

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

            Chai.expect(engineVariablesStub.transpilePresets.react).to.be.equal(true);
            Chai.expect(engineVariablesStub.lintFeatures.jsx.required).to.be.equal(true);
            Chai.expect(engineVariablesStub.lintExtends["plugin:react/recommended"]).to.be.equal(true);
            Chai.expect(engineVariablesStub.lintPlugins.react).to.be.equal(true);
            Chai.expect(engineVariablesStub.transpileProperties.jsx.required).to.be.equal(false);
        });

        it("can be called with application framework matching and typescript", async () => {
            const obj = new React();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.linter = "TSLint";
            engineVariablesStub.sourceLanguageExt = "ts";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-protractor-plugin"]).to.be.equal(true);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-react-webdriver-plugin"]).to.be.equal(false);

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

            Chai.expect(engineVariablesStub.transpilePresets.react).to.be.equal(false);
            Chai.expect(engineVariablesStub.lintFeatures.jsx.required).to.be.equal(false);
            Chai.expect(engineVariablesStub.lintExtends["plugin:react/recommended"]).to.be.equal(false);
            Chai.expect(engineVariablesStub.lintPlugins.react).to.be.equal(false);
            Chai.expect(engineVariablesStub.transpileProperties.jsx.required).to.be.equal(true);
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
