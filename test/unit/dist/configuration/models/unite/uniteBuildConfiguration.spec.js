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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsdUhBQW9IO0FBRXBILFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNoQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQnVpbGRDb25maWd1cmF0aW9uLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vLi4vZGlzdC9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuXG5kZXNjcmliZShcIlVuaXRlQnVpbGRDb25maWd1cmF0aW9uXCIsICgpID0+IHtcbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xufSk7XG4iXX0=
