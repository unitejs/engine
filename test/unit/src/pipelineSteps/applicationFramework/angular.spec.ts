/**
 * Tests for Angular.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../dist/configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../../../../dist/configuration/models/eslint/esLintConfiguration";
import { TypeScriptConfiguration } from "../../../../../dist/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Angular } from "../../../../../dist/pipelineSteps/applicationFramework/angular";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Angular", () => {
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
        uniteConfigurationStub.clientPackages = {};

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.sourceLanguageExt = "js";
        engineVariablesStub.styleLanguageExt = "css";
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
        engineVariablesStub.setConfiguration("Protractor", { plugins: []});
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Angular();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new Angular();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with application framework matching but failing bundler", async () => {
            const obj = new Angular();
            uniteConfigurationStub.bundler = "RequireJS";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not currently support");
        });

        it("can be called with application framework matching and working bundler", async () => {
            const obj = new Angular();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("process", () => {
        it("can be called with application framework not matching", async () => {
            engineVariablesStub.setConfiguration("Babel", { plugins: []});
            engineVariablesStub.setConfiguration("ESLint", { parser: "espree"});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            const obj = new Angular();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parser).to.be.equal("espree");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.experimentalDecorators).to.be.equal(undefined);
        });

        it("can be called with application framework matching", async () => {
            engineVariablesStub.setConfiguration("Babel", { plugins: []});
            engineVariablesStub.setConfiguration("ESLint", { parser: "espree"});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parser).to.be.equal("babel-eslint");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.experimentalDecorators).to.be.equal(true);
        });

        it("can be called with application framework matching and mocha framework", async () => {
            engineVariablesStub.setConfiguration("Babel", { plugins: []});
            engineVariablesStub.setConfiguration("ESLint", { parser: "espree"});
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").plugins.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parser).to.be.equal("babel-eslint");
            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.experimentalDecorators).to.be.equal(true);
        });

        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
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

            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no shared unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no custom unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("app.module.spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new Angular();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "bootstrapper.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.module.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
