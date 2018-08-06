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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvY29uZmlnSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxNQUFhLFlBQVk7SUFDZCxNQUFNLENBQU8sZ0JBQWdCLENBQUMsVUFBdUIsRUFBRSxlQUEwQzs7WUFDcEcsSUFBSSxVQUFVLENBQUM7WUFDZixJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLElBQUksSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDM0YsK0NBQStDO2dCQUMvQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QztpQkFBTTtnQkFDSCxVQUFVLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUN6RDtZQUVELElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUUzQix1RkFBdUY7WUFDdkYsbUJBQW1CO1lBQ25CLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbEIsR0FBRztnQkFDQyxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFN0QsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDekI7cUJBQU07b0JBQ0gsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTlELG9FQUFvRTtvQkFDcEUsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO3dCQUM1QixjQUFjLEdBQUcsSUFBSSxDQUFDO3FCQUN6Qjt5QkFBTTt3QkFDSCxTQUFTLEdBQUcsWUFBWSxDQUFDO3FCQUM1QjtpQkFDSjthQUNKLFFBQ00sQ0FBQyxjQUFjLEVBQUU7WUFFeEIsc0ZBQXNGO1lBQ3RGLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsU0FBUyxHQUFHLFVBQVUsQ0FBQzthQUMxQjtZQUVELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtDQUNKO0FBekNELG9DQXlDQyIsImZpbGUiOiJlbmdpbmUvY29uZmlnSGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb25maWd1cmF0aW9uIGhlbHBlclxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGNsYXNzIENvbmZpZ0hlbHBlciB7XG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBmaW5kQ29uZmlnRm9sZGVyKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgaW5pdGlhbERpcjtcbiAgICAgICAgaWYgKG91dHB1dERpcmVjdG9yeSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dERpcmVjdG9yeSA9PT0gbnVsbCB8fCBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBvdXRwdXQgZGlyZWN0b3J5IHNwZWNpZmllZCBzbyB1c2UgY3VycmVudFxuICAgICAgICAgICAgaW5pdGlhbERpciA9IGZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKFwiLi9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0aWFsRGlyID0gZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRwdXREaXIgPSBpbml0aWFsRGlyO1xuXG4gICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGlzIGZvbGRlciBjb250YWlucyB1bml0ZS5qc29uIGlmIGl0IGRvZXNuJ3QgdGhlbiBrZWVwIHJlY3Vyc2luZyB1cFxuICAgICAgICAvLyB1bnRpbCB3ZSBmaW5kIGl0XG4gICAgICAgIGxldCBzZWFyY2hDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgZm91bmQgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyLCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHNlYXJjaENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShvdXRwdXREaXIsIFwiLi4vXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVjdXJzaW5nIHVwIGRpZG4ndCBtb3ZlIHNvIHdlIGhhdmUgcmVhY2hlZCB0aGUgZW5kIG9mIG91ciBzZWFyY2hcbiAgICAgICAgICAgICAgICBpZiAobmV3T3V0cHV0RGlyID09PSBvdXRwdXREaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dERpciA9IG5ld091dHB1dERpcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKCFzZWFyY2hDb21wbGV0ZSk7XG5cbiAgICAgICAgLy8gbm90IGZvdW5kIGF0IGFsbCBzbyBzZXQgb3V0cHV0RGlyIGJhY2sgdG8gaW5pdGlhbERpciBpbiBjYXNlIHRoaXMgaXMgYSBuZXcgY3JlYXRpb25cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgb3V0cHV0RGlyID0gaW5pdGlhbERpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXREaXI7XG4gICAgfVxufVxuIl19
