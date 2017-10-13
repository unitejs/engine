/**
 * Tests for License.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { License } from "../../../../../src/pipelineSteps/content/license";
import { FileSystemMock } from "../../fileSystem.mock";

describe("License", () => {
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
        uniteConfigurationStub.license = "MIT";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new License();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new License();
            uniteConfigurationStub.license = "None";
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new License();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can do nothing if mainCondition not set", async () => {
            const obj = new License();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can fail if spx license file not available", async () => {
            sandbox.stub(fileSystemMock, "fileReadJson").rejects();
            const obj = new License();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("problem reading");
        });

        it("can fail if license not in file", async () => {
            sandbox.stub(fileSystemMock, "fileReadJson").resolves({
                MIT: {
                    name: "MIT License",
                    url: "http://www.opensource.org/licenses/MIT",
                    osiApproved: true,
                    licenseText: "MIT"
                }
            });
            uniteConfigurationStub.license = "Blah";
            const obj = new License();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("license");
        });

        it("can succeed if license in file", async () => {
            sandbox.stub(fileSystemMock, "fileReadJson").resolves({
                MIT: {
                    name: "MIT License",
                    url: "http://www.opensource.org/licenses/MIT",
                    osiApproved: true,
                    licenseText: "MIT"
                }
            });
            uniteConfigurationStub.license = "MIT";
            const obj = new License();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("finalise", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileWriteText").throws("error");
            const obj = new License();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can write file", async () => {
            sandbox.stub(fileSystemMock, "fileReadJson").resolves({
                MIT: {
                    name: "MIT License",
                    url: "http://www.opensource.org/licenses/MIT",
                    osiApproved: true,
                    licenseText: "<year>"
                }
            });
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new License();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const lines = await fileSystemMock.fileReadLines("./test/unit/temp/www/", "LICENSE");
            Chai.expect(lines.length).to.be.equal(1);
            Chai.expect(lines[0]).to.be.equal(new Date().getFullYear().toString());
        });
    });
});
