/**
 * Pipeline step to generate jasmine configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Jasmine extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestFramework, "Jasmine") || super.condition(uniteConfiguration.e2eTestFramework, "Jasmine");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info("Generating Jasmine Configuration");

        const isUnit = super.condition(uniteConfiguration.unitTestFramework, "Jasmine");
        const isE2E = super.condition(uniteConfiguration.e2eTestFramework, "Jasmine");

        engineVariables.toggleDevDependency(["jasmine-core"], true);
        engineVariables.toggleDevDependency(["@types/jasmine"], super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["karma-jasmine"], super.condition(uniteConfiguration.unitTestRunner, "Karma") && isUnit);

        engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"],
                                            super.condition(uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);

        engineVariables.toggleDevDependency(["wdio-jasmine-framework"], super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "jasmine", true, true);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "jasmine", isUnit);
        }

        if (isE2E) {
            const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            if (protractorConfiguration) {
                protractorConfiguration.framework = "jasmine";
                protractorConfiguration.jasmineNodeOpts = { showColors: true };
            }

            const protractorScriptStart = engineVariables.getConfiguration<string[]>("Protractor.ScriptStart");
            if (protractorScriptStart) {
                protractorScriptStart.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
                protractorScriptStart.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");
            }

            const protractorScriptEnd = engineVariables.getConfiguration<string[]>("Protractor.ScriptEnd");
            if (protractorScriptEnd) {
                const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

                protractorScriptEnd.push("exports.config.onPrepare = () => {");
                protractorScriptEnd.push("    jasmine.getEnv().clearReporters();");
                protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                protractorScriptEnd.push("        new Jasmine2HtmlReporter({");
                protractorScriptEnd.push(`            savePath: '${reportsFolder}/e2e/',`);
                protractorScriptEnd.push("            fileName: 'index'");
                protractorScriptEnd.push("        })");
                protractorScriptEnd.push("    );");
                protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                protractorScriptEnd.push("        new SpecReporter({");
                protractorScriptEnd.push("            displayStacktrace: 'all'");
                protractorScriptEnd.push("        })");
                protractorScriptEnd.push("    );");
                protractorScriptEnd.push("};");
            }

            const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
            if (webdriverIoConfiguration) {
                webdriverIoConfiguration.framework = "jasmine";
            }
        }

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["jasmine-core"], false);
        engineVariables.toggleDevDependency(["@types/jasmine"], false);

        engineVariables.toggleDevDependency(["karma-jasmine"], false);

        engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], false);

        engineVariables.toggleDevDependency(["wdio-jasmine-framework"], false);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "jasmine", true, false);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "jasmine", false);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            protractorConfiguration.framework = undefined;
            protractorConfiguration.jasmineNodeOpts = undefined;
        }

        const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
        if (webdriverIoConfiguration) {
            webdriverIoConfiguration.framework = undefined;
        }

        return 0;
    }
}
