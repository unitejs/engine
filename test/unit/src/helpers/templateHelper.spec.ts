/**
 * Tests for Template Helper
 */
import * as Chai from "chai";
import { TemplateHelper } from "../../../../dist/helpers/templateHelper";

describe("TemplateHelper", () => {
    describe("generateSubstitutions", () => {
        it("can be called with undefined string", async () => {
            const res = TemplateHelper.generateSubstitutions(undefined, undefined);
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with an empty string", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with an no alpha num string", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "!£$%^&");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with a single lower case character", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "a");
            Chai.expect(res).to.be.deep.equal({
                PRE: "a",
                PRE_SNAKE: "a",
                PRE_CAMEL: "a",
                PRE_PASCAL: "A",
                PRE_HUMAN: "A"
            });
        });

        it("can be called with a single upper case character", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "A");
            Chai.expect(res).to.be.deep.equal({
                PRE: "A",
                PRE_SNAKE: "a",
                PRE_CAMEL: "a",
                PRE_PASCAL: "A",
                PRE_HUMAN: "A"
            });
        });

        it("can be called with a single whitespace character", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", " ");
            Chai.expect(res).to.be.deep.equal({});
        });

        it("can be called with a single word lower case", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "ape",
                PRE_SNAKE: "ape",
                PRE_CAMEL: "ape",
                PRE_PASCAL: "Ape",
                PRE_HUMAN: "Ape"
            });
        });

        it("can be called with a single word UPPER case", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "APE");
            Chai.expect(res).to.be.deep.equal({
                PRE: "APE",
                PRE_SNAKE: "ape",
                PRE_CAMEL: "aPE",
                PRE_PASCAL: "APE",
                PRE_HUMAN: "APE"
            });
        });

        it("can be called with a multiple words lower case", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "great ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        });

        it("can be called with a multiple words title cased", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "Great Ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "Great Ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        });

        it("can be called with a multiple words camel cased", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "GreatApe");
            Chai.expect(res).to.be.deep.equal({
                PRE: "GreatApe",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        });

        it("can be called with a multiple words snake cased", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "great-ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great-ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        });

        it("can be called with a multiple word and multiple separators", async () => {
            const res = TemplateHelper.generateSubstitutions("PRE", "great     ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
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
                                                            "blah {PRE_NAME} poo");
            Chai.expect(res).to.be.equal("blah aaa poo");
        });

        it("can be called with defined string with muitple matches and defined substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa"
                                                            },
                                                            "blah {PRE_NAME} poo {PRE_NAME}");
            Chai.expect(res).to.be.equal("blah aaa poo aaa");
        });

        it("can be called with defined string with muitple matches and multiple substitutions", async () => {
            const res = TemplateHelper.replaceSubstitutions({
                                                                PRE_NAME: "aaa",
                                                                POST_NAME: "bbb"
                                                            },
                                                            "blah {PRE_NAME} poo {PRE_NAME} {POST_NAME}");
            Chai.expect(res).to.be.equal("blah aaa poo aaa bbb");
        });
    });
});
