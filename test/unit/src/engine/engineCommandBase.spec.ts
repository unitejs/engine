/**
 * Tests for Engine Command Base.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../../../../src/engine/engineCommandBase";
import { EngineVariables } from "../../../../src/engine/engineVariables";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

class TestCommand extends EngineCommandBase {
    public async testLoadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null> {
        return super.loadConfiguration(outputDirectory, profileSource, profile, force);
    }

    public async testLoadProfile<T>(profileSource: string, profile: string | undefined | null): Promise<T | undefined | null> {
        return super.loadProfile<T>(profileSource, profile);
    }

    public testCreateEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        return super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
    }

    public testMapParser(input: string): { [id: string]: string } {
        return super.mapParser(input);
    }
}

describe("EngineCommandBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new TestCommand();
        Chai.should().exist(obj);
    });

    describe("create", () => {
        it("can be called", async () => {
            const obj = new TestCommand();
            const res = obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        });
    });

    describe("loadConfiguration", () => {
        it("can be called with no existing config", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with exception loading config", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with force", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, true);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with existing config", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred" });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred" });
        });
    });

    describe("loadProfile", () => {
        it("can be called with parameters", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with non existing profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with exception loading profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with no profiles", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({});
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with unknown profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ myProfile: {} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with known profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ testProfile: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        });

        it("can be called with known profile mismatched case", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ TESTPROFILE: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        });
    });

    describe("createEngineVariables", () => {
        it("can be called with parameters", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariables = new EngineVariables();
            const uniteConfiguration = new UniteConfiguration();
            obj.testCreateEngineVariables(undefined, uniteConfiguration, engineVariables);
            Chai.expect(engineVariables.force).to.be.equal(false);
        });
    });

    describe("mapParser", () => {
        it("can be called with no parameters", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with broken input", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapParser("khjlkjlk");
            } catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        });

        it("can be called with broken input", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser("a=1;b=2");
            Chai.expect(res).to.be.deep.equal({ a: "1", b: "2" });
        });
    });
});
