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
 * Pipeline step to generate LICENSE.
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class License extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return !super.condition(uniteConfiguration.license, "None");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                try {
                    const licenseData = yield fileSystem.fileReadJson(engineVariables.engineAssetsFolder, License.FILENAME_SPDX);
                    if (!parameterValidation_1.ParameterValidation.checkOneOf(logger, "license", uniteConfiguration.license, Object.keys(licenseData), "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                        return 1;
                    }
                    else {
                        this._spdxLicense = licenseData[uniteConfiguration.license];
                    }
                }
                catch (e) {
                    logger.error(`There was a problem reading the ${License.FILENAME_SPDX} file`, e);
                    return 1;
                }
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleText").call(this, logger, fileSystem, engineVariables.wwwRootFolder, License.FILENAME, true, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                const yearString = new Date().getFullYear()
                    .toString();
                return this._spdxLicense.licenseText.replace(/<year>/gi, yearString);
            }));
        });
    }
}
License.FILENAME = "LICENSE";
License.FILENAME_SPDX = "spdx-full.json";
exports.License = License;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFPekYsb0VBQWlFO0FBRWpFLGFBQXFCLFNBQVEsbUNBQWdCO0lBTWxDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLGFBQWEsRUFBRTtnQkFDZixJQUFJO29CQUNBLE1BQU0sV0FBVyxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBUSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNwSCxJQUFJLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUFTLE1BQU0sRUFDTixTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsT0FBTyxFQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUN4QiwwRkFBMEYsQ0FBQyxFQUFFO3dCQUNySSxPQUFPLENBQUMsQ0FBQztxQkFDWjt5QkFBTTt3QkFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDL0Q7aUJBQ0o7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsT0FBTyxDQUFDLGFBQWEsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNqRixPQUFPLENBQUMsQ0FBQztpQkFDWjthQUNKO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE9BQU8sd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixPQUFPLENBQUMsUUFBUSxFQUNoQixJQUFJLEVBQ0osYUFBYSxFQUNiLEdBQVEsRUFBRTtnQkFDbEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7cUJBQ2IsUUFBUSxFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUEsRUFBRTtRQUNQLENBQUM7S0FBQTs7QUEzQ3VCLGdCQUFRLEdBQVcsU0FBUyxDQUFDO0FBQzdCLHFCQUFhLEdBQVcsZ0JBQWdCLENBQUM7QUFGckUsMEJBNkNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9saWNlbnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIExJQ0VOU0UuXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSVNwZHggfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeFwiO1xuaW1wb3J0IHsgSVNwZHhMaWNlbnNlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhMaWNlbnNlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgTGljZW5zZSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIkxJQ0VOU0VcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRV9TUERYOiBzdHJpbmcgPSBcInNwZHgtZnVsbC5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9zcGR4TGljZW5zZTogSVNwZHhMaWNlbnNlO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiAhc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlLCBcIk5vbmVcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGljZW5zZURhdGEgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxJU3BkeD4oZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgTGljZW5zZS5GSUxFTkFNRV9TUERYKTtcbiAgICAgICAgICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxzdHJpbmc+KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhsaWNlbnNlRGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgcG9zc2libGUgU1BEWCBsaWNlbnNlIHZhbHVlcyAoc2VlIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvKS5cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BkeExpY2Vuc2UgPSBsaWNlbnNlRGF0YVt1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgVGhlcmUgd2FzIGEgcHJvYmxlbSByZWFkaW5nIHRoZSAke0xpY2Vuc2UuRklMRU5BTUVfU1BEWH0gZmlsZWAsIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlVGV4dChsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaWNlbnNlLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYygpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJTdHJpbmcgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3BkeExpY2Vuc2UubGljZW5zZVRleHQucmVwbGFjZSgvPHllYXI+L2dpLCB5ZWFyU3RyaW5nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19
