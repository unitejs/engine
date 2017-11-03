/**
 * Tests for Npm.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Npm } from "../../../../../src/pipelineSteps/packageManager/npm";
import { PackageUtils } from "../../../../../src/pipelineSteps/packageUtils";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Npm", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.packageManager = "Npm";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Npm();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Npm();
            uniteConfigurationStub.packageManager = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Npm();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can succeed if not correct package manager", async () => {
            uniteConfigurationStub.packageManager = undefined;
            const obj = new Npm();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can succeed if no gitignore", async () => {
            const obj = new Npm();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can succeed and add to gitignore", async () => {
            engineVariablesStub.setConfiguration("GitIgnore", []);
            const obj = new Npm();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("GitIgnore")).to.be.deep.equal(["node_modules"]);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new Npm();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations with false mainCondition", async () => {
            engineVariablesStub.setConfiguration("GitIgnore", ["node_modules"]);
            const obj = new Npm();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("GitIgnore")).not.contains("node_modules");
        });
    });

    describe("info", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new Npm();
            try {
                await obj.info(loggerStub, fileSystemMock, "lkjdfglkjdfzsdf", undefined);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can get the info for a package with no version", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves(JSON.stringify({ version: "1.2.3", main: "index.js"}));
            const obj = new Npm();
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
            const obj = new Npm();
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
            const obj = new Npm();
            try {
                await obj.add(loggerStub, fileSystemMock, "/.", "lkjdfglkjdfzsdf", "1.2.3", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can add a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Npm();
            const res = await obj.add(loggerStub, fileSystemMock, "/.", "package", "1.2.3", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("install");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
            Chai.expect(stub.args[0][4]).to.contain("--save-dev");
        });

        it("can add a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Npm();
            const res = await obj.add(loggerStub, fileSystemMock, "/.", "package", "1.2.3", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("install");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
            Chai.expect(stub.args[0][4]).to.contain("--save-prod");
        });
    });

    describe("remove", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new Npm();
            try {
                await obj.remove(loggerStub, fileSystemMock, "/.", "lkjdfglkjdfzsdf", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can remove a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Npm();
            const res = await obj.remove(loggerStub, fileSystemMock, "/.", "package", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("uninstall");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--save-dev");
        });

        it("can remove a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new Npm();
            const res = await obj.remove(loggerStub, fileSystemMock, "/.", "package", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("uninstall");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--save");
        });
    });
});
