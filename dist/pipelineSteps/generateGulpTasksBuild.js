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
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateGulpTasksBuild extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp tasks for build in", { gulpTasksgulpTasksFolderBuildFolder: engineVariables.gulpTasksFolder });
                const lines = [];
                lines.push("/**");
                lines.push(" * Gulp tasks for building.");
                lines.push(" */");
                switch (engineVariables.uniteLanguage) {
                    case uniteLanguage_1.UniteLanguage.ES5:
                        this.buildES5BuildTasks(lines, uniteConfiguration);
                        break;
                    // case UniteLanguage.ES6: this.buildES6BuildTasks(lines); break;
                    // case UniteLanguage.TypeScript: this.buildTypeScriptBuildTasks(lines); break;
                    default: break;
                }
                yield fileSystem.fileWriteLines(engineVariables.gulpTasksFolder, "build.js", lines);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        });
    }
    buildES5BuildTasks(lines, uniteConfiguration) {
        uniteConfiguration.devDependencies.del = "^2.2.2";
        lines.push("const display = require('./util/display');");
        lines.push("const bc = require('./util/build-config');");
        lines.push("const gulp = require('gulp');");
        lines.push("const babel = require('gulp-babel');");
        lines.push("const path = require('path');");
        lines.push("const del = require('del');");
        lines.push("");
        lines.push("gulp.task('build', ['clean'], () => {");
        lines.push("    const buildConfig = bc.getBuildConfig();");
        lines.push("    return gulp.src(buildConfig.srcFolder + '**/*.js')");
        lines.push("        .pipe(babel())");
        lines.push("        .pipe(gulp.dest(buildConfig.distFolder));");
        lines.push("});");
        lines.push("");
        lines.push("gulp.task('clean', (callback) => {");
        lines.push("    const buildConfig = bc.getBuildConfig();");
        lines.push("    const folder = path.resolve(buildConfig.distFolder);");
        lines.push("    display.info('Cleaning', folder);");
        lines.push("    return del(folder, callback);");
        lines.push("");
        lines.push("});");
    }
}
exports.GenerateGulpTasksBuild = GenerateGulpTasksBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVHdWxwVGFza3NCdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsK0VBQTRFO0FBQzVFLDZFQUEwRTtBQU0xRSw0QkFBb0MsU0FBUSwrQ0FBc0I7SUFDakQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsRUFBRSxtQ0FBbUMsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBRTNJLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztnQkFFM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsS0FBSyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVsQixNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsS0FBSyw2QkFBYSxDQUFDLEdBQUc7d0JBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO3dCQUFDLEtBQUssQ0FBQztvQkFDbEYsaUVBQWlFO29CQUNqRSwrRUFBK0U7b0JBQy9FLFNBQVMsS0FBSyxDQUFDO2dCQUNuQixDQUFDO2dCQUVELE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFcEYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHdDQUF3QyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2xJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sa0JBQWtCLENBQUMsS0FBZSxFQUFFLGtCQUFzQztRQUM5RSxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUVsRCxLQUFLLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDekQsS0FBSyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQ3pELEtBQUssQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM1QyxLQUFLLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUMzRCxLQUFLLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7UUFDckUsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUNoRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxJQUFJLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUN2RSxLQUFLLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FPSjtBQTFERCx3REEwREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZUd1bHBUYXNrc0J1aWxkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
