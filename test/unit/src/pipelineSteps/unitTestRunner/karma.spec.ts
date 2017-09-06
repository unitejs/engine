/**
 * Tests for Karma.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../../../../dist/configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Karma } from "../../../../../dist/pipelineSteps/unitTestRunner/karma";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Karma", () => {
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
        uniteConfigurationStub.unitTestRunner = "Karma";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Karma();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new Karma();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(2);
        });
    });

    describe("intitialise", () => {
        it("can be called with mismatched runner", async () => {
            uniteConfigurationStub.unitTestRunner = undefined;
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Karma")).to.be.equal(undefined);
        });

        it("can fail when exception is thrown on config", async () => {
            fileSystemMock.fileExists = sandbox.stub().throws("error");
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Karma")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when regex does not match", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadText = sandbox.stub().resolves("{ reporters: [\"story2\"] }");
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Karma")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed to parse");
        });

        it("can succeed when file does not exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().resolves(false);
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").reporters).to.contain("story");
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadText = sandbox.stub().resolves("config.set({ reporters: [\"story2\"] });");
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").reporters).to.contain("story2");
        });

        it("can succeed when file does exist and has files", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            const data = [
                { pattern: "blah", includeType: "polyfill" },
                { pattern: "foo", includeType: "clientPackage" },
                { pattern: "bing", includeType: "moduleLoader" },
                { pattern: "doh", includeType: "fixed" }
            ];
            fileSystemMock.fileReadText = sandbox.stub().resolves(`config.set({ files: ${JsonHelper.codify(data)} });`);
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files[0].pattern).to.be.equal("blah");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files[1].pattern).to.be.equal("doh");
        });

        it("can succeed when file does exist but forced", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadText = sandbox.stub().resolves("config.set({ reporters: [\"story2\"] });");
            engineVariablesStub.force = true;
            const obj = new Karma();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").reporters).to.contain("story");
        });

    });

    describe("process", () => {
        it("can be called with mismatched runner", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            const stub = sandbox.stub(fileSystemMock, "fileDelete").resolves(0);
            uniteConfigurationStub.unitTestRunner = undefined;
            const obj = new Karma();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.karma).to.be.equal(undefined);
        });

        it("can succeed writing", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileWriteLines").resolves();
            const obj = new Karma();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(stub.called).to.be.equal(true);
        });
    });
});
