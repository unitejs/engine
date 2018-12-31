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
 * Tests for EsDocConfiguration.
 */
const Chai = require("chai");
const esDocConfiguration_1 = require("../../../../../../dist/configuration/models/esDoc/esDocConfiguration");
describe("EsDocConfiguration", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new esDocConfiguration_1.EsDocConfiguration();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvZXNEb2MvZXNEb2NDb25maWd1cmF0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLDRHQUF5RztBQUV6RyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFRLEVBQUU7UUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vbW9kZWxzL2VzRG9jL2VzRG9jQ29uZmlndXJhdGlvbi5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgRXNEb2NDb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBFc0RvY0NvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzRG9jL2VzRG9jQ29uZmlndXJhdGlvblwiO1xuXG5kZXNjcmliZShcIkVzRG9jQ29uZmlndXJhdGlvblwiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVzRG9jQ29uZmlndXJhdGlvbigpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG59KTtcbiJdfQ==
