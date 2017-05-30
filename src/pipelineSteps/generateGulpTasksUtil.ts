/**
 * Pipeline step to generate gulp tasks utils.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateGulpTasksUtil extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

            await this.buildUtilsDisplay(logger, display, fileSystem, uniteConfiguration, engineVariables);
            await this.buildUtilsBuildConfiguration(logger, display, fileSystem, uniteConfiguration, engineVariables);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
            return 1;
        }
    }

    private async buildUtilsDisplay(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<void> {
        super.log(logger, display, "Generating gulp tasks utils display.js in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

        const lines: string[] = [];

        lines.push("/**");
        lines.push(" * Gulp utils for display.");
        lines.push(" */");
        lines.push("const gutil = require('gulp-util');");
        lines.push("");
        lines.push("function log(text) {");
        lines.push("    gutil.log(text);");
        lines.push("}");
        lines.push("");
        lines.push("function info(caption, text) {");
        lines.push("    gutil.log('[' + gutil.colors.cyan(caption) + ']', text);");
        lines.push("}");
        lines.push("");
        lines.push("function error(text) {");
        lines.push("    gutil.log(gutil.colors.red(text));");
        lines.push("}");
        lines.push("");
        lines.push("function success(text) {");
        lines.push("    gutil.log(gutil.colors.blue(text));");
        lines.push("}");
        lines.push("");
        lines.push("module.exports = {");
        lines.push("    log: log,");
        lines.push("    info: info,");
        lines.push("    error: error,");
        lines.push("    success: success");
        lines.push("};");

        await fileSystem.fileWriteLines(engineVariables.gulpUtilFolder, "display.js", lines);

        uniteConfiguration.devDependencies["gulp-util"] = "^3.0.7";
    }

    private async buildUtilsBuildConfiguration(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<void> {
        super.log(logger, display, "Generating gulp tasks utils build-config.js in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

        const lines: string[] = [];

        lines.push("/**");
        lines.push(" * Gulp utils for build configuration.");
        lines.push(" */");
        lines.push("const buildConfigJson = require('../../build.config.json');");
        lines.push("");
        lines.push("function getBuildConfig() {");
        lines.push("   return buildConfigJson;");
        lines.push("}");
        lines.push("");
        lines.push("module.exports = {");
        lines.push("    getBuildConfig: getBuildConfig");
        lines.push("};");

        await fileSystem.fileWriteLines(engineVariables.gulpUtilFolder, "build-config.js", lines);
    }
}