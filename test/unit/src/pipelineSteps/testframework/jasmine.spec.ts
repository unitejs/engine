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

    it("can be created", () => {
        const obj = new Jasmine();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Jasmine();
            uniteConfigurationStub.unitTestFramework = undefined;
            uniteConfigurationStub.e2eTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition unit", async () => {
            const obj = new Jasmine();
            uniteConfigurationStub.unitTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called with matching condition e2e", async () => {
            const obj = new Jasmine();
            uniteConfigurationStub.unitTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("install", () => {
        it("can be called with unit framework defined", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.unitTestRunner = "Karma";
            uniteConfigurationStub.e2eTestFramework = "MochaChai";

            engineVariablesStub.setConfiguration("Karma", { frameworks: [] });

            const obj = new Jasmine();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
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
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            uniteConfigurationStub.e2eTestRunner = "Protractor";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("Protractor", { framework: "", jasmineNodeOpts: {} });
            engineVariablesStub.setConfiguration("Protractor.ScriptStart", []);
            engineVariablesStub.setConfiguration("Protractor.ScriptEnd", []);

            const obj = new Jasmine();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
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
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            uniteConfigurationStub.e2eTestRunner = "WebdriverIO";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("WebdriverIO", { framework: "" });

            const obj = new Jasmine();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
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

    describe("uninstall", () => {
        it("can be called with no configurations", async () => {
            const obj = new Jasmine();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                "jasmine-core": "1.2.3",
                "@types/jasmine": "1.2.3",
                "karma-jasmine": "1.2.3",
                "protractor-jasmine2-html-reporter": "1.2.3",
                "jasmine-spec-reporter": "1.2.3",
                "wdio-jasmine-framework": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["jasmine-core"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-jasmine"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["protractor-jasmine2-html-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["jasmine-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-jasmine-framework"]).to.be.equal(undefined);
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("ESLint", { env: { jasmine: true } });
            engineVariablesStub.setConfiguration("Karma", { frameworks: [ "jasmine" ] });
            engineVariablesStub.setConfiguration("Protractor", { framework: "jasmine", jasmineNodeOpts: {} });
            engineVariablesStub.setConfiguration("WebdriverIO", { framework: "jasmine"});

            const obj = new Jasmine();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.mocha).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").frameworks).not.contains("jasmine");
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").framework).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").jasmineNodeOpts).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO").framework).to.be.equal(undefined);
        });
    });
});
