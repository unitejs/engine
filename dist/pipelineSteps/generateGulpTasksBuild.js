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
const enumEx_1 = require("../core/enumEx");
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
                switch (enumEx_1.EnumEx.getValueByName(uniteLanguage_1.UniteLanguage, uniteConfiguration.language)) {
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
}
exports.GenerateGulpTasksBuild = GenerateGulpTasksBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVHdWxwVGFza3NCdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsK0VBQTRFO0FBQzVFLDJDQUF3QztBQUN4Qyw2RUFBMEU7QUFNMUUsNEJBQW9DLFNBQVEsK0NBQXNCO0lBQ2pELE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEVBQUUsbUNBQW1DLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUUzSSxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7Z0JBRTNCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFbEIsTUFBTSxDQUFDLENBQUMsZUFBTSxDQUFDLGNBQWMsQ0FBZ0IsNkJBQWEsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZGLEtBQUssNkJBQWEsQ0FBQyxHQUFHO3dCQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzt3QkFBQyxLQUFLLENBQUM7b0JBQ2xGLGlFQUFpRTtvQkFDakUsK0VBQStFO29CQUMvRSxTQUFTLEtBQUssQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXBGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNsSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGtCQUFrQixDQUFDLEtBQWUsRUFBRSxrQkFBc0M7UUFDOUUsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQ3pELEtBQUssQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztRQUNsRSxLQUFLLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQy9ELEtBQUssQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztRQUNsRSxLQUFLLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FPSjtBQXRERCx3REFzREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZUd1bHBUYXNrc0J1aWxkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
