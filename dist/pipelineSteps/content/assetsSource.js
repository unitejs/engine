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
class AssetsSource extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-image-cli"], true);
            try {
                logger.info("Creating Directory", { assetsSourceFolder: engineVariables.www.assetsSourceFolder });
                yield fileSystem.directoryCreate(engineVariables.www.assetsSourceFolder);
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
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "assetsSource/theme/");
                const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSourceFolder, "theme/");
                yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, AssetsSource.FILENAME, destThemeFolder, AssetsSource.FILENAME);
                yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, AssetsSource.FILENAME2, destThemeFolder, AssetsSource.FILENAME2);
                return 0;
            }
            catch (err) {
                logger.error("Copy Assets failed", err);
                return 1;
            }
        });
    }
}
AssetsSource.FILENAME = "logo-tile.svg";
AssetsSource.FILENAME2 = "logo-transparent.svg";
exports.AssetsSource = AssetsSource;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBSXZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakUsSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztnQkFFbEcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUM3RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFFdEYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNoSCxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRWpHLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDM0gsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUU3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBckNjLHFCQUFRLEdBQVcsZUFBZSxDQUFDO0FBQ25DLHNCQUFTLEdBQVcsc0JBQXNCLENBQUM7QUFGOUQsb0NBdUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9hc3NldHNTb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gY3JlYXRlIGFzc2V0IHNvdXJjZXMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEFzc2V0c1NvdXJjZSBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcImxvZ28tdGlsZS5zdmdcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTI6IHN0cmluZyA9IFwibG9nby10cmFuc3BhcmVudC5zdmdcIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInVuaXRlanMtaW1hZ2UtY2xpXCJdLCB0cnVlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJDcmVhdGluZyBEaXJlY3RvcnlcIiwgeyBhc3NldHNTb3VyY2VGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU291cmNlRm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NvdXJjZUZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiQ3JlYXRpbmcgQXNzZXRzIFNvdXJjZSBmb2xkZXIgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIERpcmVjdG9yeVwiLCB7IGFzc2V0c0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzRm9sZGVyKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNyZWF0aW5nIEFzc2V0cyBmb2xkZXIgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VUaGVtZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnBhY2thZ2VBc3NldHNEaXJlY3RvcnksIFwiYXNzZXRzU291cmNlL3RoZW1lL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGRlc3RUaGVtZUZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5hc3NldHNTb3VyY2VGb2xkZXIsIFwidGhlbWUvXCIpO1xuXG4gICAgICAgICAgICBhd2FpdCBzdXBlci5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHNvdXJjZVRoZW1lRm9sZGVyLCBBc3NldHNTb3VyY2UuRklMRU5BTUUsIGRlc3RUaGVtZUZvbGRlciwgQXNzZXRzU291cmNlLkZJTEVOQU1FKTtcbiAgICAgICAgICAgIGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgc291cmNlVGhlbWVGb2xkZXIsIEFzc2V0c1NvdXJjZS5GSUxFTkFNRTIsIGRlc3RUaGVtZUZvbGRlciwgQXNzZXRzU291cmNlLkZJTEVOQU1FMik7XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkNvcHkgQXNzZXRzIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
