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
                obj.toggleClientPackage("package", { name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        }));
        it("can fail when peer dependencies does not contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.engineDependencies = peerDependencies;
            try {
                obj.toggleClientPackage("package", { name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            }
            catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        }));
        it("can get added as a dependency contain package", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: "**/*.css"
            }, true);
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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
            obj.toggleClientPackage("package", {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBRXpFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxrQkFBc0MsQ0FBQztJQUMzQyxJQUFJLHVCQUFpRCxDQUFDO0lBQ3RELElBQUksMEJBQW9ELENBQUM7SUFDekQsSUFBSSxnQkFBMEMsQ0FBQztJQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQzlDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDdkMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQzdCLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUyxFQUFFO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFF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QUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFTLEVBQUU7WUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDbEMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUNwQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUM7WUFDMUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUMsMEJBQTBCLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUM1QyxHQUFHLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lVmFyaWFibGVzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBFbmdpbmVWYXJpYWJsZXMuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZGVzY3JpYmUoXCJFbmdpbmVWYXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgcGFja2FnZUpzb25EZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBsZXQgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBsZXQgcGVlckRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0ge307XG4gICAgICAgIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIHBlZXJEZXBlbmRlbmNpZXMgPSB7fTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidG9nZ2xlQ2xpZW50UGFja2FnZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiB0aGVyZSBhcmUgbm8gcGVlciBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwgeyBuYW1lOiBcInBhY2thZ2VcIiwgbWFpbjogXCJtYWluLmpzXCIsIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLCBpbmNsdWRlTW9kZTogXCJhcHBcIiB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwibWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBlZXIgZGVwZW5kZW5jaWVzIGRvZXMgbm90IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHsgbmFtZTogXCJwYWNrYWdlXCIsIG1haW46IFwibWFpbi5qc1wiLCBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIiwgaW5jbHVkZU1vZGU6IFwiYXBwXCIgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIk1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGRlcGVuZGVuY3kgY29udGFpbiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCJtYWluLm1pbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnByZWxvYWQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmlzUGFja2FnZSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuYXNzZXRzKS50by5iZS5lcXVhbChcIioqLyouY3NzXCIpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgcmVtb3ZlZCBhcyBhIGRlcGVuZGVuY3kgY29udGFpbiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFuZCByZW1vdmVkIGFzIGEgZGVwZW5kZW5jeSBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCJtYWluLm1pbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnByZWxvYWQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmlzUGFja2FnZSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuYXNzZXRzKS50by5iZS5lcXVhbChcIioqLyouY3NzXCIpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidG9nZ2xlRGV2RGVwZW5kZW5jeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiB0aGVyZSBhcmUgbm8gcGVlciBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwibWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBlZXIgZGVwZW5kZW5jaWVzIGRvZXMgbm90IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIk1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBhZGRpbmcgYSBkZXYgZGVwZW5kZW5jeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBhZGRpbmcgYSBkZXYgZGVwZW5kZW5jeSB0d2ljZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIHJlbW92aW5nIGEgZGV2IGRlcGVuZGVuY3lcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgZmFsc2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJidWlsZERlcGVuZGVuY2llc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGdldCByZW1vdmVkIGZyb20gZXhpc3RpbmcgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJibGFoXCI7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGFwcCBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBcIioqLyouY3NzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGFwcCBwYWNrYWdlIGFuZCByZW1vdmVkIGZyb20gZGV2IGlmIGl0IGV4aXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogXCIqKi8qLmNzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIHRlc3QgcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcInRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBub3QgbG9va3VwIHZlcnNpb24gaWYgc3VwcGxpZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIl42LjcuOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcInRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFwiKiovKi5jc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl42LjcuOFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImJ1aWxkRGV2RGVwZW5kZW5jaWVzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IHJlbW92ZWQgZnJvbSBleGlzdGluZyBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgZmFsc2UpO1xuICAgICAgICAgICAgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiYmxhaFwiO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
