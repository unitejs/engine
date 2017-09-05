/**
 * Tests for PostCss.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PostCssConfiguration } from "../../../../../dist/configuration/models/postcss/postCssConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { PostCss } from "../../../../../dist/pipelineSteps/cssPost/postCss";
import { FileSystemMock } from "../../fileSystem.mock";

describe("PostCss", () => {
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
        uniteConfigurationStub.cssPost = "PostCss";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new PostCss();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new PostCss();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(2);
        });
    });

    describe("initialise", () => {
        it("can fail when exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileExists").throws("error");

            const obj = new PostCss();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can not setup the engine configuration if not PostCss", async () => {
            const obj = new PostCss();
            uniteConfigurationStub.cssPost = "None";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PostCss")).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new PostCss();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PostCss")).to.be.deep.equal({
                plugins: {
                    "postcss-import": {},
                    autoprefixer: {}
                }
            });
        });

        it("can setup the engine configuration from existing", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ plugins: { "my-plugin": {} } });
            const obj = new PostCss();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PostCss")).to.be.deep.equal({
                plugins: {
                    "my-plugin": {},
                    "postcss-import": {},
                    autoprefixer: {}
                }
            });
        });

        it("can setup the engine configuration from existing but forced", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ plugins: { "my-plugin": {} } });
            engineVariablesStub.force = true;
            const obj = new PostCss();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PostCss")).to.be.deep.equal({
                plugins: {
                    "postcss-import": {},
                    autoprefixer: {}
                }
            });
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").throws("error");
            const obj = new PostCss();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can delete file if not post css", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileExists").returns(false);
            const obj = new PostCss();
            uniteConfigurationStub.cssPost = "None";
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.postcss).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["postcss-import"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.autoprefixer).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.cssnano).to.be.equal(undefined);
        });

        it("can write file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new PostCss();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<PostCssConfiguration>("./test/unit/temp/www/", ".postcssrc.json");
            Chai.expect(json.plugins).to.be.deep.equal({
                "postcss-import": {},
                autoprefixer: {}
            });

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.postcss).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["postcss-import"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.autoprefixer).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.cssnano).to.be.equal("1.2.3");
        });

        it("can combine with existing file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const initjson = new PostCssConfiguration();
            initjson.plugins = {
                "postcss-import": { extraOption: true},
                extraPlugin: { someOption: 1}
            };
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".postcssrc.json", initjson);

            const obj = new PostCss();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");

            const json = await fileSystemMock.fileReadJson<PostCssConfiguration>("./test/unit/temp/www/", ".postcssrc.json");
            Chai.expect(json.plugins).to.be.deep.equal({
                "postcss-import": { extraOption: true},
                autoprefixer: {},
                extraPlugin: { someOption: 1 }
            });
        });
    });
});
