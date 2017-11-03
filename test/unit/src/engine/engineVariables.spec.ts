/**
 * Tests for EngineVariables.
 */
import * as Chai from "chai";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../src/engine/engineVariables";

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

    it("can be created", async () => {
        const obj = new EngineVariables();
        Chai.should().exist(obj);
    });

    describe("toggleClientPackage", () => {
        it("can fail when there are no peer dependencies", async () => {
            const obj = new EngineVariables();
            try {
                obj.toggleClientPackage("package", { name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            } catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        });

        it("can fail when peer dependencies does not contain package", async () => {
            const obj = new EngineVariables();
            obj.engineDependencies = peerDependencies;
            try {
                obj.toggleClientPackage("package", { name: "package", main: "main.js", mainMinified: "main.min.js", includeMode: "app" }, true);
            } catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        });

        it("can get added as a dependency contain package", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
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
        });

        it("can get removed as a dependency contain package", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can get added and removed as a dependency contain package", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
            obj.toggleClientPackage("package", {
                                        name: "package",
                                        main: "main.js",
                                        mainMinified: "main.min.js",
                                        preload: false,
                                        includeMode: "app",
                                        scriptIncludeMode: "none",
                                        isPackage: false,
                                        assets: ["**/*.css"]
                                    },
                                    false);
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
        });
    });

    describe("toggleDevDependency", () => {
        it("can fail when there are no peer dependencies", async () => {
            const obj = new EngineVariables();
            try {
                obj.toggleDevDependency(["package"], true);
            } catch (err) {
                Chai.expect(err.message).to.contain("missing");
            }
        });

        it("can fail when peer dependencies does not contain package", async () => {
            const obj = new EngineVariables();
            obj.engineDependencies = peerDependencies;
            try {
                obj.toggleDevDependency(["package"], true);
            } catch (err) {
                Chai.expect(err.message).to.contain("Missing");
            }
        });

        it("can succeed when adding a dev dependency", async () => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can succeed when adding a dev dependency twice", async () => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can succeed when removing a dev dependency", async () => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });

        it("can succeed when removing a dev dependency that already exists exist", async () => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
            obj.toggleDevDependency(["package"], false);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });
    });

    describe("buildDependencies", () => {
        it("can get removed from existing dependencies", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    false);
            packageJsonDependencies.package = "blah";
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(packageJsonDependencies.package);
        });
        it("can get added as a app package", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
        });
        it("can get added as a app package and removed from dev if it exists", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
            obj.toggleDevDependency(["package"], true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });
        it("can get added as a test package", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().exist(packageJsonDevDependencies.package);
        });

        it("can not lookup version if supplied", async () => {
            const obj = new EngineVariables();
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
                                    },
                                    true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^6.7.8");
        });

        it("can retain package details if client package hasOverrides set", async () => {
            const obj = new EngineVariables();
            obj.initialisePackages({package: {
                                        name: "package",
                                        main: "mainOverride.js",
                                        version: "9.9.9",
                                        hasOverrides: true
                                    }});
            obj.toggleClientPackage("package", {
                                        name: "package",
                                        main: "main.js",
                                        version: "^6.7.8"
                                    },
                                    true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("mainOverride.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("9.9.9");
        });

        it("can retain package details if client package hasOverrides empty", async () => {
            const obj = new EngineVariables();
            obj.initialisePackages({package: {
                                        name: "package",
                                        main: "mainOverride.js",
                                        version: "9.9.9"
                                    }});
            obj.toggleClientPackage("package", {
                                        name: "package",
                                        main: "main.js",
                                        version: "^6.7.8"
                                    },
                                    true);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("^6.7.8");
        });

        it("can not remove package if client package hasOverrides set", async () => {
            const obj = new EngineVariables();
            obj.initialisePackages({package: {
                                        name: "package",
                                        main: "mainOverride.js",
                                        version: "9.9.9",
                                        hasOverrides: true
                                    }});
            obj.toggleClientPackage("package", {
                                        name: "package",
                                        main: "main.js",
                                        version: "^6.7.8"
                                    },
                                    false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().exist(uniteConfiguration.clientPackages.package);
            Chai.expect(uniteConfiguration.clientPackages.package.main).to.be.equal("mainOverride.js");
            Chai.expect(uniteConfiguration.clientPackages.package.version).to.be.equal("9.9.9");
        });

        it("can remove package if client package hasOverrides empty", async () => {
            const obj = new EngineVariables();
            obj.initialisePackages({package: {
                                        name: "package",
                                        main: "mainOverride.js",
                                        version: "9.9.9"
                                    }});
            obj.toggleClientPackage("package", {
                                        name: "package",
                                        main: "main.js",
                                        version: "^6.7.8"
                                    },
                                    false);
            obj.buildDependencies(uniteConfiguration, packageJsonDependencies);
            Chai.should().not.exist(uniteConfiguration.clientPackages.package);
            Chai.should().not.exist(packageJsonDependencies.package);
        });
    });

    describe("buildDevDependencies", () => {
        it("can get removed from existing dependencies", async () => {
            const obj = new EngineVariables();
            peerDependencies.package = "^1.2.3";
            obj.engineDependencies = peerDependencies;
            obj.toggleDevDependency(["package"], false);
            packageJsonDevDependencies.package = "blah";
            obj.buildDevDependencies(packageJsonDevDependencies);
            Chai.should().not.exist(packageJsonDevDependencies.package);
        });
    });
});
