/**
 * Tests for EngineVariables.
 */
import * as Chai from "chai";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../dist/engine/engineVariables";

describe("EngineVariables", () => {
    let uniteConfiguration: UniteConfiguration;
    let packageJsonDependencies: { [id: string]: string };
    let packageJsonDevDependencies: { [id: string]: string };
    let peerDependencies: { [id: string]: string };

    beforeEach(() => {
        uniteConfiguration = new UniteConfiguration();
        uniteConfiguration.clientPackages = {};
        packageJsonDependencies = {};
        packageJsonDevDependencies = {};
        peerDependencies = {};
    });

    it("can be created", async() => {
        const obj = new EngineVariables();
        Chai.should().exist(obj);
    });

    describe("toggleClientPackage", () => {
        it("can fail when there are no peer dependencies", async() => {
            const obj = new EngineVariables();
            try {
                obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, undefined, true);
            } catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        });

        it("can fail when peer dependencies does not contain package", async() => {
            const obj = new EngineVariables();
            obj.enginePackageJson = <any>{ peerDependencies };
            try {
                obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, undefined, true);
            } catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        });

        it("can get added as a dependency contain package", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.mainMinified).to.be.equal("main.min.js");
            Chai.expect(uniteConfiguration.clientPackages.package.includeMode).to.be.equal("app");
            Chai.expect(uniteConfiguration.clientPackages.package.testScriptInclude).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteConfiguration.clientPackages.package.preload).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.isPackage).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.equal("**/*.css");
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });

        it("can get removed as a dependency contain package", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can get added and removed as a dependency contain package", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", true);
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.mainMinified).to.be.equal("main.min.js");
            Chai.expect(uniteConfiguration.clientPackages.package.includeMode).to.be.equal("app");
            Chai.expect(uniteConfiguration.clientPackages.package.testScriptInclude).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteConfiguration.clientPackages.package.preload).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.isPackage).to.be.equal(false);
            Chai.expect(uniteConfiguration.clientPackages.package.assets).to.be.equal("**/*.css");
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });
    });

    describe("getTestClientPackages", () => {
        it("can succeed when there are no test client packages", async() => {
            const obj = new EngineVariables();
            const packages = obj.getTestClientPackages();
            Chai.expect(Object.keys(packages).length).to.be.equal(0);
        });

        it("can succeed when app packages have been added", async() => {
            const obj = new EngineVariables();
            obj.enginePackageJson = <any>{ peerDependencies };
            peerDependencies.package = "^1.2.3";
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", true);
            const packages = obj.getTestClientPackages();
            Chai.expect(Object.keys(packages).length).to.be.equal(0);
        });

        it("can succeed when test packages have been added", async() => {
            const obj = new EngineVariables();
            obj.enginePackageJson = <any>{ peerDependencies };
            peerDependencies.package = "^1.2.3";
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "test", false, false, "**/*.css", true);
            const packages = obj.getTestClientPackages();
            Chai.expect(Object.keys(packages).length).to.be.equal(1);
        });

        it("can succeed when both packages have been added", async() => {
            const obj = new EngineVariables();
            obj.enginePackageJson = <any>{ peerDependencies };
            peerDependencies.package = "^1.2.3";
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "both", false, false, "**/*.css", true);
            const packages = obj.getTestClientPackages();
            Chai.expect(Object.keys(packages).length).to.be.equal(1);
        });
    });

    describe("toggleDevDependency", () => {
        it("can fail when there are no peer dependencies", async() => {
            const obj = new EngineVariables();
            try {
                obj.toggleDevDependency(["package"], true);
            } catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        });

        it("can fail when peer dependencies does not contain package", async() => {
            const obj = new EngineVariables();
            obj.enginePackageJson = <any>{ peerDependencies };
            try {
                obj.toggleDevDependency(["package"], true);
            } catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        });

        it("can succeed when adding a dev dependency", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can succeed when adding a dev dependency twice", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleDevDependency(["package"], true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can succeed when removing a dev dependency", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleDevDependency(["package"], false);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });
    });

    describe("buildDependencies", () => {
        it("can get removed from existing dependencies", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", false);
            packageJsonDependencies.package = "blah";
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(packageJsonDependencies.package);
        });
        it("can get added as a app package", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
        });
        it("can get added as a app package and removed from dev if it exists", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "app", false, false, "**/*.css", true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });
        it("can get added as a test package", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleClientPackage("package", "main.js", "main.min.js", false, "test", false, false, "**/*.css", true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
        });
    });

    describe("buildDevDependencies", () => {
        it("can get removed from existing dependencies", async() => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.enginePackageJson = <any>{ peerDependencies };
            obj.toggleDevDependency(["package"], false);
            packageJsonDevDependencies.package = "blah";
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });
    });
});
