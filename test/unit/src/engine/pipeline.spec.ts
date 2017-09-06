/**
 * Tests for Pipeline.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../dist/engine/engineVariables";
import { Pipeline } from "../../../../dist/engine/pipeline";
import { PipelineKey } from "../../../../dist/engine/pipelineKey";
import { PipelineStepBase } from "../../../../dist/engine/pipelineStepBase";
import { IPipelineStep } from "../../../../dist/interfaces/IPipelineStep";
import { FileSystemMock } from "../fileSystem.mock";

class TestStep extends PipelineStepBase {
    public initFail: boolean;
    public processFail: boolean;

    public influences(): PipelineKey[] {
        return [];
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return this.initFail ? 1 : 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return this.processFail ? 1 : 0;
    }
}

describe("Pipeline", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let uniteConfigurationStub: any;
    let engineVariablesStub: EngineVariables;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let modulePath: string;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemStub = new FileSystemMock();

        modulePath = fileSystemStub.pathAbsolute("./test/unit/dist");

        uniteConfigurationStub = new UniteConfiguration();
        engineVariablesStub = new EngineVariables();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
        Chai.should().exist(obj);
    });

    describe("add", () => {
        it("can add a pipeline step", () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            Chai.should().exist(obj);
        });
    });

    describe("run", () => {
        it("can run a pipeline with no steps", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can run a pipeline with non existing step", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        });

        it("can run a pipeline with existing step", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step initialise fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step process fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.processFail = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });
    });

    describe("getStep", () => {
        it("can fail to get a step with no key", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(undefined);
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step with no category", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey(undefined, undefined));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step with no key property", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey("cat", undefined));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step when it has not been loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey("cat", "key"));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can get a step when it has been loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            const ret = obj.getStep(new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).not.to.be.equal(undefined);
        });
    });

    describe("tryLoad", () => {
        it("can fail with no key", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, undefined);
            Chai.expect(ret).to.be.equal(false);
        });

        it("can fail with no key property", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", undefined));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("should not be blank");
        });

        it("can fail with not existing module", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        });

        it("can fail with file system exception", async () => {
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("kaboom");
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("failed to load");
        });

        it("can succeed with existing module", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        });

        it("can succeed when module already loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        });

        it("can succeed with aliased configuration type", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"), "otherEngine");
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.otherEngine).to.be.equal("DummyStep");
        });
    });

    describe("orderByInfluence", () => {
        it("can order no items", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const keyMap = {};

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([]);
        });

        it("can order one item with no influence", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const keyMap = {
                "cat1/key1": cat1Key1
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1]);
        });

        it("can order one item with self influence", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "key1")
                ]
            };

            const keyMap = {
                "cat1/key1": cat1Key1
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1]);
        });

        it("can order two items with no influence", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key2, cat1Key1]);
        });

        it("can order two items with influence", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key2")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2]);
        });

        it("can order three items with influence when already ordered", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2,
                "cat1/key3": cat1Key3
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order three items with influence when not already ordered", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const keyMap = {
                "cat1/key3": cat1Key3,
                "cat1/key2": cat1Key2,
                "cat1/key1": cat1Key1
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order multiple items with influence", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const cat1Key4: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "key1"),
                    new PipelineKey("cat1", "key2")
                ]
            };

            const cat1Key5: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "key2"),
                    new PipelineKey("cat1", "key3")
                ]
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2,
                "cat1/key3": cat1Key3,
                "cat1/key4": cat1Key4,
                "cat1/key5": cat1Key5
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key5, cat1Key4, cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order multiple items with influence when existing in reverse order", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const cat1Key4: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "key1"),
                    new PipelineKey("cat1", "key2")
                ]
            };

            const cat1Key5: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "key2"),
                    new PipelineKey("cat1", "key3")
                ]
            };

            const keyMap = {
                "cat1/key5": cat1Key5,
                "cat1/key4": cat1Key4,
                "cat1/key3": cat1Key3,
                "cat1/key2": cat1Key2,
                "cat1/key1": cat1Key1
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key5, cat1Key4, cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order multiple items with wildcard category", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const cat1Key4: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat1", "*")
                ]
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2,
                "cat1/key3": cat1Key3,
                "cat1/key4": cat1Key4
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key4, cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order multiple items with unknown wildcard category", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);

            const cat1Key1: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key2: IPipelineStep = <IPipelineStep>{
                influences: () => [new PipelineKey("cat1", "key3")]
            };

            const cat1Key3: IPipelineStep = <IPipelineStep>{
                influences: () => []
            };

            const cat1Key4: IPipelineStep = <IPipelineStep>{
                influences: () => [
                    new PipelineKey("cat2", "*")
                ]
            };

            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2,
                "cat1/key3": cat1Key3,
                "cat1/key4": cat1Key4
            };

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key4, cat1Key1, cat1Key2, cat1Key3]);
        });

        it("can order real modules fixed order", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, fileSystemStub.pathAbsolute("./dist/pipelineSteps"));

            const keys = [];

            keys.push(new PipelineKey("scaffold", "outputDirectory"));
            keys.push(new PipelineKey("scaffold", "appScaffold"));
            keys.push(new PipelineKey("scaffold", "unitTestScaffold"));
            keys.push(new PipelineKey("scaffold", "e2eTestScaffold"));

            keys.push(new PipelineKey("applicationFramework", "plainApp"));
            keys.push(new PipelineKey("applicationFramework", "angular"));
            keys.push(new PipelineKey("applicationFramework", "aurelia"));
            keys.push(new PipelineKey("applicationFramework", "react"));

            keys.push(new PipelineKey("taskManager", "gulp"));

            keys.push(new PipelineKey("platform", "web"));
            keys.push(new PipelineKey("platform", "electron"));

            keys.push(new PipelineKey("moduleType", "amd"));
            keys.push(new PipelineKey("moduleType", "commonJs"));
            keys.push(new PipelineKey("moduleType", "systemJs"));

            keys.push(new PipelineKey("bundler", "browserify"));
            keys.push(new PipelineKey("bundler", "requireJs"));
            keys.push(new PipelineKey("bundler", "systemJsBuilder"));
            keys.push(new PipelineKey("bundler", "webpack"));

            keys.push(new PipelineKey("cssPre", "css"));
            keys.push(new PipelineKey("cssPre", "less"));
            keys.push(new PipelineKey("cssPre", "sass"));
            keys.push(new PipelineKey("cssPre", "stylus"));

            keys.push(new PipelineKey("cssPost", "none"));
            keys.push(new PipelineKey("cssPost", "postCss"));

            keys.push(new PipelineKey("testFramework", "jasmine"));
            keys.push(new PipelineKey("testFramework", "mochaChai"));

            keys.push(new PipelineKey("language", "javaScript"));
            keys.push(new PipelineKey("language", "typeScript"));

            keys.push(new PipelineKey("e2eTestRunner", "webdriverIo"));
            keys.push(new PipelineKey("e2eTestRunner", "protractor"));

            keys.push(new PipelineKey("unitTestEngine", "phantomJs"));
            keys.push(new PipelineKey("unitTestEngine", "chromeHeadless"));

            keys.push(new PipelineKey("linter", "esLint"));
            keys.push(new PipelineKey("linter", "tsLint"));

            keys.push(new PipelineKey("unitTestRunner", "karma"));

            keys.push(new PipelineKey("packageManager", "npm"));
            keys.push(new PipelineKey("packageManager", "yarn"));

            keys.push(new PipelineKey("server", "browserSync"));

            keys.push(new PipelineKey("unite", "uniteConfigurationDirectories"));
            keys.push(new PipelineKey("unite", "uniteConfigurationJson"));
            keys.push(new PipelineKey("unite", "uniteThemeConfigurationJson"));

            keys.push(new PipelineKey("content", "assets"));
            keys.push(new PipelineKey("content", "packageJson"));
            keys.push(new PipelineKey("content", "license"));
            keys.push(new PipelineKey("content", "gitIgnore"));
            keys.push(new PipelineKey("content", "readMe"));
            keys.push(new PipelineKey("content", "htmlTemplate"));

            const keyMap: { [id: string]: IPipelineStep } = {};
            const steps: IPipelineStep[] = [];
            for (let i = 0; i < keys.length; i++) {
                await obj.tryLoad(uniteConfigurationStub, keys[i], undefined, false);
                const step = obj.getStep(keys[i]);
                steps.push(step);
                keyMap[keys[i].combined()] = step;
            }

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret.map(step => step.constructor.name)).to.be.deep.equal([
                "OutputDirectory",
                "UniteThemeConfigurationJson",
                "AppScaffold",
                "E2eTestScaffold",
                "UnitTestScaffold",
                "Angular",
                "Aurelia",
                "PlainApp",
                "React",
                "Browserify",
                "RequireJs",
                "SystemJsBuilder",
                "Webpack",
                "None",
                "PostCss",
                "Css",
                "Less",
                "Sass",
                "Stylus",
                "Jasmine",
                "MochaChai",
                "Protractor",
                "WebdriverIo",
                "Amd",
                "CommonJs",
                "SystemJs",
                "JavaScript",
                "TypeScript",
                "EsLint",
                "TsLint",
                "Npm",
                "Yarn",
                "Electron",
                "Web",
                "BrowserSync",
                "Gulp",
                "ChromeHeadless",
                "PhantomJs",
                "Karma",
                "UniteConfigurationDirectories",
                "UniteConfigurationJson",
                "ReadMe",
                "Assets",
                "PackageJson",
                "License",
                "HtmlTemplate",
                "GitIgnore"
            ]);
        });

        it("can order real modules random order", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, fileSystemStub.pathAbsolute("./dist/pipelineSteps"));

            const keys = [];

            keys.push(new PipelineKey("unitTestRunner", "karma"));

            keys.push(new PipelineKey("taskManager", "gulp"));

            keys.push(new PipelineKey("linter", "esLint"));
            keys.push(new PipelineKey("linter", "tsLint"));

            keys.push(new PipelineKey("platform", "web"));
            keys.push(new PipelineKey("platform", "electron"));

            keys.push(new PipelineKey("applicationFramework", "angular"));
            keys.push(new PipelineKey("applicationFramework", "aurelia"));
            keys.push(new PipelineKey("applicationFramework", "plainApp"));
            keys.push(new PipelineKey("applicationFramework", "react"));

            keys.push(new PipelineKey("moduleType", "amd"));
            keys.push(new PipelineKey("moduleType", "commonJs"));
            keys.push(new PipelineKey("moduleType", "systemJs"));

            keys.push(new PipelineKey("platform", "web"));
            keys.push(new PipelineKey("platform", "electron"));

            keys.push(new PipelineKey("cssPre", "css"));
            keys.push(new PipelineKey("cssPre", "less"));
            keys.push(new PipelineKey("cssPre", "sass"));
            keys.push(new PipelineKey("cssPre", "stylus"));

            keys.push(new PipelineKey("bundler", "browserify"));
            keys.push(new PipelineKey("bundler", "requireJs"));
            keys.push(new PipelineKey("bundler", "systemJsBuilder"));
            keys.push(new PipelineKey("bundler", "webpack"));

            keys.push(new PipelineKey("cssPost", "none"));
            keys.push(new PipelineKey("cssPost", "postCss"));

            keys.push(new PipelineKey("language", "javaScript"));
            keys.push(new PipelineKey("language", "typeScript"));

            keys.push(new PipelineKey("testFramework", "jasmine"));
            keys.push(new PipelineKey("testFramework", "mochaChai"));

            keys.push(new PipelineKey("e2eTestRunner", "webdriverIo"));
            keys.push(new PipelineKey("e2eTestRunner", "protractor"));

            keys.push(new PipelineKey("unitTestEngine", "phantomJs"));
            keys.push(new PipelineKey("unitTestEngine", "chromeHeadless"));

            keys.push(new PipelineKey("packageManager", "npm"));
            keys.push(new PipelineKey("packageManager", "yarn"));

            keys.push(new PipelineKey("server", "browserSync"));

            keys.push(new PipelineKey("content", "htmlTemplate"));
            keys.push(new PipelineKey("content", "readMe"));
            keys.push(new PipelineKey("content", "gitIgnore"));
            keys.push(new PipelineKey("content", "license"));
            keys.push(new PipelineKey("content", "assets"));
            keys.push(new PipelineKey("content", "packageJson"));

            keys.push(new PipelineKey("unite", "uniteConfigurationDirectories"));
            keys.push(new PipelineKey("unite", "uniteThemeConfigurationJson"));
            keys.push(new PipelineKey("unite", "uniteConfigurationJson"));

            keys.push(new PipelineKey("scaffold", "outputDirectory"));
            keys.push(new PipelineKey("scaffold", "appScaffold"));
            keys.push(new PipelineKey("scaffold", "unitTestScaffold"));
            keys.push(new PipelineKey("scaffold", "e2eTestScaffold"));

            const keyMap: { [id: string]: IPipelineStep } = {};
            const steps: IPipelineStep[] = [];
            for (let i = 0; i < keys.length; i++) {
                await obj.tryLoad(uniteConfigurationStub, keys[i], undefined, false);
                const step = obj.getStep(keys[i]);
                steps.push(step);
                keyMap[keys[i].combined()] = step;
            }

            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret.map(step => step.constructor.name)).to.be.deep.equal([
                "OutputDirectory",
                "UniteThemeConfigurationJson",
                "AppScaffold",
                "E2eTestScaffold",
                "UnitTestScaffold",
                "Angular",
                "Aurelia",
                "PlainApp",
                "React",
                "Browserify",
                "RequireJs",
                "SystemJsBuilder",
                "Webpack",
                "None",
                "PostCss",
                "Css",
                "Less",
                "Sass",
                "Stylus",
                "Jasmine",
                "MochaChai",
                "Protractor",
                "WebdriverIo",
                "Amd",
                "CommonJs",
                "SystemJs",
                "JavaScript",
                "TypeScript",
                "EsLint",
                "TsLint",
                "Npm",
                "Yarn",
                "Electron",
                "Web",
                "BrowserSync",
                "Gulp",
                "ChromeHeadless",
                "PhantomJs",
                "Karma",
                "UniteConfigurationDirectories",
                "UniteConfigurationJson",
                "ReadMe",
                "Assets",
                "PackageJson",
                "License",
                "HtmlTemplate",
                "GitIgnore"
            ]);
        });
    });
});
