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
class Amd extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleClientPackage("requirejs", "require.js", undefined, false, "app", false, undefined, uniteConfiguration.moduleType === "AMD");
            engineVariables.toggleClientPackage("text", "text.js", undefined, false, "both", false, undefined, uniteConfiguration.moduleType === "AMD");
            if (uniteConfiguration.moduleType === "AMD") {
                try {
                    logger.info("Generating Module Loader Scaffold", {});
                    engineVariables.htmlNoBundle.scriptIncludes.push("requirejs/require.js");
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    engineVariables.htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    engineVariables.htmlNoBundle.body.push("<script>");
                    engineVariables.htmlNoBundle.body.push("require(preloadModules, function() {");
                    engineVariables.htmlNoBundle.body.push("    {UNITECONFIG}");
                    engineVariables.htmlNoBundle.body.push("    require(['dist/entryPoint']);");
                    engineVariables.htmlNoBundle.body.push("});");
                    engineVariables.htmlNoBundle.body.push("</script>");
                    engineVariables.htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                    engineVariables.htmlBundle.body.push("<script>{UNITECONFIG}</script>");
                    engineVariables.htmlBundle.body.push("<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Module Loader Scaffold failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Amd = Amd;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUM7WUFFN0MsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBRTdDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFFckQsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBRXpFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztvQkFDNUQsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDaEcsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztvQkFDL0UsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzVELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUM1RSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzlDLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFcEQsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7b0JBQ3JHLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO29CQUN2RSxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztvQkFFbEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDOUQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQW5ERCxrQkFtREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2FtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBhbWQgbW9kdWxlcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgQW1kIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInJlcXVpcmVqc1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYXBwXCIsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwidGV4dFwiLFxuICAgICAgICAgICAgXCJ0ZXh0LmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkXCIsIHt9KTtcblxuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuc2NyaXB0SW5jbHVkZXMucHVzaChcInJlcXVpcmVqcy9yZXF1aXJlLmpzXCIpO1xuXG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlID0gXCIoZGVmaW5lKSo/KC4uXFwvc3JjXFwvKVwiO1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZVdpdGggPSBcIi4uL2Rpc3QvXCI7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLW1vZHVsZS1jb25maWcuanNcXFwiPjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwicmVxdWlyZShwcmVsb2FkTW9kdWxlcywgZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIHtVTklURUNPTkZJR31cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgcmVxdWlyZShbJ2Rpc3QvZW50cnlQb2ludCddKTtcIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJ9KTtcIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8L3NjcmlwdD5cIik7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L3ZlbmRvci1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+e1VOSVRFQ09ORklHfTwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGQgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
