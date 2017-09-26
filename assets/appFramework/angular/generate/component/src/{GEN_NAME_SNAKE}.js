/**
 * {GEN_NAME_HUMAN} component class.
 */
import { Component } from "@angular/core";

@Component({
    moduleId: __moduleName || module.id,
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
