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
 * Tests for ProtractorConfiguration.
 */
const Chai = require("chai");
const protractorConfiguration_1 = require("../../../../../../dist/configuration/models/protractor/protractorConfiguration");
describe("ProtractorConfiguration", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new protractorConfiguration_1.ProtractorConfiguration();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ29uZmlndXJhdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwySEFBd0g7QUFFeEgsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQcm90cmFjdG9yQ29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgUHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcblxuZGVzY3JpYmUoXCJQcm90cmFjdG9yQ29uZmlndXJhdGlvblwiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFByb3RyYWN0b3JDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcbn0pO1xuIl19
