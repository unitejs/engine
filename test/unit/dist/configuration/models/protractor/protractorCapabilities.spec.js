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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ2FwYWJpbGl0aWVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLDBIQUF1SDtBQUV2SCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksK0NBQXNCLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDYXBhYmlsaXRpZXMuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFByb3RyYWN0b3JDYXBhYmlsaXRpZXMuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDYXBhYmlsaXRpZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vLi4vZGlzdC9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDYXBhYmlsaXRpZXNcIjtcblxuZGVzY3JpYmUoXCJQcm90cmFjdG9yQ2FwYWJpbGl0aWVzXCIsICgpID0+IHtcbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUHJvdHJhY3RvckNhcGFiaWxpdGllcygpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG59KTtcbiJdfQ==
