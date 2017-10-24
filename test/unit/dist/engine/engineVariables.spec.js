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
 * Tests for EngineVariables.
 */
const Chai = require("chai");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
describe("EngineVariables", () => {
    let uniteConfiguration;
    let packageJsonDependencies;
    let packageJsonDevDependencies;
    let peerDependencies;
    beforeEach(() => {
        uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
        uniteConfiguration.clientPackages = {};
        packageJsonDependencies = {};
        packageJsonDevDependencies = {};
        peerDependencies = {};
    });
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new engineVariables_1.EngineVariables();
        Chai.should().exist(obj);
    }));
    describe("toggleClientPackage", () => {
        it("can fail when there are no peer dependencies", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            try {
                obj.toggleClientPackage({ name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        }));
        it("can fail when peer dependencies does not contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.engineDependencies = peerDependencies;
            try {
                obj.toggleClientPackage({ name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        }));
        it("can get added as a dependency contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.mainMinified).to.be.equal("main.min.js");
            Chai.expect(uniteConfiguration.clientPackages.package.includeMode).to.be.equal("app");
            Chai.expect(uniteConfiguration.clientPackages.package.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteConfiguration.clientPackages.package.preload).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.isPackage).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.equal("**/*.css");
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        }));
        it("can get removed as a dependency contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        }));
        it("can get added and removed as a dependency contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.mainMinified).to.be.equal("main.min.js");
            Chai.expect(uniteConfiguration.clientPackages.package.includeMode).to.be.equal("app");
            Chai.expect(uniteConfiguration.clientPackages.package.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteConfiguration.clientPackages.package.preload).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.isPackage).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.equal("**/*.css");
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        }));
    });
    describe("toggleDevDependency", () => {
        it("can fail when there are no peer dependencies", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            try {
                obj.toggleDevDependency(["package"], true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        }));
        it("can fail when peer dependencies does not contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.engineDependencies = peerDependencies;
            try {
                obj.toggleDevDependency(["package"], true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        }));
        it("can succeed when adding a dev dependency", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        }));
        it("can succeed when adding a dev dependency twice", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        }));
        it("can succeed when removing a dev dependency", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        }));
    });
    describe("buildDependencies", () => {
        it("can get removed from existing dependencies", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, false);
            packageJsonDependencies.package = "blah";
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(packageJsonDependencies.package);
        }));
        it("can get added as a app package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
        }));
        it("can get added as a app package and removed from dev if it exists", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        }));
        it("can get added as a test package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "test",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
        }));
        it("can not lookup version if supplied", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.toggleClientPackage({
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                version: "^6.7.8",
                preload: false,
                includeMode: "test",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^6.7.8");
        }));
    });
    describe("buildDevDependencies", () => {
        it("can get removed from existing dependencies", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
            packageJsonDevDependencies.package = "blah";
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBRXpFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxrQkFBc0MsQ0FBQztJQUMzQyxJQUFJLHVCQUFpRCxDQUFDO0lBQ3RELElBQUksMEJBQW9ELENBQUM7SUFDekQsSUFBSSxnQkFBMEMsQ0FBQztJQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQzlDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDdkMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQzdCLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUyxFQUFFO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFF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QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekYsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBUyxFQUFFO1lBQ3hELE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQ2xDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDcEMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDO1lBQzFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLDBCQUEwQixDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDNUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgRW5naW5lVmFyaWFibGVzLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmRlc2NyaWJlKFwiRW5naW5lVmFyaWFibGVzXCIsICgpID0+IHtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgbGV0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgbGV0IHBlZXJEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHt9O1xuICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICBwZWVyRGVwZW5kZW5jaWVzID0ge307XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRvZ2dsZUNsaWVudFBhY2thZ2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gdGhlcmUgYXJlIG5vIHBlZXIgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoeyBuYW1lOiBcInBhY2thZ2VcIiwgbWFpbjogXCJtYWluLmpzXCIsIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLCBpbmNsdWRlTW9kZTogXCJhcHBcIiB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwibWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBlZXIgZGVwZW5kZW5jaWVzIGRvZXMgbm90IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoeyBuYW1lOiBcInBhY2thZ2VcIiwgbWFpbjogXCJtYWluLmpzXCIsIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLCBpbmNsdWRlTW9kZTogXCJhcHBcIiB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwiTWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFzIGEgZGVwZW5kZW5jeSBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogXCIqKi8qLmNzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwibWFpbi5taW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJub25lXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5wcmVsb2FkKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pc1BhY2thZ2UpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmFzc2V0cykudG8uYmUuZXF1YWwoXCIqKi8qLmNzc1wiKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IHJlbW92ZWQgYXMgYSBkZXBlbmRlbmN5IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFuZCByZW1vdmVkIGFzIGEgZGVwZW5kZW5jeSBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogXCIqKi8qLmNzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwibWFpbi5taW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJub25lXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5wcmVsb2FkKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pc1BhY2thZ2UpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmFzc2V0cykudG8uYmUuZXF1YWwoXCIqKi8qLmNzc1wiKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRvZ2dsZURldkRlcGVuZGVuY3lcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gdGhlcmUgYXJlIG5vIHBlZXIgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIm1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwZWVyIGRlcGVuZGVuY2llcyBkb2VzIG5vdCBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLm1lc3NhZ2UpLnRvLmNvbnRhaW4oXCJNaXNzaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gYWRkaW5nIGEgZGV2IGRlcGVuZGVuY3lcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gYWRkaW5nIGEgZGV2IGRlcGVuZGVuY3kgdHdpY2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiByZW1vdmluZyBhIGRldiBkZXBlbmRlbmN5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYnVpbGREZXBlbmRlbmNpZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBnZXQgcmVtb3ZlZCBmcm9tIGV4aXN0aW5nIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJibGFoXCI7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGFwcCBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFzIGEgYXBwIHBhY2thZ2UgYW5kIHJlbW92ZWQgZnJvbSBkZXYgaWYgaXQgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdChcImNhbiBnZXQgYWRkZWQgYXMgYSB0ZXN0IHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcInRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBub3QgbG9va3VwIHZlcnNpb24gaWYgc3VwcGxpZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiXjYuNy44XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwidGVzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogXCIqKi8qLmNzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjYuNy44XCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYnVpbGREZXZEZXBlbmRlbmNpZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBnZXQgcmVtb3ZlZCBmcm9tIGV4aXN0aW5nIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCBmYWxzZSk7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJibGFoXCI7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
