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
        this.uninstallFail = 0;
        this.installFail = 0;
        this.finaliseFail = 0;
    }
    mainCondition(uniteConfiguration, engineVariables) {
        return this.mainCond;
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initFail === 2) {
                throw (new Error("error!"));
            }
            return this.initFail;
        });
    }
    install(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.installFail === 2) {
                throw (new Error("error!"));
            }
            return this.installFail;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.finaliseFail === 2) {
                throw (new Error("error!"));
            }
            return this.finaliseFail;
        });
    }
    uninstall(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.uninstallFail === 2) {
                throw (new Error("error!"));
            }
            return this.uninstallFail;
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
        it("can fail pipeline with step uninstall fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            testStep.uninstallFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step uninstall throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            testStep.uninstallFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step uninstall", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            testStep.uninstallFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
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
        it("can fail pipeline with step install fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.installFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step install throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.installFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step install", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.installFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step finalise fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step finalise throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step finalise", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix1R0FBb0c7QUFDcEcsNkVBQTBFO0FBQzFFLCtEQUE0RDtBQUM1RCxxRUFBa0U7QUFDbEUsK0VBQTRFO0FBRTVFLHdEQUFvRDtBQUVwRCxjQUFlLFNBQVEsbUNBQWdCO0lBT25DO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRU0sYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3RJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBSyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMs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QUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQaXBlbGluZS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9pbnRlcmZhY2VzL0lQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5jbGFzcyBUZXN0U3RlcCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBtYWluQ29uZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgaW5pdEZhaWw6IG51bWJlcjtcbiAgICBwdWJsaWMgdW5pbnN0YWxsRmFpbDogbnVtYmVyO1xuICAgIHB1YmxpYyBpbnN0YWxsRmFpbDogbnVtYmVyO1xuICAgIHB1YmxpYyBmaW5hbGlzZUZhaWw6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmluaXRGYWlsID0gMDtcbiAgICAgICAgdGhpcy51bmluc3RhbGxGYWlsID0gMDtcbiAgICAgICAgdGhpcy5pbnN0YWxsRmFpbCA9IDA7XG4gICAgICAgIHRoaXMuZmluYWxpc2VGYWlsID0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFpbkNvbmQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdEZhaWwgPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93KG5ldyBFcnJvcihcImVycm9yIVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdEZhaWw7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluc3RhbGwobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFsbEZhaWwgPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93KG5ldyBFcnJvcihcImVycm9yIVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbEZhaWw7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXNlRmFpbCA9PT0gMikge1xuICAgICAgICAgICAgdGhyb3cobmV3IEVycm9yKFwiZXJyb3IhXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maW5hbGlzZUZhaWw7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHVuaW5zdGFsbChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodGhpcy51bmluc3RhbGxGYWlsID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyhuZXcgRXJyb3IoXCJlcnJvciFcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnVuaW5zdGFsbEZhaWw7XG4gICAgfVxufVxuXG5kZXNjcmliZShcIlBpcGVsaW5lXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG4gICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvblN0dWI6IGFueTtcbiAgICBsZXQgZW5naW5lVmFyaWFibGVzU3R1YjogRW5naW5lVmFyaWFibGVzO1xuICAgIGxldCBsb2dnZXJJbmZvU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBtb2R1bGVQYXRoOiBzdHJpbmc7XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIG1vZHVsZVBhdGggPSBmaWxlU3lzdGVtU3R1Yi5wYXRoQWJzb2x1dGUoXCIuL3Rlc3QvdW5pdC9kaXN0XCIpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIgPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImFkZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGFkZCBhIHBpcGVsaW5lIHN0ZXBcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJjYXQxXCIsIFwia2V5MVwiKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIHJ1biBhIHBpcGVsaW5lIHdpdGggbm8gc3RlcHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBydW4gYSBwaXBlbGluZSB3aXRoIG5vbiBleGlzdGluZyBzdGVwXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiY2F0MVwiLCBcImtleTFcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwiY291bGQgbm90IGJlIGxvY2F0ZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHJ1biBhIHBpcGVsaW5lIHdpdGggZXhpc3Rpbmcgc3RlcFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIHVuaW5zdGFsbCBmYWlsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRlc3RTdGVwLnVuaW5zdGFsbEZhaWwgPSAxO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCB1bmluc3RhbGwgdGhyb3dzIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICB0ZXN0U3RlcC51bmluc3RhbGxGYWlsID0gMjtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgdW5pbnN0YWxsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRlc3RTdGVwLnVuaW5zdGFsbEZhaWwgPSAwO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBpbml0aWFsaXNlIGZhaWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbml0RmFpbCA9IDE7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGluaXRpYWxpc2UgdGhyb3dzIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmluaXRGYWlsID0gMjtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgaW5pdGlhbGlzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmluaXRGYWlsID0gMDtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgaW5zdGFsbCBmYWlsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuaW5zdGFsbEZhaWwgPSAxO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBpbnN0YWxsIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbnN0YWxsRmFpbCA9IDI7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBzdGVwIGluc3RhbGxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5pbnN0YWxsRmFpbCA9IDA7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGZpbmFsaXNlIGZhaWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAxO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBmaW5hbGlzZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMjtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAwO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZ2V0U3RlcFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aXRoIG5vIGtleVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLmdldFN0ZXAodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB0byBnZXQgYSBzdGVwIHdpdGggbm8gY2F0ZWdvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHRvIGdldCBhIHN0ZXAgd2l0aCBubyBrZXkgcHJvcGVydHlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IG9iai5nZXRTdGVwKG5ldyBQaXBlbGluZUtleShcImNhdFwiLCB1bmRlZmluZWQpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB0byBnZXQgYSBzdGVwIHdoZW4gaXQgaGFzIG5vdCBiZWVuIGxvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLmdldFN0ZXAobmV3IFBpcGVsaW5lS2V5KFwiY2F0XCIsIFwia2V5XCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IGEgc3RlcCB3aGVuIGl0IGhhcyBiZWVuIGxvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLmdldFN0ZXAobmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS5ub3QudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRyeUxvYWRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8ga2V5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBrZXkgcHJvcGVydHlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCB1bmRlZmluZWQpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbnMoXCJzaG91bGQgbm90IGJlIGJsYW5rXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm90IGV4aXN0aW5nIG1vZHVsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiYmxhaFwiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwiY291bGQgbm90IGJlIGxvY2F0ZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBmaWxlIHN5c3RlbSBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZmlsZVN5c3RlbVN0dWIuZGlyZWN0b3J5R2V0RmlsZXMgPSBzYW5kYm94LnN0dWIoKS5yZWplY3RzKFwia2Fib29tXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImJsYWhcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWlucyhcImZhaWxlZCB0byBsb2FkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggZXhpc3RpbmcgbW9kdWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lbmdpbmUpLnRvLmJlLmVxdWFsKFwiRHVtbXlTdGVwXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gbW9kdWxlIGFscmVhZHkgbG9hZGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lbmdpbmUpLnRvLmJlLmVxdWFsKFwiRHVtbXlTdGVwXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggYWxpYXNlZCBjb25maWd1cmF0aW9uIHR5cGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpLCBcIm90aGVyRW5naW5lXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIub3RoZXJFbmdpbmUpLnRvLmJlLmVxdWFsKFwiRHVtbXlTdGVwXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
