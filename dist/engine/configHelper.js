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
class ConfigHelper {
    static findConfigFolder(fileSystem, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            let initialDir;
            if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
                // no output directory specified so use current
                initialDir = fileSystem.pathAbsolute("./");
            }
            else {
                initialDir = fileSystem.pathAbsolute(outputDirectory);
            }
            let outputDir = initialDir;
            // check to see if this folder contains unite.json if it doesn't then keep recursing up
            // until we find it
            let searchComplete = false;
            let found = false;
            do {
                found = yield fileSystem.fileExists(outputDir, "unite.json");
                if (found) {
                    searchComplete = true;
                }
                else {
                    const newOutputDir = fileSystem.pathCombine(outputDir, "../");
                    // recursing up didn't move so we have reached the end of our search
                    if (newOutputDir === outputDir) {
                        searchComplete = true;
                    }
                    else {
                        outputDir = newOutputDir;
                    }
                }
            } while (!searchComplete);
            // not found at all so set outputDir back to initialDir in case this is a new creation
            if (!found) {
                outputDir = initialDir;
            }
            return outputDir;
        });
    }
}
exports.ConfigHelper = ConfigHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvY29uZmlnSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTtJQUNXLE1BQU0sQ0FBTyxnQkFBZ0IsQ0FBQyxVQUF1QixFQUFFLGVBQTBDOztZQUNwRyxJQUFJLFVBQVUsQ0FBQztZQUNmLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLEtBQUssSUFBSSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMzRiwrQ0FBK0M7Z0JBQy9DLFVBQVUsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDO2lCQUFNO2dCQUNILFVBQVUsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBRTNCLHVGQUF1RjtZQUN2RixtQkFBbUI7WUFDbkIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzNCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNsQixHQUFHO2dCQUNDLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUU3RCxJQUFJLEtBQUssRUFBRTtvQkFDUCxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN6QjtxQkFBTTtvQkFDSCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFFOUQsb0VBQW9FO29CQUNwRSxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7d0JBQzVCLGNBQWMsR0FBRyxJQUFJLENBQUM7cUJBQ3pCO3lCQUFNO3dCQUNILFNBQVMsR0FBRyxZQUFZLENBQUM7cUJBQzVCO2lCQUNKO2FBQ0osUUFDTSxDQUFDLGNBQWMsRUFBRTtZQUV4QixzRkFBc0Y7WUFDdEYsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixTQUFTLEdBQUcsVUFBVSxDQUFDO2FBQzFCO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztLQUFBO0NBQ0o7QUF6Q0Qsb0NBeUNDIiwiZmlsZSI6ImVuZ2luZS9jb25maWdIZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbmZpZ3VyYXRpb24gaGVscGVyXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlnSGVscGVyIHtcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGZpbmRDb25maWdGb2xkZXIoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGxldCBpbml0aWFsRGlyO1xuICAgICAgICBpZiAob3V0cHV0RGlyZWN0b3J5ID09PSB1bmRlZmluZWQgfHwgb3V0cHV0RGlyZWN0b3J5ID09PSBudWxsIHx8IG91dHB1dERpcmVjdG9yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIG5vIG91dHB1dCBkaXJlY3Rvcnkgc3BlY2lmaWVkIHNvIHVzZSBjdXJyZW50XG4gICAgICAgICAgICBpbml0aWFsRGlyID0gZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUoXCIuL1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluaXRpYWxEaXIgPSBmaWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG91dHB1dERpciA9IGluaXRpYWxEaXI7XG5cbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoaXMgZm9sZGVyIGNvbnRhaW5zIHVuaXRlLmpzb24gaWYgaXQgZG9lc24ndCB0aGVuIGtlZXAgcmVjdXJzaW5nIHVwXG4gICAgICAgIC8vIHVudGlsIHdlIGZpbmQgaXRcbiAgICAgICAgbGV0IHNlYXJjaENvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBmb3VuZCA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXIsIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdPdXRwdXREaXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKG91dHB1dERpciwgXCIuLi9cIik7XG5cbiAgICAgICAgICAgICAgICAvLyByZWN1cnNpbmcgdXAgZGlkbid0IG1vdmUgc28gd2UgaGF2ZSByZWFjaGVkIHRoZSBlbmQgb2Ygb3VyIHNlYXJjaFxuICAgICAgICAgICAgICAgIGlmIChuZXdPdXRwdXREaXIgPT09IG91dHB1dERpcikge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyID0gbmV3T3V0cHV0RGlyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoIXNlYXJjaENvbXBsZXRlKTtcblxuICAgICAgICAvLyBub3QgZm91bmQgYXQgYWxsIHNvIHNldCBvdXRwdXREaXIgYmFjayB0byBpbml0aWFsRGlyIGluIGNhc2UgdGhpcyBpcyBhIG5ldyBjcmVhdGlvblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICBvdXRwdXREaXIgPSBpbml0aWFsRGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dERpcjtcbiAgICB9XG59XG4iXX0=
