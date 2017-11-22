/**
 * Tests for Template Helper
 */
import * as Chai from "chai";
import { TemplateHelper } from "../../../../src/helpers/templateHelper";

describe("TemplateHelper", () => {
    describe("generateSubstitutions", () => {
        it("can be called with undefined string", async () => {
            const res = TemplateHelper.generateSubstitutions(undefined);
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with an empty string", async () => {
            const res = TemplateHelper.generateSubstitutions("");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with an no alpha num string", async () => {
            const res = TemplateHelper.generateSubstitutions("!£$%^&");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with a single lower case character", async () => {
            const res = TemplateHelper.generateSubstitutions("a");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "a",
                genNameCamel: "a",
                GenNamePascal: "A",
                "Gen Name Human": "A"
            });
        });

        it("can be called with a single upper case character", async () => {
            const res = TemplateHelper.generateSubstitutions("A");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "a",
                genNameCamel: "a",
                GenNamePascal: "A",
                "Gen Name Human": "A"
            });
        });

        it("can be called with a single whitespace character", async () => {
            const res = TemplateHelper.generateSubstitutions(" ");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with a single word lower case", async () => {
            const res = TemplateHelper.generateSubstitutions("ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "ape",
                genNameCamel: "ape",
                GenNamePascal: "Ape",
                "Gen Name Human": "Ape"
            });
        });

        it("can be called with a single word UPPER case", async () => {
            const res = TemplateHelper.generateSubstitutions("APE");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "ape",
                genNameCamel: "aPE",
                GenNamePascal: "APE",
                "Gen Name Human": "APE"
            });
        });

        it("can be called with a multiple words lower case", async () => {
            const res = TemplateHelper.generateSubstitutions("great ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        });

        it("can be called with a multiple words title cased", async () => {
            const res = TemplateHelper.generateSubstitutions("Great Ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        });

        it("can be called with a multiple words camel cased", async () => {
            const res = TemplateHelper.generateSubstitutions("GreatApe");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        });

        it("can be called with a multiple words snake cased", async () => {
            const res = TemplateHelper.generateSubstitutions("great-ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        });

        it("can be called with a multiple word and multiple separators", async () => {
            const res = TemplateHelper.generateSubstitutions("great     ape");
            Chai.expect(res).to.be.deep.equal({
                "gen-name-snake": "great-ape",
                genNameCamel: "greatApe",
                GenNamePascal: "GreatApe",
                "Gen Name Human": "Great Ape"
            });
        });
    });

    describe("replaceSubstitutions", () => {
        it("can be called with undefined string", async () => {
            const res = TemplateHelper.replaceSubstitutions(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with undefined string and defined substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa"
                                                            },
                                                            undefined);
            Chai.expect(res).to.be.equal(undefined);
        });

        it("can be called with defined string with no template matches and defined substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa"
                                                            },
                                                            "blah");
            Chai.expect(res).to.be.equal("blah");
        });

        it("can be called with defined string and defined substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa"
                                                            },
                                                            "blah PRE_NAME poo");
            Chai.expect(res).to.be.equal("blah aaa poo");
        });

        it("can be called with defined string with muitple matches and defined substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa"
                                                            },
                                                            "blah PRE_NAME poo PRE_NAME");
            Chai.expect(res).to.be.equal("blah aaa poo aaa");
        });

        it("can be called with defined string with muitple matches and multiple substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa",
                                                                POST_NAME: "bbb"
                                                            },
                                                            "blah PRE_NAME poo PRE_NAME POST_NAME");
            Chai.expect(res).to.be.equal("blah aaa poo aaa bbb");
        });
    });
});
