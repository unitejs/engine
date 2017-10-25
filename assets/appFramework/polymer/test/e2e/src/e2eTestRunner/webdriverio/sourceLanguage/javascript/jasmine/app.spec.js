/**
 * Tests for App.
 */
describe("App", () => {
    it("the title is set", () => {
        const uniteJson = require("../../../../unite.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .loadAndWaitForPolymerPage("/")
            .element("#root")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });

    it("the font size is set", () => {
        return browser
            .loadAndWaitForPolymerPage("/")
            .customShadowRoot("#root unite-app::sr iron-pages unite-child::sr div")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).toEqual("20px");
            });
    });
});

/* Generated by UniteJS */
