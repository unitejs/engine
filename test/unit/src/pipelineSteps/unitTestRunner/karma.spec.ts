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

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Karma();
            uniteConfigurationStub.unitTestRunner = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Karma();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
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
    });

    describe("install", () => {
        it("can be called", async () => {
            const obj = new Karma();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.karma).to.be.equal("1.2.3");
        });
    });

    describe("finalise", () => {
        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new Karma();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "karma.conf.js");
            Chai.expect(exists).to.be.equal(true);
        });
    });

    describe("uninstall", () => {
        it("can complete", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/", "karma.conf.js", "Generated by UniteJS");

            const obj = new Karma();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { karma: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.karma).to.be.equal(undefined);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "karma.conf.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
