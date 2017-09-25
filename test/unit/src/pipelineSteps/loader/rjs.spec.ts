/**
 * Tests for RJS.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../../../../dist/configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { RJS } from "../../../../../dist/pipelineSteps/loader/rjs";
import { FileSystemMock } from "../../fileSystem.mock";

describe("RJS", () => {
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
        uniteConfigurationStub.bundler = "RequireJS";
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
        const obj = new RJS();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new RJS();
            uniteConfigurationStub.bundler = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new RJS();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called with matching bundled loader", async () => {
            uniteConfigurationStub.bundler = "RequireJS";
            const obj = new RJS();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(uniteConfigurationStub.clientPackages.requirejs.scriptIncludeMode).to.be.equal("both");
            Chai.expect(packageJsonDependencies.requirejs).to.be.equal("1.2.3");
        });

        it("can be called with configuration", async () => {
            uniteConfigurationStub.bundler = "RequireJS";
            engineVariablesStub.setConfiguration("HTMLNoBundle", { body: [] });
            const obj = new RJS();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(7);
        });

        it("can be called with false mainCondition", async () => {
            uniteConfigurationStub.bundler = "RequireJS";
            const obj = new RJS();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDependencies: { [id: string]: string } = {
                requirejs: "1.2.3"
            };
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);

            Chai.expect(packageJsonDependencies.requirejs).to.be.equal(undefined);
        });
    });
});
