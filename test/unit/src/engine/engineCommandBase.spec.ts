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
import { IPackageManager } from "../../../../src/interfaces/IPackageManager";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

class TestCommand extends EngineCommandBase {
    public async testLoadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null> {
        return super.loadConfiguration(outputDirectory, profileSource, profile, force);
    }

    public async testLoadProfile<T>(module: string, location: string, profileSource: string, profile: string | undefined | null): Promise<T | undefined | null> {
        return super.loadProfile<T>(module, location, profileSource, profile);
    }

    public testCreateEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        return super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
    }

    public testMapParser(input: string[]): { [id: string]: string } {
        return super.mapParser(input);
    }

    public testMapFromArrayParser(input: string[]): { [id: string]: string } {
        return super.mapFromArrayParser(input);
    }

    public testDisplayCompletionMessage(engineVariables: EngineVariables, showPackageUpdate: boolean): void {
        return super.displayCompletionMessage(engineVariables, showPackageUpdate);
    }
}

describe("EngineCommandBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

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

        it("can be called with existing config and no packages", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred" });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred" });
        });

        it("can be called with existing config and packages with no assets", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: {}} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: {}} });
        });

        it("can be called with existing config with new assets format", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: {assets: ["a", "b", "c"]}} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: {assets: ["a", "b", "c"]}} });
        });

        it("can be called with existing config with old assets format", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: {assets: "a,b,c"}} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: { assets: ["a", "b", "c"]}} });
        });
    });

    describe("loadProfile", () => {
        it("can be called with parameters", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with non existing profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with exception loading profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with no profiles", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({});
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with unknown profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ myProfile: {} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with known profile", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ testProfile: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        });

        it("can be called with known profile mismatched case", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ TESTPROFILE: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile(undefined, "/assets/profiles/", "configure.json", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        });

        it("can be called with module that does not exist", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("blah", "/assets/", "clientPackage.json", "testProfile");
            Chai.expect(res).to.be.equal(null);
        });

        it("can be called with module", async () => {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ TESTPROFILE: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = await obj.testLoadProfile("unitejs-packages", "/assets/", "clientPackage.json", "testProfile");
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
                obj.testMapParser(["khjlkjlk"]);
            } catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        });

        it("can be called with broken input", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(["a=1", "b=2"]);
            Chai.expect(res).to.be.deep.equal({ a: "1", b: "2" });
        });
    });

    describe("mapFromArrayParser", () => {
        it("can be called with no parameters", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with broken input", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapFromArrayParser(["khjlkjlk"]);
            } catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        });

        it("can be called with broken input", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(["a", "b"]);
            Chai.expect(res).to.be.deep.equal({ a: "b" });
        });
    });

    describe("displayCompletionMessage", () => {
        it("can be called with no additional messages and no package update", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariablesStub = new EngineVariables();
            obj.testDisplayCompletionMessage(engineVariablesStub, false);
            Chai.expect(loggerWarningSpy.args.length).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(1);
        });

        it("can be called with no additional messages and package update", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariablesStub = new EngineVariables();
            const packageManagerStub: IPackageManager = <IPackageManager>{};
            packageManagerStub.getInstallCommand = sandbox.stub();
            engineVariablesStub.packageManager = packageManagerStub;

            obj.testDisplayCompletionMessage(engineVariablesStub, true);
            Chai.expect(loggerWarningSpy.args.length).to.be.equal(2);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(1);
        });

        it("can be called with additional messages and package update", async () => {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariablesStub = new EngineVariables();
            engineVariablesStub.additionalCompletionMessages.push("a");
            engineVariablesStub.additionalCompletionMessages.push("b");
            engineVariablesStub.additionalCompletionMessages.push("c");
            const packageManagerStub: IPackageManager = <IPackageManager>{};
            packageManagerStub.getInstallCommand = sandbox.stub();
            engineVariablesStub.packageManager = packageManagerStub;

            obj.testDisplayCompletionMessage(engineVariablesStub, true);
            Chai.expect(loggerWarningSpy.args.length).to.be.equal(5);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(1);
        });
    });
});
