/**
 * Tests for MochaChai.
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
import { MochaChai } from "../../../../../dist/pipelineSteps/testFramework/mochaChai";
import { FileSystemMock } from "../../fileSystem.mock";

describe("MochaChai", () => {
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
        uniteConfigurationStub.unitTestFramework = "MochaChai";
        uniteConfigurationStub.e2eTestFramework = "MochaChai";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new MochaChai();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new MochaChai();
            uniteConfigurationStub.unitTestFramework = undefined;
            uniteConfigurationStub.e2eTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition unit", async () => {
            const obj = new MochaChai();
            uniteConfigurationStub.unitTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called with matching condition e2e", async () => {
            const obj = new MochaChai();
            uniteConfigurationStub.unitTestFramework = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("install", () => {
        it("can be called with unit framework defined", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.unitTestRunner = "Karma";
            uniteConfigurationStub.e2eTestFramework = "Jasmine";

            engineVariablesStub.setConfiguration("Karma", { frameworks: [] });

            const obj = new MochaChai();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.mocha).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/mocha"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/chai"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["karma-mocha"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["karma-chai"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["mochawesome-screenshots"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-mocha-framework"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").frameworks).contains("mocha");
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO")).to.be.equal(undefined);
        });

        it("can be called with e2e framework defined as protractor", async () => {
            uniteConfigurationStub.unitTestFramework = "Jasmine";
            uniteConfigurationStub.e2eTestRunner = "Protractor";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("Protractor", { framework: "", mochaOpts: {} });

            const obj = new MochaChai();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.mocha).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["mochawesome-screenshots"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-mocha-framework"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.mocha).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").framework).to.be.equal("mocha");
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO")).to.be.equal(undefined);
        });

        it("can be called with e2e framework defined as webdriverio", async () => {
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            uniteConfigurationStub.e2eTestRunner = "WebdriverIO";

            engineVariablesStub.setConfiguration("ESLint", { env: {} });
            engineVariablesStub.setConfiguration("WebdriverIO", { framework: "" });

            const obj = new MochaChai();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.mocha).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["mochawesome-screenshots"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-mocha-framework"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.mocha).to.be.equal(true);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO").framework).to.be.equal("mocha");
        });
    });

    describe("uninstall", () => {
        it("can be called with no configurations", async () => {
            const obj = new MochaChai();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                mocha: "1.2.3",
                "@types/mocha": "1.2.3",
                "@types/chai": "1.2.3",
                "karma-mocha": "1.2.3",
                "karma-chai": "1.2.3",
                "mochawesome-screenshots": "1.2.3",
                "wdio-mocha-framework": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.mocha).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-mocha"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["karma-chai"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["mochawesome-screenshots"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-mocha-framework"]).to.be.equal(undefined);
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("ESLint", { env: { mocha: true } });
            engineVariablesStub.setConfiguration("Karma", { frameworks: [ "mocha" ] });
            engineVariablesStub.setConfiguration("Protractor", { framework: "mocha", mochaOpts: {} });
            engineVariablesStub.setConfiguration("WebdriverIO", { framework: "mocha"});

            const obj = new MochaChai();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env.mocha).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").frameworks).not.contains("mocha");
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").framework).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").mochaOpts).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<WebdriverIoConfiguration>("WebdriverIO").framework).to.be.equal(undefined);
        });
    });
});
