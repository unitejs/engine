/**
 * Tests for SharedAppFramework.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../src/engine/engineVariables";
import { SharedAppFramework } from "../../../../src/pipelineSteps/sharedAppFramework";
import { FileSystemMock } from "../fileSystem.mock";

class TestSharedAppFramework extends SharedAppFramework {
    public customUnitTests: boolean;
    public appModuleName: string;
    public htmlFiles: string[];
    public appCssFiles: string[];

    constructor() {
        super();
        this.customUnitTests = false;
        this.appModuleName = "app";
        this.htmlFiles = ["app.html"];
        this.appCssFiles = ["child/child"];
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.js`], false);

        if (ret === 0) {
            ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint.js`], true);
        }

        if (ret === 0) {
            ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, this.htmlFiles);
        }

        if (ret === 0) {
            ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, this.appCssFiles);
        }

        if (ret === 0) {
            ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app.spec.js"], true);
        }

        if (ret === 0) {
            ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [], false);
        }

        if (ret === 0) {
            ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.spec.js`], !this.customUnitTests);
        }

        if (ret === 0) {
            ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
        }

        return ret;
    }

    public testCreateLoaderReplacement(engineVariables: EngineVariables, extension: string, loader: string, includeRequires: boolean) : void {
        return super.createLoaderReplacement(engineVariables, extension, loader, includeRequires);
    }

    public testCreateLoaderTypeMapReplacement(engineVariables: EngineVariables, extension: string, loader: string) : void {
        return super.createLoaderTypeMapReplacement(engineVariables, extension, loader);
    }

    public async testInsertContent(logger: ILogger,
                                   fileSystem: IFileSystem,
                                   engineVariables: EngineVariables,
                                   file: string,
                                   inserter: (content: string) => string): Promise<number> {
        return super.insertContent(logger, fileSystem, engineVariables, file, inserter);
    }

    public testInsertReplaceImports(srcContent: string, sourceItems: string[]): { content: string; remaining: string[] } {
        return super.insertReplaceImports(srcContent, sourceItems);
    }

    public testInsertCompletion(logger: ILogger,
                                remainingInserts: { [id: string]: string[]},
                                routes: string[]): void {
        return super.insertCompletion(logger, remainingInserts, routes);
    }
}

describe("SharedAppFramework", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;
    let fileSystemMock: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.banner = () => { };
        loggerStub.warning = () => { };

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "Aurelia";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
        uniteConfigurationStub.clientPackages = {};
        uniteConfigurationStub.sourceExtensions = ["js"];
        uniteConfigurationStub.styleExtension = "css";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async() => {
        const obj = new TestSharedAppFramework();
        Chai.should().exist(obj);
    });

    describe("finalise", () => {
        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no html", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("html")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no app css", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("css")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no e2e tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no css", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.indexOf("reset") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadText(directoryName, fileName);
                }
            });

            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can succeed with no unit test runner", async () => {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.unitTestRunner = "None";
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can succeed with no e2e test runner", async () => {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.e2eTestRunner = "None";
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can succeed with custom unit tests", async () => {
            const obj = new TestSharedAppFramework();
            obj.appModuleName = "app.module";
            obj.htmlFiles = [];
            obj.appCssFiles = [];
            obj.customUnitTests = true;
            uniteConfigurationStub.applicationFramework = "Angular";

            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can succeed", async () => {
            const obj = new TestSharedAppFramework();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(true);
        });
    });

    describe("createLoaderReplacement", () => {
        it("can be called without include requires", async() => {
            const obj = new TestSharedAppFramework();

            obj.testCreateLoaderReplacement(engineVariablesStub, "EXTENSION", "LOADER", false);

            Chai.expect(engineVariablesStub.buildTranspileInclude.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.buildTranspilePreBuild[0]).to.be.equal(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).EXTENSION\\2/g, "import$1$2LOADER!$3.EXTENSION$2"))`);
        });

        it("can be called with include requires", async() => {
            const obj = new TestSharedAppFramework();

            obj.testCreateLoaderReplacement(engineVariablesStub, "EXTENSION", "LOADER", true);

            Chai.expect(engineVariablesStub.buildTranspileInclude[0]).to.be.equal("const replace = require(\"gulp-replace\");");
            Chai.expect(engineVariablesStub.buildTranspilePreBuild[0]).to.be.equal(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).EXTENSION\\2/g, "import$1$2LOADER!$3.EXTENSION$2"))`);
        });
    });

    describe("createLoaderTypeMapReplacement", () => {
        it("can be called", async() => {
            const obj = new TestSharedAppFramework();

            obj.testCreateLoaderTypeMapReplacement(engineVariablesStub, "EXTENSION", "LOADER");

            Chai.expect(engineVariablesStub.buildTranspileInclude[0]).to.be.equal("const replace = require(\"gulp-replace\");");
            Chai.expect(engineVariablesStub.buildTranspileInclude[1]).to.be.equal("const clientPackages = require(\"./util/client-packages\");");
            Chai.expect(engineVariablesStub.buildTranspilePreBuild[0]).to.be.equal
                (`        .pipe(replace(/import(.*?)("|'|\`)(.*?).EXTENSION\\2/g, \`import$1$2\${clientPackages.getTypeMap(uniteConfig, "LOADER", buildConfiguration.minify)}!$3.EXTENSION$2\`))`);
        });
    });

    describe("insertContent", () => {
        it("can be called when files does not exist", async() => {
            const obj = new TestSharedAppFramework();

            const res = await obj.testInsertContent(loggerStub, fileSystemMock, engineVariablesStub, "myfile.txt", (content) => content);

            Chai.expect(res).to.be.equal(0);
        });

        it("can be called when replacement throws an error", async() => {
            const obj = new TestSharedAppFramework();

            sandbox.stub(fileSystemMock, "fileExists").resolves(true);

            const res = await obj.testInsertContent(loggerStub, fileSystemMock, engineVariablesStub, "myfile.txt", (content) => {
                throw new Error("err");
            });

            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Unable to replace");
        });

        it("can be called and replace content", async() => {
            const obj = new TestSharedAppFramework();

            let written = "";
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadText").resolves("content");
            sandbox.stub(fileSystemMock, "fileWriteText").callsFake(async (folder, file, content) => {
                written = content;
                return Promise.resolve();
            });

            const res = await obj.testInsertContent(loggerStub, fileSystemMock, engineVariablesStub, "myfile.txt", (content) => "blah");

            Chai.expect(res).to.be.equal(0);
            Chai.expect(written).to.contain("blah");
        });
    });

    describe("insertReplaceImports", () => {
        it("can be called with no items", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("content", []);

            Chai.expect(content).to.be.equal("content");
            Chai.expect(remaining).to.be.deep.equal([]);
        });

        it("can be called with items but no insert point", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("content", ["import blah;"]);

            Chai.expect(content).to.be.equal("content");
            Chai.expect(remaining).to.be.deep.equal(["import blah;"]);
        });

        it("can be called with items and an insert point", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("import 1;", ["import blah;"]);

            Chai.expect(content).to.be.equal("import 1;\nimport blah;");
            Chai.expect(remaining).to.be.deep.equal([]);
        });

        it("can be called with multiple items and an insert point", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("import 1;\nimport 2;", ["import blah;", "import foo;"]);

            Chai.expect(content).to.be.equal("import 1;\nimport 2;\nimport blah;\nimport foo;");
            Chai.expect(remaining).to.be.deep.equal([]);
        });

        it("can be called with multiple items and an insert point, but some existing", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("import 1;\nimport 2;\nimport foo;", ["import blah;", "import foo;"]);

            Chai.expect(content).to.be.equal("import 1;\nimport 2;\nimport foo;\nimport blah;");
            Chai.expect(remaining).to.be.deep.equal([]);
        });

        it("can be called with multiple items and an insert point, but all existing", async() => {
            const obj = new TestSharedAppFramework();

            const {content, remaining} = obj.testInsertReplaceImports("import 1;\nimport 2;\nimport foo;\nimport blah;", ["import blah;", "import foo;"]);

            Chai.expect(content).to.be.equal("import 1;\nimport 2;\nimport foo;\nimport blah;");
            Chai.expect(remaining).to.be.deep.equal([]);
        });
    });

    describe("insertCompletion", () => {
        it("can be called with no items", async() => {
            const obj = new TestSharedAppFramework();

            obj.testInsertCompletion(loggerStub, undefined, undefined);

            Chai.expect(loggerWarningSpy.args.length).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(0);
        });

        it("can be called with remaining items", async() => {
            const obj = new TestSharedAppFramework();

            obj.testInsertCompletion(loggerStub, {
                                            remain1: ["foo", "bar"],
                                            remain2: ["bob", "bill"]
                                        },
                                     undefined);

            Chai.expect(loggerWarningSpy.args.length).to.be.equal(2);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(14);
        });

        it("can be called with remaining items keys but no entries", async() => {
            const obj = new TestSharedAppFramework();

            obj.testInsertCompletion(loggerStub, {
                                            remain1: ["foo", "bar"],
                                            remain2: []
                                        },
                                     undefined);

            Chai.expect(loggerWarningSpy.args.length).to.be.equal(2);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(9);
        });

        it("can be called with routes", async() => {
            const obj = new TestSharedAppFramework();

            obj.testInsertCompletion(loggerStub, undefined,
                                     ["foo", "bar"]);

            Chai.expect(loggerWarningSpy.args.length).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args.length).to.be.equal(5);
        });
    });
});
