/**
 * Tests for StyleLint.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { StyleLintConfiguration } from "../../../../../src/configuration/models/styleLint/styleLintConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { StyleLint } from "../../../../../src/pipelineSteps/cssLinter/styleLint";
import { FileSystemMock } from "../../fileSystem.mock";

describe("StyleLint", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.cssLinter = "StyleLint";
        uniteConfigurationStub.cssPre = "Sass";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new StyleLint();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new StyleLint();
            uniteConfigurationStub.cssLinter = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new StyleLint();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can be called with false main condition", async () => {
            const obj = new StyleLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("StyleLint")).to.be.equal(undefined);
        });

        it("can be called with mismatched cssPre", async () => {
            uniteConfigurationStub.cssPre = "Stylus";
            const obj = new StyleLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("StyleLint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("Stylus");
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ rules: { foo: 1 } });
            const obj = new StyleLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<StyleLintConfiguration>("StyleLint").rules.foo).to.be.equal(1);
        });

        it("can succeed when file does not exist", async () => {
            const obj = new StyleLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<StyleLintConfiguration>("StyleLint").rules).to.be.deep.equal({});
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new StyleLint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.stylelint).to.be.equal("1.2.3");
        });

        it("can be called with sass configuration", async () => {
            const obj = new StyleLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.stylelint).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["stylelint-config-standard"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["stylelint-scss"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["stylelint-config-recommended-scss"]).to.be.equal("1.2.3");
            Chai.expect(engineVariablesStub.getConfiguration<StyleLintConfiguration>("StyleLint").extends).to.be.equal("stylelint-config-recommended-scss");
        });

        it("can be called with non sass configuration", async () => {
            const obj = new StyleLint();
            uniteConfigurationStub.cssPre = "less";
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.stylelint).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["stylelint-config-standard"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["stylelint-scss"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["stylelint-config-recommended-scss"]).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<StyleLintConfiguration>("StyleLint").extends).to.be.equal("stylelint-config-recommended");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new StyleLint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { stylelint: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.stylelint).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new StyleLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".stylelintrc");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".stylelintrc", {});

            const obj = new StyleLint();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".stylelintrc");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
