"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for Pipeline.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const pipeline_1 = require("../../../../dist/engine/pipeline");
const pipelineKey_1 = require("../../../../dist/engine/pipelineKey");
const pipelineStepBase_1 = require("../../../../dist/engine/pipelineStepBase");
const fileSystem_mock_1 = require("../fileSystem.mock");
class TestStep extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [];
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.initFail ? 1 : 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.processFail ? 1 : 0;
        });
    }
}
describe("Pipeline", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let uniteConfigurationStub;
    let engineVariablesStub;
    let loggerInfoSpy;
    let loggerErrorSpy;
    let modulePath;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemStub = new fileSystem_mock_1.FileSystemMock();
        modulePath = fileSystemStub.pathAbsolute("./test/unit/dist");
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        engineVariablesStub = new engineVariables_1.EngineVariables();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => {
        const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
        Chai.should().exist(obj);
    });
    describe("add", () => {
        it("can add a pipeline step", () => {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            Chai.should().exist(obj);
        });
    });
    describe("run", () => {
        it("can run a pipeline with no steps", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can run a pipeline with non existing step", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        }));
        it("can run a pipeline with existing step", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step initialise fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step process fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.processFail = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
    });
    describe("getStep", () => {
        it("can fail to get a step with no key", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(undefined);
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step with no category", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey(undefined, undefined));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step with no key property", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("cat", undefined));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step when it has not been loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("cat", "key"));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can get a step when it has been loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).not.to.be.equal(undefined);
        }));
    });
    describe("tryLoad", () => {
        it("can fail with no key", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, undefined);
            Chai.expect(ret).to.be.equal(false);
        }));
        it("can fail with no key property", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", undefined));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("should not be blank");
        }));
        it("can fail with not existing module", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        }));
        it("can fail with file system exception", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("kaboom");
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("failed to load");
        }));
        it("can succeed with existing module", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        }));
        it("can succeed when module already loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        }));
        it("can succeed with aliased configuration type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"), "otherEngine");
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.otherEngine).to.be.equal("DummyStep");
        }));
    });
    describe("orderByInfluence", () => {
        it("can order no items", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const keyMap = {};
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([]);
        }));
        it("can order one item with no influence", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => []
            };
            const keyMap = {
                "cat1/key1": cat1Key1
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1]);
        }));
        it("can order one item with self influence", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "key1")
                ]
            };
            const keyMap = {
                "cat1/key1": cat1Key1
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1]);
        }));
        it("can order two items with no influence", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => []
            };
            const cat1Key2 = {
                influences: () => []
            };
            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key2, cat1Key1]);
        }));
        it("can order two items with influence", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key2")]
            };
            const cat1Key2 = {
                influences: () => []
            };
            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2]);
        }));
        it("can order three items with influence when already ordered", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const keyMap = {
                "cat1/key1": cat1Key1,
                "cat1/key2": cat1Key2,
                "cat1/key3": cat1Key3
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2, cat1Key3]);
        }));
        it("can order three items with influence when not already ordered", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const keyMap = {
                "cat1/key3": cat1Key3,
                "cat1/key2": cat1Key2,
                "cat1/key1": cat1Key1
            };
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret).to.be.deep.equal([cat1Key1, cat1Key2, cat1Key3]);
        }));
        it("can order multiple items with influence", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const cat1Key4 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "key1"),
                    new pipelineKey_1.PipelineKey("cat1", "key2")
                ]
            };
            const cat1Key5 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "key2"),
                    new pipelineKey_1.PipelineKey("cat1", "key3")
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
        }));
        it("can order multiple items with influence when existing in reverse order", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const cat1Key4 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "key1"),
                    new pipelineKey_1.PipelineKey("cat1", "key2")
                ]
            };
            const cat1Key5 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "key2"),
                    new pipelineKey_1.PipelineKey("cat1", "key3")
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
        }));
        it("can order multiple items with wildcard category", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const cat1Key4 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat1", "*")
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
        }));
        it("can order multiple items with unknown wildcard category", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const cat1Key1 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key2 = {
                influences: () => [new pipelineKey_1.PipelineKey("cat1", "key3")]
            };
            const cat1Key3 = {
                influences: () => []
            };
            const cat1Key4 = {
                influences: () => [
                    new pipelineKey_1.PipelineKey("cat2", "*")
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
        }));
        it("can order real modules fixed order", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, fileSystemStub.pathAbsolute("./dist/pipelineSteps"));
            const keys = [];
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "outputDirectory"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "appScaffold"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "unitTestScaffold"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "e2eTestScaffold"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "plainApp"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "angular"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "aurelia"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "react"));
            keys.push(new pipelineKey_1.PipelineKey("taskManager", "gulp"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "web"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "electron"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "amd"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "commonJs"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "systemJs"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "browserify"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "requireJs"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "systemJsBuilder"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "webpack"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "css"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "less"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "sass"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "stylus"));
            keys.push(new pipelineKey_1.PipelineKey("cssPost", "none"));
            keys.push(new pipelineKey_1.PipelineKey("cssPost", "postCss"));
            keys.push(new pipelineKey_1.PipelineKey("testFramework", "jasmine"));
            keys.push(new pipelineKey_1.PipelineKey("testFramework", "mochaChai"));
            keys.push(new pipelineKey_1.PipelineKey("language", "javaScript"));
            keys.push(new pipelineKey_1.PipelineKey("language", "typeScript"));
            keys.push(new pipelineKey_1.PipelineKey("e2eTestRunner", "webdriverIo"));
            keys.push(new pipelineKey_1.PipelineKey("e2eTestRunner", "protractor"));
            keys.push(new pipelineKey_1.PipelineKey("unitTestEngine", "phantomJs"));
            keys.push(new pipelineKey_1.PipelineKey("unitTestEngine", "chromeHeadless"));
            keys.push(new pipelineKey_1.PipelineKey("linter", "esLint"));
            keys.push(new pipelineKey_1.PipelineKey("linter", "tsLint"));
            keys.push(new pipelineKey_1.PipelineKey("unitTestRunner", "karma"));
            keys.push(new pipelineKey_1.PipelineKey("packageManager", "npm"));
            keys.push(new pipelineKey_1.PipelineKey("packageManager", "yarn"));
            keys.push(new pipelineKey_1.PipelineKey("server", "browserSync"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteConfigurationDirectories"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteThemeConfigurationJson"));
            keys.push(new pipelineKey_1.PipelineKey("content", "assets"));
            keys.push(new pipelineKey_1.PipelineKey("content", "packageJson"));
            keys.push(new pipelineKey_1.PipelineKey("content", "license"));
            keys.push(new pipelineKey_1.PipelineKey("content", "gitIgnore"));
            keys.push(new pipelineKey_1.PipelineKey("content", "readMe"));
            keys.push(new pipelineKey_1.PipelineKey("content", "htmlTemplate"));
            const keyMap = {};
            const steps = [];
            for (let i = 0; i < keys.length; i++) {
                yield obj.tryLoad(uniteConfigurationStub, keys[i], undefined, false);
                const step = obj.getStep(keys[i]);
                steps.push(step);
                keyMap[keys[i].combined()] = step;
            }
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret.map(step => step.constructor.name)).to.be.deep.equal([
                "OutputDirectory",
                "Assets",
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
                "PackageJson",
                "License",
                "HtmlTemplate",
                "GitIgnore"
            ]);
        }));
        it("can order real modules random order", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, fileSystemStub.pathAbsolute("./dist/pipelineSteps"));
            const keys = [];
            keys.push(new pipelineKey_1.PipelineKey("unitTestRunner", "karma"));
            keys.push(new pipelineKey_1.PipelineKey("taskManager", "gulp"));
            keys.push(new pipelineKey_1.PipelineKey("linter", "esLint"));
            keys.push(new pipelineKey_1.PipelineKey("linter", "tsLint"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "web"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "electron"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "angular"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "aurelia"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "plainApp"));
            keys.push(new pipelineKey_1.PipelineKey("applicationFramework", "react"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "amd"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "commonJs"));
            keys.push(new pipelineKey_1.PipelineKey("moduleType", "systemJs"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "web"));
            keys.push(new pipelineKey_1.PipelineKey("platform", "electron"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "css"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "less"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "sass"));
            keys.push(new pipelineKey_1.PipelineKey("cssPre", "stylus"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "browserify"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "requireJs"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "systemJsBuilder"));
            keys.push(new pipelineKey_1.PipelineKey("bundler", "webpack"));
            keys.push(new pipelineKey_1.PipelineKey("cssPost", "none"));
            keys.push(new pipelineKey_1.PipelineKey("cssPost", "postCss"));
            keys.push(new pipelineKey_1.PipelineKey("language", "javaScript"));
            keys.push(new pipelineKey_1.PipelineKey("language", "typeScript"));
            keys.push(new pipelineKey_1.PipelineKey("testFramework", "jasmine"));
            keys.push(new pipelineKey_1.PipelineKey("testFramework", "mochaChai"));
            keys.push(new pipelineKey_1.PipelineKey("e2eTestRunner", "webdriverIo"));
            keys.push(new pipelineKey_1.PipelineKey("e2eTestRunner", "protractor"));
            keys.push(new pipelineKey_1.PipelineKey("unitTestEngine", "phantomJs"));
            keys.push(new pipelineKey_1.PipelineKey("unitTestEngine", "chromeHeadless"));
            keys.push(new pipelineKey_1.PipelineKey("packageManager", "npm"));
            keys.push(new pipelineKey_1.PipelineKey("packageManager", "yarn"));
            keys.push(new pipelineKey_1.PipelineKey("server", "browserSync"));
            keys.push(new pipelineKey_1.PipelineKey("content", "htmlTemplate"));
            keys.push(new pipelineKey_1.PipelineKey("content", "readMe"));
            keys.push(new pipelineKey_1.PipelineKey("content", "gitIgnore"));
            keys.push(new pipelineKey_1.PipelineKey("content", "license"));
            keys.push(new pipelineKey_1.PipelineKey("content", "assets"));
            keys.push(new pipelineKey_1.PipelineKey("content", "packageJson"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteConfigurationDirectories"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteThemeConfigurationJson"));
            keys.push(new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "outputDirectory"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "appScaffold"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "unitTestScaffold"));
            keys.push(new pipelineKey_1.PipelineKey("scaffold", "e2eTestScaffold"));
            const keyMap = {};
            const steps = [];
            for (let i = 0; i < keys.length; i++) {
                yield obj.tryLoad(uniteConfigurationStub, keys[i], undefined, false);
                const step = obj.getStep(keys[i]);
                steps.push(step);
                keyMap[keys[i].combined()] = step;
            }
            const ret = obj.orderByInfluence(keyMap);
            Chai.expect(ret.map(step => step.constructor.name)).to.be.deep.equal([
                "OutputDirectory",
                "Assets",
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
                "PackageJson",
                "License",
                "HtmlTemplate",
                "GitIgnore"
            ]);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix1R0FBb0c7QUFDcEcsNkVBQTBFO0FBQzFFLCtEQUE0RDtBQUM1RCxxRUFBa0U7QUFDbEUsK0VBQTRFO0FBRTVFLHdEQUFvRDtBQUVwRCxjQUFlLFNBQVEsbUNBQWdCO0lBSTVCLFVBQVU7UUFDYixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUFBO0NBQ0o7QUFFRCxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ2pCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTJCLENBQUM7SUFDaEMsSUFBSSxtQkFBb0MsQ0FBQztJQUN6QyxJQUFJLGFBQTZCLENBQUM7SUFDbEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksVUFBa0IsQ0FBQztJQUV2QixVQUFVLENBQUM7UUFDUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUIsVUFBVSxD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QztZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5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LENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUUvQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxJQUFJLENB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TixTQUFTO2dCQUNULEtBQUs7Z0JBQ0wsTUFBTTtnQkFDTixNQUFNO2dCQUNOLFFBQVE7Z0JBQ1IsU0FBUztnQkFDVCxXQUFXO2dCQUNYLFlBQVk7Z0JBQ1osYUFBYTtnQkFDYixLQUFLO2dCQUNMLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixZQUFZO2dCQUNaLFlBQVk7Z0JBQ1osUUFBUTtnQkFDUixRQUFRO2dCQUNSLEtBQUs7Z0JBQ0wsTUFBTTtnQkFDTixVQUFVO2dCQUNWLEtBQUs7Z0JBQ0wsYUFBYTtnQkFDYixNQUFNO2dCQUNOLGdCQUFnQjtnQkFDaEIsV0FBVztnQkFDWCxPQUFPO2dCQUNQLCtCQUErQjtnQkFDL0Isd0JBQXdCO2dCQUN4QixRQUFRO2dCQUNSLGFBQWE7Z0JBQ2IsU0FBUztnQkFDVCxjQUFjO2dCQUNkLFdBQVc7YUFDZCxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmUuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFBpcGVsaW5lLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2VuZ2luZS9waXBlbGluZVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgSVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmNsYXNzIFRlc3RTdGVwIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGluaXRGYWlsOiBib29sZWFuO1xuICAgIHB1YmxpYyBwcm9jZXNzRmFpbDogYm9vbGVhbjtcblxuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdEZhaWwgPyAxIDogMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRmFpbCA/IDEgOiAwO1xuICAgIH1cbn1cblxuZGVzY3JpYmUoXCJQaXBlbGluZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBhbnk7XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbW9kdWxlUGF0aDogc3RyaW5nO1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBsb2dnZXJJbmZvU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJpbmZvXCIpO1xuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcblxuICAgICAgICBtb2R1bGVQYXRoID0gZmlsZVN5c3RlbVN0dWIucGF0aEFic29sdXRlKFwiLi90ZXN0L3VuaXQvZGlzdFwiKTtcblxuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJhZGRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBhZGQgYSBwaXBlbGluZSBzdGVwXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiY2F0MVwiLCBcImtleTFcIik7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJydW5cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBydW4gYSBwaXBlbGluZSB3aXRoIG5vIHN0ZXBzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gcnVuIGEgcGlwZWxpbmUgd2l0aCBub24gZXhpc3Rpbmcgc3RlcFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImNhdDFcIiwgXCJrZXkxXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWlucyhcImNvdWxkIG5vdCBiZSBsb2NhdGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBydW4gYSBwaXBlbGluZSB3aXRoIGV4aXN0aW5nIHN0ZXBcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBpbml0aWFsaXNlIGZhaWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbml0RmFpbCA9IHRydWU7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIHByb2Nlc3MgZmFpbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLnByb2Nlc3NGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImdldFN0ZXBcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHRvIGdldCBhIHN0ZXAgd2l0aCBubyBrZXlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aXRoIG5vIGNhdGVnb3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkodW5kZWZpbmVkLCB1bmRlZmluZWQpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB0byBnZXQgYSBzdGVwIHdpdGggbm8ga2V5IHByb3BlcnR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkoXCJjYXRcIiwgdW5kZWZpbmVkKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aGVuIGl0IGhhcyBub3QgYmVlbiBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleShcImNhdFwiLCBcImtleVwiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGdldCBhIHN0ZXAgd2hlbiBpdCBoYXMgYmVlbiBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkubm90LnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJ0cnlMb2FkXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGtleVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8ga2V5IHByb3BlcnR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgdW5kZWZpbmVkKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwic2hvdWxkIG5vdCBiZSBibGFua1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vdCBleGlzdGluZyBtb2R1bGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImJsYWhcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWlucyhcImNvdWxkIG5vdCBiZSBsb2NhdGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggZmlsZSBzeXN0ZW0gZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkucmVqZWN0cyhcImthYm9vbVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJibGFoXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbnMoXCJmYWlsZWQgdG8gbG9hZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIGV4aXN0aW5nIG1vZHVsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIG1vZHVsZSBhbHJlYWR5IGxvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIGFsaWFzZWQgY29uZmlndXJhdGlvbiB0eXBlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSwgXCJvdGhlckVuZ2luZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLm90aGVyRW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm9yZGVyQnlJbmZsdWVuY2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBvcmRlciBubyBpdGVtc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICBjb25zdCBrZXlNYXAgPSB7fTtcblxuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLm9yZGVyQnlJbmZsdWVuY2Uoa2V5TWFwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG9yZGVyIG9uZSBpdGVtIHdpdGggbm8gaW5mbHVlbmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBrZXlNYXAgPSB7XG4gICAgICAgICAgICAgICAgXCJjYXQxL2tleTFcIjogY2F0MUtleTFcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5vcmRlckJ5SW5mbHVlbmNlKGtleU1hcCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmRlZXAuZXF1YWwoW2NhdDFLZXkxXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG9yZGVyIG9uZSBpdGVtIHdpdGggc2VsZiBpbmZsdWVuY2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcblxuICAgICAgICAgICAgY29uc3QgY2F0MUtleTE6IElQaXBlbGluZVN0ZXAgPSA8SVBpcGVsaW5lU3RlcD57XG4gICAgICAgICAgICAgICAgaW5mbHVlbmNlczogKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5MVwiKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGtleU1hcCA9IHtcbiAgICAgICAgICAgICAgICBcImNhdDEva2V5MVwiOiBjYXQxS2V5MVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLm9yZGVyQnlJbmZsdWVuY2Uoa2V5TWFwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZGVlcC5lcXVhbChbY2F0MUtleTFdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgdHdvIGl0ZW1zIHdpdGggbm8gaW5mbHVlbmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MjogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5MiwgY2F0MUtleTFdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgdHdvIGl0ZW1zIHdpdGggaW5mbHVlbmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5MlwiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkyOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBrZXlNYXAgPSB7XG4gICAgICAgICAgICAgICAgXCJjYXQxL2tleTFcIjogY2F0MUtleTEsXG4gICAgICAgICAgICAgICAgXCJjYXQxL2tleTJcIjogY2F0MUtleTJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5vcmRlckJ5SW5mbHVlbmNlKGtleU1hcCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmRlZXAuZXF1YWwoW2NhdDFLZXkxLCBjYXQxS2V5Ml0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBvcmRlciB0aHJlZSBpdGVtcyB3aXRoIGluZmx1ZW5jZSB3aGVuIGFscmVhZHkgb3JkZXJlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MTogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MjogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MzogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkzXCI6IGNhdDFLZXkzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5MSwgY2F0MUtleTIsIGNhdDFLZXkzXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG9yZGVyIHRocmVlIGl0ZW1zIHdpdGggaW5mbHVlbmNlIHdoZW4gbm90IGFscmVhZHkgb3JkZXJlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MTogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MjogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MzogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkzXCI6IGNhdDFLZXkzLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5MSwgY2F0MUtleTIsIGNhdDFLZXkzXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG9yZGVyIG11bHRpcGxlIGl0ZW1zIHdpdGggaW5mbHVlbmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkyOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkzOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5NDogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNhdDFcIiwgXCJrZXkxXCIpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5MlwiKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXk1OiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTJcIiksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNhdDFcIiwgXCJrZXkzXCIpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkzXCI6IGNhdDFLZXkzLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXk0XCI6IGNhdDFLZXk0LFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXk1XCI6IGNhdDFLZXk1XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5NSwgY2F0MUtleTQsIGNhdDFLZXkxLCBjYXQxS2V5MiwgY2F0MUtleTNdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgbXVsdGlwbGUgaXRlbXMgd2l0aCBpbmZsdWVuY2Ugd2hlbiBleGlzdGluZyBpbiByZXZlcnNlIG9yZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkyOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkzOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5NDogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNhdDFcIiwgXCJrZXkxXCIpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5MlwiKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXk1OiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTJcIiksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNhdDFcIiwgXCJrZXkzXCIpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXk1XCI6IGNhdDFLZXk1LFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXk0XCI6IGNhdDFLZXk0LFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkzXCI6IGNhdDFLZXkzLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5NSwgY2F0MUtleTQsIGNhdDFLZXkxLCBjYXQxS2V5MiwgY2F0MUtleTNdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgbXVsdGlwbGUgaXRlbXMgd2l0aCB3aWxkY2FyZCBjYXRlZ29yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MTogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MjogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbbmV3IFBpcGVsaW5lS2V5KFwiY2F0MVwiLCBcImtleTNcIildXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5MzogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgY2F0MUtleTQ6IElQaXBlbGluZVN0ZXAgPSA8SVBpcGVsaW5lU3RlcD57XG4gICAgICAgICAgICAgICAgaW5mbHVlbmNlczogKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwiKlwiKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGtleU1hcCA9IHtcbiAgICAgICAgICAgICAgICBcImNhdDEva2V5MVwiOiBjYXQxS2V5MSxcbiAgICAgICAgICAgICAgICBcImNhdDEva2V5MlwiOiBjYXQxS2V5MixcbiAgICAgICAgICAgICAgICBcImNhdDEva2V5M1wiOiBjYXQxS2V5MyxcbiAgICAgICAgICAgICAgICBcImNhdDEva2V5NFwiOiBjYXQxS2V5NFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLm9yZGVyQnlJbmZsdWVuY2Uoa2V5TWFwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZGVlcC5lcXVhbChbY2F0MUtleTQsIGNhdDFLZXkxLCBjYXQxS2V5MiwgY2F0MUtleTNdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgbXVsdGlwbGUgaXRlbXMgd2l0aCB1bmtub3duIHdpbGRjYXJkIGNhdGVnb3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkxOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkyOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtuZXcgUGlwZWxpbmVLZXkoXCJjYXQxXCIsIFwia2V5M1wiKV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGNhdDFLZXkzOiBJUGlwZWxpbmVTdGVwID0gPElQaXBlbGluZVN0ZXA+e1xuICAgICAgICAgICAgICAgIGluZmx1ZW5jZXM6ICgpID0+IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBjYXQxS2V5NDogSVBpcGVsaW5lU3RlcCA9IDxJUGlwZWxpbmVTdGVwPntcbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzOiAoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNhdDJcIiwgXCIqXCIpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkxXCI6IGNhdDFLZXkxLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkyXCI6IGNhdDFLZXkyLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXkzXCI6IGNhdDFLZXkzLFxuICAgICAgICAgICAgICAgIFwiY2F0MS9rZXk0XCI6IGNhdDFLZXk0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5kZWVwLmVxdWFsKFtjYXQxS2V5NCwgY2F0MUtleTEsIGNhdDFLZXkyLCBjYXQxS2V5M10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBvcmRlciByZWFsIG1vZHVsZXMgZml4ZWQgb3JkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQWJzb2x1dGUoXCIuL2Rpc3QvcGlwZWxpbmVTdGVwc1wiKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBbXTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwib3V0cHV0RGlyZWN0b3J5XCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJzY2FmZm9sZFwiLCBcImFwcFNjYWZmb2xkXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJzY2FmZm9sZFwiLCBcInVuaXRUZXN0U2NhZmZvbGRcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwiZTJlVGVzdFNjYWZmb2xkXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwicGxhaW5BcHBcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwiYW5ndWxhclwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgXCJhdXJlbGlhXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBcInJlYWN0XCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInRhc2tNYW5hZ2VyXCIsIFwiZ3VscFwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJwbGF0Zm9ybVwiLCBcIndlYlwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwicGxhdGZvcm1cIiwgXCJlbGVjdHJvblwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIFwiYW1kXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIFwiY29tbW9uSnNcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcIm1vZHVsZVR5cGVcIiwgXCJzeXN0ZW1Kc1wiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJidW5kbGVyXCIsIFwiYnJvd3NlcmlmeVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYnVuZGxlclwiLCBcInJlcXVpcmVKc1wiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYnVuZGxlclwiLCBcInN5c3RlbUpzQnVpbGRlclwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYnVuZGxlclwiLCBcIndlYnBhY2tcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY3NzUHJlXCIsIFwiY3NzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJsZXNzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJzYXNzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJzdHlsdXNcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY3NzUG9zdFwiLCBcIm5vbmVcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImNzc1Bvc3RcIiwgXCJwb3N0Q3NzXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInRlc3RGcmFtZXdvcmtcIiwgXCJqYXNtaW5lXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIFwibW9jaGFDaGFpXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIFwiamF2YVNjcmlwdFwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwibGFuZ3VhZ2VcIiwgXCJ0eXBlU2NyaXB0XCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImUyZVRlc3RSdW5uZXJcIiwgXCJ3ZWJkcml2ZXJJb1wiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiZTJlVGVzdFJ1bm5lclwiLCBcInByb3RyYWN0b3JcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidW5pdFRlc3RFbmdpbmVcIiwgXCJwaGFudG9tSnNcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0RW5naW5lXCIsIFwiY2hyb21lSGVhZGxlc3NcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwibGludGVyXCIsIFwiZXNMaW50XCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJsaW50ZXJcIiwgXCJ0c0xpbnRcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidW5pdFRlc3RSdW5uZXJcIiwgXCJrYXJtYVwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCBcIm5wbVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgXCJ5YXJuXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInNlcnZlclwiLCBcImJyb3dzZXJTeW5jXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXNcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb25cIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImFzc2V0c1wiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjb250ZW50XCIsIFwibGljZW5zZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImdpdElnbm9yZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInJlYWRNZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImh0bWxUZW1wbGF0ZVwiKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGtleU1hcDogeyBbaWQ6IHN0cmluZ106IElQaXBlbGluZVN0ZXAgfSA9IHt9O1xuICAgICAgICAgICAgY29uc3Qgc3RlcHM6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1Yiwga2V5c1tpXSwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IG9iai5nZXRTdGVwKGtleXNbaV0pO1xuICAgICAgICAgICAgICAgIHN0ZXBzLnB1c2goc3RlcCk7XG4gICAgICAgICAgICAgICAga2V5TWFwW2tleXNbaV0uY29tYmluZWQoKV0gPSBzdGVwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmoub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0Lm1hcChzdGVwID0+IHN0ZXAuY29uc3RydWN0b3IubmFtZSkpLnRvLmJlLmRlZXAuZXF1YWwoW1xuICAgICAgICAgICAgICAgIFwiT3V0cHV0RGlyZWN0b3J5XCIsXG4gICAgICAgICAgICAgICAgXCJBc3NldHNcIixcbiAgICAgICAgICAgICAgICBcIlVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvblwiLFxuICAgICAgICAgICAgICAgIFwiQXBwU2NhZmZvbGRcIixcbiAgICAgICAgICAgICAgICBcIkUyZVRlc3RTY2FmZm9sZFwiLFxuICAgICAgICAgICAgICAgIFwiVW5pdFRlc3RTY2FmZm9sZFwiLFxuICAgICAgICAgICAgICAgIFwiQW5ndWxhclwiLFxuICAgICAgICAgICAgICAgIFwiQXVyZWxpYVwiLFxuICAgICAgICAgICAgICAgIFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBcIlJlYWN0XCIsXG4gICAgICAgICAgICAgICAgXCJCcm93c2VyaWZ5XCIsXG4gICAgICAgICAgICAgICAgXCJSZXF1aXJlSnNcIixcbiAgICAgICAgICAgICAgICBcIlN5c3RlbUpzQnVpbGRlclwiLFxuICAgICAgICAgICAgICAgIFwiV2VicGFja1wiLFxuICAgICAgICAgICAgICAgIFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIFwiQ3NzXCIsXG4gICAgICAgICAgICAgICAgXCJMZXNzXCIsXG4gICAgICAgICAgICAgICAgXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgXCJTdHlsdXNcIixcbiAgICAgICAgICAgICAgICBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIFwiV2ViZHJpdmVySW9cIixcbiAgICAgICAgICAgICAgICBcIkFtZFwiLFxuICAgICAgICAgICAgICAgIFwiQ29tbW9uSnNcIixcbiAgICAgICAgICAgICAgICBcIlN5c3RlbUpzXCIsXG4gICAgICAgICAgICAgICAgXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgXCJUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgXCJFc0xpbnRcIixcbiAgICAgICAgICAgICAgICBcIlRzTGludFwiLFxuICAgICAgICAgICAgICAgIFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgXCJZYXJuXCIsXG4gICAgICAgICAgICAgICAgXCJFbGVjdHJvblwiLFxuICAgICAgICAgICAgICAgIFwiV2ViXCIsXG4gICAgICAgICAgICAgICAgXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIFwiQ2hyb21lSGVhZGxlc3NcIixcbiAgICAgICAgICAgICAgICBcIlBoYW50b21Kc1wiLFxuICAgICAgICAgICAgICAgIFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICBcIlVuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzXCIsXG4gICAgICAgICAgICAgICAgXCJVbml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIsXG4gICAgICAgICAgICAgICAgXCJSZWFkTWVcIixcbiAgICAgICAgICAgICAgICBcIlBhY2thZ2VKc29uXCIsXG4gICAgICAgICAgICAgICAgXCJMaWNlbnNlXCIsXG4gICAgICAgICAgICAgICAgXCJIdG1sVGVtcGxhdGVcIixcbiAgICAgICAgICAgICAgICBcIkdpdElnbm9yZVwiXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gb3JkZXIgcmVhbCBtb2R1bGVzIHJhbmRvbSBvcmRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZShcIi4vZGlzdC9waXBlbGluZVN0ZXBzXCIpKTtcblxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IFtdO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidW5pdFRlc3RSdW5uZXJcIiwgXCJrYXJtYVwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ0YXNrTWFuYWdlclwiLCBcImd1bHBcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwibGludGVyXCIsIFwiZXNMaW50XCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJsaW50ZXJcIiwgXCJ0c0xpbnRcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwicGxhdGZvcm1cIiwgXCJ3ZWJcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInBsYXRmb3JtXCIsIFwiZWxlY3Ryb25cIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgXCJhbmd1bGFyXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBcImF1cmVsaWFcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwicGxhaW5BcHBcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIsIFwicmVhY3RcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwibW9kdWxlVHlwZVwiLCBcImFtZFwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwibW9kdWxlVHlwZVwiLCBcImNvbW1vbkpzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJtb2R1bGVUeXBlXCIsIFwic3lzdGVtSnNcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwicGxhdGZvcm1cIiwgXCJ3ZWJcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInBsYXRmb3JtXCIsIFwiZWxlY3Ryb25cIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY3NzUHJlXCIsIFwiY3NzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJsZXNzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJzYXNzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQcmVcIiwgXCJzdHlsdXNcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiYnVuZGxlclwiLCBcImJyb3dzZXJpZnlcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgXCJyZXF1aXJlSnNcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgXCJzeXN0ZW1Kc0J1aWxkZXJcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImJ1bmRsZXJcIiwgXCJ3ZWJwYWNrXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImNzc1Bvc3RcIiwgXCJub25lXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJjc3NQb3N0XCIsIFwicG9zdENzc1wiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJsYW5ndWFnZVwiLCBcImphdmFTY3JpcHRcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIFwidHlwZVNjcmlwdFwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ0ZXN0RnJhbWV3b3JrXCIsIFwiamFzbWluZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidGVzdEZyYW1ld29ya1wiLCBcIm1vY2hhQ2hhaVwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJlMmVUZXN0UnVubmVyXCIsIFwid2ViZHJpdmVySW9cIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImUyZVRlc3RSdW5uZXJcIiwgXCJwcm90cmFjdG9yXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0RW5naW5lXCIsIFwicGhhbnRvbUpzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdEVuZ2luZVwiLCBcImNocm9tZUhlYWRsZXNzXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInBhY2thZ2VNYW5hZ2VyXCIsIFwibnBtXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJwYWNrYWdlTWFuYWdlclwiLCBcInlhcm5cIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwic2VydmVyXCIsIFwiYnJvd3NlclN5bmNcIikpO1xuXG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImh0bWxUZW1wbGF0ZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInJlYWRNZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImdpdElnbm9yZVwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImxpY2Vuc2VcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJhc3NldHNcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKSk7XG5cbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJ1bml0ZVwiLCBcInVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvblwiKSk7XG4gICAgICAgICAgICBrZXlzLnB1c2gobmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpKTtcblxuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwib3V0cHV0RGlyZWN0b3J5XCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJzY2FmZm9sZFwiLCBcImFwcFNjYWZmb2xkXCIpKTtcbiAgICAgICAgICAgIGtleXMucHVzaChuZXcgUGlwZWxpbmVLZXkoXCJzY2FmZm9sZFwiLCBcInVuaXRUZXN0U2NhZmZvbGRcIikpO1xuICAgICAgICAgICAga2V5cy5wdXNoKG5ldyBQaXBlbGluZUtleShcInNjYWZmb2xkXCIsIFwiZTJlVGVzdFNjYWZmb2xkXCIpKTtcblxuICAgICAgICAgICAgY29uc3Qga2V5TWFwOiB7IFtpZDogc3RyaW5nXTogSVBpcGVsaW5lU3RlcCB9ID0ge307XG4gICAgICAgICAgICBjb25zdCBzdGVwczogSVBpcGVsaW5lU3RlcFtdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBrZXlzW2ldLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gb2JqLmdldFN0ZXAoa2V5c1tpXSk7XG4gICAgICAgICAgICAgICAgc3RlcHMucHVzaChzdGVwKTtcbiAgICAgICAgICAgICAgICBrZXlNYXBba2V5c1tpXS5jb21iaW5lZCgpXSA9IHN0ZXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5vcmRlckJ5SW5mbHVlbmNlKGtleU1hcCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQubWFwKHN0ZXAgPT4gc3RlcC5jb25zdHJ1Y3Rvci5uYW1lKSkudG8uYmUuZGVlcC5lcXVhbChbXG4gICAgICAgICAgICAgICAgXCJPdXRwdXREaXJlY3RvcnlcIixcbiAgICAgICAgICAgICAgICBcIkFzc2V0c1wiLFxuICAgICAgICAgICAgICAgIFwiVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uXCIsXG4gICAgICAgICAgICAgICAgXCJBcHBTY2FmZm9sZFwiLFxuICAgICAgICAgICAgICAgIFwiRTJlVGVzdFNjYWZmb2xkXCIsXG4gICAgICAgICAgICAgICAgXCJVbml0VGVzdFNjYWZmb2xkXCIsXG4gICAgICAgICAgICAgICAgXCJBbmd1bGFyXCIsXG4gICAgICAgICAgICAgICAgXCJBdXJlbGlhXCIsXG4gICAgICAgICAgICAgICAgXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgICAgIFwiUmVhY3RcIixcbiAgICAgICAgICAgICAgICBcIkJyb3dzZXJpZnlcIixcbiAgICAgICAgICAgICAgICBcIlJlcXVpcmVKc1wiLFxuICAgICAgICAgICAgICAgIFwiU3lzdGVtSnNCdWlsZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJXZWJwYWNrXCIsXG4gICAgICAgICAgICAgICAgXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgXCJQb3N0Q3NzXCIsXG4gICAgICAgICAgICAgICAgXCJDc3NcIixcbiAgICAgICAgICAgICAgICBcIkxlc3NcIixcbiAgICAgICAgICAgICAgICBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBcIlN0eWx1c1wiLFxuICAgICAgICAgICAgICAgIFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgXCJXZWJkcml2ZXJJb1wiLFxuICAgICAgICAgICAgICAgIFwiQW1kXCIsXG4gICAgICAgICAgICAgICAgXCJDb21tb25Kc1wiLFxuICAgICAgICAgICAgICAgIFwiU3lzdGVtSnNcIixcbiAgICAgICAgICAgICAgICBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBcIlR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBcIkVzTGludFwiLFxuICAgICAgICAgICAgICAgIFwiVHNMaW50XCIsXG4gICAgICAgICAgICAgICAgXCJOcG1cIixcbiAgICAgICAgICAgICAgICBcIllhcm5cIixcbiAgICAgICAgICAgICAgICBcIkVsZWN0cm9uXCIsXG4gICAgICAgICAgICAgICAgXCJXZWJcIixcbiAgICAgICAgICAgICAgICBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgXCJDaHJvbWVIZWFkbGVzc1wiLFxuICAgICAgICAgICAgICAgIFwiUGhhbnRvbUpzXCIsXG4gICAgICAgICAgICAgICAgXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIFwiVW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXNcIixcbiAgICAgICAgICAgICAgICBcIlVuaXRlQ29uZmlndXJhdGlvbkpzb25cIixcbiAgICAgICAgICAgICAgICBcIlJlYWRNZVwiLFxuICAgICAgICAgICAgICAgIFwiUGFja2FnZUpzb25cIixcbiAgICAgICAgICAgICAgICBcIkxpY2Vuc2VcIixcbiAgICAgICAgICAgICAgICBcIkh0bWxUZW1wbGF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiR2l0SWdub3JlXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
