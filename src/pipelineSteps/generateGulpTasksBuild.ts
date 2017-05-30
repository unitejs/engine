/**
 * Pipeline step to generate gulp tasks for build.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { EnumEx } from "../core/enumEx";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateGulpTasksBuild extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks for build in", { gulpTasksgulpTasksFolderBuildFolder: engineVariables.gulpTasksFolder });

            const lines: string[] = [];

            lines.push("/**");
            lines.push(" * Gulp tasks for building.");
            lines.push(" */");

            switch (EnumEx.getValueByName<UniteLanguage>(UniteLanguage, uniteConfiguration.language)) {
                case UniteLanguage.ES5: this.buildES5BuildTasks(lines, uniteConfiguration); break;
                // case UniteLanguage.ES6: this.buildES6BuildTasks(lines); break;
                // case UniteLanguage.TypeScript: this.buildTypeScriptBuildTasks(lines); break;
                default: break;
            }

            await fileSystem.fileWriteLines(engineVariables.gulpTasksFolder, "build.js", lines);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }

    private buildES5BuildTasks(lines: string[], uniteConfiguration: UniteConfiguration): void {
        uniteConfiguration.devDependencies.del = "^2.2.2";

        lines.push("const display = require('./util/display');");
        lines.push("const buildConfig = require('./util/build-config');");
        lines.push("const gulp = require('gulp');");
        lines.push("const path = require('path');");
        lines.push("const del = require('del');");
        lines.push("");
        lines.push("gulp.task('build', ['clean'], () => {");
        lines.push("");
        lines.push("});");
        lines.push("");
        lines.push("gulp.task('clean', (callback) => {");
        lines.push("    const config = buildConfig.getBuildConfig();");
        lines.push("    const folder = path.resolve(config.destFolder);");
        lines.push("    display.info('Cleaning', folder);");
        lines.push("    return del(folder, callback);");
        lines.push("");
        lines.push("});");
    }

    // private buildES6BuildTasks(lines: string[]): void {
    // }

    // private buildTypeScriptBuildTasks(lines: string[]): void {
    // }
}