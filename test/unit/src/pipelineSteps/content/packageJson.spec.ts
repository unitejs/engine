/**
 * Tests for PackageJson.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../../../../dist/configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { PackageJson } from "../../../../../dist/pipelineSteps/content/packageJson";
import { FileSystemMock } from "../../fileSystem.mock";

describe("PackageJson", () => {
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
        uniteConfigurationStub.packageName = "test";
        uniteConfigurationStub.license = "MIT";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new PackageJson();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can fail when exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileExists").throws("error");

            const obj = new PackageJson();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can setup the engine configuration", async () => {
            const obj = new PackageJson();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PackageJson")).to.be.deep.equal({
                name: "test",
                version: "0.0.1",
                license: "MIT",
                devDependencies: {},
                dependencies: {},
                engines: { node: ">=8.0.0" }
            });
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            const obj = new PackageJson();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can write file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new PackageJson();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<PackageConfiguration>("./test/unit/temp/www/", "package.json");
            Chai.expect(json.name).to.be.equal("test");
            Chai.expect(json.version).to.be.equal("0.0.1");
            Chai.expect(json.dependencies).to.be.deep.equal({});
            Chai.expect(json.devDependencies).to.be.deep.equal({});
            Chai.expect(json.engines).to.be.deep.equal({ node: ">=8.0.0" });
        });

        it("can combine with existing file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const initjson = new PackageConfiguration();
            initjson.name = "fred";
            initjson.version = "1.0.0";
            initjson.dependencies = { "my-package": "1.0.1", "a-package": "1.0.1" };
            initjson.devDependencies = { "dev-package": "2.0.2", "a-dev-package": "2.0.2" };
            initjson.engines = { "my-engine": "3.0.0" };
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", "package.json", initjson);

            const obj = new PackageJson();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<PackageConfiguration>("./test/unit/temp/www/", "package.json");
            Chai.expect(json.name).to.be.equal("fred");
            Chai.expect(json.version).to.be.equal("1.0.0");
            Chai.expect(json.dependencies).to.be.deep.equal({ "my-package": "1.0.1", "a-package": "1.0.1" });
            Chai.expect(json.devDependencies).to.be.deep.equal({ "a-dev-package": "2.0.2", "dev-package": "2.0.2" });
            Chai.expect(json.engines).to.be.deep.equal({ "my-engine": "3.0.0", node: ">=8.0.0" });
        });
    });
});
