/**
 * {GEN_NAME_HUMAN} component class.
 */
import { Component } from "@angular/core";

@Component({
    moduleId: {MODULE_ID},
    templateUrl: "./{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}.html",
    styleUrls: ["./{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}.css"]
})
export class {GEN_NAME_PASCAL}Component {
    constructor() {
        this.message = "Hello {GEN_NAME_HUMAN}";
    }

    ngOnInit() {
        this.message += " - onInit called";
    }
}
