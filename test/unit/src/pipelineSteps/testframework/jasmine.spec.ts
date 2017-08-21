/**
 * Tests for Jasmine.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../../../../dist/configuration/models/eslint/esLintConfiguration";
import { KarmaConfiguration } from "../../../../../dist/configuration/models/karma/karmaConfiguration";
import { ProtractorConfiguration } from "../../../../../dist/configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../../../../dist/configuration/models/webdriverIo/webdriverIoConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Jasmine } from "../../../../../dist/pipelineSteps/testFramework/jasmine";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Jasmine", () => {
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
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Jasmine();
        Chai.should().exist(obj);
    });

    describe("process", () => {
        it("can be called with undefined test frameworks", async () => {
            uniteConfigurationStub.unitTestFramework = "Mocha-Chai";
            uniteConfigurationStub.e2eTestFramework = "Mocha-Chai";
            const obj = new Jasmine();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["jasmine-core"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["protractor-jasmine2-html-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["jasmine-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-jasmine-framework"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptStart")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptEnd")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO")).to.be.equal(undefined);
        });

        it("can be called with unit framework defined", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.unitTestRunner = "Karma";
            uniteConfigurationStub.e2eTestFramework = "Mocha-Chai";

            engineVariablesStub.setConfiguration("Karma", { frameworks: [] });

            const obj = new Jasmine();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["jasmine-core"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/jasmine"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["karma-jasmine"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["protractor-jasmine2-html-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["jasmine-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-jasmine-framework"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").frameworks).contains("jasmine");
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptStart")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptEnd")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO")).to.be.equal(undefined);
        });

        it("can be called with e2e framework defined as protractor", async () => {
            uniteConfigurationStub.unitTestFramework = "Mocha-Chai";
            uniteConfigurationStub.e2eTestRunner = "Protractor";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("Protractor", { framework: "", jasmineNodeOpts: {} });
            engineVariablesStub.setConfiguration("Protractor.ScriptStart", []);
            engineVariablesStub.setConfiguration("Protractor.ScriptEnd", []);

            const obj = new Jasmine();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["jasmine-core"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["protractor-jasmine2-html-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["jasmine-spec-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-jasmine-framework"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.jasmine).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").framework).to.be.equal("jasmine");
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptStart").length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptEnd").length).to.be.equal(14);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO")).to.be.equal(undefined);
        });

        it("can be called with e2e framework defined as webdriverio", async () => {
            uniteConfigurationStub.unitTestFramework = "Mocha-Chai";
            uniteConfigurationStub.e2eTestRunner = "WebdriverIO";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("WebdriverIO", { framework: "" });

            const obj = new Jasmine();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["jasmine-core"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["protractor-jasmine2-html-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["jasmine-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-jasmine-framework"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.jasmine).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptStart")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("Protractor.ScriptEnd")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO").framework).to.be.equal("jasmine");
        });
    });
});
