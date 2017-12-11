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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3BhY2thZ2VIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BO0lBQ1csTUFBTSxDQUFPLE1BQU0sQ0FBQyxVQUF1QixFQUFFLE1BQWUsRUFBRSxVQUFrQixFQUFFLFdBQW1COztZQUN4RyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLGdCQUFnQixXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFN0csTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTlELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxNQUFNLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFdEcsTUFBTSxZQUFZLEdBQUcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUVwRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsV0FBVyxRQUFRLFNBQVMsT0FBTyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUMzRixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBckJELHNDQXFCQyIsImZpbGUiOiJoZWxwZXJzL3BhY2thZ2VIZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBhY2thZ2UgaGVscGVyXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuXG5leHBvcnQgY2xhc3MgUGFja2FnZUhlbHBlciB7XG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2NhdGUoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGxvZ2dlcjogSUxvZ2dlciwgaW5pdGlhbERpcjogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3Qgc3ViRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUoZmlsZVN5c3RlbS5wYXRoQ29tYmluZShpbml0aWFsRGlyLCBgbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9YCkpO1xuXG4gICAgICAgIGNvbnN0IHN1YkV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKHN1YkZvbGRlcik7XG5cbiAgICAgICAgaWYgKHN1YkV4aXN0cykge1xuICAgICAgICAgICAgcmV0dXJuIHN1YkZvbGRlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoaW5pdGlhbERpciwgYC4uLyR7cGFja2FnZU5hbWV9YCkpO1xuXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhwYXJlbnRGb2xkZXIpO1xuXG4gICAgICAgICAgICBpZiAocGFyZW50RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudEZvbGRlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDb3VsZCBub3QgZmluZCBwYWNrYWdlICcke3BhY2thZ2VOYW1lfScgYXQgJHtzdWJGb2xkZXJ9IG9yICR7cGFyZW50Rm9sZGVyfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19
