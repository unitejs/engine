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
                assets: ["**/*.css"]
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
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.deep.equal(["**/*.css"]);
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
                assets: ["**/*.css"]
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
                assets: ["**/*.css"]
            }, true);
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                mainMinified: "main.min.js",
                preload: false,
                includeMode: "app",
                scriptIncludeMode: "none",
                isPackage: false,
                assets: ["**/*.css"]
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
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.deep.equal(["**/*.css"]);
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
        it("can succeed when removing a dev dependency that already exists exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
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
                assets: ["**/*.css"]
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
                assets: ["**/*.css"]
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
                assets: ["**/*.css"]
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
                assets: ["**/*.css"]
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
                assets: ["**/*.css"]
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^6.7.8");
        }));
        it("can retain package details if client package hasOverrides set", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.initialisePackages({ package: {
                    name: "package",
                    main: "mainOverride.js",
                    version: "9.9.9",
                    hasOverrides: true
                } });
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                version: "^6.7.8"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("mainOverride.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("9.9.9");
        }));
        it("can retain package details if client package hasOverrides empty", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.initialisePackages({ package: {
                    name: "package",
                    main: "mainOverride.js",
                    version: "9.9.9"
                } });
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                version: "^6.7.8"
            }, true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^6.7.8");
        }));
        it("can not remove package if client package hasOverrides set", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.initialisePackages({ package: {
                    name: "package",
                    main: "mainOverride.js",
                    version: "9.9.9",
                    hasOverrides: true
                } });
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                version: "^6.7.8"
            }, false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("mainOverride.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("9.9.9");
        }));
        it("can remove package if client package hasOverrides empty", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engineVariables_1.EngineVariables();
            obj.initialisePackages({ package: {
                    name: "package",
                    main: "mainOverride.js",
                    version: "9.9.9"
                } });
            obj.toggleClientPackage("package", {
                name: "package",
                main: "main.js",
                version: "^6.7.8"
            }, false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBRXpFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxrQkFBc0MsQ0FBQztJQUMzQyxJQUFJLHVCQUFpRCxDQUFDO0lBQ3RELElBQUksMEJBQW9ELENBQUM7SUFDekQsSUFBSSxnQkFBMEMsQ0FBQztJQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQzlDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDdkMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQzdCLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUyxFQUFFO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUNsQyxJQUFJO2dCQUNBLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxXQUFX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QUMsT0FBTyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBUyxFQUFFO1lBQ3hELE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQ2xDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDcEMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDO1lBQzFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLDBCQUEwQixDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDNUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgRW5naW5lVmFyaWFibGVzLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmRlc2NyaWJlKFwiRW5naW5lVmFyaWFibGVzXCIsICgpID0+IHtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgbGV0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgbGV0IHBlZXJEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24gPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyA9IHt9O1xuICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICBwZWVyRGVwZW5kZW5jaWVzID0ge307XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRvZ2dsZUNsaWVudFBhY2thZ2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gdGhlcmUgYXJlIG5vIHBlZXIgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHsgbmFtZTogXCJwYWNrYWdlXCIsIG1haW46IFwibWFpbi5qc1wiLCBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIiwgaW5jbHVkZU1vZGU6IFwiYXBwXCIgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIm1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwZWVyIGRlcGVuZGVuY2llcyBkb2VzIG5vdCBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7IG5hbWU6IFwicGFja2FnZVwiLCBtYWluOiBcIm1haW4uanNcIiwgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsIGluY2x1ZGVNb2RlOiBcImFwcFwiIH0sIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLm1lc3NhZ2UpLnRvLmNvbnRhaW4oXCJNaXNzaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgYWRkZWQgYXMgYSBkZXBlbmRlbmN5IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCJtYWluLm1pbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnByZWxvYWQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmlzUGFja2FnZSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuYXNzZXRzKS50by5iZS5kZWVwLmVxdWFsKFtcIioqLyouY3NzXCJdKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IHJlbW92ZWQgYXMgYSBkZXBlbmRlbmN5IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFuZCByZW1vdmVkIGFzIGEgZGVwZW5kZW5jeSBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFtcIioqLyouY3NzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwibWFpbi5taW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJub25lXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5wcmVsb2FkKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5pc1BhY2thZ2UpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmFzc2V0cykudG8uYmUuZGVlcC5lcXVhbChbXCIqKi8qLmNzc1wiXSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJ0b2dnbGVEZXZEZXBlbmRlbmN5XCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHRoZXJlIGFyZSBubyBwZWVyIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLm1lc3NhZ2UpLnRvLmNvbnRhaW4oXCJtaXNzaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGVlciBkZXBlbmRlbmNpZXMgZG9lcyBub3QgY29udGFpbiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwiTWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGFkZGluZyBhIGRldiBkZXBlbmRlbmN5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGFkZGluZyBhIGRldiBkZXBlbmRlbmN5IHR3aWNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gcmVtb3ZpbmcgYSBkZXYgZGVwZW5kZW5jeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIHJlbW92aW5nIGEgZGV2IGRlcGVuZGVuY3kgdGhhdCBhbHJlYWR5IGV4aXN0cyBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCBmYWxzZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImJ1aWxkRGVwZW5kZW5jaWVzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IHJlbW92ZWQgZnJvbSBleGlzdGluZyBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFtcIioqLyouY3NzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgICAgICAgICAgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiYmxhaFwiO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdChcImNhbiBnZXQgYWRkZWQgYXMgYSBhcHAgcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGFwcCBwYWNrYWdlIGFuZCByZW1vdmVkIGZyb20gZGV2IGlmIGl0IGV4aXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFzIGEgdGVzdCBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwidGVzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gbm90IGxvb2t1cCB2ZXJzaW9uIGlmIHN1cHBsaWVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCJeNi43LjhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl42LjcuOFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gcmV0YWluIHBhY2thZ2UgZGV0YWlscyBpZiBjbGllbnQgcGFja2FnZSBoYXNPdmVycmlkZXMgc2V0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai5pbml0aWFsaXNlUGFja2FnZXMoe3BhY2thZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW5PdmVycmlkZS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiOS45LjlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNPdmVycmlkZXM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCJeNi43LjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIm1haW5PdmVycmlkZS5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiOS45LjlcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHJldGFpbiBwYWNrYWdlIGRldGFpbHMgaWYgY2xpZW50IHBhY2thZ2UgaGFzT3ZlcnJpZGVzIGVtcHR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai5pbml0aWFsaXNlUGFja2FnZXMoe3BhY2thZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW5PdmVycmlkZS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiOS45LjlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIl42LjcuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjYuNy44XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBub3QgcmVtb3ZlIHBhY2thZ2UgaWYgY2xpZW50IHBhY2thZ2UgaGFzT3ZlcnJpZGVzIHNldFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBvYmouaW5pdGlhbGlzZVBhY2thZ2VzKHtwYWNrYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluT3ZlcnJpZGUuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjkuOS45XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzT3ZlcnJpZGVzOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiXjYuNy44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbk92ZXJyaWRlLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCI5LjkuOVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gcmVtb3ZlIHBhY2thZ2UgaWYgY2xpZW50IHBhY2thZ2UgaGFzT3ZlcnJpZGVzIGVtcHR5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai5pbml0aWFsaXNlUGFja2FnZXMoe3BhY2thZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW5PdmVycmlkZS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiOS45LjlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIl42LjcuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJidWlsZERldkRlcGVuZGVuY2llc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGdldCByZW1vdmVkIGZyb20gZXhpc3RpbmcgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIGZhbHNlKTtcbiAgICAgICAgICAgIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcImJsYWhcIjtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
