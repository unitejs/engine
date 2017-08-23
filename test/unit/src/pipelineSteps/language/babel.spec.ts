/**
 * Tests for Babel.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../dist/configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Babel } from "../../../../../dist/pipelineSteps/language/babel";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Babel", () => {
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
        uniteConfigurationStub.sourceLanguage = "JavaScript";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Babel();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can fail when exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileExists").throws("error");

            const obj = new Babel();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can not setup the engine configuration if not Babel", async () => {
            const obj = new Babel();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new Babel();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.deep.equal({
                presets: [],
                plugins: [],
                env: {}
            });
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").throws("error");
            const obj = new Babel();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can delete file if not JavaScript", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileExists").returns(false);
            const obj = new Babel();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["babel-core"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["babel-preset-es2015"]).to.be.equal(undefined);
        });

        it("can write file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new Babel();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<BabelConfiguration>("./test/unit/temp/www/", ".babelrc");
            Chai.expect(json.presets).to.be.deep.equal([]);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["babel-core"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["babel-preset-es2015"]).to.be.equal("1.2.3");
        });

        it("can combine with existing file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const initjson = new BabelConfiguration();
            initjson.presets = [ "preset1", "preset2" ];
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".babelrc", initjson);

            const obj = new Babel();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<BabelConfiguration>("./test/unit/temp/www/", ".babelrc");
            Chai.expect(json.presets).to.be.deep.equal(["preset1", "preset2"]);
        });
    });
});