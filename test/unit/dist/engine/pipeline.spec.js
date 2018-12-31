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
    constructor() {
        super();
        this.initFail = 0;
        this.configureFail = 0;
        this.finaliseFail = 0;
    }
    mainCondition(uniteConfiguration, engineVariables) {
        return this.mainCond;
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initFail === 2) {
                throw (new Error("error!"));
            }
            return this.initFail;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configureFail === 2) {
                throw (new Error("error!"));
            }
            return this.configureFail;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.finaliseFail === 2) {
                throw (new Error("error!"));
            }
            return this.finaliseFail;
        });
    }
}
describe("Pipeline", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let uniteConfigurationStub;
    let engineVariablesStub;
    let loggerErrorSpy;
    let modulePath;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.createSandbox();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemStub = new fileSystem_mock_1.FileSystemMock();
        modulePath = fileSystemStub.pathAbsolute("./test/unit/dist/mocks");
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
            testStep.initFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step initialise throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step initialise", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step configure mainCondition true fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step configure mainCondition true throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step configuremainCondition true ", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step configure mainCondition false fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step configure mainCondition false throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step configure mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step finalise mainCondition false true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step finalise mainCondition true throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step finalise mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step finalise mainCondition false fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step finalise mainCondition false throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with step mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, true);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with step mainCondition true no logging", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with no steps and mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with no steps and mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
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
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBQ3pFLDhEQUEyRDtBQUMzRCxvRUFBaUU7QUFDakUsOEVBQTJFO0FBQzNFLHdEQUFvRDtBQUVwRCxNQUFNLFFBQVMsU0FBUSxtQ0FBZ0I7SUFNbkM7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFTSxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDOUosSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRTtnQkFDckIsTUFBSyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDOUI7WUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzdKLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLE1BQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUVZLFFB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QUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDbkcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBUyxFQUFFO1lBQ3pELE1BQU0sR0FBRyxHQUFHLElBQUksbUJBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgUGlwZWxpbmUuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvZW5naW5lL3BpcGVsaW5lXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmNsYXNzIFRlc3RTdGVwIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIG1haW5Db25kOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIHB1YmxpYyBpbml0RmFpbDogbnVtYmVyO1xuICAgIHB1YmxpYyBjb25maWd1cmVGYWlsOiBudW1iZXI7XG4gICAgcHVibGljIGZpbmFsaXNlRmFpbDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdEZhaWwgPSAwO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyZUZhaWwgPSAwO1xuICAgICAgICB0aGlzLmZpbmFsaXNlRmFpbCA9IDA7XG4gICAgfVxuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLm1haW5Db25kO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh0aGlzLmluaXRGYWlsID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyhuZXcgRXJyb3IoXCJlcnJvciFcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmluaXRGYWlsO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJlRmFpbCA9PT0gMikge1xuICAgICAgICAgICAgdGhyb3cobmV3IEVycm9yKFwiZXJyb3IhXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmVGYWlsO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodGhpcy5maW5hbGlzZUZhaWwgPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93KG5ldyBFcnJvcihcImVycm9yIVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpc2VGYWlsO1xuICAgIH1cbn1cblxuZGVzY3JpYmUoXCJQaXBlbGluZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBhbnk7XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBtb2R1bGVQYXRoOiBzdHJpbmc7XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLmNyZWF0ZVNhbmRib3goKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgbG9nZ2VyRXJyb3JTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImVycm9yXCIpO1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG5cbiAgICAgICAgbW9kdWxlUGF0aCA9IGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZShcIi4vdGVzdC91bml0L2Rpc3QvbW9ja3NcIik7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1YiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYWRkXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYWRkIGEgcGlwZWxpbmUgc3RlcFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImNhdDFcIiwgXCJrZXkxXCIpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicnVuXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gcnVuIGEgcGlwZWxpbmUgd2l0aCBubyBzdGVwc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHJ1biBhIHBpcGVsaW5lIHdpdGggbm9uIGV4aXN0aW5nIHN0ZXBcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJjYXQxXCIsIFwia2V5MVwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbnMoXCJjb3VsZCBub3QgYmUgbG9jYXRlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gcnVuIGEgcGlwZWxpbmUgd2l0aCBleGlzdGluZyBzdGVwXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgaW5pdGlhbGlzZSBmYWlsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuaW5pdEZhaWwgPSAxO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBpbml0aWFsaXNlIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbml0RmFpbCA9IDI7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBzdGVwIGluaXRpYWxpc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbml0RmFpbCA9IDA7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGNvbmZpZ3VyZSBtYWluQ29uZGl0aW9uIHRydWUgZmFpbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmNvbmZpZ3VyZUZhaWwgPSAxO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBjb25maWd1cmUgbWFpbkNvbmRpdGlvbiB0cnVlIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5jb25maWd1cmVGYWlsID0gMjtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgY29uZmlndXJlbWFpbkNvbmRpdGlvbiB0cnVlIFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmNvbmZpZ3VyZUZhaWwgPSAwO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBjb25maWd1cmUgbWFpbkNvbmRpdGlvbiBmYWxzZSBmYWlsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuY29uZmlndXJlRmFpbCA9IDE7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBjb25maWd1cmUgbWFpbkNvbmRpdGlvbiBmYWxzZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuY29uZmlndXJlRmFpbCA9IDI7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggc3RlcCBjb25maWd1cmUgbWFpbkNvbmRpdGlvbiBmYWxzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmNvbmZpZ3VyZUZhaWwgPSAwO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2UgbWFpbkNvbmRpdGlvbiBmYWxzZSB0cnVlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2UgbWFpbkNvbmRpdGlvbiB0cnVlIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAyO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggc3RlcCBmaW5hbGlzZSBtYWluQ29uZGl0aW9uIHRydWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAwO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBmaW5hbGlzZSBtYWluQ29uZGl0aW9uIGZhbHNlIGZhaWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAxO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2UgbWFpbkNvbmRpdGlvbiBmYWxzZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMjtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBzdGVwIG1haW5Db25kaXRpb24gZmFsc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAwO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgbWFpbkNvbmRpdGlvbiB0cnVlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMDtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gdHJ1ZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggc3RlcCBtYWluQ29uZGl0aW9uIHRydWUgbm8gbG9nZ2luZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmZpbmFsaXNlRmFpbCA9IDA7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IHRydWU7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBubyBzdGVwcyBhbmQgbWFpbkNvbmRpdGlvbiBmYWxzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBbXSwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIG5vIHN0ZXBzIGFuZCBtYWluQ29uZGl0aW9uIHRydWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IHRydWU7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBbXSwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImdldFN0ZXBcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHRvIGdldCBhIHN0ZXAgd2l0aCBubyBrZXlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aXRoIG5vIGNhdGVnb3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkodW5kZWZpbmVkLCB1bmRlZmluZWQpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB0byBnZXQgYSBzdGVwIHdpdGggbm8ga2V5IHByb3BlcnR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkoXCJjYXRcIiwgdW5kZWZpbmVkKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aGVuIGl0IGhhcyBub3QgYmVlbiBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleShcImNhdFwiLCBcImtleVwiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGdldCBhIHN0ZXAgd2hlbiBpdCBoYXMgYmVlbiBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkubm90LnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJ0cnlMb2FkXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGtleVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8ga2V5IHByb3BlcnR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgdW5kZWZpbmVkKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwic2hvdWxkIG5vdCBiZSBibGFua1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vdCBleGlzdGluZyBtb2R1bGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImJsYWhcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWlucyhcImNvdWxkIG5vdCBiZSBsb2NhdGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggZmlsZSBzeXN0ZW0gZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkucmVqZWN0cyhcImthYm9vbVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJibGFoXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbnMoXCJmYWlsZWQgdG8gbG9hZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIGV4aXN0aW5nIG1vZHVsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIG1vZHVsZSBhbHJlYWR5IGxvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIGFsaWFzZWQgY29uZmlndXJhdGlvbiB0eXBlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSwgXCJvdGhlckVuZ2luZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLm90aGVyRW5naW5lKS50by5iZS5lcXVhbChcIkR1bW15U3RlcFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
