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
                const yearString = new Date().getFullYear().toString();
                return this._spdxLicense.licenseText.replace(/<year>/gi, yearString);
            }));
        });
    }
}
License.FILENAME = "LICENSE";
License.FILENAME_SPDX = "spdx-full.json";
exports.License = License;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFPekYsb0VBQWlFO0FBRWpFLGFBQXFCLFNBQVEsbUNBQWdCO0lBTWxDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzlKLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQztvQkFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQVEsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDcEgsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBbUIsQ0FBQyxVQUFVLENBQVMsTUFBTSxFQUNOLFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxPQUFPLEVBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQ3hCLDBGQUEwRixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0SSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNiLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hFLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLE9BQU8sQ0FBQyxhQUFhLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDakYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE1BQU0sQ0FBQyx3QkFBb0IsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLElBQUksRUFDSixhQUFhLEVBQ2IsR0FBUSxFQUFFO2dCQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUEsRUFBRTtRQUNQLENBQUM7S0FBQTs7QUExQ2MsZ0JBQVEsR0FBVyxTQUFTLENBQUM7QUFDN0IscUJBQWEsR0FBVyxnQkFBZ0IsQ0FBQztBQUY1RCwwQkE0Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2xpY2Vuc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgTElDRU5TRS5cbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBJU3BkeCB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9zcGR4L0lTcGR4XCI7XG5pbXBvcnQgeyBJU3BkeExpY2Vuc2UgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeExpY2Vuc2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBMaWNlbnNlIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwiTElDRU5TRVwiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FX1NQRFg6IHN0cmluZyA9IFwic3BkeC1mdWxsLmpzb25cIjtcblxuICAgIHByaXZhdGUgX3NwZHhMaWNlbnNlOiBJU3BkeExpY2Vuc2U7XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuICFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2UsIFwiTm9uZVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaWNlbnNlRGF0YSA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPElTcGR4PihlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBMaWNlbnNlLkZJTEVOQU1FX1NQRFgpO1xuICAgICAgICAgICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5jaGVja09uZU9mPHN0cmluZz4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsaWNlbnNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGxpY2Vuc2VEYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9lcyBub3QgbWF0Y2ggYW55IG9mIHRoZSBwb3NzaWJsZSBTUERYIGxpY2Vuc2UgdmFsdWVzIChzZWUgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy8pLlwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGR4TGljZW5zZSA9IGxpY2Vuc2VEYXRhW3VuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBUaGVyZSB3YXMgYSBwcm9ibGVtIHJlYWRpbmcgdGhlICR7TGljZW5zZS5GSUxFTkFNRV9TUERYfSBmaWxlYCwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVUZXh0KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExpY2Vuc2UuRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeWVhclN0cmluZyA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwZHhMaWNlbnNlLmxpY2Vuc2VUZXh0LnJlcGxhY2UoLzx5ZWFyPi9naSwgeWVhclN0cmluZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
