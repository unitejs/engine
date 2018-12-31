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
 * Tests for ProtractorCapabilities.
 */
const Chai = require("chai");
const protractorCapabilities_1 = require("../../../../../../dist/configuration/models/protractor/protractorCapabilities");
describe("ProtractorCapabilities", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new protractorCapabilities_1.ProtractorCapabilities();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ2FwYWJpbGl0aWVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLHlIQUFzSDtBQUV0SCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFRLEVBQUU7UUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSwrQ0FBc0IsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNhcGFiaWxpdGllcy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgUHJvdHJhY3RvckNhcGFiaWxpdGllcy5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgUHJvdHJhY3RvckNhcGFiaWxpdGllcyB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ2FwYWJpbGl0aWVzXCI7XG5cbmRlc2NyaWJlKFwiUHJvdHJhY3RvckNhcGFiaWxpdGllc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFByb3RyYWN0b3JDYXBhYmlsaXRpZXMoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xufSk7XG4iXX0=
