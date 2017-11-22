/**
 * Tests for Engine.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../src/engine/engineVariables";
import { PipelineStepBase } from "../../../../src/engine/pipelineStepBase";
import { FileSystemMock } from "../fileSystem.mock";

class TestPipelineStep extends PipelineStepBase {
}

describe("PipelineStepBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");

        fileSystemStub = new FileSystemMock();

        uniteConfigurationStub = new UniteConfiguration();
        engineVariablesStub = new EngineVariables();
        await fileSystemStub.directoryCreate("./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemStub.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new TestPipelineStep();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(undefined);
        });
    });

    describe("initialise", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.initialise(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.configure(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("finalise", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.finalise(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("copyFile", () => {
        it("can be called when sourceFile does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("exist");
        });

        it("can be called when destFile does not exist and destFolder does exist", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });

        it("can be called when destFile does not exist and destFolder does not exist", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/sub/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/sub/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });

        it("can be called when destFile does exist with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Skipping");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("bar-foo");
        });

        it("can be called when destFile does exist with marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo\nGenerated by UniteJS");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        });

        it("can be called when destFile does not exist and noCreate is set", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("no create");
            const exists = await fileSystemStub.fileExists("./test/unit/temp/", "destFile.txt");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can throw exception when copying", async () => {
            sandbox.stub(fileSystemStub, "fileReadText").rejects();
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "blah");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/sub/", "destFile.txt", false, false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can copy file with replacements", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "{SUB1}\n{SUB2}");
            const res = await obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/sub/", "destFile.txt", false, false, {
                "{SUB1}": ["foo"],
                "{SUB2}": ["bar"]
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = await fileSystemStub.fileReadLines("./test/unit/temp/sub/", "destFile.txt");
            Chai.expect(newContent[0]).to.be.equal("foo");
            Chai.expect(newContent[1]).to.be.equal("bar");
        });
    });

    describe("fileDeleteText", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.fileDeleteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called when file exists with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = await obj.fileDeleteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("Skipping");
        });

        it("can be called when file exists with a marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = await obj.fileDeleteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Deleting");
        });

        it("can fail when file exists but it throws an error", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            sandbox.stub(fileSystemStub, "fileDelete").rejects("error");
            const res = await obj.fileDeleteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });
    });

    describe("fileDeleteLines", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.fileDeleteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called when file exists with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = await obj.fileDeleteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("Skipping");
        });

        it("can be called when file exists with a marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = await obj.fileDeleteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Deleting");
        });

        it("can fail when file exists but it throws an error", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            sandbox.stub(fileSystemStub, "fileDelete").rejects("error");
            const res = await obj.fileDeleteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });
    });

    describe("fileDeleteJson", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.fileDeleteJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can fail when file exists but it throws an error", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.json", "{}");
            sandbox.stub(fileSystemStub, "fileDelete").rejects("error");
            const res = await obj.fileDeleteJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });
    });

    describe("folderCreate", () => {
        it("can be called", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.folderCreate(loggerStub, fileSystemStub, "./test/unit/temp/blah");
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can fail when file exists but it throws an error", async () => {
            const obj = new TestPipelineStep();
            sandbox.stub(fileSystemStub, "directoryCreate").rejects("error");
            const res = await obj.folderCreate(loggerStub, fileSystemStub, "./test/unit/temp/blah/");
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });
    });

    describe("folderDelete", () => {
        it("can fail when it throws an exception", async () => {
            sandbox.stub(fileSystemStub, "directoryExists").throws();
            const obj = new TestPipelineStep();
            const res = await obj.folderDelete(loggerStub, fileSystemStub, "./test/unit/temp/blah", true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called when folder does not exist", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.folderDelete(loggerStub, fileSystemStub, "./test/unit/temp/blah", true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can be called when folder exists and forced", async () => {
            await fileSystemStub.directoryCreate("./test/unit/temp/blah");
            const obj = new TestPipelineStep();
            const res = await obj.folderDelete(loggerStub, fileSystemStub, "./test/unit/temp/blah", true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can be called when folder exists and not forced", async () => {
            await fileSystemStub.directoryCreate("./test/unit/temp/blah");
            const obj = new TestPipelineStep();
            const res = await obj.folderDelete(loggerStub, fileSystemStub, "./test/unit/temp/blah", false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can be called when folder exists and not forced with marker files", async () => {
            await fileSystemStub.directoryCreate("./test/unit/temp/blah");
            await fileSystemStub.directoryCreate("./test/unit/temp/blah/blah1");
            await fileSystemStub.directoryCreate("./test/unit/temp/blah/blah2");
            await fileSystemStub.fileWriteText("./test/unit/temp/blah/blah2", "a.txt", "Generated by UniteJS");
            await fileSystemStub.fileWriteText("./test/unit/temp/blah/blah2", "b.txt", "");
            const obj = new TestPipelineStep();
            const res = await obj.folderDelete(loggerStub, fileSystemStub, "./test/unit/temp/blah", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("Partial");

            let exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemStub.directoryExists("./test/unit/temp/blah1");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemStub.fileExists("./test/unit/temp/blah/blah2/", "a.txt");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemStub.fileExists("./test/unit/temp/blah/blah2/", "b.txt");
            Chai.expect(exists).to.be.equal(true);
        });
    });

    describe("folderToggle", () => {
        it("can be called to create folder", async () => {
            const obj = new TestPipelineStep();
            const res = await obj.folderToggle(loggerStub, fileSystemStub, "./test/unit/temp/blah", false, true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called to delete folder", async () => {
            await fileSystemStub.directoryCreate("./test/unit/temp/blah");
            const obj = new TestPipelineStep();
            const res = await obj.folderToggle(loggerStub, fileSystemStub, "./test/unit/temp/blah", false, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemStub.directoryExists("./test/unit/temp/blah");
            Chai.expect(exists).to.be.equal(false);
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
            Chai.expect(res).to.be.equal("FileNotExist");
        });

        it("can be called when file does exist with no marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("NoMarker");
        });

        it("can be called when file does exist with a marker", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("HasMarker");
        });

        it("can be called when file does exist with a marker not on the last line", async () => {
            const obj = new TestPipelineStep();
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("HasMarker");
        });

        it("can be called when file throws an error", async () => {
            const obj = new TestPipelineStep();
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = await obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("FileNotExist");
        });
    });

    describe("fileReadJson", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.equal(undefined);
        });

        it("can be called when file does exist", async () => {
            await fileSystemStub.fileWriteJson("./test/unit/temp/", "file.json", { a: 1});
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.deep.equal({ a: 1});
        });

        it("can be called when file does exist but force is set", async () => {
            await fileSystemStub.fileWriteJson("./test/unit/temp/", "file.json", { a: 1});
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", true, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.equal(undefined);
        });

        it("can fail when an exception is thrown", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error!");
            await fileSystemStub.fileWriteJson("./test/unit/temp/", "file.json", { a: 1});
            const obj = new TestPipelineStep();
            let retObj: { a: number } = { a: 2 };
            const res = await obj.fileReadJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.json", false, async (cbObj: { a: number}) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(retObj).to.be.deep.equal({ a: 2 });
        });
    });

    describe("fileReadText", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.equal(undefined);
        });

        it("can be called when file does exist", async () => {
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "blah");
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.equal("blah");
        });

        it("can be called when file does exist but force is set", async () => {
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "blah");
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", true, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.equal(undefined);
        });

        it("can fail when an exception is thrown", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error!");
            await fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "bar");
            const obj = new TestPipelineStep();
            let retObj = "foo";
            const res = await obj.fileReadText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(retObj).to.be.equal("foo");
        });
    });

    describe("fileReadLines", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.deep.equal([]);
        });

        it("can be called when file does exist", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["blah"]);
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.deep.equal(["blah", ""]);
        });

        it("can be called when file does exist but force is set", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["blah"]);
            const obj = new TestPipelineStep();
            let retObj;
            const res = await obj.fileReadLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", true, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(retObj).to.be.deep.equal([]);
        });

        it("can fail when an exception is thrown", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error!");
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["bar"]);
            const obj = new TestPipelineStep();
            let retObj = ["foo"];
            const res = await obj.fileReadLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async (cbObj) => {
                retObj = cbObj;
                return 0;
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(retObj).to.be.deep.equal(["foo"]);
        });
    });

    describe("fileWriteLines", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return [];
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called when file does exist with marker", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return [];
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called when file does exist with no marker", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["blah"]);
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileWriteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return [];
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(false);
        });

        it("can be called and throw an exception", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            sandbox.stub(fileSystemStub, "fileWriteLines").rejects();
            const obj = new TestPipelineStep();
            const res = await obj.fileWriteLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => []);
            Chai.expect(res).to.be.equal(1);
        });
    });

    describe("fileWriteText", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return "";
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called when file does exist with marker", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return "";
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called and throw an exception", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            sandbox.stub(fileSystemStub, "fileWriteText").rejects();
            const obj = new TestPipelineStep();
            const res = await obj.fileWriteText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => "");
            Chai.expect(res).to.be.equal(1);
        });
    });

    describe("fileWriteJson", () => {
        it("can be called when file does not exist", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return {};
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called when file does exist with marker", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            const obj = new TestPipelineStep();
            let callbackCalled;
            const res = await obj.fileWriteJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {
                callbackCalled = true;
                return {};
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called and throw an exception", async () => {
            await fileSystemStub.fileWriteLines("./test/unit/temp/", "file.txt", ["Generated by UniteJS"]);
            sandbox.stub(fileSystemStub, "fileWriteJson").rejects();
            const obj = new TestPipelineStep();
            const res = await obj.fileWriteJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, async () => {});
            Chai.expect(res).to.be.equal(1);
        });
    });

    describe("fileToggleText", () => {
        it("can be called to write file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, true, async () => {
                callbackCalled = true;
                return "";
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called to delete file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleText(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, false, async () => {
                callbackCalled = true;
                return "";
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(false);
        });
    });

    describe("fileToggleJson", () => {
        it("can be called to write file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, true, async () => {
                callbackCalled = true;
                return {};
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called to delete file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleJson(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, false, async () => {
                callbackCalled = true;
                return {};
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(false);
        });
    });

    describe("fileToggleLines", () => {
        it("can be called to write file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, true, async () => {
                callbackCalled = true;
                return [];
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(true);
        });

        it("can be called to delete file", async () => {
            const obj = new TestPipelineStep();
            let callbackCalled = false;
            const res = await obj.fileToggleLines(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false, false, async () => {
                callbackCalled = true;
                return [];
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(callbackCalled).to.be.equal(false);
        });
    });

    describe("condition", () => {
        it("can be called when condition is true", async () => {
            const obj = new TestPipelineStep();
            const res = obj.condition("blah", "BLAH");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when condition is false", async () => {
            const obj = new TestPipelineStep();
            const res = obj.condition("blah", "blah2");
            Chai.expect(res).to.be.equal(false);
        });
    });

    describe("objectCondition", () => {
        it("can be called when condition is true", async () => {
            const obj = new TestPipelineStep();
            const res = obj.objectCondition({ blah: 1 }, "BLAH");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when condition is false", async () => {
            const obj = new TestPipelineStep();
            const res = obj.objectCondition({ blah: 1 }, "blah2");
            Chai.expect(res).to.be.equal(false);
        });
    });

    describe("arrayCondition", () => {
        it("can be called when condition is true", async () => {
            const obj = new TestPipelineStep();
            const res = obj.arrayCondition([ "blah" ], "BLAH");
            Chai.expect(res).to.be.equal(true);
        });

        it("can be called when condition is false", async () => {
            const obj = new TestPipelineStep();
            const res = obj.arrayCondition([ "blah" ], "BLAH2");
            Chai.expect(res).to.be.equal(false);
        });
    });
});
