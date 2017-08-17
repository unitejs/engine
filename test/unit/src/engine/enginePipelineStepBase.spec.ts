/**
 * Tests for Engine.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../../../dist/engine/enginePipelineStepBase";
import { EngineVariables } from "../../../../dist/engine/engineVariables";
import { FileSystemMock } from "../fileSystem.mock";

class TestPipelineStep extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return Promise.resolve(0);
    }
}

describe("EnginePipelineStepBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemStub = new FileSystemMock();

        uniteConfigurationStub = new UniteConfiguration();
        engineVariablesStub = new EngineVariables();
        await fileSystemStub.directoryCreate("./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemStub.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new TestPipelineStep();
        Chai.should().exist(obj);
    });

    describe("prerequisites", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.prerequisites(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("process", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.process(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("copyFile", () => {
        it("can be called when sourceFile does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt");
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("exist");
        });

        it("can be called when destFile does not exist and destFolder does exist", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });

        it("can be called when destFile does not exist and destFolder does not exist", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/sub/", "destFile.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/sub/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });

        it("can be called when destFile does exist with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Skipping");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("bar-foo");
        });

        it("can be called when destFile does exist with marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo\nGenerated by UniteJS");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });
    });

    describe("deleteFile", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called when file exists with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = await obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Skipping");
        });

        it("can be called when file exists with a marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = await obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Deleting");
        });

        it("can fail when file exists but it throws an error", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            sandbox.stub(fileSystemStub, "fileDelete").rejects("error");
            const res = await obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });
    });

    describe("wrapGeneratedMarker", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = obj.wrapGeneratedMarker("before", "after");
            Chai.expect(res).to.be.equal("beforeGenerated by UniteJSafter");
        });
    });

    describe("fileHasGeneratedMarker", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when file does exist with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called when file does exist with a marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when file does exist with a marker not on the last line", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when file throws an error", async () => {
            const obj = new TestPipelineStep();
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal(true);
        });
    });
});
