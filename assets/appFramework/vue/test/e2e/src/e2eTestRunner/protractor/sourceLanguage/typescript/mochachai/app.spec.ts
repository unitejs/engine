/**
 * Tests for App.
 */
/// <reference types="unitejs-vue-protractor-plugin"/>
import { expect } from "chai";
import { $, browser, by } from "protractor";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../../unite.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).to.equal(uniteJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.loadAndWaitForVuePage("/")
            .then(() => {
                $("#root > span").getText()
                    .then((rootContent) => {
                        expect(rootContent).to.equal("Hello UniteJS World!");
                        done();
                    });
            });
    });

    it("the font size is set", (done) => {
        browser.loadAndWaitForVuePage("/")
            .then(() => {
                $(".child").getCssValue("font-size")
                    .then((fontSize) => {
                        expect(fontSize).to.equal("20px");
                        done();
                    });
            });
    });
});

// Generated by UniteJS