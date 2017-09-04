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
 * Pipeline step to generate phantom JS configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PhantomJs extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma-phantomjs-launcher", "bluebird"], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && _super("condition").call(this, uniteConfiguration.unitTestEngine, "PhantomJS"));
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                const addCond = _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && _super("condition").call(this, uniteConfiguration.unitTestEngine, "PhantomJS");
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.browsers, "PhantomJS", addCond);
                const bbInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.files, { pattern: bbInclude, included: true }, addCond, (obj, item) => obj.pattern === item.pattern);
            }
            return 0;
        });
    }
}
exports.PhantomJs = PhantomJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0RW5naW5lL3BoYW50b21Kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFLekUsZ0ZBQTZFO0FBRzdFLGVBQXVCLFNBQVEsK0NBQXNCO0lBQ3BDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLFVBQVUsQ0FBQyxFQUN4QyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLEtBQUssbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUVwSyxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBcUIsT0FBTyxDQUFDLENBQUM7WUFDekYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLE9BQU8sR0FBRyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLEtBQUssbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBRS9JLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBRXpFLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQ2xDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlKLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEosQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQW5CRCw4QkFtQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdEVuZ2luZS9waGFudG9tSnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgcGhhbnRvbSBKUyBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgS2FybWFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2thcm1hL2thcm1hQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFBoYW50b21KcyBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hLXBoYW50b21qcy1sYXVuY2hlclwiLCBcImJsdWViaXJkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUsIFwiUGhhbnRvbUpTXCIpKTtcblxuICAgICAgICBjb25zdCBrYXJtYUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxLYXJtYUNvbmZpZ3VyYXRpb24+KFwiS2FybWFcIik7XG4gICAgICAgIGlmIChrYXJtYUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGFkZENvbmQgPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUsIFwiUGhhbnRvbUpTXCIpO1xuXG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoa2FybWFDb25maWd1cmF0aW9uLmJyb3dzZXJzLCBcIlBoYW50b21KU1wiLCBhZGRDb25kKTtcblxuICAgICAgICAgICAgY29uc3QgYmJJbmNsdWRlID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoXG4gICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgXCJibHVlYmlyZC9qcy9icm93c2VyL2JsdWViaXJkLmpzXCIpKSk7XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShrYXJtYUNvbmZpZ3VyYXRpb24uZmlsZXMsIHsgcGF0dGVybjogYmJJbmNsdWRlLCBpbmNsdWRlZDogdHJ1ZSB9LCBhZGRDb25kLCAob2JqLCBpdGVtKSA9PiBvYmoucGF0dGVybiA9PT0gaXRlbS5wYXR0ZXJuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
