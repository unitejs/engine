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
class PackageHelper {
    static locate(fileSystem, logger, initialDir, packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const subFolder = fileSystem.pathAbsolute(fileSystem.pathCombine(initialDir, `node_modules/${packageName}`));
            const subExists = yield fileSystem.directoryExists(subFolder);
            if (subExists) {
                return subFolder;
            }
            else {
                const parentFolder = fileSystem.pathAbsolute(fileSystem.pathCombine(initialDir, `../${packageName}`));
                const parentExists = yield fileSystem.directoryExists(parentFolder);
                if (parentExists) {
                    return parentFolder;
                }
                else {
                    logger.error(`Could not find package '${packageName}' at ${subFolder} or ${parentFolder}`);
                    return null;
                }
            }
        });
    }
}
exports.PackageHelper = PackageHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3BhY2thZ2VIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLE1BQWEsYUFBYTtJQUNmLE1BQU0sQ0FBTyxNQUFNLENBQUMsVUFBdUIsRUFBRSxNQUFlLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjs7WUFDeEcsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdHLE1BQU0sU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU5RCxJQUFJLFNBQVMsRUFBRTtnQkFDWCxPQUFPLFNBQVMsQ0FBQzthQUNwQjtpQkFBTTtnQkFDSCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUV0RyxNQUFNLFlBQVksR0FBRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRXBFLElBQUksWUFBWSxFQUFFO29CQUNkLE9BQU8sWUFBWSxDQUFDO2lCQUN2QjtxQkFBTTtvQkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixXQUFXLFFBQVEsU0FBUyxPQUFPLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQzNGLE9BQU8sSUFBSSxDQUFDO2lCQUNmO2FBQ0o7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXJCRCxzQ0FxQkMiLCJmaWxlIjoiaGVscGVycy9wYWNrYWdlSGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQYWNrYWdlIGhlbHBlclxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VIZWxwZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9jYXRlKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBsb2dnZXI6IElMb2dnZXIsIGluaXRpYWxEaXI6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHN1YkZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoaW5pdGlhbERpciwgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfWApKTtcblxuICAgICAgICBjb25zdCBzdWJFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhzdWJGb2xkZXIpO1xuXG4gICAgICAgIGlmIChzdWJFeGlzdHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdWJGb2xkZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGluaXRpYWxEaXIsIGAuLi8ke3BhY2thZ2VOYW1lfWApKTtcblxuICAgICAgICAgICAgY29uc3QgcGFyZW50RXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMocGFyZW50Rm9sZGVyKTtcblxuICAgICAgICAgICAgaWYgKHBhcmVudEV4aXN0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRGb2xkZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IGZpbmQgcGFja2FnZSAnJHtwYWNrYWdlTmFtZX0nIGF0ICR7c3ViRm9sZGVyfSBvciAke3BhcmVudEZvbGRlcn1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
