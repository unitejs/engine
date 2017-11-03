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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBRXpFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxrQkFBc0MsQ0FBQztJQUMzQyxJQUFJLHVCQUFpRCxDQUFDO0lBQ3RELElBQUksMEJBQW9ELENBQUM7SUFDekQsSUFBSSxnQkFBMEMsQ0FBQztJQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQzlDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDdkMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQzdCLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUyxFQUFFO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFF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QUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFTLEVBQUU7WUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDbEMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUNwQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUM7WUFDMUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUMsMEJBQTBCLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUM1QyxHQUFHLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lVmFyaWFibGVzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBFbmdpbmVWYXJpYWJsZXMuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZGVzY3JpYmUoXCJFbmdpbmVWYXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgcGFja2FnZUpzb25EZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBsZXQgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBsZXQgcGVlckRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzID0ge307XG4gICAgICAgIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgIHBlZXJEZXBlbmRlbmNpZXMgPSB7fTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidG9nZ2xlQ2xpZW50UGFja2FnZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiB0aGVyZSBhcmUgbm8gcGVlciBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwgeyBuYW1lOiBcInBhY2thZ2VcIiwgbWFpbjogXCJtYWluLmpzXCIsIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLCBpbmNsdWRlTW9kZTogXCJhcHBcIiB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5tZXNzYWdlKS50by5jb250YWluKFwibWlzc2luZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBlZXIgZGVwZW5kZW5jaWVzIGRvZXMgbm90IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHsgbmFtZTogXCJwYWNrYWdlXCIsIG1haW46IFwibWFpbi5qc1wiLCBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIiwgaW5jbHVkZU1vZGU6IFwiYXBwXCIgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIk1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGRlcGVuZGVuY3kgY29udGFpbiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCJtYWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbk1pbmlmaWVkKS50by5iZS5lcXVhbChcIm1haW4ubWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYXBwXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwibm9uZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UucHJlbG9hZCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaXNQYWNrYWdlKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS5hc3NldHMpLnRvLmJlLmRlZXAuZXF1YWwoW1wiKiovKi5jc3NcIl0pO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgcmVtb3ZlZCBhcyBhIGRlcGVuZGVuY3kgY29udGFpbiBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgYWRkZWQgYW5kIHJlbW92ZWQgYXMgYSBkZXBlbmRlbmN5IGNvbnRhaW4gcGFja2FnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCJtYWluLm1pbi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnByZWxvYWQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmlzUGFja2FnZSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuYXNzZXRzKS50by5iZS5kZWVwLmVxdWFsKFtcIioqLyouY3NzXCJdKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRvZ2dsZURldkRlcGVuZGVuY3lcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gdGhlcmUgYXJlIG5vIHBlZXIgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIubWVzc2FnZSkudG8uY29udGFpbihcIm1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwZWVyIGRlcGVuZGVuY2llcyBkb2VzIG5vdCBjb250YWluIHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLm1lc3NhZ2UpLnRvLmNvbnRhaW4oXCJNaXNzaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gYWRkaW5nIGEgZGV2IGRlcGVuZGVuY3lcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gYWRkaW5nIGEgZGV2IGRlcGVuZGVuY3kgdHdpY2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJwYWNrYWdlXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiByZW1vdmluZyBhIGRldiBkZXBlbmRlbmN5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gcmVtb3ZpbmcgYSBkZXYgZGVwZW5kZW5jeSB0aGF0IGFscmVhZHkgZXhpc3RzIGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInBhY2thZ2VcIl0sIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYnVpbGREZXBlbmRlbmNpZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBnZXQgcmVtb3ZlZCBmcm9tIGV4aXN0aW5nIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzLnBhY2thZ2UgPSBcIl4xLjIuM1wiO1xuICAgICAgICAgICAgb2JqLmVuZ2luZURlcGVuZGVuY2llcyA9IHBlZXJEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJibGFoXCI7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwiY2FuIGdldCBhZGRlZCBhcyBhIGFwcCBwYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IGFkZGVkIGFzIGEgYXBwIHBhY2thZ2UgYW5kIHJlbW92ZWQgZnJvbSBkZXYgaWYgaXQgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHBlZXJEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiXjEuMi4zXCI7XG4gICAgICAgICAgICBvYmouZW5naW5lRGVwZW5kZW5jaWVzID0gcGVlckRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW4ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5ub3QuZXhpc3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdChcImNhbiBnZXQgYWRkZWQgYXMgYSB0ZXN0IHBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFja2FnZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbXCIqKi8qLmNzc1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBub3QgbG9va3VwIHZlcnNpb24gaWYgc3VwcGxpZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbi5taW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIl42LjcuOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcInRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IFtcIioqLyouY3NzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjYuNy44XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiByZXRhaW4gcGFja2FnZSBkZXRhaWxzIGlmIGNsaWVudCBwYWNrYWdlIGhhc092ZXJyaWRlcyBzZXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmluaXRpYWxpc2VQYWNrYWdlcyh7cGFja2FnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbk92ZXJyaWRlLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCI5LjkuOVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc092ZXJyaWRlczogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJwYWNrYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIl42LjcuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwibWFpbk92ZXJyaWRlLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCI5LjkuOVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gcmV0YWluIHBhY2thZ2UgZGV0YWlscyBpZiBjbGllbnQgcGFja2FnZSBoYXNPdmVycmlkZXMgZW1wdHlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmluaXRpYWxpc2VQYWNrYWdlcyh7cGFja2FnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbk92ZXJyaWRlLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCI5LjkuOVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiXjYuNy44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCJtYWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeNi43LjhcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG5vdCByZW1vdmUgcGFja2FnZSBpZiBjbGllbnQgcGFja2FnZSBoYXNPdmVycmlkZXMgc2V0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIG9iai5pbml0aWFsaXNlUGFja2FnZXMoe3BhY2thZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcIm1haW5PdmVycmlkZS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiOS45LjlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNPdmVycmlkZXM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgIG9iai50b2dnbGVDbGllbnRQYWNrYWdlKFwicGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCJeNi43LjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgICAgIG9iai5idWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCJtYWluT3ZlcnJpZGUuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIjkuOS45XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiByZW1vdmUgcGFja2FnZSBpZiBjbGllbnQgcGFja2FnZSBoYXNPdmVycmlkZXMgZW1wdHlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgb2JqLmluaXRpYWxpc2VQYWNrYWdlcyh7cGFja2FnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbk92ZXJyaWRlLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogXCI5LjkuOVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICBvYmoudG9nZ2xlQ2xpZW50UGFja2FnZShcInBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IFwiXjYuNy44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgICBvYmouYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uLCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdCh1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMucGFja2FnZSk7XG4gICAgICAgICAgICBDaGFpLnNob3VsZCgpLm5vdC5leGlzdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llcy5wYWNrYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImJ1aWxkRGV2RGVwZW5kZW5jaWVzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZ2V0IHJlbW92ZWQgZnJvbSBleGlzdGluZyBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgcGVlckRlcGVuZGVuY2llcy5wYWNrYWdlID0gXCJeMS4yLjNcIjtcbiAgICAgICAgICAgIG9iai5lbmdpbmVEZXBlbmRlbmNpZXMgPSBwZWVyRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgb2JqLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicGFja2FnZVwiXSwgZmFsc2UpO1xuICAgICAgICAgICAgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucGFja2FnZSA9IFwiYmxhaFwiO1xuICAgICAgICAgICAgb2JqLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkubm90LmV4aXN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnBhY2thZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
