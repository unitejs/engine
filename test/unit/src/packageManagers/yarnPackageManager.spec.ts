/**
 * Tests for YarnPackageManager.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageUtils } from "../../../../dist/packageManagers/packageUtils";
import { YarnPackageManager } from "../../../../dist/packageManagers/yarnPackageManager";

describe("NpmPackageManager", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        fileSystemStub = <IFileSystem>{};
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", async () => {
        const obj = new YarnPackageManager(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });

    describe("info", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            try {
                await obj.info("lkjdfglkjdfzsdf");
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can get the info for a package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves(JSON.stringify({ version: "1.2.3", main: "index.js"}));
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            const res = await obj.info("package");
            Chai.expect(stub.args[0][4]).to.contain("view");
            Chai.expect(stub.args[0][4]).to.contain("package");
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
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            try {
                await obj.add("/.", "lkjdfglkjdfzsdf", "1.2.3", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can add a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            const res = await obj.add("/.", "package", "1.2.3", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        });

        it("can add a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            const res = await obj.add("/.", "package", "1.2.3", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
        });
    });

    describe("remove", () => {
        it("can throw an error for an unknown package", async () => {
            sandbox.stub(PackageUtils, "exec").rejects("error");
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            try {
                await obj.remove("/.", "lkjdfglkjdfzsdf", true);
            } catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        });

        it("can remove a dev package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            const res = await obj.remove("/.", "package", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        });

        it("can remove a prod package", async () => {
            const stub = sandbox.stub(PackageUtils, "exec").resolves();
            const obj = new YarnPackageManager(loggerStub, fileSystemStub);
            const res = await obj.remove("/.", "package", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
        });
    });
});
