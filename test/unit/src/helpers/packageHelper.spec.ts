/**
 * Tests for Package Helper
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageHelper } from "../../../../src/helpers/packageHelper";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("PackageHelper", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();
    });

    describe("locate", () => {
        it("can be called with child that exists", async () => {
            sandbox.stub(fileSystemStub, "directoryExists").resolves(true);
            const res = await PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.contain("blah");
        });

        it("can be called with parent that does not exist", async () => {
            sandbox.stub(fileSystemStub, "directoryExists").onSecondCall().resolves(true);
            const res = await PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.contain("blah");
        });

        it("can be called when parent or child do not exist", async () => {
            sandbox.stub(fileSystemStub, "directoryExists").resolves(false);
            const res = await PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.be.equal(null);
        });
    });
});
