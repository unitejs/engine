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
 * Tests for JestConfigurationCoverageThreshold.
 */
const Chai = require("chai");
const jestConfigurationCoverageThreshold_1 = require("../../../../../../dist/configuration/models/jest/jestConfigurationCoverageThreshold");
describe("JestConfigurationCoverageThreshold", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new jestConfigurationCoverageThreshold_1.JestConfigurationCoverageThreshold();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvamVzdC9qZXN0Q29uZmlndXJhdGlvbkNvdmVyYWdlVGhyZXNob2xkLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLDJJQUF3STtBQUV4SSxRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO0lBQ2hELEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFRLEVBQUU7UUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSx1RUFBa0MsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vbW9kZWxzL2plc3QvamVzdENvbmZpZ3VyYXRpb25Db3ZlcmFnZVRocmVzaG9sZC5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgSmVzdENvbmZpZ3VyYXRpb25Db3ZlcmFnZVRocmVzaG9sZC5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgSmVzdENvbmZpZ3VyYXRpb25Db3ZlcmFnZVRocmVzaG9sZCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvamVzdC9qZXN0Q29uZmlndXJhdGlvbkNvdmVyYWdlVGhyZXNob2xkXCI7XG5cbmRlc2NyaWJlKFwiSmVzdENvbmZpZ3VyYXRpb25Db3ZlcmFnZVRocmVzaG9sZFwiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEplc3RDb25maWd1cmF0aW9uQ292ZXJhZ2VUaHJlc2hvbGQoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xufSk7XG4iXX0=
