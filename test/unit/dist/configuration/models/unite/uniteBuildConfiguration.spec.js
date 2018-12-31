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
 * Tests for UniteBuildConfiguration.
 */
const Chai = require("chai");
const uniteBuildConfiguration_1 = require("../../../../../../dist/configuration/models/unite/uniteBuildConfiguration");
describe("UniteBuildConfiguration", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new uniteBuildConfiguration_1.UniteBuildConfiguration();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0Isc0hBQW1IO0FBRW5ILFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQVEsRUFBRTtRQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb24uc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFVuaXRlQnVpbGRDb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb25cIjtcblxuZGVzY3JpYmUoXCJVbml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcbn0pO1xuIl19
