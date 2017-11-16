/**
 * Tests for LessHint.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { LessHintConfiguration } from "../../../../../src/configuration/models/lessHint/lessHintConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { LessHint } from "../../../../../src/pipelineSteps/cssLinter/lessHint";
import { FileSystemMock } from "../../fileSystem.mock";

describe("LessHint", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.cssLinter = "LessHint";
        uniteConfigurationStub.cssPre = "Less";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new LessHint();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new LessHint();
            uniteConfigurationStub.cssLinter = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new LessHint();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can be called with false main condition", async () => {
            const obj = new LessHint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("LessHint")).to.be.equal(undefined);
        });

        it("can be called with mismatched cssPre", async () => {
            uniteConfigurationStub.cssPre = "Sass";
            const obj = new LessHint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("LessHint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("Less");
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ fileExtensions: ["txt"] });
            const obj = new LessHint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<LessHintConfiguration>("LessHint").fileExtensions[0]).to.be.equal("txt");
        });

        it("can succeed when file does not exist", async () => {
            const obj = new LessHint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<LessHintConfiguration>("LessHint").fileExtensions).to.be.equal(undefined);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new LessHint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.lesshint).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new LessHint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { lesshint: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.lesshint).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new LessHint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".lesshintrc");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".lesshintrc", {});

            const obj = new LessHint();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".lesshintrc");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
