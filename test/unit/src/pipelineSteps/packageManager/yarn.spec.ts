/**
 * Tests for Yarn.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Yarn } from "../../../../../dist/pipelineSteps/packageManager/yarn";
import { PackageUtils } from "../../../../../dist/pipelineSteps/packageUtils";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Yarn", () => {
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
        uniteConfigurationStub.packageManager = "Yarn";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Yarn();
        Chai.should().exist(obj);
    });

    describe("process", () => {
        it("can succeed if not correct package manager", async () => {
            uniteConfigurationStub.packageManager = undefined;
            const obj = new Yarn();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can succeed if no gitignore", async () => {
            const obj = new Yarn();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can succeed and add to gitignore", async () => {
            engineVariablesStub.setConfiguration("GitIgnore", []);
            const obj = new Yarn();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("GitIgnore")).to.be.deep.equal(["node_modules"]);
        });
    });

    describe("info", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new Yarn();
            try {
                await obj.info(loggerStub, fileSystemMock, "lkjdfglkjdfzsdf", undefined);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can get the info for a package with no version", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves(JSON.stringify({ version: "1.2.3", main: "index.js"}));
            const obj = new Yarn();
            const res = await obj.info(loggerStub, fileSystemMock, "package", undefined);
            Chai.expect(stub.args[0][4]).to.contain("view");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--json");
            Chai.expect(stub.args[0][4]).to.contain("name");
            Chai.expect(stub.args[0][4]).to.contain("version");
            Chai.expect(stub.args[0][4]).to.contain("main");
            Chai.expect(res.version).to.be.equal("1.2.3");
            Chai.expect(res.main).to.be.equal("index.js");
        });

        it("can get the info for a package with version", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves(JSON.stringify({ version: "1.2.3", main: "index.js"}));
            const obj = new Yarn();
            const res = await obj.info(loggerStub, fileSystemMock, "package", "4.5.6");
            Chai.expect(stub.args[0][4]).to.contain("view");
            Chai.expect(stub.args[0][4]).to.contain("package@4.5.6");
            Chai.expect(stub.args[0][4]).to.contain("--json");
            Chai.expect(stub.args[0][4]).to.contain("name");
            Chai.expect(stub.args[0][4]).to.contain("version");
            Chai.expect(stub.args[0][4]).to.contain("main");
            Chai.expect(res.version).to.be.equal("1.2.3");
            Chai.expect(res.main).to.be.equal("index.js");
        });
    });

    describe("add", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new Yarn();
            try {
                await obj.add(loggerStub, fileSystemMock, "/.", "lkjdfglkjdfzsdf", "1.2.3", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can add a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Yarn();
            const res = await obj.add(loggerStub, fileSystemMock, "/.", "package", "1.2.3", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        });

        it("can add a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Yarn();
            const res = await obj.add(loggerStub, fileSystemMock, "/.", "package", "1.2.3", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
        });
    });

    describe("remove", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new Yarn();
            try {
                await obj.remove(loggerStub, fileSystemMock, "/.", "lkjdfglkjdfzsdf", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can remove a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Yarn();
            const res = await obj.remove(loggerStub, fileSystemMock, "/.", "package", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        });

        it("can remove a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Yarn();
            const res = await obj.remove(loggerStub, fileSystemMock, "/.", "package", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
        });
    });
});
