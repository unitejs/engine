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

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new PostCss();
            uniteConfigurationStub.cssPost = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new PostCss();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
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

    describe("install", () => {
        it("can be called", async () => {
            const obj = new PostCss();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.postcss).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["postcss-import"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.autoprefixer).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.cssnano).to.be.equal("1.2.3");
        });
    });

    describe("uninstall", () => {
        it("can be called", async () => {
            const obj = new PostCss();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { postcss: "1.2.3", "postcss-import": "1.2.3", autoprefixer: "1.2.3", cssnano: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.postcss).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["postcss-import"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.autoprefixer).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.cssnano).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").throws("error");
            const obj = new PostCss();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can write file", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new PostCss();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const json = await fileSystemMock.fileReadJson<PostCssConfiguration>("./test/unit/temp/www/", ".postcssrc.json");
            Chai.expect(json.plugins).to.be.deep.equal({
                "postcss-import": {},
                autoprefixer: {}
            });
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
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
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
