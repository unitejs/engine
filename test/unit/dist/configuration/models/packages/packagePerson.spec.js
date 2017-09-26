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
 * Tests for PackagePerson.
 */
const Chai = require("chai");
const packagePerson_1 = require("../../../../../../dist/configuration/models/packages/packagePerson");
describe("PackagePerson", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new packagePerson_1.PackagePerson();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZVBlcnNvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixzR0FBbUc7QUFFbkcsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN0QixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZVBlcnNvbi5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgUGFja2FnZVBlcnNvbi5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgUGFja2FnZVBlcnNvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VQZXJzb25cIjtcblxuZGVzY3JpYmUoXCJQYWNrYWdlUGVyc29uXCIsICgpID0+IHtcbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZVBlcnNvbigpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG59KTtcbiJdfQ==
