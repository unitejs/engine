/**
 * {GEN_NAME_HUMAN} component class.
 */
import {Element as PolymerElement} from "@polymer/polymer/polymer-element";
import {GEN_NAME_CAMEL}Css from "./{GEN_NAME_SNAKE}.css";
import {GEN_NAME_CAMEL}Html from "./{GEN_NAME_SNAKE}.html";

export class {GEN_NAME_PASCAL} extends PolymerElement {
    static get properties (): any {
        return {
            message: {
                type: String,
                value: "Hello {GEN_NAME_HUMAN}"
            }
        };
    }

    static get template (): string {
        return `
        <style>${{GEN_NAME_CAMEL}Css}</style>
        ${{GEN_NAME_CAMEL}Html}`;
    }
}

customElements.define("co-{GEN_NAME_SNAKE}", {GEN_NAME_PASCAL});
