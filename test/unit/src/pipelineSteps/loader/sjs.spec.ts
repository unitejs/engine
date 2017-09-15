/**
 * Tests for SJS.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../../../../dist/configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { SJS } from "../../../../../dist/pipelineSteps/loader/sjs";
import { FileSystemMock } from "../../fileSystem.mock";

describe("SJS", () => {
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
        uniteConfigurationStub.moduleType = "SystemJS";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.clientPackages = {};

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new SJS();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new SJS();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(3);
        });
    });

    describe("process", () => {
        it("can be called with mismatched bundled loader and mismatched not bundler loader", async () => {
            uniteConfigurationStub.bundledLoader = "RJS";
            uniteConfigurationStub.notBundledLoader = "RJS";
            const obj = new SJS();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.systemjs).to.be.equal(undefined);
        });

        it("can be called with bundled loader and mismatched not bundler loader", async () => {
            engineVariablesStub.setConfiguration("HTMLNoBundle", { body: []});
            uniteConfigurationStub.bundledLoader = "SJS";
            uniteConfigurationStub.notBundledLoader = "RJS";
            const obj = new SJS();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.systemjs).to.be.equal("1.2.3");
            Chai.expect(uniteConfigurationStub.clientPackages.systemjs.scriptIncludeMode).to.be.equal("bundled");
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(0);
        });

        it("can be called with mismatched bundled loader and not bundler loader", async () => {
            engineVariablesStub.setConfiguration("HTMLNoBundle", { body: []});
            uniteConfigurationStub.bundledLoader = "RJS";
            uniteConfigurationStub.notBundledLoader = "SJS";
            const obj = new SJS();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.systemjs).to.be.equal("1.2.3");
            Chai.expect(uniteConfigurationStub.clientPackages.systemjs.scriptIncludeMode).to.be.equal("notBundled");
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(8);
        });

        it("can be called with bundled loader and not bundler loader", async () => {
            engineVariablesStub.setConfiguration("HTMLNoBundle", { body: []});
            uniteConfigurationStub.bundledLoader = "SJS";
            uniteConfigurationStub.notBundledLoader = "SJS";
            const obj = new SJS();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.systemjs).to.be.equal("1.2.3");
            Chai.expect(uniteConfigurationStub.clientPackages.systemjs.scriptIncludeMode).to.be.equal("both");
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(8);
        });

        it("can be called with bundled loader and not bundler loader, no htmltemplate", async () => {
            uniteConfigurationStub.bundledLoader = "SJS";
            uniteConfigurationStub.notBundledLoader = "SJS";
            const obj = new SJS();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.systemjs).to.be.equal("1.2.3");
            Chai.expect(uniteConfigurationStub.clientPackages.systemjs.scriptIncludeMode).to.be.equal("both");
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle")).to.be.equal(undefined);
        });
    });
});
