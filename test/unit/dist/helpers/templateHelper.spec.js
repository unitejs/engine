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
 * Tests for Template Helper
 */
const Chai = require("chai");
const templateHelper_1 = require("../../../../dist/helpers/templateHelper");
describe("TemplateHelper", () => {
    describe("generateSubstitutions", () => {
        it("can be called with undefined string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions(undefined);
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with an empty string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with an no alpha num string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("!£$%^&");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with a single lower case character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("a");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "a",
                genNameCamel: "a",
                GenNamePascal: "A",
                "Gen Name Human": "A"
            });
        }));
        it("can be called with a single upper case character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("A");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "a",
                genNameCamel: "a",
                GenNamePascal: "A",
                "Gen Name Human": "A"
            });
        }));
        it("can be called with a single whitespace character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions(" ");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with a single word lower case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "ape",
                genNameCamel: "ape",
                GenNamePascal: "Ape",
                "Gen Name Human": "Ape"
            });
        }));
        it("can be called with a single word UPPER case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("APE");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "ape",
                genNameCamel: "aPE",
                GenNamePascal: "APE",
                "Gen Name Human": "APE"
            });
        }));
        it("can be called with a multiple words lower case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("great ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        }));
        it("can be called with a multiple words title cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("Great Ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        }));
        it("can be called with a multiple words camel cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("GreatApe");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        }));
        it("can be called with a multiple words snake cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("great-ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        }));
        it("can be called with a multiple word and multiple separators", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("great     ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        }));
    });
    describe("replaceSubstitutions", () => {
        it("can be called with undefined string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with undefined string and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with defined string with no template matches and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah");
            Chai.expect(res).to.be.equal("blah");
        }));
        it("can be called with defined string and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah PRE_NAME poo");
            Chai.expect(res).to.be.equal("blah aaa poo");
        }));
        it("can be called with defined string with muitple matches and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah PRE_NAME poo PRE_NAME");
            Chai.expect(res).to.be.equal("blah aaa poo aaa");
        }));
        it("can be called with defined string with muitple matches and multiple substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa",
                POST_NAME: "bbb"
            }, "blah PRE_NAME poo PRE_NAME POST_NAME");
            Chai.expect(res).to.be.equal("blah aaa poo aaa bbb");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvaGVscGVycy90ZW1wbGF0ZUhlbHBlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwyRUFBd0U7QUFFeEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFTLEVBQUU7WUFDakQsTUFBTSxHQUFHLEdBQUcsK0JBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQVMsRUFBRTtZQUNoRCxNQUFNLEdBQUcsR0FBRywrQkFBYyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBUyxFQUFFO1lBQ3ZELE1BQU0sR0FBRyxHQUFHLCtCQUFjLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxr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QUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiaGVscGVycy90ZW1wbGF0ZUhlbHBlci5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgVGVtcGxhdGUgSGVscGVyXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCB7IFRlbXBsYXRlSGVscGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9oZWxwZXJzL3RlbXBsYXRlSGVscGVyXCI7XG5cbmRlc2NyaWJlKFwiVGVtcGxhdGVIZWxwZXJcIiwgKCkgPT4ge1xuICAgIGRlc2NyaWJlKFwiZ2VuZXJhdGVTdWJzdGl0dXRpb25zXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIHN0cmluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7fSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFuIGVtcHR5IHN0cmluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe30pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhbiBubyBhbHBoYSBudW0gc3RyaW5nXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIiHCoyQlXiZcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe30pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZSBsb3dlciBjYXNlIGNoYXJhY3RlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBcImdlbi1uYW1lLXNuYWtlXCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgIGdlbk5hbWVDYW1lbDogXCJhXCIsXG4gICAgICAgICAgICAgICAgR2VuTmFtZVBhc2NhbDogXCJBXCIsXG4gICAgICAgICAgICAgICAgXCJHZW4gTmFtZSBIdW1hblwiOiBcIkFcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlIHVwcGVyIGNhc2UgY2hhcmFjdGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIkFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIFwiZ2VuLW5hbWUtc25ha2VcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgZ2VuTmFtZUNhbWVsOiBcImFcIixcbiAgICAgICAgICAgICAgICBHZW5OYW1lUGFzY2FsOiBcIkFcIixcbiAgICAgICAgICAgICAgICBcIkdlbiBOYW1lIEh1bWFuXCI6IFwiQVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiIFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7fSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlIHdvcmQgbG93ZXIgY2FzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJhcGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIFwiZ2VuLW5hbWUtc25ha2VcIjogXCJhcGVcIixcbiAgICAgICAgICAgICAgICBnZW5OYW1lQ2FtZWw6IFwiYXBlXCIsXG4gICAgICAgICAgICAgICAgR2VuTmFtZVBhc2NhbDogXCJBcGVcIixcbiAgICAgICAgICAgICAgICBcIkdlbiBOYW1lIEh1bWFuXCI6IFwiQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZSB3b3JkIFVQUEVSIGNhc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiQVBFXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBcImdlbi1uYW1lLXNuYWtlXCI6IFwiYXBlXCIsXG4gICAgICAgICAgICAgICAgZ2VuTmFtZUNhbWVsOiBcImFQRVwiLFxuICAgICAgICAgICAgICAgIEdlbk5hbWVQYXNjYWw6IFwiQVBFXCIsXG4gICAgICAgICAgICAgICAgXCJHZW4gTmFtZSBIdW1hblwiOiBcIkFQRVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBtdWx0aXBsZSB3b3JkcyBsb3dlciBjYXNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcImdyZWF0IGFwZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgXCJnZW4tbmFtZS1zbmFrZVwiOiBcImdyZWF0LWFwZVwiLFxuICAgICAgICAgICAgICAgIGdlbk5hbWVDYW1lbDogXCJncmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIEdlbk5hbWVQYXNjYWw6IFwiR3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBcIkdlbiBOYW1lIEh1bWFuXCI6IFwiR3JlYXQgQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIG11bHRpcGxlIHdvcmRzIHRpdGxlIGNhc2VkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIkdyZWF0IEFwZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgXCJnZW4tbmFtZS1zbmFrZVwiOiBcImdyZWF0LWFwZVwiLFxuICAgICAgICAgICAgICAgIGdlbk5hbWVDYW1lbDogXCJncmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIEdlbk5hbWVQYXNjYWw6IFwiR3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBcIkdlbiBOYW1lIEh1bWFuXCI6IFwiR3JlYXQgQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIG11bHRpcGxlIHdvcmRzIGNhbWVsIGNhc2VkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIkdyZWF0QXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBcImdlbi1uYW1lLXNuYWtlXCI6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgZ2VuTmFtZUNhbWVsOiBcImdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgR2VuTmFtZVBhc2NhbDogXCJHcmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFwiR2VuIE5hbWUgSHVtYW5cIjogXCJHcmVhdCBBcGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgbXVsdGlwbGUgd29yZHMgc25ha2UgY2FzZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiZ3JlYXQtYXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBcImdlbi1uYW1lLXNuYWtlXCI6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgZ2VuTmFtZUNhbWVsOiBcImdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgR2VuTmFtZVBhc2NhbDogXCJHcmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFwiR2VuIE5hbWUgSHVtYW5cIjogXCJHcmVhdCBBcGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgbXVsdGlwbGUgd29yZCBhbmQgbXVsdGlwbGUgc2VwYXJhdG9yc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJncmVhdCAgICAgYXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBcImdlbi1uYW1lLXNuYWtlXCI6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgZ2VuTmFtZUNhbWVsOiBcImdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgR2VuTmFtZVBhc2NhbDogXCJHcmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFwiR2VuIE5hbWUgSHVtYW5cIjogXCJHcmVhdCBBcGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJyZXBsYWNlU3Vic3RpdHV0aW9uc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBzdHJpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnModW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgc3RyaW5nIGFuZCBkZWZpbmVkIHN1YnN0aXR1dGlvbnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBSRV9OQU1FOiBcImFhYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZGVmaW5lZCBzdHJpbmcgd2l0aCBubyB0ZW1wbGF0ZSBtYXRjaGVzIGFuZCBkZWZpbmVkIHN1YnN0aXR1dGlvbnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBSRV9OQU1FOiBcImFhYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibGFoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChcImJsYWhcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGRlZmluZWQgc3RyaW5nIGFuZCBkZWZpbmVkIHN1YnN0aXR1dGlvbnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBSRV9OQU1FOiBcImFhYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibGFoIFBSRV9OQU1FIHBvb1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoXCJibGFoIGFhYSBwb29cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGRlZmluZWQgc3RyaW5nIHdpdGggbXVpdHBsZSBtYXRjaGVzIGFuZCBkZWZpbmVkIHN1YnN0aXR1dGlvbnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBSRV9OQU1FOiBcImFhYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibGFoIFBSRV9OQU1FIHBvbyBQUkVfTkFNRVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoXCJibGFoIGFhYSBwb28gYWFhXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBkZWZpbmVkIHN0cmluZyB3aXRoIG11aXRwbGUgbWF0Y2hlcyBhbmQgbXVsdGlwbGUgc3Vic3RpdHV0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUFJFX05BTUU6IFwiYWFhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUE9TVF9OQU1FOiBcImJiYlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibGFoIFBSRV9OQU1FIHBvbyBQUkVfTkFNRSBQT1NUX05BTUVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiYmxhaCBhYWEgcG9vIGFhYSBiYmJcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
