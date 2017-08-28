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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Assets extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-image-cli"], true);
            try {
                logger.info("Creating Directory", { assetsSrcFolder: engineVariables.www.assetsSrcFolder });
                yield fileSystem.directoryCreate(engineVariables.www.assetsSrcFolder);
            }
            catch (err) {
                logger.error("Creating Assets Source folder failed", err);
                return 1;
            }
            try {
                logger.info("Creating Directory", { assetsFolder: engineVariables.www.assetsFolder });
                yield fileSystem.directoryCreate(engineVariables.www.assetsFolder);
            }
            catch (err) {
                logger.error("Creating Assets folder failed", err);
                return 1;
            }
            try {
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
                const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");
                let ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME, destThemeFolder, Assets.FILENAME, engineVariables.force);
                if (ret === 0) {
                    ret = yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, Assets.FILENAME2, destThemeFolder, Assets.FILENAME2, engineVariables.force);
                }
                return ret;
            }
            catch (err) {
                logger.error("Copy Assets failed", err);
                return 1;
            }
        });
    }
}
Assets.FILENAME = "logo-tile.svg";
Assets.FILENAME2 = "logo-transparent.svg";
exports.Assets = Assets;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsWUFBb0IsU0FBUSwrQ0FBc0I7SUFJakMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7Z0JBRTVGLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzFFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO2dCQUV0RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUV2RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3pHLE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlGLElBQUksR0FBRyxHQUFHLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVoSixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xKLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQXhDYyxlQUFRLEdBQVcsZUFBZSxDQUFDO0FBQ25DLGdCQUFTLEdBQVcsc0JBQXNCLENBQUM7QUFGOUQsd0JBMENDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9hc3NldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gY3JlYXRlIGFzc2V0IHNvdXJjZXMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEFzc2V0cyBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcImxvZ28tdGlsZS5zdmdcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTI6IHN0cmluZyA9IFwibG9nby10cmFuc3BhcmVudC5zdmdcIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInVuaXRlanMtaW1hZ2UtY2xpXCJdLCB0cnVlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJDcmVhdGluZyBEaXJlY3RvcnlcIiwgeyBhc3NldHNTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyY0ZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiQ3JlYXRpbmcgQXNzZXRzIFNvdXJjZSBmb2xkZXIgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIERpcmVjdG9yeVwiLCB7IGFzc2V0c0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzRm9sZGVyKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNyZWF0aW5nIEFzc2V0cyBmb2xkZXIgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VUaGVtZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgXCJhc3NldHNTcmMvdGhlbWUvXCIpO1xuICAgICAgICAgICAgY29uc3QgZGVzdFRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyY0ZvbGRlciwgXCJ0aGVtZS9cIik7XG5cbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHNvdXJjZVRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUUsIGRlc3RUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBzb3VyY2VUaGVtZUZvbGRlciwgQXNzZXRzLkZJTEVOQU1FMiwgZGVzdFRoZW1lRm9sZGVyLCBBc3NldHMuRklMRU5BTUUyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNvcHkgQXNzZXRzIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
