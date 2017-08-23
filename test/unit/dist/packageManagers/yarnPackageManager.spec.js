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
 * Tests for YarnPackageManager.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const packageUtils_1 = require("../../../../dist/packageManagers/packageUtils");
const yarnPackageManager_1 = require("../../../../dist/packageManagers/yarnPackageManager");
describe("NpmPackageManager", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        fileSystemStub = {};
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    }));
    describe("info", () => {
        it("can throw an error for an unknown package", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").rejects("error");
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            try {
                yield obj.info("lkjdfglkjdfzsdf");
            }
            catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        }));
        it("can get the info for a package", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves(JSON.stringify({ version: "1.2.3", main: "index.js" }));
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            const res = yield obj.info("package");
            Chai.expect(stub.args[0][4]).to.contain("view");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--json");
            Chai.expect(stub.args[0][4]).to.contain("name");
            Chai.expect(stub.args[0][4]).to.contain("version");
            Chai.expect(stub.args[0][4]).to.contain("main");
            Chai.expect(res.version).to.be.equal("1.2.3");
            Chai.expect(res.main).to.be.equal("index.js");
        }));
    });
    describe("add", () => {
        it("can throw an error for an unknown package", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").rejects("error");
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            try {
                yield obj.add("/.", "lkjdfglkjdfzsdf", "1.2.3", true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        }));
        it("can add a dev package", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves();
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            const res = yield obj.add("/.", "package", "1.2.3", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        }));
        it("can add a prod package", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves();
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            const res = yield obj.add("/.", "package", "1.2.3", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("add");
            Chai.expect(stub.args[0][4]).to.contain("package@1.2.3");
        }));
    });
    describe("remove", () => {
        it("can throw an error for an unknown package", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").rejects("error");
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            try {
                yield obj.remove("/.", "lkjdfglkjdfzsdf", true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("error");
            }
        }));
        it("can remove a dev package", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves();
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            const res = yield obj.remove("/.", "package", true);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
            Chai.expect(stub.args[0][4]).to.contain("--dev");
        }));
        it("can remove a prod package", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves();
            const obj = new yarnPackageManager_1.YarnPackageManager(loggerStub, fileSystemStub);
            const res = yield obj.remove("/.", "package", false);
            Chai.expect(res).to.be.equal(undefined);
            Chai.expect(stub.args[0][4]).to.contain("remove");
            Chai.expect(stub.args[0][4]).to.contain("package");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBQzdFLDRGQUF5RjtBQUV6RixRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDMUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFFaEMsVUFBVSxDQUFDO1FBQ1AsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLGNBQWMsR0FBZ0IsRUFBRSxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDO1FBQ04sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNiLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELE1BQU0sR0FBRyxHQUFHLElBQUksdUNBQWtCLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFD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QUFPLENBQUMsSUFBSSxDQUFDLDJCQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDL0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoicGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlci5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgWWFyblBhY2thZ2VNYW5hZ2VyLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvcGFja2FnZU1hbmFnZXJzL3BhY2thZ2VVdGlsc1wiO1xuaW1wb3J0IHsgWWFyblBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvcGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlclwiO1xuXG5kZXNjcmliZShcIk5wbVBhY2thZ2VNYW5hZ2VyXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IDxJRmlsZVN5c3RlbT57fTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBZYXJuUGFja2FnZU1hbmFnZXIobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImluZm9cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiB0aHJvdyBhbiBlcnJvciBmb3IgYW4gdW5rbm93biBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKS5yZWplY3RzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgWWFyblBhY2thZ2VNYW5hZ2VyKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb2JqLmluZm8oXCJsa2pkZmdsa2pkZnpzZGZcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcImVycm9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgdGhlIGluZm8gZm9yIGEgcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlc29sdmVzKEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogXCIxLjIuM1wiLCBtYWluOiBcImluZGV4LmpzXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgWWFyblBhY2thZ2VNYW5hZ2VyKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbmZvKFwicGFja2FnZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHN0dWIuYXJnc1swXVs0XSkudG8uY29udGFpbihcInZpZXdcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChzdHViLmFyZ3NbMF1bNF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwiLS1qc29uXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwibmFtZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHN0dWIuYXJnc1swXVs0XSkudG8uY29udGFpbihcInZlcnNpb25cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChzdHViLmFyZ3NbMF1bNF0pLnRvLmNvbnRhaW4oXCJtYWluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMubWFpbikudG8uYmUuZXF1YWwoXCJpbmRleC5qc1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImFkZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIHRocm93IGFuIGVycm9yIGZvciBhbiB1bmtub3duIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBZYXJuUGFja2FnZU1hbmFnZXIobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBvYmouYWRkKFwiLy5cIiwgXCJsa2pkZmdsa2pkZnpzZGZcIiwgXCIxLjIuM1wiLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwiZXJyb3JcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGFkZCBhIGRldiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBZYXJuUGFja2FnZU1hbmFnZXIobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmFkZChcIi8uXCIsIFwicGFja2FnZVwiLCBcIjEuMi4zXCIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwiYWRkXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwicGFja2FnZUAxLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHN0dWIuYXJnc1swXVs0XSkudG8uY29udGFpbihcIi0tZGV2XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBhZGQgYSBwcm9kIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKS5yZXNvbHZlcygpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFlhcm5QYWNrYWdlTWFuYWdlcihsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouYWRkKFwiLy5cIiwgXCJwYWNrYWdlXCIsIFwiMS4yLjNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwiYWRkXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwicGFja2FnZUAxLjIuM1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJlbW92ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIHRocm93IGFuIGVycm9yIGZvciBhbiB1bmtub3duIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBZYXJuUGFja2FnZU1hbmFnZXIobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBvYmoucmVtb3ZlKFwiLy5cIiwgXCJsa2pkZmdsa2pkZnpzZGZcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcImVycm9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiByZW1vdmUgYSBkZXYgcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlc29sdmVzKCk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgWWFyblBhY2thZ2VNYW5hZ2VyKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5yZW1vdmUoXCIvLlwiLCBcInBhY2thZ2VcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChzdHViLmFyZ3NbMF1bNF0pLnRvLmNvbnRhaW4oXCJyZW1vdmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChzdHViLmFyZ3NbMF1bNF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwiLS1kZXZcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHJlbW92ZSBhIHByb2QgcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlc29sdmVzKCk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgWWFyblBhY2thZ2VNYW5hZ2VyKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5yZW1vdmUoXCIvLlwiLCBcInBhY2thZ2VcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwicmVtb3ZlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5hcmdzWzBdWzRdKS50by5jb250YWluKFwicGFja2FnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==