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
 * Pipeline step to generate jsdom configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class JsDom extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.unitTestEngine, "JSDom");
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["jsdom"], mainCondition);
            engineVariables.toggleDevDependency(["karma-jsdom-launcher"], mainCondition && _super.condition.call(this, uniteConfiguration.unitTestRunner, "Karma"));
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.browsers, "jsdom", mainCondition && _super.condition.call(this, uniteConfiguration.unitTestRunner, "Karma"));
            }
            const jestConfiguration = engineVariables.getConfiguration("Jest");
            if (karmaConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(jestConfiguration, "testEnvironment", "jsdom", mainCondition && _super.condition.call(this, uniteConfiguration.unitTestRunner, "Jest"));
            }
            return 0;
        });
    }
}
exports.JsDom = JsDom;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0RW5naW5lL2pzRG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFPM0Usb0VBQWlFO0FBRWpFLE1BQWEsS0FBTSxTQUFRLG1DQUFnQjtJQUNoQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzlELGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsYUFBYSxJQUFJLE9BQU0sU0FBUyxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTVJLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztZQUN6RixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsSUFBSSxPQUFNLFNBQVMsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM3STtZQUVELE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFvQixNQUFNLENBQUMsQ0FBQztZQUN0RixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQiwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsYUFBYSxJQUFJLE9BQU0sU0FBUyxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ3RKO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXJCRCxzQkFxQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdEVuZ2luZS9qc0RvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBqc2RvbSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEplc3RDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2plc3QvamVzdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBKc0RvbSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcykgOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RFbmdpbmUsIFwiSlNEb21cIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJqc2RvbVwiXSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hLWpzZG9tLWxhdW5jaGVyXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikpO1xuXG4gICAgICAgIGNvbnN0IGthcm1hQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEthcm1hQ29uZmlndXJhdGlvbj4oXCJLYXJtYVwiKTtcbiAgICAgICAgaWYgKGthcm1hQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGthcm1hQ29uZmlndXJhdGlvbi5icm93c2VycywgXCJqc2RvbVwiLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgamVzdENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxKZXN0Q29uZmlndXJhdGlvbj4oXCJKZXN0XCIpO1xuICAgICAgICBpZiAoa2FybWFDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGplc3RDb25maWd1cmF0aW9uLCBcInRlc3RFbnZpcm9ubWVudFwiLCBcImpzZG9tXCIsIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJKZXN0XCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
