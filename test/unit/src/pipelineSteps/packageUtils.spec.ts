/**
 * Tests for PackageUtils.
 */
import * as Chai from "chai";
import * as child from "child_process";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageUtils } from "../../../../src/pipelineSteps/packageUtils";

describe("PackageUtils", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerInfoSpy: Sinon.SinonSpy;
    let childSpawnStub: Sinon.SinonStub;
    let childSpawnProcess: any;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemStub = <IFileSystem>{};

        childSpawnStub = sandbox.stub(child, "spawn");

        childSpawnProcess = {
            stdout: {},
            stderr: {}
        };
        childSpawnProcess.on = () => { };
        childSpawnProcess.stdout.on = () => { };
        childSpawnProcess.stderr.on = () => { };

        childSpawnStub.returns(childSpawnProcess);

        loggerInfoSpy = sandbox.spy(loggerStub, "info");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new PackageUtils();
        Chai.should().exist(obj);
    });

    describe("exec", () => {
        it("can be called with no working directory", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(data).to.be.equal("");
        });

        it("can be called with a working directory", async () => {
            fileSystemStub.pathAbsolute = () => "/someplace/foo";
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", "foo", undefined);
            Chai.expect(data).to.be.equal("");
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(childSpawnStub.args[0][2].cwd).to.be.equal("/someplace/foo");
        });

        it("can be called with a working directory and args", async () => {
            fileSystemStub.pathAbsolute = () => "/someplace/foo";
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", "foo", ["arg1", "arg2"]);
            Chai.expect(data).to.be.equal("");
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(childSpawnStub.args[0][1]).to.contain("arg1");
            Chai.expect(childSpawnStub.args[0][1]).to.contain("arg2");
            Chai.expect(childSpawnStub.args[0][2].cwd).to.be.equal("/someplace/foo");
        });

        it("can be called on non windows platform", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };

            PackageUtils.isWindows = false;

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal("package");
            Chai.expect(data).to.be.equal("");
        });

        it("can be called on windows platform", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };

            PackageUtils.isWindows = true;

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal("package.cmd");
            Chai.expect(data).to.be.equal("");
        });

        it("can be called and exit with code 1", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(1);
                }
            };

            try {
                await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            } catch (err) {
                Chai.expect(err).to.be.equal(1);
            }
        });

        it("can be called and return data", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stdout.on = (name: string, cb: any) => {
                cb("this");
                cb("is");
                cb("data");
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
        });

        it("can be called with undefined data", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stdout.on = (name: string, cb: any) => {
                cb(undefined);
                cb("is");
                cb("data");
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("isdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
        });

        it("can be called and had error and other data", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stderr.on = (name: string, cb: any) => {
                cb("this");
                cb("is");
                cb("error");
            };
            childSpawnProcess.stdout.on = (name: string, cb: any) => {
                cb("this");
                cb("is");
                cb("data");
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
            Chai.expect(loggerInfoSpy.args[3][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[4][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[5][0]).to.be.equal("error");
        });

        it("can be called and had undefined error and other data", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stderr.on = (name: string, cb: any) => {
                cb(undefined);
                cb("is");
                cb("error");
            };
            childSpawnProcess.stdout.on = (name: string, cb: any) => {
                cb("this");
                cb("is");
                cb("data");
            };

            const data = await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
            Chai.expect(loggerInfoSpy.args[3][0]).to.be.equal("");
            Chai.expect(loggerInfoSpy.args[4][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[5][0]).to.be.equal("error");
        });

        it("can fail with spawn error", async () => {
            childSpawnProcess.on = (name: string, cb: any) => {
                if (name === "error") {
                    cb("error");
                }
            };

            try {
                await PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            } catch (err) {
                Chai.expect(err).to.contain("error");
            }
        });
    });
});
