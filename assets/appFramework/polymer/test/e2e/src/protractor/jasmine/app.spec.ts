/**
 * Tests for App.
 */
/// <reference types="unitejs-protractor-plugin"/>
import { $, browser, by, element } from "protractor";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteThemeJson.title);
                        done();
                    });
            });
    });

    it("the child text is set", (done) => {
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
                element(by.customShadowRoot("#root unite-app::sr iron-pages unite-child::sr div "))
                    .getText()
                    .then((rootContent) => {
                        expect(rootContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });

    it("the font size is set", (done) => {
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
                element(by.customShadowRoot("#root unite-app::sr iron-pages unite-child::sr div "))
                    .getCssValue("font-size")
                    .then((fontSize) => {
                        expect(fontSize).toEqual("20px");
                        done();
                    });
            });
    });

});

// Generated by UniteJS