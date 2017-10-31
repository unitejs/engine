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
 * Tests for Engine Command Base.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineCommandBase_1 = require("../../../../dist/engine/engineCommandBase");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
class TestCommand extends engineCommandBase_1.EngineCommandBase {
    testLoadConfiguration(outputDirectory, profileSource, profile, force) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadConfiguration").call(this, outputDirectory, profileSource, profile, force);
        });
    }
    testLoadProfile(profileSource, profile) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadProfile").call(this, profileSource, profile);
        });
    }
    testCreateEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        return super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
    }
    testMapParser(input) {
        return super.mapParser(input);
    }
    testMapFromArrayParser(input) {
        return super.mapFromArrayParser(input);
    }
}
describe("EngineCommandBase", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => {
        const obj = new TestCommand();
        Chai.should().exist(obj);
    });
    describe("create", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            const res = obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
    });
    describe("loadConfiguration", () => {
        it("can be called with no existing config", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with exception loading config", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with force", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, true);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with existing config and no packages", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred" });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred" });
        }));
        it("can be called with existing config and packages with no assets", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: {} } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: {} } });
        }));
        it("can be called with existing config with new assets format", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: { assets: ["a", "b", "c"] } } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: { assets: ["a", "b", "c"] } } });
        }));
        it("can be called with existing config with old assets format", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred", clientPackages: { package: { assets: "a,b,c" } } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred", clientPackages: { package: { assets: ["a", "b", "c"] } } });
        }));
    });
    describe("loadProfile", () => {
        it("can be called with parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with non existing profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with exception loading profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with no profiles", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({});
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with unknown profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ myProfile: {} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with known profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ testProfile: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        }));
        it("can be called with known profile mismatched case", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ TESTPROFILE: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        }));
    });
    describe("createEngineVariables", () => {
        it("can be called with parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariables = new engineVariables_1.EngineVariables();
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            obj.testCreateEngineVariables(undefined, uniteConfiguration, engineVariables);
            Chai.expect(engineVariables.force).to.be.equal(false);
        }));
    });
    describe("mapParser", () => {
        it("can be called with no parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapParser(["khjlkjlk"]);
            }
            catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(["a=1", "b=2"]);
            Chai.expect(res).to.be.deep.equal({ a: "1", b: "2" });
        }));
    });
    describe("mapFromArrayParser", () => {
        it("can be called with no parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapFromArrayParser(["khjlkjlk"]);
            }
            catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(["a", "b"]);
            Chai.expect(res).to.be.deep.equal({ a: "b" });
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixzR0FBbUc7QUFDbkcsZ0ZBQTZFO0FBQzdFLDRFQUF5RTtBQUN6RSx3RUFBb0U7QUFFcEUsaUJBQWtCLFNBQVEscUNBQWlCO0lBQzFCLHFCQUFxQixDQUFDLGVBQXVCLEVBQUUsYUFBcUIsRUFBRSxPQUFrQyxFQUFFLEtBQWM7OztZQUNqSSxNQUFNLENBQUMsMkJBQXVCLFlBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ25GLENBQUM7S0FBQTtJQUVZLGVBQWUsQ0FBSSxhQUFxQixFQUFFLE9BQWtDOzs7WUFDckYsTUFBTSxDQUFDLHFCQUFpQixZQUFJLGFBQWEsRUFBRSxPQUFPLEVBQUU7UUFDeEQsQ0FBQztLQUFBO0lBRU0seUJBQXlCLENBQUMsZUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQztRQUM5SCxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRU0sYUFBYSxDQUFDLEtBQWU7UUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLHNCQUFzQixDQUFDLEtBQWU7UUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFFRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFH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R0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lQ29tbWFuZEJhc2Uuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEVuZ2luZSBDb21tYW5kIEJhc2UuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lQ29tbWFuZEJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmNsYXNzIFRlc3RDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyB0ZXN0TG9hZENvbmZpZ3VyYXRpb24ob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPFVuaXRlQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmxvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeSwgcHJvZmlsZVNvdXJjZSwgcHJvZmlsZSwgZm9yY2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyB0ZXN0TG9hZFByb2ZpbGU8VD4ocHJvZmlsZVNvdXJjZTogc3RyaW5nLCBwcm9maWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkIHwgbnVsbD4ge1xuICAgICAgICByZXR1cm4gc3VwZXIubG9hZFByb2ZpbGU8VD4ocHJvZmlsZVNvdXJjZSwgcHJvZmlsZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRlc3RDcmVhdGVFbmdpbmVWYXJpYWJsZXMob3V0cHV0RGlyZWN0b3J5OiBzdHJpbmcsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0ZXN0TWFwUGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIHJldHVybiBzdXBlci5tYXBQYXJzZXIoaW5wdXQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0ZXN0TWFwRnJvbUFycmF5UGFyc2VyKGlucHV0OiBzdHJpbmdbXSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIHJldHVybiBzdXBlci5tYXBGcm9tQXJyYXlQYXJzZXIoaW5wdXQpO1xuICAgIH1cbn1cblxuZGVzY3JpYmUoXCJFbmdpbmVDb21tYW5kQmFzZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjcmVhdGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImxvYWRDb25maWd1cmF0aW9uXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gZXhpc3RpbmcgY29uZmlnXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhjZXB0aW9uIGxvYWRpbmcgY29uZmlnXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGZvcmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBjb25maWcgYW5kIG5vIHBhY2thZ2VzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKS5yZXNvbHZlcyh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgY29uZmlnIGFuZCBwYWNrYWdlcyB3aXRoIG5vIGFzc2V0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIikucmVzb2x2ZXMoeyBwYWNrYWdlTmFtZTogXCJmcmVkXCIsIGNsaWVudFBhY2thZ2VzOiB7IHBhY2thZ2U6IHt9fSB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiwgY2xpZW50UGFja2FnZXM6IHsgcGFja2FnZToge319IH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBjb25maWcgd2l0aCBuZXcgYXNzZXRzIGZvcm1hdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIikucmVzb2x2ZXMoeyBwYWNrYWdlTmFtZTogXCJmcmVkXCIsIGNsaWVudFBhY2thZ2VzOiB7IHBhY2thZ2U6IHthc3NldHM6IFtcImFcIiwgXCJiXCIsIFwiY1wiXX19IH0pO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai50ZXN0TG9hZENvbmZpZ3VyYXRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHsgcGFja2FnZU5hbWU6IFwiZnJlZFwiLCBjbGllbnRQYWNrYWdlczogeyBwYWNrYWdlOiB7YXNzZXRzOiBbXCJhXCIsIFwiYlwiLCBcImNcIl19fSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgY29uZmlnIHdpdGggb2xkIGFzc2V0cyBmb3JtYXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVzb2x2ZXModHJ1ZSk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpLnJlc29sdmVzKHsgcGFja2FnZU5hbWU6IFwiZnJlZFwiLCBjbGllbnRQYWNrYWdlczogeyBwYWNrYWdlOiB7YXNzZXRzOiBcImEsYixjXCJ9fSB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiwgY2xpZW50UGFja2FnZXM6IHsgcGFja2FnZTogeyBhc3NldHM6IFtcImFcIiwgXCJiXCIsIFwiY1wiXX19IH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibG9hZFByb2ZpbGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRQcm9maWxlKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVzb2x2ZXMoZmFsc2UpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai50ZXN0TG9hZFByb2ZpbGUoXCJjb25maWd1cmVcIiwgXCJ0ZXN0UHJvZmlsZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhjZXB0aW9uIGxvYWRpbmcgcHJvZmlsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZWplY3RzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZShcImNvbmZpZ3VyZVwiLCBcInRlc3RQcm9maWxlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gcHJvZmlsZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVzb2x2ZXModHJ1ZSk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpLnJlc29sdmVzKHt9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRQcm9maWxlKFwiY29uZmlndXJlXCIsIFwidGVzdFByb2ZpbGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmtub3duIHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVzb2x2ZXModHJ1ZSk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpLnJlc29sdmVzKHsgbXlQcm9maWxlOiB7fSB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRQcm9maWxlKFwiY29uZmlndXJlXCIsIFwidGVzdFByb2ZpbGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBrbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKS5yZXNvbHZlcyh7IHRlc3RQcm9maWxlOiB7IGE6IDEgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRQcm9maWxlKFwiY29uZmlndXJlXCIsIFwidGVzdFByb2ZpbGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoeyBhOiAxIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBrbm93biBwcm9maWxlIG1pc21hdGNoZWQgY2FzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIikucmVzb2x2ZXMoeyBURVNUUFJPRklMRTogeyBhOiAxIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZShcImNvbmZpZ3VyZVwiLCBcInRlc3RQcm9maWxlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHsgYTogMSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNyZWF0ZUVuZ2luZVZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhcmFtZXRlcnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGVuZ2luZVZhcmlhYmxlcyA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgICAgIG9iai50ZXN0Q3JlYXRlRW5naW5lVmFyaWFibGVzKHVuZGVmaW5lZCwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzLmZvcmNlKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJtYXBQYXJzZXJcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBubyBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudGVzdE1hcFBhcnNlcih1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBicm9rZW4gaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRlc3RNYXBQYXJzZXIoW1wia2hqbGtqbGtcIl0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLnRvU3RyaW5nKCkpLnRvLmNvbnRhaW4oXCJub3QgZm9ybWVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBicm9rZW4gaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai50ZXN0TWFwUGFyc2VyKFtcImE9MVwiLCBcImI9MlwiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoeyBhOiBcIjFcIiwgYjogXCIyXCIgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJtYXBGcm9tQXJyYXlQYXJzZXJcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBubyBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudGVzdE1hcEZyb21BcnJheVBhcnNlcih1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBicm9rZW4gaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRlc3RNYXBGcm9tQXJyYXlQYXJzZXIoW1wia2hqbGtqbGtcIl0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLnRvU3RyaW5nKCkpLnRvLmNvbnRhaW4oXCJub3QgZm9ybWVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBicm9rZW4gaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai50ZXN0TWFwRnJvbUFycmF5UGFyc2VyKFtcImFcIiwgXCJiXCJdKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IGE6IFwiYlwiIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
