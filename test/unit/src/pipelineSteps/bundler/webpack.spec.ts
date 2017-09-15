/**
 * Tests for Webpack.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Webpack } from "../../../../../dist/pipelineSteps/bundler/webpack";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Webpack", () => {
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
        uniteConfigurationStub.bundler = "Webpack";
        uniteConfigurationStub.moduleType = "CommonJS";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new Webpack();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new Webpack();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(2);
        });
    });

    describe("initialise", () => {
        it("can be called with bundler not matching", async () => {
            const obj = new Webpack();
            uniteConfigurationStub.bundler = "Browserify";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.notBundledLoader).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.bundledLoader).to.be.equal(undefined);
        });

        it("can be called with bundler matching but failing moduleType", async () => {
            const obj = new Webpack();
            uniteConfigurationStub.moduleType = "AMD";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("can only use");
            Chai.expect(uniteConfigurationStub.notBundledLoader).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.bundledLoader).to.be.equal(undefined);
        });

        it("can be called with bundler matching and working moduleType", async () => {
            const obj = new Webpack();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.notBundledLoader).to.be.equal("SJS");
            Chai.expect(uniteConfigurationStub.bundledLoader).to.be.equal("WPK");
        });
    });

    describe("process", () => {
        it("can be called with non matching bundler", async () => {
            const obj = new Webpack();
            uniteConfigurationStub.bundler = "Browserify";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.webpack).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["source-map-loader"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["uglifyjs-webpack-plugin"]).to.be.equal(undefined);
        });

        it("can be called with matching bundler", async () => {
            uniteConfigurationStub.bundledLoader = "WPK";

            const obj = new Webpack();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.webpack).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["source-map-loader"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["uglifyjs-webpack-plugin"]).to.be.equal("1.2.3");
        });
    });
});
